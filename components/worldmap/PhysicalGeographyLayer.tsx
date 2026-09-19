import { WORLD_COASTLINE_STROKE_PATH } from "@/lib/geo/coastlineStroke";

/**
 * Layer — Physical Geography (coastline).
 *
 * Just the coastline outline now — TerrainLayer paints the land fill
 * underneath this, so the coastline stroke sits crisp on top of the
 * relief texture instead of being drawn twice.
 *
 * Uses WORLD_COASTLINE_STROKE_PATH (coastlineStroke.ts), not the raw
 * WORLD_LAND_PATH used for fills — that fill path can contain synthetic
 * edges where the bbox clip stitches two disjoint clipped fragments back
 * into one ring (harmless for fill area, but a stray straight line if
 * stroked). The stroke-safe path omits exactly those edges.
 */
export default function PhysicalGeographyLayer() {
  return (
    <path
      d={WORLD_COASTLINE_STROKE_PATH}
      fill="none"
      stroke="#4A4F45"
      strokeOpacity={0.8}
      strokeWidth={0.6}
      strokeLinejoin="round"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  );
}
