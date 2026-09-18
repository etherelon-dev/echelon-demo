"use client";

import { useMemo } from "react";

import type { Kingdom, KingdomId, TerritoryId, TerritoryState } from "@/lib/game/types";
import { RESOURCE_LABELS } from "@/lib/game/types";
import { PROJECTED_PEAKS, PROJECTED_WATER_LABELS } from "@/lib/geo/terrainGeometry";
import { TERRITORIES } from "@/lib/geo/territoryGeometry";

interface LabelLayerProps {
  zoomScale: number;
  territories: Record<TerritoryId, TerritoryState>;
  kingdoms: Record<KingdomId, Kingdom>;
  /** CITIES map mode — reveal every settlement name regardless of zoom. */
  forceReveal?: boolean;
  /** RESOURCES map mode — show each settlement's primary resource under
   * its name instead of just the name. */
  emphasizeResources?: boolean;
}

/** A label that keeps a constant on-screen size regardless of the map's
 * current zoom — translate happens in the (zoomed) parent coordinate
 * space, then a local counter-scale cancels the parent's zoom out again,
 * the same trick vectorEffect="non-scaling-stroke" achieves for strokes,
 * which SVG has no text equivalent for. */
function ScaleStableLabel({
  x,
  y,
  zoomScale,
  opacity,
  children
}: {
  x: number;
  y: number;
  zoomScale: number;
  opacity: number;
  children: React.ReactNode;
}) {
  if (opacity <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${1 / zoomScale})`} style={{ opacity }}>
      {children}
    </g>
  );
}

const fadeIn = (scale: number, from: number, to: number) =>
  Math.max(0, Math.min(1, (scale - from) / (to - from)));

/**
 * Layer — map labels.
 *
 * Three label families, each with its own zoom band, per the semantic-zoom
 * brief: sea/ocean names (always for the handful of largest bodies, the
 * rest fading in from the regional band); mountain summit names (from the
 * territory band); and territory/kingdom names plus settlement points
 * (from the territory band, in step with PoliticalLayer's own opacity).
 * Settlement points are the top territories by generated population
 * (lib/game/territories.ts) — not a separate hand-placed dataset, so
 * "which places count as cities" always matches the world the player is
 * actually looking at. All text uses the serif map-label font (see
 * app/layout.tsx) to read as geography, distinct from the UI's own
 * display/body type.
 */
export default function LabelLayer({
  zoomScale,
  territories,
  kingdoms,
  forceReveal = false,
  emphasizeResources = false
}: LabelLayerProps) {
  const settlements = useMemo(() => {
    return Object.values(territories)
      .slice()
      .sort((a, b) => b.population - a.population)
      .slice(0, 24)
      .map((t, rank) => ({ ...t, rank, seed: TERRITORIES[t.id].seed }));
  }, [territories]);

  const territoryLabelOpacity = fadeIn(zoomScale, 4, 5.5);
  const summitLabelOpacity = fadeIn(zoomScale, 4.5, 6.5);
  const minorWaterOpacity = fadeIn(zoomScale, 1.4, 2.6);

  return (
    <g pointerEvents="none">
      {/* Sea / ocean names */}
      {PROJECTED_WATER_LABELS.map((label) => (
        <ScaleStableLabel
          key={label.name}
          x={label.x}
          y={label.y}
          zoomScale={zoomScale}
          opacity={label.tier === "ocean" ? 1 : minorWaterOpacity}
        >
          <text
            textAnchor="middle"
            className="font-map-label italic"
            fontSize={label.tier === "ocean" ? 13 : 9.5}
            fill="#D7DEE6"
            fillOpacity={0.82}
            letterSpacing="0.04em"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
          >
            {label.name}
          </text>
        </ScaleStableLabel>
      ))}

      {/* Mountain summit names */}
      {PROJECTED_PEAKS.filter((p) => p.tier === "major").map((peak) => (
        <ScaleStableLabel
          key={peak.name}
          x={peak.x}
          y={peak.y - 9}
          zoomScale={zoomScale}
          opacity={summitLabelOpacity}
        >
          <text
            textAnchor="middle"
            className="font-map-label italic"
            fontSize={7}
            fill="#EDEFF2"
            fillOpacity={0.85}
            letterSpacing="0.03em"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
          >
            {peak.name}
          </text>
        </ScaleStableLabel>
      ))}

      {/* Settlements — dot + name, top territories by population */}
      {settlements.map((settlement) => {
        const isMajor = settlement.rank < 6;
        const dotOpacity = isMajor ? 1 : forceReveal ? 1 : fadeIn(zoomScale, 2.5, 3.8);
        const nameOpacity = forceReveal
          ? 1
          : isMajor
            ? fadeIn(zoomScale, 1.6, 2.8)
            : territoryLabelOpacity;
        const kingdom = settlement.kingdomId ? kingdoms[settlement.kingdomId] : null;
        return (
          <ScaleStableLabel
            key={settlement.id}
            x={settlement.seed[0]}
            y={settlement.seed[1]}
            zoomScale={zoomScale}
            opacity={Math.max(dotOpacity, nameOpacity)}
          >
            <circle
              r={isMajor ? 2.6 : 1.8}
              fill={kingdom ? kingdom.color : "#D0AD79"}
              stroke="#0A0D14"
              strokeWidth={0.6}
              style={{ opacity: dotOpacity }}
            />
            <text
              x={0}
              y={-5}
              textAnchor="middle"
              className="font-display uppercase"
              fontSize={5.5}
              fontWeight={600}
              fill="#ECEAE5"
              letterSpacing="0.08em"
              style={{ opacity: nameOpacity, textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}
            >
              {settlement.name}
            </text>
            {emphasizeResources && settlement.resources[0] && (
              <text
                x={0}
                y={8}
                textAnchor="middle"
                className="font-display uppercase"
                fontSize={4.5}
                fill="#D0AD79"
                letterSpacing="0.1em"
                style={{ opacity: nameOpacity, textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}
              >
                {RESOURCE_LABELS[settlement.resources[0]]}
              </text>
            )}
          </ScaleStableLabel>
        );
      })}
    </g>
  );
}
