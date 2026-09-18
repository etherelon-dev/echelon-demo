import type { LonLatBBox } from "./bbox";
import { LAKES } from "./lakePolygons";
import { RIVERS } from "./riverPaths";
import { TERRAIN_REGIONS } from "./terrainRegions";

/**
 * The active game map no longer renders the whole world — only the
 * geographic extent the existing terrain system actually implements (see
 * lib/geo/README.md), plus a small padding margin so the coastline doesn't
 * touch the edge of the canvas. This is computed once, directly from the
 * real terrain/river/lake data below (never hand-picked or hardcoded), so
 * it automatically tracks whatever the terrain system covers — if
 * terrainRegions.ts/riverPaths.ts/lakePolygons.ts grow to cover more
 * geography later, this extent (and everything downstream: the viewBox,
 * the projector, the cropped land data) grows with them with no further
 * changes needed here.
 *
 * Deliberately does NOT read WORLD_LAND_POLYGONS / worldLand.ts — the
 * extent must come from the terrain system, not from the land geometry
 * itself, since the land geometry is exactly what gets cropped down to
 * this extent (see worldLand.ts). Reading from it here would be circular
 * and would also miss the point: an ocean-only region has no terrain but
 * would still have "land" bounding box data.
 */

/** Small, self-scaling padding around the terrain coverage: 5% of whichever
 * axis (lon or lat) spans further, applied equally to both axes so the
 * margin reads as visually even (a flat/equirectangular projection maps a
 * degree of longitude and a degree of latitude to the same map distance,
 * so an *equal-degree* pad — not an equal-percentage-per-axis pad — is
 * what looks even on screen). */
const PADDING_FRACTION = 0.05;

function computeTerrainCoverageBBox(): LonLatBBox {
  let lonMin = Infinity;
  let lonMax = -Infinity;
  let latMin = Infinity;
  let latMax = -Infinity;

  const feed = (lon: number, lat: number) => {
    if (lon < lonMin) lonMin = lon;
    if (lon > lonMax) lonMax = lon;
    if (lat < latMin) latMin = lat;
    if (lat > latMax) latMax = lat;
  };

  for (const region of TERRAIN_REGIONS) {
    for (const [lon, lat] of region.ring) feed(lon, lat);
  }
  for (const river of RIVERS) {
    for (const [lon, lat] of river.points) feed(lon, lat);
  }
  for (const lake of LAKES) {
    for (const [lon, lat] of lake.ring) feed(lon, lat);
  }

  return { lonMin, lonMax, latMin, latMax };
}

const TERRAIN_COVERAGE_BBOX = computeTerrainCoverageBBox();

const paddingDeg =
  Math.max(
    TERRAIN_COVERAGE_BBOX.lonMax - TERRAIN_COVERAGE_BBOX.lonMin,
    TERRAIN_COVERAGE_BBOX.latMax - TERRAIN_COVERAGE_BBOX.latMin
  ) * PADDING_FRACTION;

/**
 * Terrain coverage + padding — the actual geographic area the active game
 * map renders. Everything outside this is not part of the current game
 * world: worldLand.ts crops the base land dataset to exactly this box, and
 * worldMapGeometry.ts fits its viewBox/projector to it, so no layer ever
 * has to render or pan across geography the game doesn't use.
 */
export const ACTIVE_MAP_BBOX: LonLatBBox = {
  lonMin: Math.max(-180, TERRAIN_COVERAGE_BBOX.lonMin - paddingDeg),
  lonMax: Math.min(180, TERRAIN_COVERAGE_BBOX.lonMax + paddingDeg),
  latMin: Math.max(-90, TERRAIN_COVERAGE_BBOX.latMin - paddingDeg),
  latMax: Math.min(90, TERRAIN_COVERAGE_BBOX.latMax + paddingDeg)
};
