// Turns traced roofs into world-space geometry. One unit is one metre: +x east, +z south.
import { ShapeUtils, Vector2 } from 'three';
import {
  metresPerPixel as MPP,
  origin,
  mosaic,
  parts as tracedParts,
  plazaArc,
  terrain,
} from './campus-real.mjs';

export const STYLES = {
  hostel: { floor: 3.4, bay: 3.6, parapet: '#b0604c' },
  academic: { floor: 3.8, bay: 4.2, parapet: '#d8cfc0' },
  bh4: { floor: 3.4, bay: 3.4, parapet: '#c3bdb0' },
  bungalow: { floor: 3.2, bay: 4.0, parapet: '#c79f86' },
  hangar: { floor: 3.5, bay: 5.0, parapet: '#d8d7d0' },
  construction: { floor: 3.8, bay: 5.0, parapet: '#8e8b84' },
  arcade: { floor: 10, bay: 6.0, parapet: '#d8cfc0' },
  stage: { floor: 1.2, bay: 3.0, parapet: '#efe4cd' },
};
export const WALL_STYLES = Object.keys(STYLES);

// Satellite imagery is slightly oblique: a roof appears north of its true base.
// Each metre of height moves the base this many metres relative to the roof image.
const LEAN = [-0.06, 0.3];
const ARCADE_SOFFIT = 6.5;

export const pxToWorld = (px, py) => [
  (px - origin.px) * MPP,
  (py - origin.py) * MPP,
];

function arcRing({ cx, cy, r0, r1, a0, a1 }, n = 44) {
  const at = (r, a) => [
    cx + r * Math.cos((a * Math.PI) / 180),
    cy + r * Math.sin((a * Math.PI) / 180),
  ];
  const ring = [];
  for (let i = 0; i <= n; i++) ring.push(at(r1, a0 + ((a1 - a0) * i) / n));
  for (let i = 0; i <= n; i++) ring.push(at(r0, a1 - ((a1 - a0) * i) / n));
  return ring;
}

export function buildingParts() {
  const source = [
    ...tracedParts,
    ['plaza', 'Central plaza colonnade', 'arcade', 1, arcRing(plazaArc), []],
  ];
  return source.map(([landmark, name, style, floors, outer, holes], index) => {
    const height = floors * STYLES[style].floor;
    const sx = (height * LEAN[0]) / MPP,
      sy = (height * LEAN[1]) / MPP;
    const place = (ring) => ring.map(([x, y]) => pxToWorld(x + sx, y + sy));
    return {
      index,
      landmark,
      name,
      style,
      floors,
      height,
      outer: place(outer),
      holes: holes.map(place),
      roofOuter: outer,
      roofHoles: holes,
      shift: [sx, sy],
    };
  });
}

export const ROOF_MARGIN = 2;

// Shelf-packs each part's roof rectangle into one atlas so roofs keep real imagery.
export function packRoofAtlas(all, size = 2048, scale = 1) {
  // Wide enough for the copied margin that keeps filtering inside real imagery.
  const pad = ROOF_MARGIN * 2 + 1;
  const boxes = all.map((p) => {
    const xs = p.roofOuter.map((v) => v[0]),
      ys = p.roofOuter.map((v) => v[1]);
    const x = Math.floor(Math.min(...xs)),
      y = Math.floor(Math.min(...ys));
    return {
      index: p.index,
      x,
      y,
      w: Math.ceil(Math.max(...xs)) - x + 1,
      h: Math.ceil(Math.max(...ys)) - y + 1,
    };
  });
  const order = [...boxes].sort((a, b) => b.h - a.h);
  let cx = pad,
    cy = pad,
    shelf = 0;
  for (const b of order) {
    const w = b.w * scale,
      h = b.h * scale;
    if (cx + w + pad > size) {
      cx = pad;
      cy += shelf + pad;
      shelf = 0;
    }
    b.ax = cx;
    b.ay = cy;
    cx += w + pad;
    shelf = Math.max(shelf, h);
  }
  const used = cy + shelf + pad;
  if (used > size) throw new Error(`Roof atlas overflow: ${used} > ${size}`);
  return { size, scale, boxes };
}

