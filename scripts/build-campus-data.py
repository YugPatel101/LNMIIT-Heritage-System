"""Generate src/data/campus-real.mjs from open map data and the traced roofs.

Requires numpy and pillow. Downloads are cached in the directory given as argv[1]:
  osm.xml        OpenStreetMap API extract (roads).
  overture.json  Overture Maps buildings: id, src, g (GeoJSON) (surroundings).
  sat19.jpg      The z19 mosaic described by traced.MOSAIC (tree detection only).
Elevation comes from the public Terrarium tiles (Mapzen / SRTM).
Satellite pixels are read to locate trees and are never written to the output.
"""
import io
import json
import math
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).parent / 'campus-data'))
import traced  # noqa: E402

CACHE = Path(sys.argv[1])
ROOT = Path(__file__).parent.parent
OUT = ROOT / 'src/data/campus-real.mjs'
M = traced.MOSAIC
LAT0 = 26.9335
MPP = math.cos(math.radians(LAT0)) * 40075016.686 / 2 ** (M['z'] + 8)
OX, OY = 1950, 1650
INTEREST = (560, 330, 3280, 3320)
CAMPUS = [
    (1000, 420), (3180, 420), (3180, 1100), (2400, 1900), (2200, 3200),
    (700, 3200), (700, 2000), (1000, 1500),
]
# OpenStreetMap footways with no matching path in the imagery: 716051409 is a two-node
# straight line through unbroken canopy, and 716051411 cuts across the plaza paving.
EXCLUDED_WAYS = {'716051409', '716051411'}
Image.MAX_IMAGE_PIXELS = None


def lon_px(lon):
    return ((lon + 180) / 360 * 2 ** M['z'] - M['x0']) * 256


