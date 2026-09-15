"use client";

import { useCallback, useRef, useState } from "react";
import MapControls from "@/components/worldmap/MapControls";
import MapHud from "@/components/worldmap/MapHud";
import PhysicalGeographyLayer from "@/components/worldmap/PhysicalGeographyLayer";
import RegionMinimap from "@/components/worldmap/RegionMinimap";
import RiverLayer from "@/components/worldmap/RiverLayer";
import TerrainLayer from "@/components/worldmap/TerrainLayer";
import TerritoryBoundaryLayer from "@/components/worldmap/TerritoryBoundaryLayer";
import { useMapZoomPan } from "@/components/worldmap/useMapZoomPan";
import WorldMinimap from "@/components/worldmap/WorldMinimap";
import { INITIAL_FOCUS_TRANSFORM } from "@/lib/geo/focus";
import { MAP_VIEWBOX_HEIGHT, MAP_VIEWBOX_WIDTH, WORLD_LAND_PATH } from "@/lib/geo/worldMapGeometry";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * The geographic foundation of the Echelon world — a real, interactive
 * map (not a static image), initially centered on Turkey/Anatolia purely
 * for load performance. Physical geography + procedural terrain/territory
 * styling only: no territory selection, no labels, no gameplay systems.
 * Pan, zoom, and recenter are the only interactions.
 */
export default function EchelonWorldMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showTerritories, setShowTerritories] = useState(true);

  const { svgRef, transform, transformString, handlers, zoomIn, zoomOut, reset } = useMapZoomPan(
    MAP_VIEWBOX_WIDTH,
    MAP_VIEWBOX_HEIGHT,
    { minScale: 1, maxScale: 16, initialTransform: INITIAL_FOCUS_TRANSFORM }
  );

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen?.();
    }
  }, []);

  // Territory subdivisions are the local/strategic level of detail — fade
  // them in once the camera is zoomed in enough to read as provinces
  // rather than clutter over a world-scale view. At the initial Turkey
  // focus (scale ~8) this is already fully visible by design.
  const territoryOpacity = showTerritories ? clamp01((transform.scale - 3) / 4) : 0;

  return (
    <div ref={containerRef} className="relative h-full w-full select-none overflow-hidden bg-[#04050A]">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_VIEWBOX_WIDTH} ${MAP_VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Interactive geographic map of the Echelon world, initially centered on Turkey and the surrounding region"
        className="h-full w-full touch-none"
        {...handlers}
      >
        <defs>
          <linearGradient id="echelon-map-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#060810" />
            <stop offset="100%" stopColor="#0A0D14" />
          </linearGradient>
          <radialGradient id="echelon-map-vignette" cx="50%" cy="45%" r="75%">
            <stop offset="55%" stopColor="#000000" stopOpacity={0} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0.6} />
          </radialGradient>
          <clipPath id="echelon-land-clip">
            <path d={WORLD_LAND_PATH} fillRule="evenodd" />
          </clipPath>
        </defs>

        <rect x={0} y={0} width={MAP_VIEWBOX_WIDTH} height={MAP_VIEWBOX_HEIGHT} fill="url(#echelon-map-ocean)" />

        <g transform={transformString}>
          <TerrainLayer />
          <PhysicalGeographyLayer />
          <RiverLayer />
          <TerritoryBoundaryLayer opacity={territoryOpacity} />
        </g>

        <rect
          x={0}
          y={0}
          width={MAP_VIEWBOX_WIDTH}
          height={MAP_VIEWBOX_HEIGHT}
          fill="url(#echelon-map-vignette)"
          className="pointer-events-none"
        />
      </svg>

      <MapHud onToggleFullscreen={toggleFullscreen} />
      <MapControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onRecenter={reset}
        onToggleLayers={() => setShowTerritories((v) => !v)}
        layersActive={showTerritories}
      />
      <WorldMinimap transform={transform} />
      <RegionMinimap
        transform={transform}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
}
