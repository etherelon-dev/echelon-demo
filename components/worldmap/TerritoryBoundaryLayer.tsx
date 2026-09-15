import { TERRITORIES, TONE_COUNT } from "@/lib/geo/territoryGeometry";

/** Muted earth-tone variants — subtle differentiation between cells, never
 * political/ownership color per the spec (that's a future gameplay layer). */
const TERRITORY_TONES = [
  "#2E3324", // dark olive
  "#3A2F22", // muted brown
  "#333730", // slate-green
  "#2A2E33", // muted gray-slate
  "#3A331F" // dark earth / muted ochre
];

interface TerritoryBoundaryLayerProps {
  /** Fades boundaries in past the world-scale view — they're the
   * strategic/local level of detail, not something a zoomed-out view
   * should show. */
  opacity: number;
}

/**
 * Layer — organic territory subdivisions within the high-detail region.
 * See lib/geo/territoryGeometry.ts for how the shapes are generated
 * (procedural Voronoi, not sourced administrative boundaries). Clipped to
 * the coastline via the shared land clip-path so cells never spill into
 * open water.
 */
export default function TerritoryBoundaryLayer({ opacity }: TerritoryBoundaryLayerProps) {
  if (opacity <= 0) return null;

  return (
    <g clipPath="url(#echelon-land-clip)" style={{ opacity }}>
      {TERRITORIES.map((territory, index) => (
        <path
          key={index}
          d={territory.path}
          fill={TERRITORY_TONES[territory.toneIndex % TONE_COUNT]}
          fillOpacity={0.32}
          stroke="#8F6B3E"
          strokeOpacity={0.3}
          strokeWidth={0.5}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  );
}
