import { WORLD_LAND_PATH } from "@/lib/geo/worldMapGeometry";

/**
 * Layer 1 — Physical Geography.
 *
 * Land silhouette derived from the existing world-land-110m.json asset.
 * Coastline is the path outline itself (land fill + a slightly lighter
 * stroke) — at this resolution there isn't a separate higher-detail
 * coastline dataset to layer on top of.
 */
export default function PhysicalGeographyLayer() {
  return (
    <path
      d={WORLD_LAND_PATH}
      fill="#1B1E1B"
      stroke="#3A3F39"
      strokeWidth={0.6}
      strokeLinejoin="round"
      fillRule="evenodd"
      vectorEffect="non-scaling-stroke"
    />
  );
}
