"""
Echelon /demo — build the flat 2D map dataset.

Reads a world TopoJSON (Natural Earth via world-atlas, `objects.countries`)
and writes a small GeoJSON containing only what the /demo map needs:

  - land      one feature per country, kept only where it touches the map extent
  - border    shared country borders (drawn once)
  - coast     coastlines (drawn once)

Everything stays in real lon/lat. Projection to flat X/Y happens at runtime
in lib/map/projection.ts, using the parameters written into the "echelon"
block of the output, so this file is the single source of truth for the
projection and the visible extent.

Usage (from this folder):
    python convert.py                         # world-110m.json -> ../../lib/map/data/france-mediterranean.geo.json
    python convert.py countries-50m.json      # same, with higher-resolution input

To get more detail when zooming in, download `countries-50m.json` from the
`world-atlas` package (Natural Earth 50m) and pass it as the first argument;
nothing else needs to change.
"""
import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'world-110m.json')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
    HERE, '..', '..', 'lib', 'map', 'data', 'france-mediterranean.geo.json')

# ---------------------------------------------------------------------------
# Map definition (single source of truth — also read by the frontend)
# ---------------------------------------------------------------------------

# Lambert Conformal Conic, tuned for France + the western Mediterranean.
PROJECTION = {
    'type': 'lambertConformalConic',
    'centerLon': 3.0,
    'originLat': 42.0,
    'parallels': [37.0, 47.0],
}
EARTH_RADIUS_KM = 6371.0088

# Projected units are kilometres from (centerLon, originLat); +y points south
# (screen space). The user can never pan or zoom outside this rectangle, so it
# also defines exactly how much geography has to be in the dataset.
EXTENT_KM = {'x0': -1800, 'x1': 2200, 'y0': -1400, 'y1': 1500}

# What the first screen shows: France in full, the Mediterranean, and a strip of
# North Africa. The frontend fits this box into the viewport.
DEFAULT_VIEW_KM = {'x0': -900, 'x1': 700, 'y0': -1120, 'y1': 900}

MAIN = 'France'
EXCLUDE = {'Antarctica'}
COORD_DECIMALS = 2
SELECT_MARGIN_KM = 40  # covers the tiny bow of a curved edge vs. its straight chord

# ---------------------------------------------------------------------------
# TopoJSON decoding
# ---------------------------------------------------------------------------

with open(SRC) as f:
    topo = json.load(f)

scale = topo['transform']['scale']
translate = topo['transform']['translate']


def decode_arc(arc):
    """Decode one quantized, delta-encoded arc into absolute [lon, lat] points."""
    x = 0
    y = 0
    points = []
    for dx, dy in arc:
        x += dx
        y += dy
        p = [
            round(x * scale[0] + translate[0], COORD_DECIMALS),
            round(y * scale[1] + translate[1], COORD_DECIMALS),
        ]
        if not points or points[-1] != p:
            points.append(p)
    return points


decoded_arcs = [decode_arc(a) for a in topo['arcs']]


def get_arc(index):
    """Resolve an arc reference (negative = reversed)."""
    if index >= 0:
        return decoded_arcs[index][:]
    return list(reversed(decoded_arcs[~index]))


def ring_from_arcs(arc_indices):
    """Stitch arcs into one closed ring of lon/lat coordinates."""
    coords = []
    for i, idx in enumerate(arc_indices):
        pts = get_arc(idx)
        coords.extend(pts if i == 0 else pts[1:])
    return coords


def polygons_of(geom):
    if geom['type'] == 'Polygon':
        return [geom['arcs']]
    if geom['type'] == 'MultiPolygon':
        return geom['arcs']
    raise ValueError('Unsupported geometry type: ' + geom['type'])


# ---------------------------------------------------------------------------
# Projection (same maths as lib/map/projection.ts) — used only to decide which
# polygons touch the visible extent.
# ---------------------------------------------------------------------------

D2R = math.pi / 180


def make_projector():
    f1, f2 = (p * D2R for p in PROJECTION['parallels'])
    f0 = PROJECTION['originLat'] * D2R
    lon0 = PROJECTION['centerLon']
    n = math.log(math.cos(f1) / math.cos(f2)) / math.log(
        math.tan(math.pi / 4 + f2 / 2) / math.tan(math.pi / 4 + f1 / 2))
    F = math.cos(f1) * math.tan(math.pi / 4 + f1 / 2) ** n / n

    def rho(phi):
        return F / math.tan(math.pi / 4 + phi / 2) ** n

    rho0 = rho(f0)

    def project(lon, lat):
        r = rho(lat * D2R)
        t = n * (lon - lon0) * D2R
        return (EARTH_RADIUS_KM * r * math.sin(t),
                -EARTH_RADIUS_KM * (rho0 - r * math.cos(t)))

    return project


