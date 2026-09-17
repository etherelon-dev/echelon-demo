import type { LonLatBBox } from "./bbox";
import type { Polygon, Ring } from "./topojson";

/**
 * Crops the world land dataset's rings down to the active map's lon/lat
 * bounding box (see activeMapExtent.ts), using the Sutherland-Hodgman
 * rectangle-clipping algorithm. This is what turns "the whole world's
 * coastline" into "just the terrain-covered region's coastline" — the
 * land dataset's real geometry is unchanged data-wise, just trimmed to
 * the box, so this stays real-world Natural Earth geometry throughout
 * (never hand-drawn or invented).
 *
 * Sutherland-Hodgman clips a ring against a convex window (a rectangle,
 * here) one straight edge at a time. It is the standard, well-defined way
 * to do this and is correct for a single ring even where the true clipped
 * result is geometrically several disjoint pieces — which is exactly
 * what happens here: the land dataset's Afro-Eurasian landmass is one
 * continuous ring that, cropped down to Europe/Anatolia, would otherwise
 * need to become several separate coastline fragments (Iberia, the Urals
 * cut, the Levant/Sinai cut, ...). The algorithm still returns one valid,
 * non-self-intersecting ring: wherever the "true" answer would be
 * disjoint pieces, it connects them with a short segment that runs along
 * the clip boundary itself (the edge of the map) rather than cutting
 * across open water or land that shouldn't be there — so it never
 * produces the diagonal-triangle / stray-polygon artifacts a naive
 * point-drop filter would.
 */

type Point = [number, number];

function lerpAt(a: Point, b: Point, t: number): Point {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/** One Sutherland-Hodgman pass: clips `points` (a closed, cyclic ring) to
 * a single half-plane, defined by `inside` (which side of the boundary a
 * point is on) and `intersect` (where a boundary-crossing edge meets it). */
function clipToHalfPlane(
  points: Point[],
  inside: (p: Point) => boolean,
  intersect: (a: Point, b: Point) => Point
): Point[] {
  if (points.length === 0) return points;
  const out: Point[] = [];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const curr = points[i];
    const prev = points[(i - 1 + n) % n];
    const currIn = inside(curr);
    const prevIn = inside(prev);
    if (currIn) {
      if (!prevIn) out.push(intersect(prev, curr));
      out.push(curr);
    } else if (prevIn) {
      out.push(intersect(prev, curr));
    }
  }
  return out;
}

/** Clips a single ring (lon/lat degrees, implicitly closed — no duplicated
 * end point, matching this project's ring convention) to a lon/lat
 * rectangle. Returns an empty ring if nothing survives. */
export function clipRingToBBox(ring: Ring, bbox: LonLatBBox): Ring {
  let pts: Point[] = ring as Point[];

  pts = clipToHalfPlane(
    pts,
    (p) => p[0] >= bbox.lonMin,
    (a, b) => lerpAt(a, b, (bbox.lonMin - a[0]) / (b[0] - a[0]))
  );
  if (pts.length === 0) return [];

  pts = clipToHalfPlane(
    pts,
    (p) => p[0] <= bbox.lonMax,
    (a, b) => lerpAt(a, b, (bbox.lonMax - a[0]) / (b[0] - a[0]))
  );
  if (pts.length === 0) return [];

  pts = clipToHalfPlane(
    pts,
    (p) => p[1] >= bbox.latMin,
    (a, b) => lerpAt(a, b, (bbox.latMin - a[1]) / (b[1] - a[1]))
  );
  if (pts.length === 0) return [];

  pts = clipToHalfPlane(
    pts,
    (p) => p[1] <= bbox.latMax,
    (a, b) => lerpAt(a, b, (bbox.latMax - a[1]) / (b[1] - a[1]))
  );

  return pts as Ring;
}

/**
 * Clips every ring of a polygon (outer boundary + any holes) to a lon/lat
 * bounding box. Drops the polygon entirely if its outer ring doesn't
 * survive (the landmass doesn't intersect the active extent at all —
 * e.g. the Americas, Australia, Antarctica) and drops individual hole
 * rings that clip away to nothing (a lake far outside the active extent).
 * A degenerate ring of fewer than 3 points can't enclose an area, so
 * those are treated the same as "clipped away to nothing".
 */
export function clipPolygonToBBox(polygon: Polygon, bbox: LonLatBBox): Polygon | null {
  const [outer, ...holes] = polygon;
  const clippedOuter = clipRingToBBox(outer, bbox);
  if (clippedOuter.length < 3) return null;

  const clippedHoles = holes
    .map((hole) => clipRingToBBox(hole, bbox))
    .filter((hole) => hole.length >= 3);

  return [clippedOuter, ...clippedHoles];
}

/**
 * Filters and clips a set of polygons to a lon/lat bounding box: whole
 * landmasses with no overlap are dropped (no unnecessary Americas / no
 * distant empty world regions / no unrelated landmasses — see the v0.5.0
 * map-foundation brief), and landmasses that straddle the box (like the
 * Afro-Eurasian supercontinent) are trimmed down to just their portion
 * inside it.
 */
export function clipPolygonsToBBox(polygons: Polygon[], bbox: LonLatBBox): Polygon[] {
  const result: Polygon[] = [];
  for (const polygon of polygons) {
    const clipped = clipPolygonToBBox(polygon, bbox);
    if (clipped) result.push(clipped);
  }
  return result;
}
