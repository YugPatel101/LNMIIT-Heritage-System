// Satellite tiles and procedural facades for the campus scene. Browser only.
import * as THREE from 'three';
import { metresPerPixel, mosaic, origin } from '@/data/campus-real.mjs';
import { ROOF_MARGIN, STYLES } from '@/data/campus-geometry.mjs';

const TILE_URL = (z, x, y) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
const CONCURRENCY = 8;

async function pool(jobs, worker) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, async () => {
      while (next < jobs.length) await worker(jobs[next++]);
    }),
  );
}

// Draws a block of tiles into a canvas. Returns the number that loaded.
async function drawTiles({
  canvas,
  z,
  x0,
  y0,
  nx,
  ny,
  tilePx,
  signal,
  onTile,
}) {
  const ctx = canvas.getContext('2d');
  const jobs = [];
  for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) jobs.push([x, y]);
  let loaded = 0;
  await pool(jobs, async ([x, y]) => {
    if (signal.aborted) return;
    try {
      const response = await fetch(TILE_URL(z, x0 + x, y0 + y), { signal });
      if (!response.ok) throw new Error(String(response.status));
      const bitmap = await createImageBitmap(await response.blob());
      ctx.drawImage(bitmap, x * tilePx, y * tilePx, tilePx, tilePx);
      bitmap.close();
      loaded++;
    } catch {
      // A missing tile leaves the base colour; the rest of the view still works.
    }
    onTile?.();
  });
  return loaded;
}

const mercatorTile = (z) => {
  const scale = 2 ** (mosaic.z - z);
  return {
    x: (mosaic.x0 + origin.px / 256) / scale,
    y: (mosaic.y0 + origin.py / 256) / scale,
    metres: metresPerPixel * 256 * scale,
  };
};

// A square block of tiles centred on the campus, with its world rectangle.
export function tileBlock(z, count) {
  const c = mercatorTile(z);
  const x0 = Math.floor(c.x) - Math.floor(count / 2),
    y0 = Math.floor(c.y) - Math.floor(count / 2);
  return {
    z,
    x0,
    y0,
    nx: count,
    ny: count,
    bounds: {
      x0: (x0 - c.x) * c.metres,
      z0: (y0 - c.y) * c.metres,
      x1: (x0 + count - c.x) * c.metres,
      z1: (y0 + count - c.y) * c.metres,
    },
  };
}

function makeTexture(canvas, renderer) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  return t;
}

function blankCanvas(w, h, fill) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = fill;
  g.fillRect(0, 0, w, h);
  return c;
}

export function createBlockTexture(block, tilePx, renderer, fill) {
  const canvas = blankCanvas(block.nx * tilePx, block.ny * tilePx, fill);
  return { canvas, texture: makeTexture(canvas, renderer) };
}

export async function loadBlock(
  block,
  canvas,
  texture,
  tilePx,
  signal,
  onTile,
) {
  const loaded = await drawTiles({ canvas, ...block, tilePx, signal, onTile });
  if (loaded && !signal.aborted) texture.needsUpdate = true;
  return loaded;
}