project = make_projector()

SX0 = EXTENT_KM['x0'] - SELECT_MARGIN_KM
SX1 = EXTENT_KM['x1'] + SELECT_MARGIN_KM
SY0 = EXTENT_KM['y0'] - SELECT_MARGIN_KM
SY1 = EXTENT_KM['y1'] + SELECT_MARGIN_KM


def segment_hits_rect(a, b):
    """Liang–Barsky segment/rectangle test."""
    x0, y0 = a
    x1, y1 = b
    dx, dy = x1 - x0, y1 - y0
    t0, t1 = 0.0, 1.0
    for p, q in ((-dx, x0 - SX0), (dx, SX1 - x0), (-dy, y0 - SY0), (dy, SY1 - y0)):
        if p == 0:
            if q < 0:
                return False
        else:
            r = q / p
            if p < 0:
                if r > t1:
                    return False
                t0 = max(t0, r)
            else:
                if r < t0:
                    return False
                t1 = min(t1, r)
    return True


def point_in_ring(pt, ring):
    x, y = pt
    inside = False
    for i in range(len(ring)):
        x1, y1 = ring[i]
        x2, y2 = ring[(i + 1) % len(ring)]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            inside = not inside
    return inside


def ring_touches_extent(lonlat_ring):
    if min(p[1] for p in lonlat_ring) < -60:  # polar rings don't project sensibly
        return False
    pp = [project(*p) for p in lonlat_ring]
    if any(SX0 <= x <= SX1 and SY0 <= y <= SY1 for x, y in pp):
        return True
    if any(segment_hits_rect(pp[i], pp[i + 1]) for i in range(len(pp) - 1)):
        return True
    # extent could sit entirely inside a very large polygon
    return point_in_ring(((SX0 + SX1) / 2, (SY0 + SY1) / 2), pp)


# ---------------------------------------------------------------------------
# Build features
# ---------------------------------------------------------------------------

geometries = topo['objects']['countries']['geometries']

# How many country rings use each arc? 1 = coastline, 2+ = shared border.
arc_use = {}
for geom in geometries:
    for poly in polygons_of(geom):
        for ring in poly:
            for idx in ring:
                key = idx if idx >= 0 else ~idx
                arc_use[key] = arc_use.get(key, 0) + 1

land_features = []
border_arcs = set()
coast_arcs = set()

for geom in geometries:
    name = geom.get('properties', {}).get('name')
    if name in EXCLUDE:
        continue

    kept = []
    for poly in polygons_of(geom):
        exterior = ring_from_arcs(poly[0])
        if not ring_touches_extent(exterior):
            continue
        kept.append([ring_from_arcs(r) for r in poly])
        for ring in poly:
            for idx in ring:
                key = idx if idx >= 0 else ~idx
                (coast_arcs if arc_use[key] == 1 else border_arcs).add(key)

    if not kept:
        continue

    geometry = (
        {'type': 'Polygon', 'coordinates': kept[0]}
        if len(kept) == 1
        else {'type': 'MultiPolygon', 'coordinates': kept}
    )
    land_features.append({
        'type': 'Feature',
        'properties': {
            'kind': 'land',
            'name': name,
            'role': 'main' if name == MAIN else 'context',
        },
        'geometry': geometry,
    })

land_features.sort(key=lambda f: (f['properties']['role'] != 'main', f['properties']['name']))


def lines_feature(kind, arc_keys):
    return {
        'type': 'Feature',
        'properties': {'kind': kind},
        'geometry': {
            'type': 'MultiLineString',
            'coordinates': [decoded_arcs[k] for k in sorted(arc_keys)],
        },
    }


fc = {
    'type': 'FeatureCollection',
    'echelon': {
        'source': os.path.basename(SRC),
        'projection': PROJECTION,
        'extentKm': EXTENT_KM,
        'defaultViewKm': DEFAULT_VIEW_KM,
    },
    'features': land_features + [
        lines_feature('border', border_arcs),
        lines_feature('coast', coast_arcs),
    ],
}

os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
with open(OUT, 'w') as f:
    json.dump(fc, f, separators=(',', ':'))

print('Countries kept :', len(land_features), '->', ', '.join(f['properties']['name'] for f in land_features))
print('Border arcs    :', len(border_arcs))
print('Coast arcs     :', len(coast_arcs))
print('Wrote          :', os.path.relpath(OUT, HERE))
print('Size (KB)      :', round(os.path.getsize(OUT) / 1024, 1))
