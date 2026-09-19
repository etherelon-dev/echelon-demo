"use client";

import { ChevronDown, ChevronUp, Maximize2 } from "lucide-react";
import { visibleCanonicalBBoxForContainer, type FocusTransform } from "@/lib/geo/focus";
import { MAP_VIEWBOX_HEIGHT, MAP_VIEWBOX_WIDTH, WORLD_LAND_PATH } from "@/lib/geo/worldMapGeometry";

interface RegionMinimapProps {
  transform: FocusTransform;
  /** The main map <svg>'s live rendered size — see useElementSize's
   * docstring — so the indicator rectangle matches what "slice" actually
   * shows instead of the full (partially cropped-off) viewBox. */
  containerSize: { width: number; height: number };
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
}

const PANEL_WIDTH = 132;
const PANEL_HEIGHT = PANEL_WIDTH * (MAP_VIEWBOX_HEIGHT / MAP_VIEWBOX_WIDTH);

/**
 * Rectangular world-overview panel, bottom-right — same idea as
 * WorldMinimap, plus a small utility strip (fullscreen, zoom shortcuts)
 * echoing the reference layout. Hidden on small screens per the spec
 * ("hide non-essential minimap elements if necessary" on mobile).
 */
export default function RegionMinimap({
  transform,
  containerSize,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen
}: RegionMinimapProps) {
  const view = visibleCanonicalBBoxForContainer(
    transform,
    MAP_VIEWBOX_WIDTH,
    MAP_VIEWBOX_HEIGHT,
    containerSize.width,
    containerSize.height
  );
  const iconClasses =
    "flex h-7 w-7 items-center justify-center border border-bone/15 bg-ink-900/80 text-bone-dim transition-colors duration-200 hover:border-gold-500/40 hover:text-gold-300";

  return (
    <div className="absolute bottom-4 right-4 z-10 hidden items-stretch gap-1.5 sm:flex sm:bottom-6 sm:right-6">
      <div
        className="overflow-hidden rounded-sm border border-gold-500/25 bg-ink-900/85 p-1.5"
        style={{ width: PANEL_WIDTH }}
      >
        <svg
          viewBox={`0 0 ${MAP_VIEWBOX_WIDTH} ${MAP_VIEWBOX_HEIGHT}`}
          width={PANEL_WIDTH - 12}
          height={PANEL_HEIGHT}
          aria-hidden="true"
        >
          <path d={WORLD_LAND_PATH} fill="#33362D" fillRule="evenodd" />
          <rect
            x={view.minX}
            y={view.minY}
            width={Math.max(2, view.maxX - view.minX)}
            height={Math.max(2, view.maxY - view.minY)}
            fill="none"
            stroke="#E1C594"
            strokeWidth={3}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-px overflow-hidden rounded-sm border border-bone/10">
        <button type="button" aria-label="Toggle fullscreen" onClick={onToggleFullscreen} className={iconClasses}>
          <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
        <button type="button" aria-label="Zoom in" onClick={onZoomIn} className={iconClasses}>
          <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
        <button type="button" aria-label="Zoom out" onClick={onZoomOut} className={iconClasses}>
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