// Loads the sharpest imagery, copies each roof into the atlas, then removes
// from the ground the roof pixels that sit north of each building's true base.
export async function loadCore({
  parts,
  atlas,
  groundCanvas,
  groundTexture,
  roofCanvas,
  roofTexture,
  z,
  signal,
  onTile,
}) {
  const scale = 2 ** (mosaic.z - z);
  const tilePx = 256;
  const loaded = await drawTiles({
    canvas: groundCanvas,
    z,
    x0: Math.floor(mosaic.x0 / scale),
    y0: Math.floor(mosaic.y0 / scale),
    nx: Math.ceil(mosaic.w / 256 / scale),
    ny: Math.ceil(mosaic.h / 256 / scale),
    tilePx,
    signal,
    onTile,
  });
  if (!loaded || signal.aborted) return 0;
  const k = atlas.scale;
  const roofs = roofCanvas.getContext('2d');
  const m = ROOF_MARGIN;
  for (const b of atlas.boxes) {
    // The margin keeps texture filtering inside real imagery at each roof's edge.
    roofs.drawImage(
      groundCanvas,
      (b.x - m / k) * k,
      (b.y - m / k) * k,
      (b.w + (2 * m) / k) * k,
      (b.h + (2 * m) / k) * k,
      b.ax - m,
      b.ay - m,
      b.w * k + 2 * m,
      b.h * k + 2 * m,
    );
    if (parts[b.index].name === 'OAT stage') paintStage(roofs, b, k);
  }
  const ground = groundCanvas.getContext('2d');
  for (const part of parts) {
    const [sx, sy] = part.shift;
    const len = Math.hypot(sx, sy);
    if (len < 1) continue;
    const reach = (len + 12) / len;
    ground.save();
    ground.beginPath();
    for (const ring of [part.roofOuter, ...part.roofHoles]) {
      ring.forEach(([x, y], i) =>
        i ? ground.lineTo(x * k, y * k) : ground.moveTo(x * k, y * k),
      );
      ground.closePath();
    }
    ground.clip('evenodd');
    ground.drawImage(groundCanvas, sx * reach * k, sy * reach * k);
    ground.restore();
  }
  groundTexture.needsUpdate = true;
  roofTexture.needsUpdate = true;
  return loaded;
}

// Timber decking, so the low platform reads as a stage against the sandy ground.
function paintStage(g, b, k) {
  const [x, y, w, h] = [b.ax, b.ay, b.w * k, b.h * k];
  g.fillStyle = '#c79a66';
  g.fillRect(x, y, w, h);
  g.fillStyle = '#b5885a';
  for (let i = 2; i < w; i += 3) g.fillRect(x + i, y, 1, h);
}

export const coreCanvasSize = (z) => {
  const scale = 2 ** (mosaic.z - z);
  return { w: Math.ceil(mosaic.w / scale), h: Math.ceil(mosaic.h / scale) };
};

export function createCanvasTexture(w, h, fill, renderer) {
  const canvas = blankCanvas(w, h, fill);
  return { canvas, texture: makeTexture(canvas, renderer) };
}

// Facade artwork: 8 bays wide and 4 floors tall, matched to campus photographs.
const WALLS = {
  hostel: { base: '#c26a52', course: '#a95a44', band: '#d4896f' },
  academic: { base: '#c46c54', course: '#ab5b45', band: '#d68c73' },
  bh4: { base: '#d0694a', course: '#b5583c', band: '#b9b6ab' },
  bungalow: { base: '#c98368', course: '#b07058', band: '#dcaa92' },
  hangar: { base: '#d6d5cc', course: '#bebdb4', band: '#e4e3db' },
  construction: { base: '#8f8c84', course: '#7b7870', band: '#a19e95' },
  arcade: { base: '#c46c54', course: '#ab5b45', band: '#d68c73' },
  stage: { base: '#c9b08b', course: '#b39a76', band: '#d8c4a2' },
};

export function createWallTexture(style, renderer) {
  const w = 1024,
    h = 512;
  const bayW = w / 8,
    floorH = h / 4;
  const palette = WALLS[style];
  const canvas = blankCanvas(w, h, palette.base);
  const g = canvas.getContext('2d');
  let seed = 41 + style.length * 7;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  // Dressed-stone coursing and weathering.
  g.strokeStyle = palette.course;
  g.globalAlpha = 0.34;
  g.lineWidth = 1;
  for (let y = 0; y < h; y += 11) {
    g.beginPath();
    g.moveTo(0, y + 0.5);
    g.lineTo(w, y + 0.5);
    g.stroke();
  }
  g.globalAlpha = 1;
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = rnd() > 0.5 ? '#ffffff0a' : '#2413090e';
    g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 5, 1 + rnd() * 3);
  }
  for (let floor = 0; floor < 4; floor++) {
    const top = floor * floorH;
    g.fillStyle = palette.band;
    g.fillRect(0, top + floorH - 7, w, 7);
    g.fillStyle = '#00000030';
    g.fillRect(0, top + floorH, w, 2);
    for (let bay = 0; bay < 8; bay++) {
      drawBay(g, style, bay * bayW, top, bayW, floorH, rnd, palette);
    }
  }
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}

