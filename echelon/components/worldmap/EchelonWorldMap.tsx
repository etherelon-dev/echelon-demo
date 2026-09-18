"use client";

import { useCallback, useRef, useState } from "react";
import HistoryPanel from "@/components/worldmap/HistoryPanel";
import LabelLayer from "@/components/worldmap/LabelLayer";
import LakeLayer from "@/components/worldmap/LakeLayer";
import LeftToolbar, { type MapMode } from "@/components/worldmap/LeftToolbar";
import MapCompassHud from "@/components/worldmap/MapCompassHud";
import MapControls from "@/components/worldmap/MapControls";
import MapHud from "@/components/worldmap/MapHud";
import PhysicalGeographyLayer from "@/components/worldmap/PhysicalGeographyLayer";
import PoliticalLayer from "@/components/worldmap/PoliticalLayer";
import RegionMinimap from "@/components/worldmap/RegionMinimap";
import RiverLayer from "@/components/worldmap/RiverLayer";
import TerrainLayer from "@/components/worldmap/TerrainLayer";
import TerritoryInfoPanel from "@/components/worldmap/TerritoryInfoPanel";
import { useElementSize } from "@/components/worldmap/useElementSize";
import { useMapZoomPan } from "@/components/worldmap/useMapZoomPan";
import { useGameState } from "@/lib/game/useGameState";
import { INITIAL_FOCUS_TRANSFORM } from "@/lib/geo/focus";
import { TERRITORIES } from "@/lib/geo/territoryGeometry";
import { MAP_VIEWBOX_HEIGHT, MAP_VIEWBOX_WIDTH, WORLD_LAND_PATH } from "@/lib/geo/worldMapGeometry";

/** Screen-px of pointer movement within one pointer-down/up session before
 * a tap stops counting as a tap. Same session the pan/pinch handlers in
 * useMapZoomPan track internally for their own purposes — this is a
 * separate, cheap measurement at the DOM level so a pan-that-ends-on-a-
 * territory doesn't also select it. */
const TAP_MOVEMENT_THRESHOLD_PX = 6;

/**
 * The geographic foundation of the Echelon world — a real, interactive
 * map (not a static image), initially centered on Turkey/Anatolia purely
 * for load performance. Physical geography with pseudo-3D relief
 * (TerrainLayer — gradients standing in for hillshade, snow-capped
 * summits, forest/dune texture — see that file's docstring for why this
 * isn't the feTurbulence/feDiffuseLighting approach lib/geo/README.md
 * describes abandoning), a political/territory layer with fictional
 * Echelon kingdoms (PoliticalLayer + lib/game/*), geographic + settlement
 * labels (LabelLayer), and a small interactive loop: select a territory,
 * develop it, form a kingdom, annex neighbors, propose trade — all backed
 * by lib/game/useGameState.ts, which is intentionally the only thing that
 * ever mutates as a result (see DATA ARCHITECTURE in the upgrade brief:
 * geography here never changes, only game state layered on top of it).
 *
 * Layer order (back to front): water background, base land + terrain
 * regions, lakes, rivers, political overlay, coastline, labels.
 */
