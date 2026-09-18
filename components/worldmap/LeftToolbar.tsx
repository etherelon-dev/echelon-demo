"use client";

import { Coins, Crown, Globe2, Landmark, Mountain, Warehouse } from "lucide-react";

export type MapMode = "world" | "terrain" | "resources" | "cities" | "economy" | "politics";

interface LeftToolbarProps {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
}

const MODES: Array<{ id: MapMode; label: string; icon: typeof Globe2 }> = [
  { id: "world", label: "World", icon: Globe2 },
  { id: "terrain", label: "Terrain", icon: Mountain },
  { id: "resources", label: "Resources", icon: Warehouse },
  { id: "cities", label: "Cities", icon: Landmark },
  { id: "economy", label: "Economy", icon: Coins },
  { id: "politics", label: "Politics", icon: Crown }
];

/**
 * Left vertical map-mode toolbar, desktop only (see MapHud's "Layers" tab
 * for the mobile equivalent — same MapMode, a dropdown instead of a
 * persistent strip). Single-select: each mode re-weights what's already
 * on the map (how strongly political fills show, whether settlement names
 * force-reveal, whether territories tint by economic power) rather than
 * turning whole layers on/off — see EchelonWorldMap's mode handling for
 * exactly what each one changes.
 */
export default function LeftToolbar({ mode, onChange }: LeftToolbarProps) {
  return (
    <div className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-px overflow-hidden rounded-sm border border-bone/10 sm:left-6 sm:flex">
      {MODES.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-label={label}
          aria-pressed={mode === id}
          title={label}
          onClick={() => onChange(id)}
          className={`flex h-9 w-9 items-center justify-center border border-bone/15 bg-ink-900/80 backdrop-blur-sm transition-colors duration-200 hover:border-gold-500/40 hover:text-gold-300 ${
            mode === id ? "bg-gold-500/15 text-gold-300" : "text-bone-dim"
          }`}
        >
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}
