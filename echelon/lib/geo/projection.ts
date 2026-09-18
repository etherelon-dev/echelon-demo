import type { LonLatBBox } from "./bbox";
import type { Polygon } from "./topojson";

/**
 * Equal Earth projection (Šavrič, Patterson & Jenny, 2018) — a pseudocylindrical,
 * equal-area globe projection. Kept here for reference, but the active game
 * map no longer uses it (see `equirectangularRaw` below): a globe projection
 * curves longitude lines and isn't what a flat 2D grand-strategy map wants.
 * This is the same closed-form formula used by d3-geo-projection,
 * reimplemented here directly since we have no network access to install
 * that package in this session.
 */
const A1 = 1.340264;
const A2 = -0.081106;
const A3 = 0.000893;
const A4 = 0.003796;
const M = Math.sqrt(3) / 2;

/** Raw (unscaled) Equal Earth projection. Input in degrees. Unused by the
 * active map (see module doc comment above) — kept for reference. */
export function equalEarthRaw(lonDeg: number, latDeg: number): [number, number] {
  const lambda = (lonDeg * Math.PI) / 180;
  const phi = (latDeg * Math.PI) / 180;
  const theta = Math.asin(M * Math.sin(phi));
  const theta2 = theta * theta;
  const theta6 = theta2 * theta2 * theta2;
  const x =
    (lambda * Math.cos(theta)) /
    (M * (A1 + 3 * A2 * theta2 + theta6 * (7 * A3 + 9 * A4 * theta2)));
  const y = theta * (A1 + A2 * theta2 + theta6 * (A3 + A4 * theta2));
  return [x, y];
}

/**
 * Flat/equirectangular (Plate Carrée) projection — x = longitude,
 * y = latitude, both in degrees, with no further warping. No spherical
 * curvature, no perspective, no pole distortion games: every degree of
 * longitude occupies exactly the same map width at every latitude, and
 * every degree of latitude occupies exactly the same map height. This is
 * what makes the result a genuinely flat 2D strategy-game canvas with
 * predictable X/Y coordinates, and it's what the active game map's shared
 * `worldProjector` (see worldMapGeometry.ts) is built from.
 */
export function equirectangularRaw(lonDeg: number, latDeg: number): [number, number] {
  return [lonDeg, latDeg];
}

/** Inverse of `equirectangularRaw` — it's its own inverse, since the raw
 * projection does no warping at all (x = lon, y = lat either direction). */
export function equirectangularRawInvert(x: number, y: number): [number, number] {
  return [x, y];
}

export interface Projector {
  project: (lonDeg: number, latDeg: number) => [number, number];
  /** Inverse of `project` — canonical viewBox coordinates back to lon/lat
   * degrees. Exact (not approximated) for every raw projection currently
   * used here, since `fitBoundsToViewport` only ever applies a uniform
   * scale + translate on top of `rawProject`. */
  invert: (x: number, y: number) => [number, number];
  scale: number;
}

type RawProject = (lonDeg: number, latDeg: number) => [number, number];
type RawInvert = (x: number, y: number) => [number, number];

interface RawBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/** Shared tail: given raw-projection-space bounds, builds the actual
 * Projector — uniform scale (never independently scaled per axis, so this
 * can never stretch/squash geographic proportions), centered, with
 * optional padding. Used by both fitting strategies below.
 *
 * `rawInvert` defaults to the identity function, which is only exact for
 * `equirectangularRaw` (the only raw projection the active map actually
 * uses — see worldMapGeometry.ts). Callers fitting a non-identity raw
 * projection (e.g. the unused `equalEarthRaw`) should pass its true
 * inverse if they need `invert` to be meaningful. */
function fitBoundsToViewport(
  bounds: RawBounds,
  rawProject: RawProject,
  width: number,
  height: number,
  padding: number,
  rawInvert: RawInvert = equirectangularRawInvert
): Projector {
  const dataWidth = bounds.maxX - bounds.minX;
  const dataHeight = bounds.maxY - bounds.minY;
  const availW = width - padding * 2;
  const availH = height - padding * 2;
  const scale = Math.min(availW / dataWidth, availH / dataHeight);

  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  const translateX = width / 2 - cx * scale;
  const translateY = height / 2 + cy * scale; // + because SVG y grows down, raw y grows north

  const project = (lonDeg: number, latDeg: number): [number, number] => {
    const [x, y] = rawProject(lonDeg, latDeg);
    return [x * scale + translateX, -y * scale + translateY];
  };

  const invert = (x: number, y: number): [number, number] => {
    const rawX = (x - translateX) / scale;
    const rawY = -(y - translateY) / scale;
    return rawInvert(rawX, rawY);
  };

  return { project, invert, scale };
}

/**
 * Projects a set of polygons through `rawProject` and fits their combined
 * extent to a width x height viewport (uniform scale, centered, optional
 * padding) — a hand-rolled equivalent of d3.geoPath().fitExtent(). Not
 * currently used to build the active map's shared projector (see
 * createProjectorForBBox below, which fits to the declared active map
 * extent instead of to whatever the land geometry happens to contain) but
 * kept as a general utility.
 */
export function createProjector(
  polygons: Polygon[],
  rawProject: RawProject,
  width: number,
  height: number,
  padding = 0
): Projector {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const rings of polygons) {
    for (const ring of rings) {
      for (const [lon, lat] of ring) {
        const [x, y] = rawProject(lon, lat);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return fitBoundsToViewport({ minX, maxX, minY, maxY }, rawProject, width, height, padding);
}

/**
 * Fits a *declared* lon/lat bounding box (rather than scanned geometry) to
 * a width x height viewport. This is how the active map extent (terrain
 * coverage + padding — see activeMapExtent.ts) becomes the shared
 * `worldProjector` every layer (land, terrain, rivers, lakes) projects
 * through, so they all stay in registration and the map only ever shows
 * the geography the game actually uses.
 *
 * Samples along the box's edge rather than just its four corners — this
 * matters for a non-linear projection (a straight lon/lat edge doesn't
 * project to a straight line), and while `equirectangularRaw` above is
 * perfectly linear (so the four corners alone would be exact), sampling
 * keeps this function correct if the raw projection is ever swapped again.
 */
export function createProjectorForBBox(
  bbox: LonLatBBox,
  rawProject: RawProject,
  width: number,
  height: number,
  padding = 0,
  samples = 24
): Projector {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const lon = bbox.lonMin + (bbox.lonMax - bbox.lonMin) * t;
    const lat = bbox.latMin + (bbox.latMax - bbox.latMin) * t;
    const points: Array<[number, number]> = [
      rawProject(lon, bbox.latMin),
      rawProject(lon, bbox.latMax),
      rawProject(bbox.lonMin, lat),
      rawProject(bbox.lonMax, lat)
    ];
    for (const [x, y] of points) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  return fitBoundsToViewport({ minX, maxX, minY, maxY }, rawProject, width, height, padding);
}
