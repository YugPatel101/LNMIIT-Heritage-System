// Campus places, in metres around the campus centre: +x east, +z south.
// Footprints are traced from satellite imagery; heights are estimated from floor counts.
import { buildingParts, pxToWorld } from './campus-geometry.mjs';
import { osmRoutes, trees } from './campus-real.mjs';

export const palette = {
  academic: '#b8a0c9',
  boys: '#91b4d4',
  girls: '#b4cc8e',
  faculty: '#d29a98',
  sports: '#ddd8c7',
  mess: '#b17f57',
  construction: '#dfb761',
  outdoors: '#93aa77',
  facilities: '#a6b0b8',
};
export const categories = [
  ['all', 'All places'],
  ['academic', 'Academic'],
  ['boys', 'Boys hostels'],
  ['girls', 'Girls hostels'],
  ['faculty', 'Faculty'],
  ['mess', 'Mess & dining'],
  ['sports', 'Sports'],
  ['construction', 'AI centre'],
  ['facilities', 'Facilities'],
];

// Zoom at which the whole campus fits the simplified fallback view.
export const FALLBACK_ZOOM = 0.62;

const TRACED =
  'Footprint traced from satellite imagery · height estimated from floors';
const OPEN_SPACE = 'Located from satellite imagery';

// id, name, category, short label, description, options.
// options.pixel marks an open space by mosaic pixel; options.view sets the arrival camera.
const entries = [
  [
    'academic',
    'Academic Blocks',
    'academic',
    'Teaching & learning',
    'The academic complex around the east side of the central plaza and its wings to the south. The solar-roofed blocks are shown as they appear in satellite imagery.',
  ],
  [
    'plaza',
    'Central plaza',
    'outdoors',
    'The academic gathering space',
    'The radial plaza and its curved colonnade, seen in the campus drone film. The paving pattern is the real ground, from satellite imagery.',
    { pixel: [1951, 672], y: 10, ring: 44 },
  ],
  [
    'boys-west',
    'BH3',
    'boys',
    'Tallest building on campus',
    'The tall hostel tower beside Mess B, shown in LNMIIT’s official Boys Hostel 3 photograph.',
  ],
  [
    'boys-upper',
    'BH2',
    'boys',
    'Courtyard hostel',
    'An outer square of rooms around a rotated diamond of wings.',
  ],
  [
    'boys-lower',
    'BH1',
    'boys',
    'Courtyard hostel',
    'BH2’s neighbour to the west, with the same plan plus a southern wing.',
  ],
  [
    'bh4',
    'BH4',
    'boys',
    'Twin courtyard hostel',
    'Two rotated courtyard blocks joined by a link, in terracotta and grey as in the hostel photograph.',
  ],
  [
    'girls-west',
    'GH Extension',
    'girls',
    'Long white-roofed block',
    'The long block on the north-east edge of the campus. OpenStreetMap labels it BH-5; this name follows the project owner’s correction.',
  ],
  [
    'girls-courtyard',
    'GH',
    'girls',
    'Twin courtyard block',
    'The twin-courtyard girls’ hostel west of the Academic Blocks.',
  ],
  [
    'mess-west',
    'Mess B',
    'mess',
    'Beside BH3',
    'The mess beside BH3. Named Mess-B in OpenStreetMap.',
  ],
  [
    'mess-central',
    'Mess A',
    'mess',
    'Between the hostel groups',
    'The solar-roofed mess north of BH1, facing the Canteen Area. Named Mess-A in OpenStreetMap.',
  ],
  [
    'canteen',
    'Canteen Area',
    'mess',
    'In front of Mess A',
    'The paved court directly east of Mess A. OpenStreetMap places Amul Cafe, Food Barn and Bazingaa here.',
    {
      pixel: [1855, 1372],
      extent: 44,
      ring: 18,
      label: true,
      view: { theta: 0.3, phi: 0.82, distance: 120 },
    },
  ],
  [
    'faculty-b',
    'Faculty residences · B',
    'faculty',
    'West of BH1',
    'Four faculty houses west of BH1, labelled Type B in the project’s annotated satellite view. OpenStreetMap calls this group Faculty Residence.',
  ],
  [
    'faculty-d',
    'Faculty residences · D',
    'faculty',
    'West of the courts',
    'The rows of faculty houses west of the sports courts, labelled Type D in the project’s annotated satellite view.',
  ],
  [
    'faculty-upper',
    'Faculty residences · upper',
    'faculty',
    'Tall angled block',
    'The tall angled block north of BH4, marked as faculty housing in the project’s annotated satellite view. OpenStreetMap does not name it.',
  ],
  [
    'faculty-east',
    'Faculty residences · east',
    'faculty',
    'South-east of the courts',
    'Three small angled blocks. OpenStreetMap labels one of them Faculty Residence.',
  ],
  [
    'courts',
    'Sports courts',
    'sports',
    'Basketball, tennis and volleyball',
    'The blue basketball and tennis courts and the sand court beside them. The markings are the real surfaces, from satellite imagery.',
    { pixel: [1600, 2085] },
  ],
  [
    'football',
    'Football ground',
    'sports',
    'South-western playing field',
    'The large open field in the south-west of the campus.',
    { pixel: [720, 3175], extent: 150 },
  ],
  [
    'ai',
    'Centre for AI',
    'construction',
    'Under construction',
    'The long tower and circular wing on the western edge. Shown as an unfinished concrete frame because it is an active building site, and its final appearance will differ.',
  ],
  [
    'library',
    'Central Library',
    'academic',
    'South-west of the plaza',
    'Two solar-roofed blocks at the southern end of the colonnade. Named in OpenStreetMap.',
  ],
  [
    'mme',
    'MME block',
    'academic',
    'East of the Academic Blocks',
    'The grey-roofed hall and low courtyard block east of the Academic Blocks. Named MME in OpenStreetMap.',
  ],
  [
    'incubation',
    'Incubation block',
    'academic',
    'North-east corner',
    'The large brick block beside GH Extension. Named Incubation in OpenStreetMap.',
  ],
  [
    'sac',
    'Student Activity Centre',
    'facilities',
    'Beside the courts',
    'The white-roofed hall and frontage east of the sports courts. Named SAC in OpenStreetMap.',
  ],
  [
    'medical',
    'Medical unit',
    'facilities',
    'North of the SAC',
    'A small single-storey block north of the Student Activity Centre. Named in OpenStreetMap.',
  ],
  [
    'guest-house',
    'Guest House',
    'facilities',
    'West of Mess A',
    'Named in OpenStreetMap.',
  ],
  [
    'directors-house',
    'Director’s House',
    'facilities',
    'West of GH',
    'Named in OpenStreetMap.',
  ],
  [
    'temple',
    'Hanuman Temple',
    'facilities',
    'West of the medical unit',
    'A small shrine among the trees, at its OpenStreetMap position. The surrounding trees step aside while it is selected so that you can see it.',
    { ring: 11, view: { theta: 0.55, phi: 0.72, distance: 88 } },
  ],
  [
    'wtp',
    'Water treatment plant',
    'facilities',
    'East of BH2',
    'Named WTP in OpenStreetMap.',
  ],
  [
    'oat',
    'Open-air theatre',
    'outdoors',
    'Stage, lawn and curved wall',
    'The lawn named OAT in OpenStreetMap, held by a curved retaining wall. The stage stands on the paved pad at the focus of that curve, on the western side; its height and backdrop are representative.',
    {
      pixel: [2085, 1395],
      extent: 88,
      ring: 40,
      view: { theta: 1.45, phi: 0.95, distance: 170 },
    },
  ],
];

