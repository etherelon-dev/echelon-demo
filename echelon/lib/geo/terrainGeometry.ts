import { LAKES } from "./lakePolygons";
import { lineToPathData, ringToPathData } from "./path";
import { PEAKS } from "./peaks";
import { RIVERS } from "./riverPaths";
import type { TerrainTypeId } from "./terrainTypes";
import { TERRAIN_REGIONS } from "./terrainRegions";
import { WATER_LABELS } from "./waterLabels";
import { worldProjector } from "./worldMapGeometry";

export interface ProjectedTerrainRegion {
  type: TerrainTypeId;
  path: string;
  /** Projected ring, kept alongside the path string so a point can be
   * tested against it directly (see classifyTerrainAt below) without
   * re-parsing the path data. */
  ring: Array<[number, number]>;
}

export interface ProjectedRiver {
  name: string;
  path: string;
}

export interface ProjectedLake {
  name: string;
  path: string;
}

export interface ProjectedPeak {
  name: string;
  tier: "major" | "minor";
  x: number;
  y: number;
}

export interface ProjectedWaterLabel {
  name: string;
  tier: "ocean" | "sea";
  x: number;
  y: number;
}

/** Terrain classification regions, rivers, and lakes — projected into the
 * canonical viewBox once at module load, same as WORLD_LAND_PATH. Paint
 * order for regions follows TERRAIN_REGIONS' array order (broad base
 * regions first, specific overrides on top). */
export const PROJECTED_TERRAIN_REGIONS: ProjectedTerrainRegion[] = TERRAIN_REGIONS.map(
  (region) => ({
    type: region.type,
    path: ringToPathData(region.ring, worldProjector.project),
    ring: region.ring.map(([lon, lat]) => worldProjector.project(lon, lat))
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

export const PROJECTED_PEAKS: ProjectedPeak[] = PEAKS.map((peak) => {
  const [x, y] = worldProjector.project(peak.point[0], peak.point[1]);
  return { name: peak.name, tier: peak.tier, x, y };
});

export const PROJECTED_WATER_LABELS: ProjectedWaterLabel[] = WATER_LABELS.map((label) => {
  const [x, y] = worldProjector.project(label.point[0], label.point[1]);
  return { name: label.name, tier: label.tier, x, y };
});

/** Even-odd point-in-ring test — same algorithm as landHitTest.ts's, kept
 * separate to avoid importing land-clip-specific plumbing here for one
 * function. */
function isPointInRing(x: number, y: number, ring: Array<[number, number]>): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/**
 * Classifies a canonical-space point against the hand-authored terrain
 * regions, for flavor purposes only (currently: biasing a territory's
 * generated resources toward what its land actually looks like — see
 * lib/game/territories.ts). Walks the array back-to-front because later
 * entries in TERRAIN_REGIONS are painted on top (see the array's own
 * ordering comment), so the last ring a point falls inside is the one
 * that's actually visible there. Falls back to "land" (the same base tone
 * TerrainLayer uses under unclassified ground) when nothing matches.
 */
export function classifyTerrainAt(x: number, y: number): TerrainTypeId {
  for (let i = PROJECTED_TERRAIN_REGIONS.length - 1; i >= 0; i--) {
    if (isPointInRing(x, y, PROJECTED_TERRAIN_REGIONS[i].ring)) {
      return PROJECTED_TERRAIN_REGIONS[i].type;
    }
  }
  return "land";
}
