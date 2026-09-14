"use client";

import { MAP_VIEWBOX_HEIGHT, MAP_VIEWBOX_WIDTH } from "@/lib/geo/worldMapGeometry";
import PhysicalGeographyLayer from "@/components/worldmap/PhysicalGeographyLayer";
import TerrainLayer from "@/components/worldmap/TerrainLayer";
import RiverLayer from "@/components/worldmap/RiverLayer";
import TerritoryBoundaryLayer from "@/components/worldmap/TerritoryBoundaryLayer";
import MapControls from "@/components/worldmap/MapControls";
import { useMapZoomPan } from "@/components/worldmap/useMapZoomPan";

/**
 * The raw geographic foundation of the Echelon world — physical geography
 * only. No territory selection, no labels, no gameplay. Map navigation
 * (zoom / pan / reset) only.
 */
export default function EchelonWorldMap() {
  const { svgRef, transformString, handlers, zoomIn, zoomOut, reset } = useMapZoomPan(
    MAP_VIEWBOX_WIDTH,
    MAP_VIEWBOX_HEIGHT,
    { minScale: 1, maxScale: 14 }
  );

  return (
    <div className="relative aspect-[49/24] w-full select-none overflow-hidden border border-ink-500 bg-[#04050A]">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_VIEWBOX_WIDTH} ${MAP_VIEWBOX_HEIGHT}`}
        role="img"
        aria-label="Geographic world map — the physical foundation of the Echelon world"
        className="h-full w-full touch-none"
        {...handlers}
      >
        <defs>
          <radialGradient id="echelon-map-vignette" cx="50%" cy="45%" r="75%">
            <stop offset="55%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id="echelon-map-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#05060B" />
            <stop offset="100%" stopColor="#0A0C12" />
          </linearGradient>
        </defs>

        {/* Ocean */}
        <rect
          x={0}
          y={0}
          width={MAP_VIEWBOX_WIDTH}
          height={MAP_VIEWBOX_HEIGHT}
          fill="url(#echelon-map-ocean)"
        />

        {/* Pan/zoom group — every geographic layer lives inside here, in registration */}
        <g transform={transformString}>
          <PhysicalGeographyLayer />
          <TerrainLayer />
          <RiverLayer />
          <TerritoryBoundaryLayer />
        </g>

        {/* Atmospheric vignette sits outside the zoom group, fixed to the viewport */}
        <rect
          x={0}
          y={0}
          width={MAP_VIEWBOX_WIDTH}
          height={MAP_VIEWBOX_HEIGHT}
          fill="url(#echelon-map-vignette)"
          className="pointer-events-none"
        />
      </svg>

      <MapControls onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={reset} />
    </div>
  );
}
