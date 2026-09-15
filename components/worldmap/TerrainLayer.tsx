import { PROJECTED_TERRAIN_REGIONS } from "@/lib/geo/terrainGeometry";
import { TERRAIN_TYPES } from "@/lib/geo/terrainTypes";
import { WORLD_LAND_PATH } from "@/lib/geo/worldMapGeometry";

interface TerrainLayerProps {
  /** Whether to paint the classified terrain regions on top of the base
   * land color. When false, the map shows a plain land silhouette. */
  showClassification: boolean;
}

/**
 * Layer — terrain classification, flat colors only.
 *
 * Renders the base "land" color across the whole coastline, then paints
 * each classified terrain region (plains/mountains/forest/etc., from
 * lib/geo/terrainRegions.ts) on top in flat fill — no gradients, no
 * shading, no procedural noise. Everything here is wrapped in the shared
 * land clip-path, so hand-authored region edges can never spill past the
 * real coastline even when they're only approximate.
 *
 * This replaces an earlier feTurbulence/feDiffuseLighting-based "shaded
 * relief" approach. That was procedural noise standing in for terrain that
 * didn't exist yet, not real classification, and complex SVG filter chains
 * like that are exactly the kind of thing that can render as solid black
 * or fail inconsistently across browsers — flat fills sidestep that
 * entirely.
 */
export default function TerrainLayer({ showClassification }: TerrainLayerProps) {
  return (
    <g clipPath="url(#echelon-land-clip)">
      <path d={WORLD_LAND_PATH} fill={TERRAIN_TYPES.land.color} fillRule="evenodd" />
      {showClassification &&
        PROJECTED_TERRAIN_REGIONS.map((region, index) => (
          <path key={index} d={region.path} fill={TERRAIN_TYPES[region.type].color} />
        ))}
    </g>
  );
}
