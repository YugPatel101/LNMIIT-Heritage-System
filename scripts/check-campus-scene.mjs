// Exercise the actual scene setup with real Three.js geometry and a renderer stub.
// This checks lifecycle and first-frame scheduling without requiring a GPU.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as Three from 'three';
import {
  buildCampusGeometry,
  buildingParts,
  coreBounds,
  heightAt,
  packRoofAtlas,
  WALL_STYLES,
} from '../src/data/campus-geometry.mjs';
import { context, metresPerPixel } from '../src/data/campus-real.mjs';
import {
  annotations,
  landmarks,
  routes,
  vegetation,
} from '../src/data/campus-model.mjs';
let rendered = 0,
  failed = 0,
  ready = false,
  cleanup;
class Element {
  constructor() {
    this.children = [];
    this.style = {};
    this.classList = { toggle() {} };
  }
  appendChild(x) {
    this.children.push(x);
  }
  remove() {}
  setAttribute() {}
  addEventListener() {}
  removeEventListener() {}
  getBoundingClientRect() {
    return { width: 1000, height: 700 };
  }
  getContext() {
    return { fillRect() {} };
  }
}
const surface = new Element(),
  host = new Element();
let refs = 0;
class Renderer {
  constructor() {
    this.domElement = new Element();
    this.shadowMap = {};
    this.capabilities = { maxTextureSize: 8192, getMaxAnisotropy: () => 8 };
  }
  setPixelRatio() {}
  setSize(w, h) {
    assert(w > 0 && h > 0);
  }
  render(scene, camera) {
    assert(scene.children.length > 12);
    assert(camera.projectionMatrix.elements.every(Number.isFinite));
    assert(camera.position.toArray().every(Number.isFinite));
    const frustum = new Three.Frustum().setFromProjectionMatrix(
      new Three.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse,
      ),
    );
    assert(
      landmarks.some((l) =>
        frustum.containsPoint(new Three.Vector3(l.x, l.y, l.z)),
      ),
    );
    rendered++;
  }
  dispose() {}
}
class Controls {
  constructor(camera) {
    this.camera = camera;
    this.target = new Three.Vector3();
    this.mouseButtons = {};
  }
  update() {
    this.camera.lookAt(this.target);
    return false;
  }
  addEventListener() {}
  dispose() {}
}
let code = readFileSync(
  new URL('../src/components/CampusScene.js', import.meta.url),
  'utf8',
);
code = code
  .slice(code.indexOf('const WebGLCampusScene ='))
  .replace('const WebGLCampusScene = forwardRef(', 'return (');
code =
  code.slice(
    0,
    code.lastIndexOf('return', code.lastIndexOf('className="cm-webgl"')),
  ) + ' return null;\n});';
const stubTexture = () => ({ canvas: {}, texture: new Three.Texture() });
const dependencies = {
  useRef: (value) => ({
    current: refs++ === 0 ? surface : refs === 2 ? host : value,
  }),
  useState: (value) => [
    value,
    (v) => {
      if (typeof v === 'boolean') ready = v;
    },
  ],
  useEffect: (fn) => {
    const c = fn();
    if (c) cleanup = c;
  },
  useImperativeHandle: () => {},
  THREE: { ...Three, WebGLRenderer: Renderer },
  OrbitControls: Controls,
  annotations,
  landmarks,
  routes,
  vegetation,
  surroundings: context,
  metresPerPixel,
  buildCampusGeometry,
  buildingParts,
  coreBounds,
  heightAt,
  packRoofAtlas,
  WALL_STYLES,
  coreCanvasSize: () => ({ w: 256, h: 256 }),
  createBlockTexture: stubTexture,
  createCanvasTexture: stubTexture,
  createCrownGeometry: () => new Three.IcosahedronGeometry(1, 1),
  createLeafTexture: () => new Three.Texture(),
  createSkyDome: () => new Three.Object3D(),
  createWallTexture: () => new Three.Texture(),
  loadBlock: async () => 1,
  loadCore: async () => 1,
  applySharpSampling: (material) => material,
  SMALL_PLACE: 30,
  TREE_CLEARANCE: 15,
  tileBlock: () => ({
    nx: 1,
    ny: 1,
    bounds: { x0: -3000, x1: 3000, z0: -3000, z1: 3000 },
  }),
  document: { createElement: () => new Element() },
  window: { devicePixelRatio: 1 },
  ResizeObserver: class {
    observe() {}
    disconnect() {}
  },
  requestAnimationFrame: () => 1,
  cancelAnimationFrame: () => {},
  PRESETS: { overview: { position: [-90, 400, -760], target: [10, 0, 10] } },
  SUN: [700, 900, 120],
  FLY_MS: 1200,
};
const setup = new Function(...Object.keys(dependencies), code)(
  ...Object.values(dependencies),
);
setup(
  {
    selected: 'plaza',
    category: 'all',
    labels: true,
    routeLayers: { shared: true, walking: true },
    panMode: false,
    onSelect() {},
    onPreset() {},
    onFailure() {
      failed++;
    },
  },
  {},
);
assert.equal(failed, 0, 'Scene setup threw before its first frame');
assert(
  rendered >= 1,
  'Must render synchronously; do not wait for requestAnimationFrame',
);
assert.equal(ready, true);
assert.equal(
  surface.children.length,
  2,
  'Canvas and markers must be mounted in their dedicated surface',
);
cleanup();
console.log(
  'PASS: actual scene setup, finite camera, visible landmarks, immediate first frame, separate canvas mount and cleanup.',
);
