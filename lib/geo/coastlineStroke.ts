import { ACTIVE_MAP_BBOX } from "./activeMapExtent";
import type { LonLatBBox } from "./bbox";
import { worldProjector } from "./worldMapGeometry";
import { WORLD_LAND_POLYGONS } from "./worldLand";

/**
 * WORLD_LAND_PATH (worldMapGeometry.ts) is built from WORLD_LAND_POLYGONS,
 * which is the real Natural Earth coastline clipped to ACTIVE_MAP_BBOX by a
 * sequential Sutherland-Hodgman rectangle clip (clip.ts). That clip is
 * fill-correct — the "phantom" edges it introduces wherever the clip has to
 * stitch two separate clipped fragments back into one ring always run
 * exactly along the bbox boundary, so they add zero net area to a filled
 * shape. But they are still real edges in the path data, and *stroking*
 * that same path (as TerrainLayer's coastal shelf glow and
 * PhysicalGeographyLayer's coastline outline both do) draws every edge
 * regardless of fill area — including those phantom ones. When the real
 * coastline crosses one edge of the box in more than one place (e.g. the
 * Aegean/Levant coast both dipping across ACTIVE_MAP_BBOX's southern edge),
 * the stitched-together bridge between those two unrelated crossings can
 * run most of the way across the visible map, which is the long
 * straight-line glitch across land *and* water.
 *
 * This builds a second path — stroke-only, never used for fill — that
 * simply omits any edge whose both endpoints lie on the bbox boundary
 * (within a tiny epsilon). Real Natural Earth vertices essentially never
 * land exactly on ACTIVE_MAP_BBOX's min/max (that box is derived from this
 * game's terrain coverage, not from the coastline data), so this reliably
 * identifies clip-boundary bridge edges and only those, leaving the real
 * coastline geometry completely untouched. The result is emitted as
 * several open (`M ... L ...`, no closing `Z`) subpaths, since a
 * stroke-only outline never needs to be a closed fillable ring.
 */

const EPSILON_DEG = 1e-6;

function onBoundary(point: readonly [number, number], bbox: LonLatBBox): boolean {
  const [lon, lat] = point;
  return (
    Math.abs(lon - bbox.lonMin) < EPSILON_DEG ||
    Math.abs(lon - bbox.lonMax) < EPSILON_DEG ||
    Math.abs(lat - bbox.latMin) < EPSILON_DEG ||
    Math.abs(lat - bbox.latMax) < EPSILON_DEG
  );
}

function projectPoint(point: readonly [number, number]): string {
  const [x, y] = worldProjector.project(point[0], point[1]);
  return `${x.toFixed(2)},${y.toFixed(2)}`;
}

function buildStrokeSafeCoastlinePath(): string {
  const parts: string[] = [];

  for (const rings of WORLD_LAND_POLYGONS) {
    for (const ring of rings) {
      const n = ring.length;
      if (n < 2) continue;

      // Walk the ring's n edges (the last one wraps from ring[n-1] back to
      // ring[0], since rings are implicitly closed). Whenever an edge is a
      // boundary bridge, close off the run built so far and start a fresh
      // one at the point right after the bridge — never silently dropping
      // that point, and never treating it as connected to the run before it.
      let current: string[] = [projectPoint(ring[0])];
      const flush = () => {
        if (current.length >= 2) {
          parts.push(`M${current[0]} L${current.slice(1).join(" L")}`);
        }
        current = [];
      };

      for (let i = 0; i < n; i++) {
        const next = ring[(i + 1) % n];
        const isBridgeEdge = onBoundary(ring[i], ACTIVE_MAP_BBOX) && onBoundary(next, ACTIVE_MAP_BBOX);

        if (isBridgeEdge) {
          flush();
          if (i + 1 < n) current = [projectPoint(next)];
        } else {
          current.push(projectPoint(next));
        }
      }
      flush();
    }
  }

  return parts.join(" ");
}

/** Coastline geometry for STROKE use only (coastline outline, shallow-water
 * shelf glow). Never use this for a `fill` — some rings are deliberately
 * left open where a bridge edge was removed. For fills, keep using
 * WORLD_LAND_PATH (worldMapGeometry.ts), which is unaffected by this file. */
export const WORLD_COASTLINE_STROKE_PATH: string = buildStrokeSafeCoastlinePath();
