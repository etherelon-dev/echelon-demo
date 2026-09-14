"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export default function MapControls({ onZoomIn, onZoomOut, onReset }: MapControlsProps) {
  const buttonClasses =
    "flex h-9 w-9 items-center justify-center border border-bone/15 bg-ink-900/80 text-bone-dim backdrop-blur-sm transition-colors duration-200 hover:border-gold-500/40 hover:text-gold-300";

  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-px overflow-hidden rounded-sm border border-bone/10 sm:bottom-6 sm:right-6">
      <button
        type="button"
        aria-label="Zoom in"
        onClick={onZoomIn}
        className={buttonClasses}
      >
        <Plus className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Zoom out"
        onClick={onZoomOut}
        className={buttonClasses}
      >
        <Minus className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Reset view"
        onClick={onReset}
        className={buttonClasses}
      >
        <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
