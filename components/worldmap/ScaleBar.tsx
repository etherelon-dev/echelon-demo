"use client";

import { visibleCanonicalBBoxForContainer, type FocusTransform } from "@/lib/geo/focus";
import { pickScaleBarReading } from "@/lib/geo/scale";
import { MAP_VIEWBOX_HEIGHT, MAP_VIEWBOX_WIDTH } from "@/lib/geo/worldMapGeometry";

interface ScaleBarProps {
  transform: FocusTransform;
  containerSize: { width: number; height: number };
}

/**
 * A real, recalculated-every-render distance scale — never a hardcoded
 * "0 500 1000 1500 km" image. Reads the currently visible canonical bbox
 * (same helper the minimaps use) to get both the current px-per-canonical
 * ratio and the latitude to measure km at, then lib/geo/scale.ts picks a
 * round km value that lands close to a target pixel width.
 */
export default function ScaleBar({ transform, containerSize }: ScaleBarProps) {
  if (containerSize.width === 0) return null;

  const view = visibleCanonicalBBoxForContainer(
    transform,
    MAP_VIEWBOX_WIDTH,
    MAP_VIEWBOX_HEIGHT,
    containerSize.width,
    containerSize.height
  );
  const visibleWidth = view.maxX - view.minX;
  if (visibleWidth <= 0) return null;

  const pxPerCanonicalUnit = containerSize.width / visibleWidth;
  const centerY = (view.minY + view.maxY) / 2;
  const reading = pickScaleBarReading(pxPerCanonicalUnit, centerY, 84);

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center" style={{ width: reading.widthPx }}>
        <div className="h-2 w-px bg-bone/50" />
        <div className="h-px flex-1 bg-bone/50" />
        <div className="h-2 w-px bg-bone/50" />
      </div>
      <span className="font-display text-[10px] tracking-wide text-bone-dim">
        {reading.km.toLocaleString()} km
      </span>
    </div>
  );
}
