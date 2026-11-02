'use client';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';
import CampusFallback from './CampusFallback';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  annotations,
  landmarks,
  routes,
  vegetation,
} from '@/data/campus-model.mjs';
import {
  context as surroundings,
  metresPerPixel,
} from '@/data/campus-real.mjs';
import {
  buildCampusGeometry,
  coreBounds,
  heightAt,
  packRoofAtlas,
  buildingParts,
  WALL_STYLES,
} from '@/data/campus-geometry.mjs';
import {
  coreCanvasSize,
  createBlockTexture,
  createCanvasTexture,
  createCrownGeometry,
  createLeafTexture,
  createSkyDome,
  createWallTexture,
  loadBlock,
  loadCore,
  tileBlock,
  applySharpSampling,
} from './campus-imagery';

// North is -z. The overview matches the campus drone film, looking south.
const PRESETS = {
  overview: { position: [-90, 400, -760], target: [10, 0, 10] },
  academic: { position: [-150, 90, -390], target: [70, 8, -250] },
  sports: { position: [-40, 190, 720], target: [-110, 0, 280] },
  top: { position: [0, 1240, 10.1], target: [0, 0, 10] },
};
const SUN = [700, 900, 120];
const FLY_MS = 1200;
// Below this radius a place is small enough for trees to hide it from the camera.
const SMALL_PLACE = 30;
const TREE_CLEARANCE = 15;
export default forwardRef(function CampusScene(props, ref) {
  const [failed, setFailed] = useState(false);
  if (props.simplified || failed)
    return <CampusFallback {...props} ref={ref} />;
  return (
    <WebGLCampusScene {...props} ref={ref} onFailure={() => setFailed(true)} />
  );
});
const WebGLCampusScene = forwardRef(function WebGLCampusScene(
  {
    selected,
    category,
    labels,
    routeLayers,
    panMode,
    onSelect,
    onPreset,
    onFailure,
  },
  ref,
) {
  const mount = useRef(null),
    host = useRef(null),
    api = useRef(null),
    latest = useRef({
      selected,
      category,
      labels,
      routeLayers,
      panMode,
      onSelect,
    });
  latest.current = {
    selected,
    category,
    labels,
    routeLayers,
    panMode,
    onSelect,
  };
  const [ready, setReady] = useState(false);
  const [imagery, setImagery] = useState({ percent: 0, state: 'loading' });
  useImperativeHandle(ref, () => ({
    preset(name) {
      api.current?.preset(name);
      onPreset?.(name);
    },
    zoom(factor) {
      api.current?.zoom(factor);
    },
    rotate(deg) {
      api.current?.rotate(deg);
    },
  }));
  useEffect(() => {
    const el = mount.current;
    let renderer,
      disposed = false,
      raf = 0,
      settle = 0;
    const disposables = [];
    const loading = new AbortController();
    let cleanup = () => {};
    const fail = () => {
      if (disposed) return;
      cleanup();
      onFailure();
    };
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      const maxTexture = renderer.capabilities.maxTextureSize;
      // Phones and small GPUs get half-resolution imagery and fewer trees.
      const low =
        (window.navigator?.deviceMemory ?? 8) <= 4 ||
        window.innerWidth < 700 ||
        maxTexture < 4096;
      const maxRatio = Math.min(window.devicePixelRatio, low ? 1.5 : 2);
      const minRatio = Math.min(maxRatio, low ? 0.75 : 1);
      let ratio = maxRatio;
      renderer.setPixelRatio(ratio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.shadowMap.autoUpdate = false;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#dfe2dc');
      scene.fog = new THREE.Fog('#dfe2dc', 3500, 17000);
      scene.add(createSkyDome());
      const camera = new THREE.PerspectiveCamera(42, 1, 2, 40000);
      camera.position.set(...PRESETS.overview.position);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(...PRESETS.overview.target);
      controls.enableDamping = true;
      controls.dampingFactor = 0.09;
      // Closer than this the 0.27 m imagery cannot show any more detail.
      controls.minDistance = 30;
      controls.maxDistance = 5200;
      controls.maxPolarAngle = Math.PI * 0.47;
      controls.minPolarAngle = 0.001;
      controls.zoomSpeed = 0.9;
      controls.panSpeed = 1;
      controls.rotateSpeed = 0.7;
      controls.zoomToCursor = true;
      controls.screenSpacePanning = false;
      // Imagery already contains daylight, so these lights multiply it by about one.
      scene.add(new THREE.HemisphereLight('#f2f5ff', '#c7b79a', 2.0));
      const sun = new THREE.DirectionalLight('#fff3de', 1.5);
      sun.position.set(...SUN);
      sun.castShadow = true;
      const shadowSize = low ? 2048 : maxTexture >= 8192 ? 6144 : 4096;
      sun.shadow.mapSize.set(shadowSize, shadowSize);
      Object.assign(sun.shadow.camera, {
        left: -640,
        right: 640,
        top: 640,
        bottom: -640,
        near: 200,
        far: 2400,
      });
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.7;
      scene.add(sun);
      // Ground: nested satellite layers draped over real terrain, each about four times
      // coarser than the last, so detail falls away evenly towards the horizon.
      const coreZoom = low ? 18 : 19;
      const core = coreBounds();
      const farBlock = tileBlock(13, 5),
        outerBlock = low ? tileBlock(15, 5) : tileBlock(16, 9),
        midBlock = low ? tileBlock(17, 7) : tileBlock(18, 13);
      const groundFill = '#a79a79';
      const far = createBlockTexture(farBlock, 256, renderer, groundFill);
      const outer = createBlockTexture(outerBlock, 256, renderer, groundFill);
      const mid = createBlockTexture(midBlock, 256, renderer, groundFill);
      const coreSize = coreCanvasSize(coreZoom);
      const coreLayer = createCanvasTexture(
        coreSize.w,
        coreSize.h,
        groundFill,
        renderer,
      );
      disposables.push(
        far.texture,
        outer.texture,
        mid.texture,
        coreLayer.texture,
      );
      const groundMesh = (
        bounds,
        cells,
        texture,
        drop,
        hole,
        receive,
        sharp,
      ) => {
        const positions = [],
          uvs = [],
          index = [];
        const { x0, x1, z0, z1 } = bounds;
        const n = cells + 1;
        for (let j = 0; j < n; j++)
          for (let i = 0; i < n; i++) {
            const x = x0 + ((x1 - x0) * i) / cells,
              z = z0 + ((z1 - z0) * j) / cells;
            positions.push(x, heightAt(x, z) - drop, z);
            uvs.push(i / cells, 1 - j / cells);
          }
        const covered = (i, j) => {
          const x = x0 + ((x1 - x0) * i) / cells,
            z = z0 + ((z1 - z0) * j) / cells;
          return (
            hole && x > hole.x0 && x < hole.x1 && z > hole.z0 && z < hole.z1
          );
        };
        for (let j = 0; j < cells; j++)
          for (let i = 0; i < cells; i++) {
            if (
              covered(i, j) &&
              covered(i + 1, j) &&
              covered(i, j + 1) &&
              covered(i + 1, j + 1)
            )
              continue;
            const a = j * n + i,
              b = a + 1,
              c = a + n,
              d = c + 1;
            index.push(a, c, b, b, c, d);
          }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(positions, 3),
        );
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(index);
        geometry.computeVertexNormals();
        const material = new THREE.MeshLambertMaterial({ map: texture });
        if (sharp) applySharpSampling(material, sharp.w, sharp.h);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = !!receive;
        scene.add(mesh);
        return mesh;
      };
      groundMesh(farBlock.bounds, 96, far.texture, 3, outerBlock.bounds);
      groundMesh(outerBlock.bounds, 72, outer.texture, 2.2, midBlock.bounds);
      groundMesh(midBlock.bounds, 64, mid.texture, 1.2, core);
      groundMesh(core, 1, coreLayer.texture, 0, null, true, coreSize);
      // Buildings: real footprints, real roofs from imagery, facades from photographs.
      const allParts = buildingParts();
      const atlas = packRoofAtlas(allParts, 2048, low ? 0.5 : 1);
      const roofLayer = createCanvasTexture(
        atlas.size,
        atlas.size,
        '#c9bda7',
        renderer,
      );
      disposables.push(roofLayer.texture);
      const built = buildCampusGeometry(atlas);
      const pickables = [],
        tinted = [];
      const partCategory = allParts.map(
        (p) => landmarks.find((l) => l.id === p.landmark)?.category ?? null,
      );
      const addBatch = (batch, material, shadows = true) => {
        if (!batch.vertices) return null;
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(batch.position, 3),
        );
        geometry.setAttribute(
          'normal',
          new THREE.Float32BufferAttribute(batch.normal, 3),
        );
        geometry.setAttribute(
          'uv',
          new THREE.Float32BufferAttribute(batch.uv, 2),
        );
        geometry.setAttribute(
          'color',
          new THREE.Float32BufferAttribute(batch.color, 3),
        );
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = shadows;
        mesh.receiveShadow = true;
        mesh.userData.ranges = batch.ranges;
        mesh.userData.base = Float32Array.from(batch.color);
        scene.add(mesh);
        tinted.push(mesh);
        return mesh;
      };
      for (const style of WALL_STYLES) {
        const map = createWallTexture(style, renderer);
        disposables.push(map);
        const mesh = addBatch(
          built.walls[style],
          new THREE.MeshLambertMaterial({ map, vertexColors: true }),
        );
        if (mesh) pickables.push(mesh);
      }
      const roofMesh = addBatch(
        built.roofs,
        applySharpSampling(
          new THREE.MeshLambertMaterial({
            map: roofLayer.texture,
            vertexColors: true,
            side: THREE.DoubleSide,
          }),
          atlas.size,
          atlas.size,
        ),
      );
      pickables.push(roofMesh);
      addBatch(
        built.parapets,
        new THREE.MeshLambertMaterial({
          vertexColors: true,
          side: THREE.DoubleSide,
        }),
        false,
      );
      const surroundingWalls = [],
        surroundingRoofs = [];
      for (const [floors, ring] of surroundings) {
        const h = floors * 3.1;
        const y = heightAt(ring[0][0], ring[0][1]);
        ring.forEach((a, i) => {
          const b = ring[(i + 1) % ring.length];
          surroundingWalls.push(
            a[0],
            y,
            a[1],
            b[0],
            y,
            b[1],
            b[0],
            y + h,
            b[1],
            a[0],
            y,
            a[1],
            b[0],
            y + h,
            b[1],
            a[0],
            y + h,
            a[1],
          );
          if (i > 0 && i < ring.length - 1) {
            const c = ring[0];
            surroundingRoofs.push(
              c[0],
              y + h,
              c[1],
              a[0],
              y + h,
              a[1],
              b[0],
              y + h,
              b[1],
            );
          }
        });
      }
      const flatMesh = (positions, color) => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(positions, 3),
        );
        geometry.computeVertexNormals();
        const mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide }),
        );
        mesh.castShadow = true;
        scene.add(mesh);
      };
      flatMesh(surroundingWalls, '#b7a48c');
      flatMesh(surroundingRoofs, '#cdbfa8');
      // Trees stand where satellite imagery shows canopy, in the canopy's own colour.
      const trees = low ? vegetation.filter((_, i) => i % 2) : vegetation;
      // Each tree is a main crown plus a smaller lobe, for an irregular silhouette.
      const lobes = low ? 1 : 2;
      const leaves = createLeafTexture(renderer);
      disposables.push(leaves);
      const crowns = new THREE.InstancedMesh(
        createCrownGeometry(),
        new THREE.MeshLambertMaterial({ map: leaves, vertexColors: true }),
        trees.length * lobes,
      );
      const trunks = new THREE.InstancedMesh(
        new THREE.CylinderGeometry(0.16, 0.28, 1, 5),
        new THREE.MeshLambertMaterial({ color: '#5f5140' }),
        trees.length,
      );
      const dummy = new THREE.Object3D(),
        leaf = new THREE.Color();
      trees.forEach((t, i) => {
        const spin = (i * 2.399) % (Math.PI * 2);
        dummy.position.set(t.x, t.height * 0.5, t.z);
        dummy.scale.set(t.r * 0.42, t.height, t.r * 0.42);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        trunks.setMatrixAt(i, dummy.matrix);
        const shadeTree = 1.5 + ((i * 7) % 11) * 0.06;
        for (let lobe = 0; lobe < lobes; lobe++) {
          const small = lobe ? 0.68 : 1;
          dummy.position.set(
            t.x + (lobe ? Math.cos(spin) * t.r * 0.62 : 0),
            t.height + t.r * (lobe ? 0.42 : 0.62),
            t.z + (lobe ? Math.sin(spin) * t.r * 0.62 : 0),
          );
          dummy.scale.set(t.r * small, t.r * 0.82 * small, t.r * small);
          dummy.rotation.set(0, spin + lobe, 0);
          dummy.updateMatrix();
          crowns.setMatrixAt(i * lobes + lobe, dummy.matrix);
          leaf.set(`#${t.colour}`).multiplyScalar(shadeTree);
          crowns.setColorAt(i * lobes + lobe, leaf);
        }
      });
      crowns.castShadow = true;
      trunks.castShadow = true;
      scene.add(trunks, crowns);
      const crownMatrices = crowns.instanceMatrix.array.slice(),
        trunkMatrices = trunks.instanceMatrix.array.slice();
      let clearedTrees = [];
      // Steps trees aside for a small selected place; the canopy imagery stays on the ground.
      function clearTreesAround(l) {
        const near =
          l.extent < SMALL_PLACE
            ? trees.flatMap((t, i) =>
                Math.hypot(t.x - l.x, t.z - l.z) < TREE_CLEARANCE + t.r
                  ? [i]
                  : [],
              )
            : [];
        if (!near.length && !clearedTrees.length) return;
        const place = (i, source) => {
          trunks.instanceMatrix.array.set(
            source
              ? trunkMatrices.subarray(i * 16, i * 16 + 16)
              : new Float32Array(16),
            i * 16,
          );
          for (let lobe = 0; lobe < lobes; lobe++) {
            const at = (i * lobes + lobe) * 16;
            crowns.instanceMatrix.array.set(
              source
                ? crownMatrices.subarray(at, at + 16)
                : new Float32Array(16),
              at,
            );
          }
        };
        clearedTrees.forEach((i) => place(i, true));
        near.forEach((i) => place(i, false));
        clearedTrees = near;
        trunks.instanceMatrix.needsUpdate = true;
        crowns.instanceMatrix.needsUpdate = true;
        renderer.shadowMap.needsUpdate = true;
      }
      // Routes: real OpenStreetMap lines as crisp surfaces, toggled from the legend.
      const ribbon = (lines, width, y) => {
        const positions = [],
          normals = [],
          index = [];
        for (const line of lines) {
          const start = positions.length / 3;
          line.forEach(([x, z], i) => {
            const [ax, az] = line[Math.max(0, i - 1)],
              [bx, bz] = line[Math.min(line.length - 1, i + 1)];
            const len = Math.hypot(bx - ax, bz - az) || 1;
            const ox = (-(bz - az) / len) * (width / 2),
              oz = ((bx - ax) / len) * (width / 2);
            const h = heightAt(x, z) + y;
            positions.push(x + ox, h, z + oz, x - ox, h, z - oz);
            normals.push(0, 1, 0, 0, 1, 0);
            if (i) {
              const a = start + (i - 1) * 2;
              index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
            }
          });
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(positions, 3),
        );
        geometry.setAttribute(
          'normal',
          new THREE.Float32BufferAttribute(normals, 3),
        );
        geometry.setIndex(index);
        return geometry;
      };
      const routeMesh = (kind, width, color, y) => {
        const mesh = new THREE.Mesh(
          ribbon(routes[kind], width, y),
          new THREE.MeshLambertMaterial({ color }),
        );
        mesh.receiveShadow = true;
        mesh.userData.route = kind;
        scene.add(mesh);
      };
      routeMesh('shared', 5.6, '#b9b2a0', 0.4);
      routeMesh('shared', 4.6, '#6b6a66', 0.46);
      routeMesh('walking', 1.7, '#e5d3aa', 0.5);
      // Selection: outlines a building's roof, or rings an open space.
      const selectRing = new THREE.Mesh(
        new THREE.RingGeometry(0.955, 1, 96),
        new THREE.MeshBasicMaterial({
          color: '#f2cb7c',
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
          depthTest: false,
        }),
      );
      selectRing.rotation.x = -Math.PI / 2;
      selectRing.renderOrder = 10;
      scene.add(selectRing);
      const outline = new THREE.LineSegments(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ color: '#f2cb7c', depthTest: false }),
      );
      outline.renderOrder = 10;
      scene.add(outline);
      // A column of light finds a small place among the trees from any distance.
      const beacon = new THREE.Mesh(
        new THREE.CylinderGeometry(1.1, 1.1, 42, 16, 1, true),
        new THREE.MeshBasicMaterial({
          color: '#f6d58c',
          transparent: true,
          opacity: 0.32,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      beacon.visible = false;
      scene.add(beacon);
      const markerLayer = document.createElement('div');
      markerLayer.className = 'cm-scene-markers';
      el.appendChild(markerLayer);
      const markers = landmarks.map((l, i) => {
        const b = document.createElement('button');
        b.className = 'cm-scene-marker';
        b.textContent = String(i + 1).padStart(2, '0');
        b.title = l.name;
        b.setAttribute('aria-label', l.name);
        b.setAttribute('data-name', l.name);
        b.classList.toggle('named', l.label);
        b.onclick = () => latest.current.onSelect(l.id);
        markerLayer.appendChild(b);
        return { l, b };
      });
      const tags = annotations.map((a) => {
        const t = document.createElement('span');
        t.className = 'cm-scene-tag';
        t.textContent = a.text;
        t.hidden = true;
        markerLayer.appendChild(t);
        return { a, t };
      });
      const projected = new THREE.Vector3();
      let width = 1,
        height = 1,
        aspectScale = 1,
        flight = null,
        lastFrame = 0,
        slowFrames = 0;
      const reducedMotion = window.matchMedia?.(
        '(prefers-reduced-motion: reduce)',
      )?.matches;
      const startSpherical = new THREE.Spherical(),
        endSpherical = new THREE.Spherical(),
        flightOffset = new THREE.Vector3();
      function flyTo(position, target, ms = FLY_MS) {
        const end = new THREE.Vector3(...position),
          endTarget = new THREE.Vector3(...target);
        if (reducedMotion || !ms) {
          controls.target.copy(endTarget);
          camera.position.copy(end);
          flight = null;
          controls.update();
          request();
          return;
        }
        startSpherical.setFromVector3(
          flightOffset.copy(camera.position).sub(controls.target),
        );
        endSpherical.setFromVector3(flightOffset.copy(end).sub(endTarget));
        const turn = endSpherical.theta - startSpherical.theta;
        flight = {
          start: performance.now(),
          ms,
          fromTarget: controls.target.clone(),
          toTarget: endTarget,
          radius0: startSpherical.radius,
          radius1: endSpherical.radius,
          phi0: startSpherical.phi,
          phi1: endSpherical.phi,
          theta0: startSpherical.theta,
          turn: Math.atan2(Math.sin(turn), Math.cos(turn)),
        };
        request();
      }
      function advanceFlight(now) {
        const f = flight,
          raw = Math.min(1, (now - f.start) / f.ms),
          t = raw * raw * (3 - 2 * raw);
        controls.target.lerpVectors(f.fromTarget, f.toTarget, t);
        const s = new THREE.Spherical(
          f.radius0 * Math.pow(f.radius1 / f.radius0, t),
          f.phi0 + (f.phi1 - f.phi0) * t,
          f.theta0 + f.turn * t,
        );
        camera.position.setFromSpherical(s).add(controls.target);
        if (raw >= 1) flight = null;
      }
      // Keeps motion fluid on slow GPUs; full sharpness returns once the view settles.
      function adaptQuality(now, moving) {
        if (!moving) {
          slowFrames = 0;
          return;
        }
        const gap = now - lastFrame;
        if (lastFrame && gap < 200 && gap > 30) slowFrames++;
        else if (slowFrames > 0) slowFrames--;
        if (slowFrames > 12 && ratio > minRatio) {
          ratio = Math.max(minRatio, ratio - 0.35);
          renderer.setPixelRatio(ratio);
          slowFrames = 0;
        }
      }
      // Selected and named places claim their space first, so markers never overlap.
      function placeMarkers() {
        const { selected, labels, category } = latest.current;
        const taken = [];
        const claim = (x0, y0, x1, y1) => {
          if (
            taken.some((r) => x0 < r[2] && x1 > r[0] && y0 < r[3] && y1 > r[1])
          )
            return false;
          taken.push([x0, y0, x1, y1]);
          return true;
        };
        // After those, the smallest places go first: they have the least else to click on.
        const rank = ({ l }) =>
          l.id === selected
            ? 0
            : l.label
              ? 1
              : 2 + (l.extent < SMALL_PLACE ? l.extent / 1000 : 1);
        const names = [];
        for (const m of [...markers].sort((a, b) => rank(a) - rank(b))) {
          const { l, b } = m;
          // Names yield to the priority markers, then claim space from the others.
          if (rank(m) >= 2) taken.push(...names.splice(0));
          const active = l.id === selected;
          projected.set(l.x, l.y + 7, l.z).project(camera);
          const x = (projected.x * 0.5 + 0.5) * width,
            y = (-projected.y * 0.5 + 0.5) * height;
          const onScreen =
            labels &&
            (category === 'all' || l.category === category) &&
            projected.z < 1 &&
            projected.z > -1 &&
            Math.abs(projected.x) < 0.96 &&
            Math.abs(projected.y) < 0.92;
          const half = active ? 16 : 13;
          const visible =
            onScreen && claim(x - half, y - half, x + half, y + half);
          // A name sits above its marker, so neighbours on the same row stay visible.
          if (visible && (active || l.label)) {
            const nameHalf = (l.name.length * 7.2 + 18) / 2;
            names.push([x - nameHalf, y - half - 26, x + nameHalf, y - half]);
          }
          b.hidden = !visible;
          b.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
          b.classList.toggle('active', active);
          b.setAttribute('aria-pressed', String(active));
        }
        for (const { a, t } of tags) {
          projected.set(a.x, a.y, a.z).project(camera);
          const x = (projected.x * 0.5 + 0.5) * width,
            y = (-projected.y * 0.5 + 0.5) * height;
          const near =
            selected === a.parent ||
            camera.position.distanceTo(projected.set(a.x, a.y, a.z)) < 320;
          t.hidden = !(labels && near);
          t.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
        }
      }
      function draw() {
        if (disposed) return;
        raf = 0;
        try {
          const now = performance.now();
          if (flight) advanceFlight(now);
          const moved = controls.update();
          const moving = moved || !!flight;
          adaptQuality(now, moving);
          lastFrame = moving ? now : 0;
          controls.target.x = THREE.MathUtils.clamp(
            controls.target.x,
            -2600,
            2600,
          );
          controls.target.z = THREE.MathUtils.clamp(
            controls.target.z,
            -2600,
            2600,
          );
          // Stay above the treetops, where imagery and models hold up as a low drone pass.
          const floor = heightAt(camera.position.x, camera.position.z) + 17;
          if (camera.position.y < floor) camera.position.y = floor;
          const distance = camera.position.distanceTo(controls.target);
          const near = THREE.MathUtils.clamp(distance * 0.02, 1, 40);
          if (Math.abs(near - camera.near) > camera.near * 0.15) {
            camera.near = near;
            camera.updateProjectionMatrix();
          }
          camera.updateMatrixWorld();
          placeMarkers();
          renderer.render(scene, camera);
          setReady(true);
          if (moving) request();
          else if (ratio < maxRatio) {
            clearTimeout(settle);
            settle = setTimeout(() => {
              ratio = maxRatio;
              renderer.setPixelRatio(ratio);
              request();
            }, 400);
          }
        } catch {
          fail();
        }
      }
      function request() {
        if (!raf && !disposed) raf = requestAnimationFrame(draw);
      }
      let tintKey = '',
        shownSelection = latest.current.selected;
      // Dims other categories and lifts the selected place, so it stands out at any zoom.
      function applyTint() {
        const { category: active, selected: chosen } = latest.current;
        const key = `${active}/${chosen}`;
        if (key === tintKey) return;
        tintKey = key;
        for (const mesh of tinted) {
          const color = mesh.geometry.attributes.color;
          const base = mesh.userData.base;
          for (const { part, start, end } of mesh.userData.ranges) {
            const dim =
              allParts[part].landmark === chosen
                ? 1.12
                : active !== 'all' && partCategory[part] !== active
                  ? 0.42
                  : 1;
            for (let i = start * 3; i < end * 3; i++)
              color.array[i] = base[i] * dim;
          }
          color.needsUpdate = true;
        }
      }
      function showSelection(l) {
        const own = allParts.filter((p) => p.landmark === l.id);
        const lines = [];
        for (const p of own) {
          const y = p.height + 1.1;
          for (const ring of [p.outer, ...p.holes])
            ring.forEach((a, i) => {
              const b = ring[(i + 1) % ring.length];
              lines.push(a[0], y, a[1], b[0], y, b[1]);
            });
        }
        outline.geometry.dispose();
        outline.geometry = new THREE.BufferGeometry();
        outline.geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(lines, 3),
        );
        selectRing.visible = !!l.ring;
        if (l.ring) {
          selectRing.scale.setScalar(l.ring);
          selectRing.position.set(l.x, 0.8, l.z);
        }
        beacon.visible = l.extent < SMALL_PLACE;
        beacon.position.set(l.x, l.y + 22, l.z);
        clearTreesAround(l);
      }
      function focusOn(l) {
        const offset = new THREE.Vector3()
          .copy(camera.position)
          .sub(controls.target);
        const s = new THREE.Spherical().setFromVector3(offset);
        const view = l.view ?? {};
        s.radius =
          (view.distance ?? THREE.MathUtils.clamp(l.extent * 2.1, 90, 520)) *
          aspectScale;
        s.phi = view.phi ?? THREE.MathUtils.clamp(s.phi, 0.7, 1.15);
        s.theta = view.theta ?? s.theta;
        const y = Math.min(l.y * 0.5, 20);
        const position = new THREE.Vector3()
          .setFromSpherical(s)
          .add(new THREE.Vector3(l.x, y, l.z));
        flyTo(position.toArray(), [l.x, y, l.z]);
      }
      function sync() {
        for (const child of scene.children) {
          if (child.userData.route)
            child.visible = !!latest.current.routeLayers[child.userData.route];
        }
        applyTint();
        const l = landmarks.find((x) => x.id === latest.current.selected);
        if (l) {
          showSelection(l);
          if (l.id !== shownSelection) {
            shownSelection = l.id;
            focusOn(l);
          }
        }
        controls.mouseButtons.LEFT = latest.current.panMode
          ? THREE.MOUSE.PAN
          : THREE.MOUSE.ROTATE;
        request();
      }
      function scaled(position, target) {
        return new THREE.Vector3(...position)
          .sub(new THREE.Vector3(...target))
          .multiplyScalar(aspectScale)
          .add(new THREE.Vector3(...target))
          .toArray();
      }
      function preset(name) {
        const p = PRESETS[name] || PRESETS.overview;
        flyTo(scaled(p.position, p.target), p.target);
      }
      function zoom(factor) {
        const next = camera.position
          .clone()
          .sub(controls.target)
          .multiplyScalar(factor)
          .clampLength(controls.minDistance, controls.maxDistance)
          .add(controls.target);
        flyTo(next.toArray(), controls.target.toArray(), 420);
      }
      function rotate(deg) {
        const offset = camera.position.clone().sub(controls.target);
        offset.applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          (deg * Math.PI) / 180,
        );
        flyTo(
          offset.add(controls.target).toArray(),
          controls.target.toArray(),
          420,
        );
      }
      api.current = { sync, preset, zoom, rotate };
      const cancelFlight = () => {
        flight = null;
      };
      controls.addEventListener('start', cancelFlight);
      controls.addEventListener('change', request);
      function fit() {
        if (disposed) return;
        const bounds = el.getBoundingClientRect();
        width = Math.round(bounds.width);
        height = Math.round(bounds.height);
        if (width < 1 || height < 1) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        const nextScale = Math.max(1, 1 / camera.aspect);
        camera.position
          .sub(controls.target)
          .multiplyScalar(nextScale / aspectScale)
          .add(controls.target);
        aspectScale = nextScale;
        camera.updateProjectionMatrix();
        controls.update();
        camera.updateMatrixWorld();
        draw();
      }
      const resize = new ResizeObserver(fit);
      resize.observe(el);
      const ray = new THREE.Raycaster(),
        pointer = new THREE.Vector2();
      let down = null;
      function pointerDown(e) {
        down = { x: e.clientX, y: e.clientY };
        flight = null;
      }
      function pointerUp(e) {
        if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5)
          return;
        const r = renderer.domElement.getBoundingClientRect();
        pointer.set(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          (-(e.clientY - r.top) / r.height) * 2 + 1,
        );
        ray.setFromCamera(pointer, camera);
        const hit = ray.intersectObjects(pickables)[0];
        if (hit) {
          const vertex = hit.faceIndex * 3;
          const range = hit.object.userData.ranges.find(
            (x) => vertex >= x.start && vertex < x.end,
          );
          const id = range && allParts[range.part].landmark;
          if (id) latest.current.onSelect(id);
        }
        down = null;
      }
      function keys(e) {
        if (e.target !== host.current) return;
        if (
          [
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            '+',
            '=',
            '-',
            '0',
          ].includes(e.key)
        ) {
          e.preventDefault();
          if (e.key === '0') preset('overview');
          else if (['+', '='].includes(e.key)) zoom(0.85);
          else if (e.key === '-') zoom(1.18);
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
            rotate(e.key === 'ArrowLeft' ? -10 : 10);
          else {
            const o = camera.position.clone().sub(controls.target),
              s = new THREE.Spherical().setFromVector3(o);
            s.phi = THREE.MathUtils.clamp(
              s.phi + (e.key === 'ArrowUp' ? -0.08 : 0.08),
              0.01,
              Math.PI * 0.47,
            );
            camera.position
              .copy(controls.target)
              .add(new THREE.Vector3().setFromSpherical(s));
            request();
          }
        }
      }
      const lost = (e) => {
        e.preventDefault();
        fail();
      };
      renderer.domElement.addEventListener('webglcontextlost', lost);
      renderer.domElement.addEventListener('pointerdown', pointerDown);
      renderer.domElement.addEventListener('pointerup', pointerUp);
      host.current.addEventListener('keydown', keys);
      cleanup = () => {
        disposed = true;
        loading.abort();
        cancelAnimationFrame(raf);
        clearTimeout(settle);
        resize.disconnect();
        controls.dispose();
        host.current?.removeEventListener('keydown', keys);
        renderer.domElement.removeEventListener('webglcontextlost', lost);
        renderer.domElement.removeEventListener('pointerdown', pointerDown);
        renderer.domElement.removeEventListener('pointerup', pointerUp);
        const geometries = new Set(),
          materials = new Set();
        scene.traverse((o) => {
          if (o.geometry) geometries.add(o.geometry);
          if (o.material) materials.add(o.material);
        });
        geometries.forEach((g) => g.dispose());
        materials.forEach((m) => m.dispose());
        disposables.forEach((t) => t.dispose());
        renderer.dispose();
        renderer.domElement.remove();
        markerLayer.remove();
        api.current = null;
      };
      sync();
      fit();
      renderer.shadowMap.needsUpdate = true;
      request();
      // Imagery streams in behind the model, coarse first, so the view is never blocked.
      const coreTiles =
        Math.ceil(coreSize.w / 256) * Math.ceil(coreSize.h / 256);
      const total =
        farBlock.nx ** 2 + outerBlock.nx ** 2 + midBlock.nx ** 2 + coreTiles;
      let done = 0;
      const tick = () => {
        done++;
        if (done % 12 === 0 && !disposed)
          setImagery({
            percent: Math.round((done / total) * 100),
            state: 'loading',
          });
      };
      (async () => {
        const { signal } = loading;
        const coarse = await Promise.all([
          loadBlock(farBlock, far.canvas, far.texture, 256, signal, tick),
          loadBlock(outerBlock, outer.canvas, outer.texture, 256, signal, tick),
          loadBlock(midBlock, mid.canvas, mid.texture, 256, signal, tick),
        ]);
        if (disposed) return;
        request();
        const sharp = await loadCore({
          parts: allParts,
          atlas,
          groundCanvas: coreLayer.canvas,
          groundTexture: coreLayer.texture,
          roofCanvas: roofLayer.canvas,
          roofTexture: roofLayer.texture,
          z: coreZoom,
          signal,
          onTile: tick,
        });
        if (disposed) return;
        setImagery({
          percent: 100,
          state: sharp || coarse.some(Boolean) ? 'ready' : 'failed',
        });
        request();
      })();
      return cleanup;
    } catch {
      cleanup();
      renderer?.dispose();
      renderer?.domElement?.remove();
      onFailure();
      return cleanup;
    }
  }, []);
  useEffect(() => {
    api.current?.sync();
  }, [selected, category, labels, routeLayers, panMode]);
  return (
    <div
      className="cm-webgl"
      ref={host}
      tabIndex={0}
      role="group"
      aria-label="Interactive three-dimensional LNMIIT campus. Drag to orbit, scroll to zoom, or use the labelled controls."
      aria-describedby="cm-instructions"
    >
      <div className="cm-render-surface" ref={mount} />
      {!ready && (
        <div className="cm-loading" role="status">
          Preparing the campus…
        </div>
      )}
      {imagery.state === 'loading' && (
        <div className="cm-imagery-status" role="status">
          Loading satellite imagery · {imagery.percent}%
        </div>
      )}
      {imagery.state === 'failed' && (
        <div className="cm-imagery-status" role="status">
          Satellite imagery is unavailable. Buildings are still shown.
        </div>
      )}
      <p className="cm-attribution">
        Imagery: Esri, Vantor, Earthstar Geographics · Map data: ©
        OpenStreetMap contributors, Overture Maps · {metresPerPixel.toFixed(2)}{' '}
        m/px
      </p>
    </div>
  );
});