const allParts = buildingParts();

export const landmarks = entries.map(
  ([id, name, category, short, description, options = {}]) => {
    const own = allParts.filter(
      (p) => p.landmark === id && p.style !== 'arcade',
    );
    const { pixel, ring, view, label = false } = options;
    if (pixel) {
      const [x, z] = pxToWorld(...pixel);
      return {
        id,
        name,
        category,
        x,
        z,
        y: options.y ?? 2,
        extent: options.extent ?? 70,
        ring: ring ?? Math.min((options.extent ?? 70) / 2, 40),
        label,
        view,
        short,
        description,
        accuracy: OPEN_SPACE,
      };
    }
    const points = own.flatMap((p) => p.outer);
    const xs = points.map((p) => p[0]),
      zs = points.map((p) => p[1]);
    const [x0, x1] = [Math.min(...xs), Math.max(...xs)],
      [z0, z1] = [Math.min(...zs), Math.max(...zs)];
    return {
      id,
      name,
      category,
      x: (x0 + x1) / 2,
      z: (z0 + z1) / 2,
      y: Math.max(...own.map((p) => p.height)),
      extent: Math.max(x1 - x0, z1 - z0),
      ring,
      label,
      view,
      short,
      description,
      accuracy: TRACED,
    };
  },
);

// Small names shown beside a place once the camera is close enough to read them.
const [stageX, stageZ] = pxToWorld(2014, 1375);
export const annotations = [
  { text: 'Stage', parent: 'oat', x: stageX, y: 6, z: stageZ },
];

