import { ACTIVE_MAP_BBOX } from "./activeMapExtent";
import { polygonsToPathData } from "./path";
import { createProjectorForBBox, equirectangularRaw } from "./projection";
import { WORLD_LAND_POLYGONS } from "./worldLand";

/**
 * Canonical logical coordinate space for the active map. All map layers
 * (land, terrain, rivers, lakes) project into this same viewBox so they
 * stay in registration with each other.
 *
 * The viewBox's aspect ratio is derived from ACTIVE_MAP_BBOX's own lon/lat
 * span (see activeMapExtent.ts) rather than a fixed constant — under the
 * flat equirectangular projection a degree of longitude and a degree of
 * latitude map to the same map distance, so matching the viewBox's shape
 * to the extent's real shape means the fitted projector (below) uses the
 * canvas fully instead of leaving unnecessary letterboxed space on one
 * axis. Width is fixed at a reference resolution; height follows the
 * extent's aspect ratio.
 */
const EXTENT_LON_SPAN = ACTIVE_MAP_BBOX.lonMax - ACTIVE_MAP_BBOX.lonMin;
const EXTENT_LAT_SPAN = ACTIVE_MAP_BBOX.latMax - ACTIVE_MAP_BBOX.latMin;

export const MAP_VIEWBOX_WIDTH = 980;
export const MAP_VIEWBOX_HEIGHT = Math.round(
  MAP_VIEWBOX_WIDTH * (EXTENT_LAT_SPAN / EXTENT_LON_SPAN)
);

/**
 * The shared projector every layer projects through. Built from the
 * *declared* active map extent (terrain coverage + padding), not from
 * scanning the land geometry itself — so the map's framing is anchored to
 * what the game's terrain system covers, independent of exactly where the
 * (now-cropped) coastline happens to fall within that box.
 */
export const worldProjector = createProjectorForBBox(
  ACTIVE_MAP_BBOX,
  equirectangularRaw,
  MAP_VIEWBOX_WIDTH,
  MAP_VIEWBOX_HEIGHT,
  10
);

/** Precomputed once at module load — land geometry rarely changes at runtime. */
export const WORLD_LAND_PATH = polygonsToPathData(
  WORLD_LAND_POLYGONS,
  worldProjector.project
);
