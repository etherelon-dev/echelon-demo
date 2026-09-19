"use client";

import { X } from "lucide-react";

import type { HistoryEvent, Kingdom, KingdomId } from "@/lib/game/types";

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
  kingdoms: Record<KingdomId, Kingdom>;
  history: HistoryEvent[];
}

/**
 * Combined "Regions" + "History" overlay — a compact list of every
 * kingdom the player has formed, and the full chronological event log
 * underneath. One panel instead of two separate ones: on a demo with a
 * handful of kingdoms and a few dozen events, splitting these into
 * separate modal panels would mean more chrome than content.
 */
export default function HistoryPanel({ open, onClose, kingdoms, history }: HistoryPanelProps) {
  if (!open) return null;

  const kingdomList = Object.values(kingdoms);
  const events = history.slice().reverse();

  return (
    <div className="absolute inset-x-0 top-12 z-20 mx-auto max-h-[80%] w-[min(92vw,26rem)] overflow-y-auto rounded-b-lg border border-t-0 border-gold-500/25 bg-ink-900/95 p-4 sm:top-14">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-bone">
          Regions &amp; History
        </h2>
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
        <p className="mb-1.5 text-[11px] uppercase tracking-[0.14em] text-bone-faint">
          Kingdoms ({kingdomList.length})
        </p>
        {kingdomList.length === 0 ? (
          <p className="text-xs text-bone-faint">No kingdoms have been formed yet.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {kingdomList.map((k) => (
              <li key={k.id} className="flex items-center gap-2 text-sm text-bone">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: k.color }}
                  aria-hidden="true"
                />
                {k.name}
                <span className="text-xs text-bone-faint">
                  · {k.memberTerritoryIds.length} territor{k.memberTerritoryIds.length === 1 ? "y" : "ies"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 border-t border-bone/10 pt-3">
        <p className="mb-1.5 text-[11px] uppercase tracking-[0.14em] text-bone-faint">Chronicle</p>
        <ul className="flex flex-col gap-2">
          {events.map((event) => (
            <li key={event.id} className="text-sm">
              <span className="mr-2 font-display text-[11px] uppercase tracking-[0.1em] text-gold-400/80">
                Year {String(event.year).padStart(2, "0")}
              </span>
              <span className="text-bone-dim">{event.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