export default function EchelonWorldMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showTerrainColors, setShowTerrainColors] = useState(true);
  const [mode, setMode] = useState<MapMode>("world");
  const [historyOpen, setHistoryOpen] = useState(false);

  const {
    state,
    selectedTerritory,
    annexableNeighbors,
    selectTerritory,
    developTerritory,
    formKingdom,
    annexTerritory,
    proposeTrade
  } = useGameState();

  const { svgRef, transform, transformString, handlers, zoomIn, zoomOut, reset, panTo } = useMapZoomPan(
    MAP_VIEWBOX_WIDTH,
    MAP_VIEWBOX_HEIGHT,
    { minScale: 1, maxScale: 16, initialTransform: INITIAL_FOCUS_TRANSFORM }
  );
  // The <svg>'s actual rendered box — needed so the minimap's viewport
  // indicator can account for what preserveAspectRatio="slice" crops off
  // (see useElementSize's docstring).
  const containerSize = useElementSize(svgRef);

  // Tap-vs-pan disambiguation for territory selection — see
  // TAP_MOVEMENT_THRESHOLD_PX above. Capture-phase so it observes every
  // pointer session on the svg without touching useMapZoomPan's own
  // bubble-phase handlers.
  const pointerDownAt = useRef<{ x: number; y: number } | null>(null);
  const wasDrag = useRef(false);
  const onPointerDownCapture = useCallback((e: React.PointerEvent) => {
    pointerDownAt.current = { x: e.clientX, y: e.clientY };
    wasDrag.current = false;
  }, []);
  const onPointerMoveCapture = useCallback((e: React.PointerEvent) => {
    if (!pointerDownAt.current) return;
    const dx = e.clientX - pointerDownAt.current.x;
    const dy = e.clientY - pointerDownAt.current.y;
    if (Math.hypot(dx, dy) > TAP_MOVEMENT_THRESHOLD_PX) wasDrag.current = true;
  }, []);
  const onPointerUpCapture = useCallback(() => {
    pointerDownAt.current = null;
  }, []);

  const handleSelectTerritory = useCallback(
    (id: number) => {
      if (wasDrag.current) return;
      selectTerritory(id);
    },
    [selectTerritory]
  );
  const handleBackgroundClick = useCallback(() => {
    if (wasDrag.current) return;
    selectTerritory(null);
  }, [selectTerritory]);

  const handleSearchSelect = useCallback(
    (id: number) => {
      selectTerritory(id);
      const seed = TERRITORIES[id]?.seed;
      if (seed) panTo(seed[0], seed[1], Math.max(transform.scale, 6));
    },
    [selectTerritory, panTo, transform.scale]
  );

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen?.();
    }
  }, []);

  // Map-mode → visual parameters. Each mode re-weights layers that already
  // exist rather than switching whole layers on/off — see
  // LeftToolbar.tsx's docstring.
  const politicalZoomOpacity = Math.max(0, Math.min(1, (transform.scale - 2.2) / 2));
  const politicalOpacity =
    mode === "politics" ? 1 : mode === "terrain" ? politicalZoomOpacity * 0.25 : politicalZoomOpacity;
  const colorMode = mode === "economy" ? "economy" : "ownership";

  const selectedKingdom = selectedTerritory?.kingdomId ? state.kingdoms[selectedTerritory.kingdomId] : null;

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
        onPointerDownCapture={onPointerDownCapture}
        onPointerMoveCapture={onPointerMoveCapture}
        onPointerUpCapture={onPointerUpCapture}
      >
        <defs>
          <linearGradient id="echelon-map-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#060810" />
            <stop offset="100%" stopColor="#0A0D14" />
          </linearGradient>
          <radialGradient id="echelon-map-ocean-vignette" cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#0C1420" stopOpacity="0" />
            <stop offset="100%" stopColor="#020306" stopOpacity="0.55" />
          </radialGradient>
          <clipPath id="echelon-land-clip">
            <path d={WORLD_LAND_PATH} fillRule="evenodd" />
          </clipPath>
        </defs>

        {/* 1. Water background */}
        <rect
          x={0}
          y={0}
          width={MAP_VIEWBOX_WIDTH}
          height={MAP_VIEWBOX_HEIGHT}
          fill="url(#echelon-map-ocean)"
          onClick={handleBackgroundClick}
        />
        <rect
          x={0}
          y={0}
          width={MAP_VIEWBOX_WIDTH}
          height={MAP_VIEWBOX_HEIGHT}
          fill="url(#echelon-map-ocean-vignette)"
          pointerEvents="none"
        />

        <g transform={transformString}>
          {/* 2 & 3. Base land + terrain relief */}
          <TerrainLayer showClassification={showTerrainColors} zoomScale={transform.scale} />
          {/* 4. Lakes */}
          <LakeLayer />
          {/* 5. Rivers */}
          <RiverLayer />
          {/* 6. Political overlay — fictional Echelon territories/kingdoms */}
          <PoliticalLayer
            opacity={politicalOpacity}
            colorMode={colorMode}
            emphasize={mode === "politics"}
            territories={state.territories}
            kingdoms={state.kingdoms}
            selectedTerritoryId={state.selectedTerritoryId}
            annexableNeighbors={annexableNeighbors}
            onSelectTerritory={handleSelectTerritory}
          />
          {/* 7. Coastline */}
          <PhysicalGeographyLayer />
          {/* 8. Labels — seas, summits, settlements */}
          <LabelLayer
            zoomScale={transform.scale}
            territories={state.territories}
            kingdoms={state.kingdoms}
            forceReveal={mode === "cities"}
            emphasizeResources={mode === "resources"}
          />
        </g>
      </svg>

      <MapHud
        onToggleFullscreen={toggleFullscreen}
        mode={mode}
        onModeChange={setMode}
        historyOpen={historyOpen}
        onToggleHistory={() => setHistoryOpen((v) => !v)}
        territories={state.territories}
        onSelectTerritory={handleSearchSelect}
      />
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        kingdoms={state.kingdoms}
        history={state.history}
      />
      <LeftToolbar mode={mode} onChange={setMode} />
      <MapControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onRecenter={reset}
        onToggleLayers={() => setShowTerrainColors((v) => !v)}
        layersActive={showTerrainColors}
      />
      <MapCompassHud transform={transform} containerSize={containerSize} />
      <RegionMinimap
        transform={transform}
        containerSize={containerSize}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onToggleFullscreen={toggleFullscreen}
      />
      <TerritoryInfoPanel
        territory={selectedTerritory}
        kingdom={selectedKingdom}
        kingdoms={state.kingdoms}
        territories={state.territories}
        annexableNeighbors={annexableNeighbors}
        onClose={() => selectTerritory(null)}
        onDevelop={developTerritory}
        onFormKingdom={formKingdom}
        onAnnex={annexTerritory}
        onProposeTrade={proposeTrade}
      />
    </div>
  );
}
