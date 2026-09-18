"use client";

import { X } from "lucide-react";

import type { Kingdom, KingdomId, TerritoryId, TerritoryState } from "@/lib/game/types";
import { RESOURCE_LABELS } from "@/lib/game/types";

interface TerritoryInfoPanelProps {
  territory: TerritoryState | null;
  kingdom: Kingdom | null;
  kingdoms: Record<KingdomId, Kingdom>;
  territories: Record<TerritoryId, TerritoryState>;
  annexableNeighbors: TerritoryId[];
  onClose: () => void;
  onDevelop: (id: TerritoryId) => void;
  onFormKingdom: (id: TerritoryId) => void;
  onAnnex: (kingdomId: KingdomId, territoryId: TerritoryId) => void;
  onProposeTrade: (kingdomIdA: KingdomId, kingdomIdB: KingdomId) => void;
}

const ECONOMIC_POWER_LABEL: Record<string, string> = {
  minor: "Minor",
  modest: "Modest",
  moderate: "Moderate",
  strong: "Strong",
  dominant: "Dominant"
};

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between border-b border-bone/5 py-2">
      <span className="text-[11px] uppercase tracking-[0.14em] text-bone-faint">{label}</span>
      <span className="text-sm text-bone">{value}</span>
    </div>
  );
}

const actionButtonClasses =
  "w-full rounded-sm border border-gold-500/30 bg-gold-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-gold-300 transition-colors duration-200 hover:bg-gold-500/20 disabled:cursor-not-allowed disabled:border-bone/10 disabled:bg-transparent disabled:text-bone-faint";

/**
 * Territory selection panel — fixed panel on the right on desktop, a
 * bottom sheet on mobile (same component, responsive classes only, per
 * the brief's "same component" expectation for this kind of pairing —
 * see PoliticalLayer/LabelLayer for the pattern). Renders nothing when no
 * territory is selected, so callers don't need their own visibility
 * check.
 */
export default function TerritoryInfoPanel({
  territory,
  kingdom,
  kingdoms,
  territories,
  annexableNeighbors,
  onClose,
  onDevelop,
  onFormKingdom,
  onAnnex,
  onProposeTrade
}: TerritoryInfoPanelProps) {
  if (!territory) return null;

  const otherKingdoms = Object.values(kingdoms).filter(
    (k) => k.id !== kingdom?.id && !kingdom?.tradePartners.includes(k.id)
  );

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-20 max-h-[85%] overflow-y-auto rounded-t-lg border-t border-gold-500/25 bg-ink-900/95 p-4 backdrop-blur-md sm:inset-y-0 sm:bottom-auto sm:right-0 sm:left-auto sm:h-full sm:w-80 sm:max-h-none sm:rounded-none sm:rounded-l-lg sm:border-t-0 sm:border-l"
      role="dialog"
      aria-label={`${territory.name} territory details`}
    >
      <div className="flex items-start justify-between">
        <div>
          {kingdom && (
            <div className="mb-1 flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: kingdom.color }}
                aria-hidden="true"
              />
              <span className="text-[11px] uppercase tracking-[0.16em] text-bone-dim">
                {kingdom.name}
              </span>
            </div>
          )}
          <h2 className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-bone">
            {territory.name}
          </h2>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center text-bone-dim transition-colors hover:text-gold-300"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-3">
        <StatRow label="Population" value={territory.population.toLocaleString()} />
        <StatRow label="Development" value={`Level ${territory.development}`} />
        <StatRow
          label="Resources"
          value={territory.resources.map((r) => RESOURCE_LABELS[r]).join(", ")}
        />
        <StatRow label="Infrastructure" value={`${territory.infrastructure} / 100`} />
        <StatRow label="Economic Power" value={ECONOMIC_POWER_LABEL[territory.economicPower]} />
        <StatRow label="Stability" value={`${territory.stability}%`} />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          className={actionButtonClasses}
          disabled={territory.development >= 5}
          onClick={() => onDevelop(territory.id)}
        >
          {territory.development >= 5 ? "Fully Developed" : "Develop Territory"}
        </button>

        {!kingdom && (
          <button type="button" className={actionButtonClasses} onClick={() => onFormKingdom(territory.id)}>
            Form Kingdom
          </button>
        )}

        {kingdom && annexableNeighbors.length > 0 && (
          <div className="rounded-sm border border-bone/10 p-2.5">
            <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-bone-faint">
              Annex neighboring territory
            </p>
            <div className="flex flex-col gap-1.5">
              {annexableNeighbors.slice(0, 5).map((neighborId) => (
                <button
                  key={neighborId}
                  type="button"
                  className="rounded-sm border border-bone/10 px-2.5 py-1.5 text-left text-xs text-bone-dim transition-colors hover:border-gold-500/40 hover:text-gold-300"
                  onClick={() => onAnnex(kingdom.id, neighborId)}
                >
                  {territories[neighborId]?.name ?? `Territory ${neighborId}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {kingdom && otherKingdoms.length > 0 && (
          <div className="rounded-sm border border-bone/10 p-2.5">
            <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-bone-faint">
              Propose trade agreement
            </p>
            <div className="flex flex-col gap-1.5">
              {otherKingdoms.slice(0, 5).map((other) => (
                <button
                  key={other.id}
                  type="button"
                  className="flex items-center gap-1.5 rounded-sm border border-bone/10 px-2.5 py-1.5 text-left text-xs text-bone-dim transition-colors hover:border-gold-500/40 hover:text-gold-300"
                  onClick={() => onProposeTrade(kingdom.id, other.id)}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: other.color }}
                    aria-hidden="true"
                  />
                  {other.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {kingdom && kingdom.tradePartners.length > 0 && (
          <p className="text-[11px] text-bone-faint">
            Trading with: {kingdom.tradePartners.map((id) => kingdoms[id]?.name).filter(Boolean).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