function drawBay(g, style, x, y, w, h, rnd, palette) {
  if (style === 'arcade' || style === 'stage') return;
  if (style === 'construction') {
    // Open floor plates and stubs of column before the facade goes on.
    g.fillStyle = '#26272a';
    g.fillRect(x + 8, y + 22, w - 16, h - 46);
    g.fillStyle = palette.base;
    g.fillRect(x + w / 2 - 5, y + 22, 10, h - 46);
    return;
  }
  if (style === 'hangar') {
    g.fillStyle = palette.course;
    for (let i = 0; i < 6; i++) g.fillRect(x + (i * w) / 6, y, 2, h);
    return;
  }
  if (style === 'bh4') {
    // Grey panels between terracotta piers, as in the BH4 photograph.
    g.fillStyle = '#a7a59b';
    g.fillRect(x + 14, y + 8, w - 28, h - 16);
    windowFrame(g, x + w * 0.3, y + h * 0.26, w * 0.4, h * 0.44, rnd);
    g.fillStyle = '#e6e3d8';
    g.fillRect(x + w * 0.36, y + h * 0.72, w * 0.28, 8);
    return;
  }
  if (style === 'academic') {
    // Deep recessed openings between stone piers.
    g.fillStyle = '#5a3a30';
    g.fillRect(x + w * 0.14, y + h * 0.16, w * 0.72, h * 0.62);
    windowFrame(g, x + w * 0.2, y + h * 0.26, w * 0.6, h * 0.48, rnd);
    return;
  }
  if (style === 'bungalow') {
    if (rnd() < 0.3) return;
    windowFrame(g, x + w * 0.3, y + h * 0.28, w * 0.4, h * 0.42, rnd);
    return;
  }
  g.fillStyle = '#7a4134';
  g.fillRect(x + w * 0.24, y + h * 0.2, w * 0.52, h * 0.56);
  windowFrame(g, x + w * 0.29, y + h * 0.26, w * 0.42, h * 0.46, rnd);
  g.fillStyle = palette.band;
  g.fillRect(x + w * 0.22, y + h * 0.76, w * 0.56, 5);
}

function windowFrame(g, x, y, w, h, rnd) {
  const tone = 30 + Math.floor(rnd() * 38);
  g.fillStyle = `rgb(${tone},${tone + 8},${tone + 16})`;
  g.fillRect(x, y, w, h);
  g.fillStyle = '#ffffff1f';
  g.fillRect(x, y, w, h * 0.22);
  g.fillStyle = '#17110e';
  g.fillRect(x + w / 2 - 1, y, 2, h);
  g.fillRect(x, y + h * 0.42, w, 2);
}

export const wallStyles = Object.keys(STYLES);