def lat_px(lat):
    r = math.radians(lat)
    y = (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * 2 ** M['z']
    return (y - M['y0']) * 256


def world(px, py):
    return round((px - OX) * MPP, 2), round((py - OY) * MPP, 2)


def inside(x, y, poly):
    c = False
    j = len(poly) - 1
    for i, (ax, ay) in enumerate(poly):
        bx, by = poly[j]
        if (ay > y) != (by > y) and x < (bx - ax) * (y - ay) / (by - ay) + ax:
            c = not c
        j = i
    return c


def building_mask(shape, grow):
    """Boolean mask of traced roofs, including the wall lean below each roof."""
    im = Image.new('L', (shape[1], shape[0]), 0)
    d = ImageDraw.Draw(im)
    for _, _, _, floors, outer, holes in traced.PARTS:
        lean = floors * 3.5 * 0.33 / MPP
        ring = [(x, y) for x, y in outer]
        for t in (0, 0.5, 1):
            d.polygon([(x, y + lean * t) for x, y in ring], fill=255)
        if grow:
            d.line(ring + ring[:1], fill=255, width=grow)
    P = traced.PLAZA
    d.polygon(traced.sector(P['cx'], P['cy'], P['r0'], P['r1'], P['a0'], P['a1']), fill=255)
    return np.asarray(im) > 0


def detect_trees():
    """Place trees on textured green canopy; smooth green fields stay flat."""
    a = np.asarray(Image.open(CACHE / 'sat19.jpg').convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    lum = (r + g + b) / 3
    green = (g > r * 1.03) & (g > b * 1.08) & (lum < 125)
    blocked = building_mask(green.shape, 18)
    cell = 24  # About 6.4 m.
    h = green.shape[0] // cell
    w = green.shape[1] // cell
    rng = np.random.default_rng(226)
    P = traced.PLAZA
    trees = []
    for j in range(1, h - 1):
        for i in range(1, w - 1):
            y0, y1 = j * cell, (j + 1) * cell
            x0, x1 = i * cell, (i + 1) * cell
            if blocked[y0:y1, x0:x1].any():
                continue
            frac = green[y0:y1, x0:x1].mean()
            # The plaza is open paving; only solid canopy there is a real tree.
            in_plaza = math.hypot(x0 + cell / 2 - P['cx'], y0 + cell / 2 - P['cy']) < P['r0']
            if frac < (0.92 if in_plaza else 0.66):
                continue
            # Canopies are lumpy; crops and lawns are not.
            if lum[y0:y1, x0:x1].std() < 11:
                continue
            px = x0 + rng.uniform(0.2, 0.8) * cell
            py = y0 + rng.uniform(0.2, 0.8) * cell
            colour = a[y0:y1, x0:x1][green[y0:y1, x0:x1]].mean(axis=0)
            wide = green[max(0, y0 - cell):y1 + cell, max(0, x0 - cell):x1 + cell].mean()
            radius = 2.9 + 2.3 * max(0.0, wide - 0.6) / 0.4 + rng.uniform(0, 0.9)
            x, z = world(px, py)
            trees.append((x, z, round(radius, 1), '%02x%02x%02x' % tuple(int(c) for c in colour)))
    return trees


def load_routes():
    root = ET.parse(CACHE / 'osm.xml').getroot()
    nodes = {n.get('id'): (float(n.get('lat')), float(n.get('lon'))) for n in root.findall('node')}
    shared, walking = [], []
    for way in root.findall('way'):
        tags = {t.get('k'): t.get('v') for t in way.findall('tag')}
        kind = tags.get('highway')
        if kind is None or tags.get('area') == 'yes' or way.get('id') in EXCLUDED_WAYS:
            continue
        target = walking if kind in ('footway', 'path', 'steps', 'pedestrian') else shared
        line = []
        for nd in way.findall('nd'):
            if nd.get('ref') not in nodes:
                continue
            la, lo = nodes[nd.get('ref')]
            px, py = lon_px(lo), lat_px(la)
            if INTEREST[0] < px < INTEREST[2] and INTEREST[1] < py < INTEREST[3]:
                line.append(world(px, py))
            else:
                if len(line) > 1:
                    target.append(line)
                line = []
        if len(line) > 1:
            target.append(line)
    return shared, walking


def load_context():
    out = []
    for b in json.loads((CACHE / 'overture.json').read_text()):
        if b['src'] == 'OpenStreetMap':
            continue
        g = b['g'] if isinstance(b['g'], dict) else json.loads(b['g'])
        polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
        for poly in polys:
            ring = [(lon_px(lo), lat_px(la)) for lo, la in poly[0]][:-1]
            cx = sum(p[0] for p in ring) / len(ring)
            cy = sum(p[1] for p in ring) / len(ring)
            if inside(cx, cy, CAMPUS) or len(ring) > 16:
                continue
            xs = [p[0] for p in ring]
            ys = [p[1] for p in ring]
            area = (max(xs) - min(xs)) * (max(ys) - min(ys)) * MPP * MPP
            if area < 25:
                continue
            out.append({
                'floors': 2 if area > 180 else 1,
                'ring': [world(*p) for p in ring],
            })
    return out


def load_terrain(half=9000, size=81, z=13):
    n = 2 ** z
    lon0 = (M['x0'] + OX / 256) / 2 ** M['z'] * 360 - 180
    y = (M['y0'] + OY / 256) / 2 ** M['z']
    lat0 = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y))))
    cx = (lon0 + 180) / 360 * n
    r = math.radians(lat0)
    cy = (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * n
    tile_x, tile_y = int(cx), int(cy)
    span = 2
    mosaic = Image.new('RGB', (256 * (2 * span + 1), 256 * (2 * span + 1)))
    for j in range(-span, span + 1):
        for i in range(-span, span + 1):
            url = f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{tile_x + i}/{tile_y + j}.png'
            data = urllib.request.urlopen(url, timeout=60).read()
            mosaic.paste(Image.open(io.BytesIO(data)).convert('RGB'), ((i + span) * 256, (j + span) * 256))
    a = np.asarray(mosaic).astype(np.float32)
    heights = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
    mpp = MPP * 2 ** (M['z'] - z)
    px0 = (cx - tile_x + span) * 256
    py0 = (cy - tile_y + span) * 256
    base = float(heights[int(py0), int(px0)])
    grid = []
    for j in range(size):
        row = []
        for i in range(size):
            wx = -half + 2 * half * i / (size - 1)
            wz = -half + 2 * half * j / (size - 1)
            sx = np.clip(px0 + wx / mpp, 0, heights.shape[1] - 1)
            sy = np.clip(py0 + wz / mpp, 0, heights.shape[0] - 1)
            row.append(int(round(float(heights[int(sy), int(sx)]) - base)))
        grid.append(row)
    return {'half': half, 'size': size, 'grid': grid}, lat0, lon0


def num(v):
    s = f'{v:.2f}'.rstrip('0').rstrip('.')
    return s if s not in ('-0', '') else '0'


def ring_js(ring):
    return '[' + ', '.join(f'[{num(a)}, {num(b)}]' for a, b in ring) + ']'


def main():
    trees = detect_trees()
    shared, walking = load_routes()
    context = load_context()
    terrain, lat0, lon0 = load_terrain()
    P = traced.PLAZA
    L = ['// Generated by scripts/build-campus-data.py. Do not edit by hand.']
    L.append('// Sources: traced satellite roofs; OpenStreetMap (ODbL); Overture Maps; Terrarium elevation.')
    L.append(f'export const metresPerPixel = {MPP:.6f};')
    L.append(f'export const origin = {{ px: {OX}, py: {OY}, lat: {lat0:.6f}, lon: {lon0:.6f} }};')
    L.append(f"export const mosaic = {json.dumps(M).replace(chr(34), chr(39))};")
    L.append(f"export const plazaArc = {json.dumps(P).replace(chr(34), chr(39))};")
    L.append('// Roof outlines in mosaic pixels: [landmark, name, style, floors, outer, holes].')
    L.append('export const parts = [')
    for lid, name, style, floors, outer, holes in traced.PARTS:
        L.append('  [')
        L.append(f'    {json.dumps(lid)},')
        L.append(f'    {json.dumps(name)},')
        L.append(f'    {json.dumps(style)},')
        L.append(f'    {floors},')
        L.append(f'    {ring_js(outer)},')
        L.append('    [' + ', '.join(ring_js(h) for h in holes) + '],')
        L.append('  ],')
    L.append('];')
    L.append('// Surrounding footprints in metres: [floors, ring].')
    L.append('export const context = [')
    for c in context:
        L.append(f"  [{c['floors']}, {ring_js(c['ring'])}],")
    L.append('];')
    L.append('// Trees located on satellite canopy, in metres: [x, z, radius, colour].')
    L.append('export const trees = [')
    for x, z, r, colour in trees:
        L.append(f"  [{num(x)}, {num(z)}, {num(r)}, '{colour}'],")
    L.append('];')
    L.append('export const osmRoutes = {')
    for key, lines in (('shared', shared), ('walking', walking)):
        L.append(f'  {key}: [')
        for line in lines:
            L.append(f'    {ring_js(line)},')
        L.append('  ],')
    L.append('};')
    L.append('// Elevation in metres relative to the campus, on a regular grid.')
    L.append(f"export const terrain = {{ half: {terrain['half']}, size: {terrain['size']}, grid: [")
    for row in terrain['grid']:
        L.append('  [' + ', '.join(str(v) for v in row) + '],')
    L.append(']};')
    OUT.write_text('\n'.join(L) + '\n')
    print(f'parts {len(traced.PARTS)} context {len(context)} trees {len(trees)} shared {len(shared)} walking {len(walking)} bytes {OUT.stat().st_size}')
    print('origin', lat0, lon0, 'terrain range', min(map(min, terrain['grid'])), max(map(max, terrain['grid'])))


main()
