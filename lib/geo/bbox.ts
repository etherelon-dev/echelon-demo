/**
 * Shared bounding-box types for the map's coordinate plumbing. Pulled out
 * of focus.ts (which used to define these itself) so that activeMapExtent.ts
 * can depend on `LonLatBBox` without creating a cycle with focus.ts /
 * worldMapGeometry.ts. Zero runtime logic here on purpose — just shapes.
 */

/** A geographic bounding box, in lon/lat degrees. */
export interface LonLatBBox {
  lonMin: number;
  lonMax: number;
  latMin: number;
  latMax: number;
}

/** A bounding box in canonical (projected, unscaled-by-pan/zoom) viewBox
 * coordinates — i.e. the same space the precomputed layer paths live in. */
export interface CanonicalBBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
