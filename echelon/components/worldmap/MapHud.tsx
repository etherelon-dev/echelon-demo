"use client";

import { useState } from "react";
import { Layers, Map as MapIcon, Maximize2, Scroll, Search, Settings, Users } from "lucide-react";

import CompassMark from "@/components/worldmap/CompassMark";
import type { MapMode } from "@/components/worldmap/LeftToolbar";
import type { TerritoryId, TerritoryState } from "@/lib/game/types";
import { APP_VERSION } from "@/lib/version";

interface MapHudProps {
  onToggleFullscreen: () => void;
  mode: MapMode;
  onModeChange: (mode: MapMode) => void;
  historyOpen: boolean;
  onToggleHistory: () => void;
  territories: Record<TerritoryId, TerritoryState>;
  onSelectTerritory: (id: TerritoryId) => void;
}

const MODES: Array<{ id: MapMode; label: string }> = [
  { id: "world", label: "World" },
  { id: "terrain", label: "Terrain" },
  { id: "resources", label: "Resources" },
  { id: "cities", label: "Cities" },
  { id: "economy", label: "Economy" },
  { id: "politics", label: "Politics" }
];

/**
 * Slim strategy-game navigation strip that sits above the map itself —
 * deliberately not the site's full marketing <Navbar>, which the project
 * brief calls out as exactly the wrong feel here ("do not create a full
 * dashboard navbar over the map"). Community/settings are visually present
 * (matching the reference) but inert — there's no account or community
 * system yet to open, and a dead link would be worse than a disabled icon.
 *
 * MAP / REGIONS / LAYERS / SEARCH tabs added for the visual-reference
 * upgrade: MAP resets the map-mode selector to its default; REGIONS opens
 * the kingdoms + chronicle overlay (HistoryPanel); LAYERS is the mobile
 * equivalent of LeftToolbar's mode strip (same MapMode, a dropdown instead
 * of a persistent strip, since LeftToolbar hides below the sm breakpoint);
 * SEARCH finds a territory by name and selects it. The Layers/Search
 * dropdown panels render full-width on mobile and anchored top-right on
 * desktop, from a single trigger each (icon-only under md, labeled tab at
 * md+) so mobile and desktop share one open/closed state instead of two.
 */
export default function MapHud({
  onToggleFullscreen,
  mode,
  onModeChange,
  historyOpen,
  onToggleHistory,
  territories,
  onSelectTerritory
}: MapHudProps) {
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const iconButtonClasses =
    "flex h-7 w-7 items-center justify-center text-bone-dim/70 transition-colors duration-200 hover:text-gold-300 disabled:cursor-default disabled:hover:text-bone-dim/70";

  const tabClasses = (active: boolean) =>
    `font-display text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 ${
      active ? "text-gold-300" : "text-bone-dim/80 hover:text-bone"
    }`;

  const openLayers = () => {
    setLayersMenuOpen((v) => !v);
    setSearchOpen(false);
  };
  const openSearch = () => {
    setSearchOpen((v) => !v);
    setLayersMenuOpen(false);
  };

  const searchResults = query.trim()
    ? Object.values(territories)
        .filter((t) => t.name.toLowerCase().includes(query.trim().toLowerCase()))
        .slice(0, 8)
    : [];

  return (
    <div className="absolute inset-x-0 top-0 z-30">
      <div className="flex h-12 items-center justify-between border-b border-gold-500/20 bg-ink-900/70 px-4 backdrop-blur-sm sm:h-14 sm:px-6">
        <a href="/" className="flex items-center gap-2.5">
          <CompassMark size={20} />
          <span className="font-display text-sm font-semibold tracking-[0.28em] text-bone sm:text-base">
            ECHELON
          </span>
        </a>

        <nav className="hidden items-center gap-5 md:flex">
          <button type="button" className={tabClasses(mode === "world")} onClick={() => onModeChange("world")}>
            Map
          </button>
          <button type="button" className={tabClasses(historyOpen)} onClick={onToggleHistory}>
            Regions
          </button>
          <button type="button" className={tabClasses(layersMenuOpen)} onClick={openLayers}>
            Layers
          </button>
          <button type="button" className={tabClasses(searchOpen)} onClick={openSearch}>
            Search
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden text-[10px] tracking-[0.2em] text-bone-faint sm:inline">
            v{APP_VERSION}
          </span>
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
          {/* Compact mobile equivalents of the Map/Regions/Layers/Search tabs */}
          <div className="flex items-center gap-1 md:hidden">
            <button type="button" aria-label="Map" className={iconButtonClasses} onClick={() => onModeChange("world")}>
              <MapIcon className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Regions and history"
              className={iconButtonClasses}
              onClick={onToggleHistory}
            >
              <Scroll className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button type="button" aria-label="Layers" className={iconButtonClasses} onClick={openLayers}>
              <Layers className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button type="button" aria-label="Search" className={iconButtonClasses} onClick={openSearch}>
              <Search className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {layersMenuOpen && (
        <div className="mx-4 mt-1.5 rounded-sm border border-bone/10 bg-ink-900/95 p-1 backdrop-blur-md sm:absolute sm:right-6 sm:mx-0 sm:w-40">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onModeChange(m.id);
                setLayersMenuOpen(false);
              }}
              className={`block w-full rounded-sm px-2.5 py-1.5 text-left text-xs uppercase tracking-[0.1em] transition-colors ${
                mode === m.id ? "bg-gold-500/15 text-gold-300" : "text-bone-dim hover:bg-bone/5"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {searchOpen && (
        <div className="mx-4 mt-1.5 rounded-sm border border-bone/10 bg-ink-900/95 p-2 backdrop-blur-md sm:absolute sm:right-6 sm:mx-0 sm:w-56">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a territory…"
            className="w-full rounded-sm border border-bone/15 bg-ink-800 px-2 py-1.5 text-xs text-bone placeholder:text-bone-faint focus:border-gold-500/40 focus:outline-none"
          />
          {searchResults.length > 0 && (
            <ul className="mt-1.5 max-h-48 overflow-y-auto">
              {searchResults.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className="block w-full rounded-sm px-2 py-1.5 text-left text-xs text-bone-dim hover:bg-bone/5 hover:text-gold-300"
                    onClick={() => {
                      onSelectTerritory(t.id);
                      setSearchOpen(false);
                      setQuery("");
                    }}
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