// Imagery is at most 0.27 m per pixel, so the sampling must lose none of it. Far away, a
// negative mip bias keeps full detail under anisotropic filtering. Close up, Catmull-Rom
// reconstruction replaces bilinear, which softens and blocks the pixels when magnified.
const SHARP_SAMPLE = `
uniform vec2 sharpMapSize;
vec4 sharpSample(sampler2D tex, vec2 uv) {
  vec2 texel = uv * sharpMapSize;
  vec2 dx = dFdx(texel), dy = dFdy(texel);
  if (max(dot(dx, dx), dot(dy, dy)) >= 1.0) return texture(tex, uv, -0.55);
  vec2 base = floor(texel - 0.5) + 0.5;
  vec2 f = texel - base;
  vec2 w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
  vec2 w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
  vec2 w2 = f * (0.5 + f * (2.0 - 1.5 * f));
  vec2 w3 = f * f * (-0.5 + 0.5 * f);
  vec2 w12 = w1 + w2;
  vec2 p0 = (base - 1.0) / sharpMapSize;
  vec2 p12 = (base + w2 / w12) / sharpMapSize;
  vec2 p3 = (base + 2.0) / sharpMapSize;
  vec4 c = vec4(0.0);
  c += textureLod(tex, vec2(p0.x, p0.y), 0.0) * w0.x * w0.y;
  c += textureLod(tex, vec2(p12.x, p0.y), 0.0) * w12.x * w0.y;
  c += textureLod(tex, vec2(p3.x, p0.y), 0.0) * w3.x * w0.y;
  c += textureLod(tex, vec2(p0.x, p12.y), 0.0) * w0.x * w12.y;
  c += textureLod(tex, vec2(p12.x, p12.y), 0.0) * w12.x * w12.y;
  c += textureLod(tex, vec2(p3.x, p12.y), 0.0) * w3.x * w12.y;
  c += textureLod(tex, vec2(p0.x, p3.y), 0.0) * w0.x * w3.y;
  c += textureLod(tex, vec2(p12.x, p3.y), 0.0) * w12.x * w3.y;
  c += textureLod(tex, vec2(p3.x, p3.y), 0.0) * w3.x * w3.y;
  return clamp(c, 0.0, 1.0);
}
`;

export function applySharpSampling(material, width, height) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.sharpMapSize = { value: new THREE.Vector2(width, height) };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${SHARP_SAMPLE}`)
      .replace(
        '#include <map_fragment>',
        'diffuseColor *= sharpSample(map, vMapUv);',
      );
  };
  material.customProgramCacheKey = () => 'sharp-sampling';
  return material;
}

export function createSkyDome() {
  const geometry = new THREE.SphereGeometry(30000, 24, 16);
  const horizon = new THREE.Color('#dfe2dc'),
    zenith = new THREE.Color('#8fb1d0');
  const position = geometry.attributes.position;
  const colors = new Float32Array(position.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < position.count; i++) {
    const t = Math.max(0, position.getY(i) / 30000);
    c.copy(horizon).lerp(zenith, Math.pow(t, 0.55));
    c.toArray(colors, i * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const dome = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
      fog: false,
      depthWrite: false,
    }),
  );
  dome.renderOrder = -10;
  return dome;
}

// Uneven crowns read as foliage rather than spheres; shaded darker underneath.
export function createCrownGeometry() {
  const geometry = new THREE.IcosahedronGeometry(1, 1);
  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const colors = new Float32Array(position.count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i);
    // Normals from the unit sphere keep crowns rounded rather than faceted.
    normal.setXYZ(i, v.x, v.y, v.z);
    const n = Math.sin(v.x * 5.1 + v.y * 2.3) * Math.cos(v.z * 4.7 - v.y * 1.9);
    v.multiplyScalar(1 + n * 0.14);
    position.setXYZ(i, v.x, v.y, v.z);
    const shade = 0.72 + (v.y + 1) * 0.2;
    colors.set([shade, shade, shade], i * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}

// Mottled leaf clusters, so a crown reads as foliage from close up.
export function createLeafTexture(renderer) {
  const size = 256;
  const canvas = blankCanvas(size, size, '#f2f2f2');
  const g = canvas.getContext('2d');
  let seed = 97;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < 1800; i++) {
    const r = 3 + rnd() * 8;
    const tone = rnd();
    g.fillStyle =
      tone > 0.55
        ? `rgba(255,255,255,${0.08 + rnd() * 0.14})`
        : `rgba(40,60,30,${0.05 + rnd() * 0.1})`;
    const x = rnd() * size,
      y = rnd() * size;
    // Wrap at the edges so the seam around each crown does not show.
    for (const ox of [-size, 0, size]) {
      g.beginPath();
      g.arc(x + ox, y, r, 0, Math.PI * 2);
      g.fill();
    }
  }
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