class Batch {
  constructor() {
    this.position = [];
    this.normal = [];
    this.uv = [];
    this.color = [];
    this.ranges = [];
  }
  get vertices() {
    return this.position.length / 3;
  }
  begin(part) {
    this.current = { part, start: this.vertices, end: this.vertices };
    this.ranges.push(this.current);
  }
  end() {
    this.current.end = this.vertices;
  }
  vertex(p, n, uv, c) {
    this.position.push(p[0], p[1], p[2]);
    this.normal.push(n[0], n[1], n[2]);
    this.uv.push(uv[0], uv[1]);
    this.color.push(c[0], c[1], c[2]);
  }
}

const signedArea = (ring) => {
  let a = 0;
  ring.forEach((p, i) => {
    const q = ring[(i + 1) % ring.length];
    a += p[0] * q[1] - q[0] * p[1];
  });
  return a / 2;
};

function wallRing(batch, ring, wantPositive, y0, y1, uScale, vScale, tint, ao) {
  const pts =
    signedArea(ring) > 0 === wantPositive ? ring : [...ring].reverse();
  let run = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i],
      b = pts[(i + 1) % pts.length];
    const dx = b[0] - a[0],
      dz = b[1] - a[1],
      len = Math.hypot(dx, dz);
    if (len < 1e-3) continue;
    const n = [-dz / len, 0, dx / len];
    const u0 = run * uScale,
      u1 = (run + len) * uScale;
    const low = [tint[0] * ao, tint[1] * ao, tint[2] * ao];
    const A = [a[0], y0, a[1]],
      B = [b[0], y0, b[1]],
      C = [b[0], y1, b[1]],
      D = [a[0], y1, a[1]];
    const v0 = y0 * vScale,
      v1 = y1 * vScale;
    batch.vertex(A, n, [u0, v0], low);
    batch.vertex(B, n, [u1, v0], low);
    batch.vertex(C, n, [u1, v1], tint);
    batch.vertex(A, n, [u0, v0], low);
    batch.vertex(C, n, [u1, v1], tint);
    batch.vertex(D, n, [u0, v1], tint);
    run += len;
  }
}

function box(batch, x, z, w, d, angle, y0, y1, tint) {
  const c = Math.cos(angle),
    s = Math.sin(angle);
  const corner = (u, v) => [x + u * c - v * s, z + u * s + v * c];
  const ring = [
    corner(-w / 2, -d / 2),
    corner(w / 2, -d / 2),
    corner(w / 2, d / 2),
    corner(-w / 2, d / 2),
  ];
  wallRing(batch, ring, false, y0, y1, 1 / 24, 1 / 40, tint, 0.7);
}

const hexColor = (hex) => [
  parseInt(hex.slice(1, 3), 16) / 255,
  parseInt(hex.slice(3, 5), 16) / 255,
  parseInt(hex.slice(5, 7), 16) / 255,
];
// sRGB to linear so vertex colours match the colour-managed textures.
const toLinear = (c) => c.map((v) => Math.pow(v, 2.2));

export function buildCampusGeometry(atlas) {
  const all = buildingParts();
  const walls = Object.fromEntries(WALL_STYLES.map((s) => [s, new Batch()]));
  const roofs = new Batch(),
    parapets = new Batch();
  const boxes = new Map(atlas.boxes.map((b) => [b.index, b]));
  const up = [0, 1, 0];
  for (const part of all) {
    const style = STYLES[part.style];
    const wall = walls[part.style];
    // A gentle per-part tint stops neighbouring blocks looking stamped from one mould.
    const seed = Math.sin(part.index * 12.9898) * 43758.5453;
    const shade = 0.93 + (seed - Math.floor(seed)) * 0.14;
    const tint = [shade, shade, shade];
    const uScale = 1 / (8 * style.bay),
      vScale = 1 / (4 * style.floor);
    const arcade = part.style === 'arcade';
    wall.begin(part.index);
    wallRing(
      wall,
      part.outer,
      false,
      arcade ? ARCADE_SOFFIT : 0,
      part.height,
      uScale,
      arcade ? 1 / part.height : vScale,
      tint,
      arcade ? 0.9 : 0.68,
    );
    for (const hole of part.holes)
      wallRing(wall, hole, true, 0, part.height, uScale, vScale, tint, 0.55);
    if (arcade) addArcadeColumns(wall, part);
    wall.end();
    // Roof, textured by the exact satellite pixels of this building.
    const box = boxes.get(part.index);
    const contour = part.outer.map((v) => new Vector2(v[0], v[1]));
    const holes = part.holes.map((h) => h.map((v) => new Vector2(v[0], v[1])));
    const triangles = ShapeUtils.triangulateShape(contour, holes);
    const worldRing = [part.outer, ...part.holes].flat();
    const pixelRing = [part.roofOuter, ...part.roofHoles].flat();
    roofs.begin(part.index);
    for (const tri of triangles) {
      const ordered =
        signedArea(tri.map((i) => worldRing[i])) < 0
          ? tri
          : [tri[0], tri[2], tri[1]];
      for (const i of ordered) {
        const [px, py] = pixelRing[i];
        const au = (box.ax + (px - box.x) * atlas.scale) / atlas.size;
        const av = 1 - (box.ay + (py - box.y) * atlas.scale) / atlas.size;
        roofs.vertex(
          [worldRing[i][0], part.height, worldRing[i][1]],
          up,
          [au, av],
          [1, 1, 1],
        );
      }
    }
    roofs.end();
    // Parapets belong on buildings; a stage or retaining wall has an open top.
    const edge = toLinear(hexColor(style.parapet));
    parapets.begin(part.index);
    if (part.style !== 'stage')
      for (const ring of [part.outer, ...part.holes])
        wallRing(
          parapets,
          ring,
          false,
          part.height,
          part.height + 0.9,
          1,
          1,
          edge,
          0.9,
        );
    parapets.end();
  }
  return { parts: all, walls, roofs, parapets };
}

