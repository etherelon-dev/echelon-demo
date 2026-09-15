"use client";

import { Maximize2, Settings, Users } from "lucide-react";
import CompassMark from "@/components/worldmap/CompassMark";

interface MapHudProps {
  onToggleFullscreen: () => void;
}

/**
 * Slim strategy-game navigation strip that sits above the map itself —
 * deliberately not the site's full marketing <Navbar>, which the project
 * brief calls out as exactly the wrong feel here ("do not create a full
 * dashboard navbar over the map"). Community/settings are visually present
 * (matching the reference) but inert — there's no account or community
 * system yet to open, and a dead link would be worse than a disabled icon.
 */
export default function MapHud({ onToggleFullscreen }: MapHudProps) {
  const iconButtonClasses =
    "flex h-7 w-7 items-center justify-center text-bone-dim/70 transition-colors duration-200 hover:text-gold-300 disabled:cursor-default disabled:hover:text-bone-dim/70";

  return (
    <div className="absolute inset-x-0 top-0 z-10 flex h-12 items-center justify-between border-b border-gold-500/20 bg-ink-900/70 px-4 backdrop-blur-sm sm:h-14 sm:px-6">
      <a href="/" className="flex items-center gap-2.5">
        <CompassMark size={20} />
        <span className="font-display text-sm font-semibold tracking-[0.28em] text-bone sm:text-base">
          ECHELON
        </span>
      </a>

      <div className="flex items-center gap-4">
        <span className="rounded-sm border border-gold-500/30 px-2 py-0.5 text-[10px] tracking-[0.25em] text-gold-300/90">
          DEMO
        </span>
        <div className="hidden items-center gap-1 sm:flex">
          <button
            type="button"
            aria-label="Community (coming soon)"
            title="Coming soon"
            className={iconButtonClasses}
            disabled
          >
            <Users className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Settings (coming soon)"
            title="Coming soon"
            className={iconButtonClasses}
            disabled
          >
            <Settings className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Toggle fullscreen"
            onClick={onToggleFullscreen}
            className={iconButtonClasses}
          >
            <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
