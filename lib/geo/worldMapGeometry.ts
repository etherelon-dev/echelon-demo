import { WORLD_LAND_POLYGONS } from "./worldLand";
import { createProjector } from "./projection";
import { polygonsToPathData } from "./path";

/**
 * Canonical logical coordinate space for the world map. All map layers
 * (land now; terrain/rivers/territories later) should project into this
 * same viewBox so they stay in registration with each other.
 */
export const MAP_VIEWBOX_WIDTH = 980;
export const MAP_VIEWBOX_HEIGHT = 480;

export const worldProjector = createProjector(
  WORLD_LAND_POLYGONS,
  MAP_VIEWBOX_WIDTH,
  MAP_VIEWBOX_HEIGHT,
  10
);

/** Precomputed once at module load — land geometry rarely changes at runtime. */
export const WORLD_LAND_PATH = polygonsToPathData(
  WORLD_LAND_POLYGONS,
  worldProjector.project
);