function addArcadeColumns(batch, part) {
  const { cx, cy, r0, r1, a0, a1 } = plazaArc;
  const [ox, oz] = pxToWorld(cx + part.shift[0], cy + part.shift[1]);
  const inner = r0 * MPP,
    outer = r1 * MPP;
  const stone = [0.82, 0.82, 0.82];
  for (let a = a0 + 1.5; a < a1; a += 3.1) {
    const t = (a * Math.PI) / 180;
    const x = ox + Math.cos(t) * (inner + 0.6),
      z = oz + Math.sin(t) * (inner + 0.6);
    box(batch, x, z, 1.4, 1.0, t, 0, ARCADE_SOFFIT, stone);
  }
  // Deep recessed back wall seen between the columns.
  const shadow = [0.16, 0.16, 0.16];
  const back = [];
  for (let i = 0; i <= 44; i++) {
    const t = ((a0 + ((a1 - a0) * i) / 44) * Math.PI) / 180;
    back.push([ox + Math.cos(t) * outer, oz + Math.sin(t) * outer]);
  }
  for (let i = 0; i < back.length - 1; i++) {
    const a = back[i],
      b = back[i + 1];
    const dx = b[0] - a[0],
      dz = b[1] - a[1],
      len = Math.hypot(dx, dz);
    const n = [-dz / len, 0, dx / len];
    const A = [a[0], 0, a[1]],
      B = [b[0], 0, b[1]],
      C = [b[0], ARCADE_SOFFIT, b[1]],
      D = [a[0], ARCADE_SOFFIT, a[1]];
    const uv = [0.01, 0.01];
    batch.vertex(A, n, uv, shadow);
    batch.vertex(B, n, uv, shadow);
    batch.vertex(C, n, uv, shadow);
    batch.vertex(A, n, uv, shadow);
    batch.vertex(C, n, uv, shadow);
    batch.vertex(D, n, uv, shadow);
  }
}

// The campus is treated as level; real hills fade in beyond it.
const smoothstep = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export function heightAt(x, z) {
  const { half, size, grid } = terrain;
  const u = ((x + half) / (2 * half)) * (size - 1),
    v = ((z + half) / (2 * half)) * (size - 1);
  const i = Math.max(0, Math.min(size - 2, Math.floor(u))),
    j = Math.max(0, Math.min(size - 2, Math.floor(v)));
  const fx = Math.max(0, Math.min(1, u - i)),
    fy = Math.max(0, Math.min(1, v - j));
  const h =
    grid[j][i] * (1 - fx) * (1 - fy) +
    grid[j][i + 1] * fx * (1 - fy) +
    grid[j + 1][i] * (1 - fx) * fy +
    grid[j + 1][i + 1] * fx * fy;
  return h * smoothstep(900, 2600, Math.hypot(x, z));
}

// World rectangle of the z19 mosaic.
export function coreBounds() {
  const [x0, z0] = pxToWorld(0, 0);
  const [x1, z1] = pxToWorld(mosaic.w, mosaic.h);
  return { x0, z0, x1, z1 };
}