export const routes = osmRoutes;

export const vegetation = trees.map(([x, z, r, colour]) => ({
  x,
  z,
  r,
  colour,
  height: 1.8 + r * 0.7,
}));

const BUILDING_COLOUR = {
  hostel: '#a9604d',
  academic: '#b0715e',
  bh4: '#c0694a',
  bungalow: '#b98a72',
  hangar: '#d5d4cc',
  construction: '#96938b',
  arcade: '#a9604d',
  stage: '#d8c6a4',
};
const shade = (hex, f) =>
  '#' +
  hex
    .slice(1)
    .match(/../g)
    .map((v) =>
      Math.max(0, Math.min(255, Math.round(parseInt(v, 16) * f)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('');

// Flat faces for the simplified, non-WebGL view and for geometry checks.
export function createCampus({ trees: withTrees = true } = {}) {
  const faces = [];
  let serial = 0;
  const face = (points, color, id = null, route = null) =>
    faces.push({ key: serial++, points, color, id, route });
  face(
    [
      [-560, -0.5, -520],
      [560, -0.5, -520],
      [560, -0.5, 600],
      [-560, -0.5, 600],
    ],
    '#c5cfab',
  );
  for (const [kind, width, color] of [
    ['shared', 5, '#8b8d84'],
    ['walking', 2, '#d4c5a5'],
  ]) {
    for (const line of routes[kind]) {
      for (let i = 1; i < line.length; i++) {
        const [ax, az] = line[i - 1],
          [bx, bz] = line[i];
        const len = Math.hypot(bx - ax, bz - az);
        if (!len) continue;
        const ox = (-(bz - az) / len) * (width / 2),
          oz = ((bx - ax) / len) * (width / 2);
        face(
          [
            [ax + ox, 0.8, az + oz],
            [bx + ox, 0.8, bz + oz],
            [bx - ox, 0.8, bz - oz],
            [ax - ox, 0.8, az - oz],
          ],
          color,
          null,
          kind,
        );
      }
    }
  }
  for (const part of allParts) {
    const base = BUILDING_COLOUR[part.style];
    part.outer.forEach((a, i) => {
      const b = part.outer[(i + 1) % part.outer.length];
      face(
        [
          [a[0], 0, a[1]],
          [b[0], 0, b[1]],
          [b[0], part.height, b[1]],
          [a[0], part.height, a[1]],
        ],
        shade(base, 0.78 + (i % 3) * 0.08),
        part.landmark,
      );
    });
    face(
      part.outer.map(([x, z]) => [x, part.height, z]),
      shade(base, 1.18),
      part.landmark,
    );
  }
  for (const l of landmarks.filter((x) => x.accuracy === OPEN_SPACE)) {
    const r = Math.min(l.extent / 2, 40);
    face(
      Array.from({ length: 16 }, (_, i) => [
        l.x + r * Math.cos((i / 16) * Math.PI * 2),
        0.3,
        l.z + r * Math.sin((i / 16) * Math.PI * 2),
      ]),
      '#b8bd99',
      l.id,
    );
  }
  if (withTrees) {
    vegetation.forEach((t, i) => {
      if (i % 14) return;
      face(
        Array.from({ length: 7 }, (_, j) => [
          t.x + t.r * Math.cos((j / 7) * Math.PI * 2),
          0.4,
          t.z + t.r * Math.sin((j / 7) * Math.PI * 2),
        ]),
        '#7a9467',
      );
    });
  }
  return faces;
}
export function projectPoint([x, y, z], view) {
  const a = (view.angle * Math.PI) / 180,
    t = (view.tilt * Math.PI) / 180;
  const rx = x * Math.cos(a) - z * Math.sin(a),
    rz = x * Math.sin(a) + z * Math.cos(a);
  return [
    500 + (view.panX || 0) + rx * view.zoom,
    360 + (view.panY || 0) + (rz * Math.cos(t) - y * Math.sin(t)) * view.zoom,
    rz * Math.sin(t) + y * Math.cos(t),
  ];
}
export function projectFaces(faces, view) {
  return faces
    .map((f) => {
      const p = f.points.map((x) => projectPoint(x, view));
      return {
        ...f,
        screen: p.map((x) => x.slice(0, 2)),
        layer: Math.max(...f.points.map((p) => p[1])) <= 1.2 ? 0 : 1,
        depth: p.reduce((a, x) => a + x[2], 0) / p.length,
      };
    })
    .sort(
      (a, b) =>
        a.layer - b.layer ||
        (a.layer === 0 ? a.key - b.key : a.depth - b.depth) ||
        a.key - b.key,
    );
}
