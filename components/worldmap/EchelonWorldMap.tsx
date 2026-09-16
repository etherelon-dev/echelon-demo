"use client";

import { useCallback, useRef, useState } from "react";
import LakeLayer from "@/components/worldmap/LakeLayer";
import MapControls from "@/components/worldmap/MapControls";
import MapHud from "@/components/worldmap/MapHud";
import PhysicalGeographyLayer from "@/components/worldmap/PhysicalGeographyLayer";
import RegionMinimap from "@/components/worldmap/RegionMinimap";
import RiverLayer from "@/components/worldmap/RiverLayer";
import TerrainLayer from "@/components/worldmap/TerrainLayer";
import { useElementSize } from "@/components/worldmap/useElementSize";
import { useMapZoomPan } from "@/components/worldmap/useMapZoomPan";
import WorldMinimap from "@/components/worldmap/WorldMinimap";
import { INITIAL_FOCUS_TRANSFORM } from "@/lib/geo/focus";
import { MAP_VIEWBOX_HEIGHT, MAP_VIEWBOX_WIDTH, WORLD_LAND_PATH } from "@/lib/geo/worldMapGeometry";

/**
 * The geographic foundation of the Echelon world — a real, interactive
 * map (not a static image), initially centered on Turkey/Anatolia purely
 * for load performance. Physical geography + flat-color terrain
 * classification only: no political/territory layers, no labels, no
 * gameplay systems yet. Pan, zoom, and recenter are the only interactions.
 *
 * Layer order (back to front): water background, base land, terrain
 * regions, lakes, rivers, coastline.
 */
export default function EchelonWorldMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showTerrainColors, setShowTerrainColors] = useState(true);

  const { svgRef, transform, transformString, handlers, zoomIn, zoomOut, reset } = useMapZoomPan(
    MAP_VIEWBOX_WIDTH,
    MAP_VIEWBOX_HEIGHT,
    { minScale: 1, maxScale: 16, initialTransform: INITIAL_FOCUS_TRANSFORM }
  );
  // The <svg>'s actual rendered box — needed so the minimaps' viewport
  // indicator can account for what preserveAspectRatio="slice" crops off
  // (see useElementSize's docstring).
  const containerSize = useElementSize(svgRef);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen?.();
    }
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full select-none overflow-hidden bg-[#04050A]">
      {/* "slice" (not "meet") so the map always fills its panel edge to
          edge. The active extent (Iceland to the Urals, Scandinavia to the
          Syrian desert) is a very wide box — on a tall/narrow phone
          viewport, "meet" had to shrink that whole wide box down to fit
          the width, which left most of the panel below it as dead
          letterboxed space. "slice" instead scales up to fill the panel
          height and crops the excess width, centered — the initial camera
          (INITIAL_FOCUS_TRANSFORM, below) already frames Turkey/Anatolia
          within that box, and pan/zoom reaches everything the crop
          trims. */}
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
          <clipPath id="echelon-land-clip">
            <path d={WORLD_LAND_PATH} fillRule="evenodd" />
          </clipPath>
        </defs>

        {/* 1. Water background */}
        <rect x={0} y={0} width={MAP_VIEWBOX_WIDTH} height={MAP_VIEWBOX_HEIGHT} fill="url(#echelon-map-ocean)" />

        <g transform={transformString}>
          {/* 2 & 3. Base land + terrain regions */}
          <TerrainLayer showClassification={showTerrainColors} />
          {/* 4. Lakes */}
          <LakeLayer />
          {/* 5. Rivers */}
          <RiverLayer />
          {/* 6. Coastline */}
          <PhysicalGeographyLayer />
        </g>
      </svg>

      <MapHud onToggleFullscreen={toggleFullscreen} />
      <MapControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onRecenter={reset}
        onToggleLayers={() => setShowTerrainColors((v) => !v)}
        layersActive={showTerrainColors}
      />
      <WorldMinimap transform={transform} containerSize={containerSize} />
      <RegionMinimap
        transform={transform}
        containerSize={containerSize}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
}
