import type { CanonicalBBox } from "./focus";
import { worldProjector } from "./worldMapGeometry";
import { WORLD_LAND_POLYGONS } from "./worldLand";

export type ProjectedRing = Array<[number, number]>;

function projectAllRings(): ProjectedRing[] {
  const rings: ProjectedRing[] = [];
  for (const polygon of WORLD_LAND_POLYGONS) {
    for (const ring of polygon) {
      rings.push(ring.map(([lon, lat]) => worldProjector.project(lon, lat)));
    }
  }
  return rings;
}

/** Every land ring, pre-projected into canonical viewBox space once at module load. */
export const WORLD_LAND_RINGS: ProjectedRing[] = projectAllRings();

function ringBBox(ring: ProjectedRing): CanonicalBBox {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, maxX, minY, maxY };
}

function bboxIntersects(a: CanonicalBBox, b: CanonicalBBox): boolean {
  return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY;
}

/**
 * Land rings whose bounding box overlaps `bbox` — narrows the point-in-
 * polygon test down to a handful of relevant rings instead of scanning all
 * ~125 rings in the world dataset for every sample point.
 */
export function ringsOverlapping(bbox: CanonicalBBox): ProjectedRing[] {
  return WORLD_LAND_RINGS.filter((ring) => bboxIntersects(ringBBox(ring), bbox));
}

/** Even-odd ray-casting point-in-polygon test over a set of already-projected rings. */
export function isPointOnLand(x: number, y: number, rings: ProjectedRing[]): boolean {
  let inside = false;
  for (const ring of rings) {
    const n = ring.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersects) inside = !inside;
    }
  }
  return inside;
}
