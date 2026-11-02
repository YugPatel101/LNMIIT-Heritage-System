import * as THREE from 'three';
// Project each planar polygon onto its dominant plane, then triangulate concave outlines.
export function triangulate(points) {
  const a = new THREE.Vector3(...points[0]),
    normal = new THREE.Vector3();
  for (let i = 1; i < points.length - 1; i++) {
    normal.crossVectors(
      new THREE.Vector3(...points[i]).sub(a),
      new THREE.Vector3(...points[i + 1]).sub(a),
    );
    if (normal.lengthSq() > 1e-9) break;
  }
  const n = [Math.abs(normal.x), Math.abs(normal.y), Math.abs(normal.z)],
    drop = n.indexOf(Math.max(...n));
  const axes = [0, 1, 2].filter((x) => x !== drop);
  return {
    indices: THREE.ShapeUtils.triangulateShape(
      points.map((p) => new THREE.Vector2(p[axes[0]], p[axes[1]])),
      [],
    ).flat(),
    axes,
  };
}
