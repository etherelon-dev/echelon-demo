"use client";

import type { RoadmapPhase, RoadmapStatus } from "@/types/roadmap";
import { roadmapStatusLabels } from "@/lib/content/roadmap";

type PhaseNodeProps = {
  phase: RoadmapPhase;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

const markerClasses: Record<RoadmapStatus, string> = {
  completed: "border-gold-400 bg-gold-500/20 text-gold-300",
  current: "border-gold-400 bg-gold-500/20 text-gold-300",
  confirmed: "border-gold-500/70 bg-ink-800 text-gold-300",
  planned: "border-ink-500 bg-ink-800 text-bone-faint",
  "coming-soon": "border-dashed border-gold-500/60 bg-ink-800 text-gold-300"
};

const statusTextClasses: Record<RoadmapStatus, string> = {
  completed: "text-gold-300",
  current: "text-gold-300",
  confirmed: "text-gold-300",
  planned: "text-bone-faint",
  "coming-soon": "text-gold-300"
};

export default function PhaseNode({
  phase,
  isSelected,
  onSelect
}: PhaseNodeProps) {
  const Icon = phase.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(phase.id)}
      aria-expanded={isSelected}
      aria-controls={`phase-detail-${phase.id}`}
      className={`group flex w-full items-start gap-4 rounded-sm border px-3 py-3 text-left transition-all duration-300 ${
        isSelected
          ? "border-gold-500/50 bg-ink-800/70"
          : "border-transparent hover:border-ink-500 hover:bg-ink-800/40"
      }`}
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
        {phase.status === "current" ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-gold-400 animate-marker-pulse"
          />
        ) : null}
        <span
          aria-hidden="true"
          className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
            markerClasses[phase.status]
          } ${isSelected ? "ring-2 ring-gold-400/40 ring-offset-2 ring-offset-ink-900" : ""}`}
        >
          {phase.status === "coming-soon" ? (
            <span className="font-display text-base leading-none">∞</span>
          ) : (
            <Icon className="h-4 w-4" strokeWidth={1.5} />
          )}
        </span>
      </span>

      <span className="flex flex-1 flex-col gap-1 pt-1">
        <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className="text-[11px] tracking-[0.16em] text-bone-faint">
            PHASE {phase.number}
          </span>
          <span
            className={`text-[10px] tracking-[0.12em] ${statusTextClasses[phase.status]}`}
          >
            {roadmapStatusLabels[phase.status]}
          </span>
        </span>
        <span className="font-display text-base font-medium text-bone transition-colors duration-200 group-hover:text-gold-200 sm:text-lg">
          {phase.title.toUpperCase()}
        </span>
        <span className="text-xs leading-relaxed text-bone-dim sm:text-sm">
          {phase.narrative}
        </span>
      </span>
    </button>
  );
}
