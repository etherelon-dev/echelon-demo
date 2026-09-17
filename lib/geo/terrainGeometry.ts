import { LAKES } from "./lakePolygons";
import { lineToPathData, ringToPathData } from "./path";
import { RIVERS } from "./riverPaths";
import type { TerrainTypeId } from "./terrainTypes";
import { TERRAIN_REGIONS } from "./terrainRegions";
import { worldProjector } from "./worldMapGeometry";

export interface ProjectedTerrainRegion {
  type: TerrainTypeId;
  path: string;
}

export interface ProjectedRiver {
  name: string;
  path: string;
}

export interface ProjectedLake {
  name: string;
  path: string;
}

/** Terrain classification regions, rivers, and lakes — projected into the
 * canonical viewBox once at module load, same as WORLD_LAND_PATH. Paint
 * order for regions follows TERRAIN_REGIONS' array order (broad base
 * regions first, specific overrides on top). */
export const PROJECTED_TERRAIN_REGIONS: ProjectedTerrainRegion[] = TERRAIN_REGIONS.map(
  (region) => ({
    type: region.type,
    path: ringToPathData(region.ring, worldProjector.project)
  })
);

export const PROJECTED_RIVERS: ProjectedRiver[] = RIVERS.map((river) => ({
  name: river.name,
  path: lineToPathData(river.points, worldProjector.project)
}));

export const PROJECTED_LAKES: ProjectedLake[] = LAKES.map((lake) => ({
  name: lake.name,
  path: ringToPathData(lake.ring, worldProjector.project)
}));
