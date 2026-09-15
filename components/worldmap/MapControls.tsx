"use client";

import { Crosshair, Layers, Minus, Plus } from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  onToggleLayers: () => void;
  layersActive: boolean;
}

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onRecenter,
  onToggleLayers,
  layersActive
}: MapControlsProps) {
  const buttonClasses =
    "flex h-9 w-9 items-center justify-center border border-bone/15 bg-ink-900/80 text-bone-dim backdrop-blur-sm transition-colors duration-200 hover:border-gold-500/40 hover:text-gold-300";

  return (
    <div className="absolute left-4 top-16 z-10 flex flex-col gap-px overflow-hidden rounded-sm border border-bone/10 sm:left-6 sm:top-20">
      <button type="button" aria-label="Zoom in" onClick={onZoomIn} className={buttonClasses}>
        <Plus className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <button type="button" aria-label="Zoom out" onClick={onZoomOut} className={buttonClasses}>
        <Minus className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <button type="button" aria-label="Recenter on Turkey" onClick={onRecenter} className={buttonClasses}>
        <Crosshair className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Toggle territory boundaries"
        aria-pressed={layersActive}
        onClick={onToggleLayers}
        className={`${buttonClasses} ${layersActive ? "text-gold-300" : ""}`}
      >
        <Layers className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
