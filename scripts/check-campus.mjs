import assert from 'node:assert/strict';
import {
  referencePins,
  referenceImage,
} from '../src/data/campus-reference.mjs';
import {
  annotations,
  createCampus,
  FALLBACK_ZOOM,
  landmarks,
  projectFaces,
  projectPoint,
  routes,
} from '../src/data/campus-model.mjs';
const faces = createCampus();
assert.equal(landmarks.filter((l) => l.category === 'girls').length, 2);
assert.equal(landmarks.filter((l) => l.category === 'mess').length, 3);
const named = (id) => landmarks.find((l) => l.id === id)?.name;
assert.equal(named('boys-west'), 'BH3');
assert.equal(named('girls-west'), 'GH Extension');
assert.equal(named('girls-courtyard'), 'GH');
assert.equal(named('academic'), 'Academic Blocks');
assert.equal(named('canteen'), 'Canteen Area');
assert.equal(named('academic-south'), undefined);
assert.equal(
  landmarks.filter((l) => /^academic block/i.test(l.name)).length,
  1,
);
assert.equal(new Set(landmarks.map((l) => l.name)).size, landmarks.length);
for (const l of landmarks) {
  const pin = referencePins[l.id];
  assert(pin, `Missing reference pin: ${l.id}`);
  assert(pin[0] > 0 && pin[0] < referenceImage.width);
  assert(pin[1] > 0 && pin[1] < referenceImage.height);
}
assert.equal(Object.keys(referencePins).length, landmarks.length);
assert(annotations.every((a) => landmarks.some((l) => l.id === a.parent)));
assert.equal(landmarks.filter((l) => l.category === 'boys').length, 4);
assert.equal(new Set(landmarks.map((l) => l.id)).size, landmarks.length);
for (const l of landmarks)
  assert(
    faces.some((f) => f.id === l.id),
    `Missing mesh: ${l.id}`,
  );
assert(landmarks.find((l) => l.id === 'ai').short === 'Under construction');
for (const route of ['shared', 'walking']) {
  assert(routes[route].length > 0);
  assert(faces.some((f) => f.route === route));
  assert(
    faces
      .filter((f) => f.route === route)
      .every((f) => f.points.every((p) => p[1] < 1.2)),
  );
}
for (const angle of [-180, -90, -24, 0, 90, 180])
  for (const tilt of [0, 35, 72]) {
    const view = { angle, tilt, zoom: FALLBACK_ZOOM, panX: 0, panY: 0 },
      projected = projectFaces(faces, view);
    assert(projected.every((f) => f.screen.flat().every(Number.isFinite)));
    const firstBuilding = projected.findIndex((f) => f.layer === 1);
    assert(projected.slice(firstBuilding).every((f) => f.layer === 1));
  }
const v = { angle: 0, tilt: 35, zoom: FALLBACK_ZOOM };
const p = projectPoint([3, 4, 5], v),
  q = projectPoint([3, 4, 5], { ...v, panX: 120, panY: -70 });
assert(Math.abs(q[0] - p[0] - 120) < 1e-8);
assert(Math.abs(q[1] - p[1] + 70) < 1e-8);
for (const l of landmarks) {
  const p = projectPoint([l.x, l.y + 9, l.z], v);
  assert(
    p[0] > 0 && p[0] < 1000 && p[1] > 0 && p[1] < 720,
    `Default view clips ${l.id}`,
  );
}
console.log(
  `PASS: ${landmarks.length} landmark meshes, confirmed hostel/mess counts, both route layers, 18 camera angles, panning and default marker visibility.`,
);

const { triangulate } = await import('../src/data/campus-triangulation.mjs');
const renderFaces = createCampus({ trees: false });
let triangles = 0;
for (const f of renderFaces) {
  const { indices } = triangulate(f.points);
  assert(indices.length >= 3, `Untriangulated face ${f.key}`);
  assert(
    indices.every((i) => Number.isInteger(i) && i >= 0 && i < f.points.length),
  );
  assert(f.points.flat().every(Number.isFinite));
  triangles += indices.length / 3;
}
console.log(
  `PASS: WebGL geometry contains ${renderFaces.length} valid faces and ${triangles} triangles, including concave construction slabs.`,
);
