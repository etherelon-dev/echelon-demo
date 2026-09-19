"use client";

import CompassMark from "@/components/worldmap/CompassMark";
import ScaleBar from "@/components/worldmap/ScaleBar";
import type { FocusTransform } from "@/lib/geo/focus";

interface MapCompassHudProps {
  transform: FocusTransform;
  containerSize: { width: number; height: number };
}

/**
 * Bottom-left HUD group — compass rose + scale bar, matching the
 * reference layout's lower-left corner. Takes WorldMinimap's old slot;
 * WorldMinimap itself is left in place, unmounted (see its own docstring)
 * rather than deleted, since a single rectangular minimap (RegionMinimap,
 * bottom-right) plus this corner already covers what both minimaps
 * together used to.
 */
export default function MapCompassHud({ transform, containerSize }: MapCompassHudProps) {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex items-end gap-3 sm:bottom-6 sm:left-6">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-bone/10 bg-ink-900/70">
        <span className="absolute top-0.5 font-display text-[8px] font-semibold text-bone-dim">N</span>
        <span className="absolute bottom-0.5 font-display text-[8px] font-semibold text-bone-faint">S</span>
        <span className="absolute left-1 font-display text-[8px] font-semibold text-bone-faint">W</span>
        <span className="absolute right-1 font-display text-[8px] font-semibold text-bone-faint">E</span>
        <CompassMark size={26} />
      </div>
      <div className="rounded-sm border border-bone/10 bg-ink-900/70 px-2.5 py-1.5">
        <ScaleBar transform={transform} containerSize={containerSize} />
      </div>
    </div>
  );
}
