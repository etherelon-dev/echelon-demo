"use client";

import type { Kingdom, KingdomId, TerritoryId, TerritoryState } from "@/lib/game/types";
import { TERRITORIES, TONE_COUNT } from "@/lib/geo/territoryGeometry";
import { MAP_VIEWBOX_WIDTH } from "@/lib/geo/worldMapGeometry";

/** Muted earth-tone variants for territories that belong to no kingdom yet
 * — subtle differentiation between cells, not political/ownership color. */
const UNCLAIMED_TONES = [
  "#2E3324", // dark olive
  "#3A2F22", // muted brown
  "#333730", // slate-green
  "#2A2E33", // muted gray-slate
  "#3A331F" // dark earth / muted ochre
];

/** "Economy" mode color ramp — a single gold hue deepening with economic
 * power, instead of ownership color, so wealth reads at a glance
 * regardless of who owns what. */
const ECONOMY_COLORS: Record<TerritoryState["economicPower"], string> = {
  minor: "#5A4530",
  modest: "#8F6B3E",
  moderate: "#B58A54",
  strong: "#D0AD79",
  dominant: "#E1C594"
};

interface PoliticalLayerProps {
  /** Fades the whole layer in past the world-scale view — territory
   * borders are strategic/local detail, not something a zoomed-out view
   * should show. Map-mode-driven (POLITICS forces this to 1; TERRAIN
   * dampens it) — see EchelonWorldMap's mode handling. */
  opacity: number;
  /** "ownership" (default) fills by kingdom color; "economy" (ECONOMY map
   * mode) fills every territory, owned or not, by its economic-power tier
   * instead — a wealth heatmap independent of who controls what. */
  colorMode: "ownership" | "economy";
  /** POLITICS map mode — stronger borders across the board, not just on
   * the selected/annexable territories. */
  emphasize: boolean;
  territories: Record<TerritoryId, TerritoryState>;
  kingdoms: Record<KingdomId, Kingdom>;
  selectedTerritoryId: TerritoryId | null;
  /** Unowned territories bordering the selected territory's kingdom, if
   * any — offered as "expand here" targets, drawn with an inviting dashed
   * accent instead of a flat fill. */
  annexableNeighbors: TerritoryId[];
  onSelectTerritory: (id: TerritoryId) => void;
}

/**
 * Layer — political ownership + territory selection.
 *
 * Every procedural territory (lib/geo/territoryGeometry.ts) gets a fill:
 * its kingdom's color at 15-35% opacity if it belongs to one (so the
 * terrain underneath stays readable — "WHAT THE LAND LOOKS LIKE" and "WHO
 * CONTROLS IT" both visible at once, per the brief), or a muted neutral
 * tone if it's unclaimed — unless `colorMode` is "economy", in which case
 * every territory is tinted by its economic-power tier instead. The
 * selected territory gets a brighter fill and a heavier border (no blur/glow
 * filter — too expensive to re-render on every pan/zoom); annexable
 * neighbors of the selected territory's kingdom get
 * a dashed invitation border. Clicking a territory calls
 * `onSelectTerritory` — actual drag-vs-tap disambiguation happens one
 * level up in EchelonWorldMap, since only it knows whether the current
 * pointer session was a pan.
 */
export default function PoliticalLayer({
  opacity,
  colorMode,
  emphasize,
  territories,
  kingdoms,
  selectedTerritoryId,
  annexableNeighbors,
  onSelectTerritory
}: PoliticalLayerProps) {
  if (opacity <= 0) return null;

  const annexableSet = new Set(annexableNeighbors);
  const borderWidth = MAP_VIEWBOX_WIDTH / 1400;

  return (
    <g clipPath="url(#echelon-land-clip)">
      <g style={{ opacity }}>
        {TERRITORIES.map((territory, index) => {
          const state = territories[index];
          const kingdom = state?.kingdomId ? kingdoms[state.kingdomId] : null;
          const isSelected = selectedTerritoryId === index;
          const isAnnexable = annexableSet.has(index);

          const economyFill = state ? ECONOMY_COLORS[state.economicPower] : UNCLAIMED_TONES[0];
          const ownershipFill = kingdom
            ? kingdom.color
            : UNCLAIMED_TONES[territory.toneIndex % TONE_COUNT];
          const fill = colorMode === "economy" ? economyFill : ownershipFill;
          const baseFillOpacity =
            colorMode === "economy" ? 0.38 : kingdom ? 0.26 : 0.32;
          const fillOpacity = isSelected ? Math.min(0.55, baseFillOpacity + 0.16) : baseFillOpacity;

          const strokeColor = colorMode === "economy" ? "#8F6B3E" : kingdom ? kingdom.color : "#8F6B3E";
          const baseStrokeOpacity =
            colorMode === "economy" ? 0.25 : kingdom ? 0.75 : 0.3;
          const strokeOpacity = emphasize ? Math.min(1, baseStrokeOpacity + 0.3) : baseStrokeOpacity;
          const strokeWidthMultiplier = emphasize ? 1.8 : 1;

          return (
            <path
              key={index}
              d={territory.path}
              fill={fill}
              fillOpacity={fillOpacity}
              stroke={strokeColor}
              strokeOpacity={strokeOpacity}
              strokeWidth={(isSelected ? borderWidth * 2.5 : borderWidth) * strokeWidthMultiplier}
              strokeDasharray={isAnnexable ? `${borderWidth * 3} ${borderWidth * 2}` : undefined}
              vectorEffect="non-scaling-stroke"
              className="cursor-pointer transition-[fill-opacity] duration-150"
              onClick={() => onSelectTerritory(index)}
            />
          );
        })}
      </g>
    </g>
  );
}
