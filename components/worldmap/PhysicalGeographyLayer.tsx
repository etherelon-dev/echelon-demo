import { WORLD_LAND_PATH } from "@/lib/geo/worldMapGeometry";

/**
 * Layer — Physical Geography (coastline).
 *
 * Just the coastline outline now — TerrainLayer paints the land fill
 * underneath this, so the coastline stroke sits crisp on top of the
 * relief texture instead of being drawn twice.
 */
export default function PhysicalGeographyLayer() {
  return (
    <path
      d={WORLD_LAND_PATH}
      fill="none"
      stroke="#4A4F45"
      strokeOpacity={0.8}
      strokeWidth={0.6}
      strokeLinejoin="round"
      fillRule="evenodd"
      vectorEffect="non-scaling-stroke"
    />
  );
}
