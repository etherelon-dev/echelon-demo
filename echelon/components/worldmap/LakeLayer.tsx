import { PROJECTED_LAKES } from "@/lib/geo/terrainGeometry";
import { TERRAIN_TYPES } from "@/lib/geo/terrainTypes";

/**
 * Layer — lakes.
 *
 * Flat-color closed water shapes (lib/geo/lakePolygons.ts), classified
 * separately from the ocean/water background per the terrainType="lake"
 * spec. No depth, no reflections, no gradients. Clipped to the land
 * clip-path as a safety net for the hand-authored polygons — a lake should
 * never visually bleed past the real coastline.
 */
export default function LakeLayer() {
  return (
    <g clipPath="url(#echelon-land-clip)">
      {PROJECTED_LAKES.map((lake) => (
        <path key={lake.name} d={lake.path} fill={TERRAIN_TYPES.lake.color} />
      ))}
    </g>
  );
}
