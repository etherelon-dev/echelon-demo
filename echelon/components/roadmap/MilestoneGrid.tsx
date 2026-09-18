"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import MilestoneCard from "@/components/roadmap/MilestoneCard";
import type { MilestoneVariant, RoadmapMilestone } from "@/types/roadmap";

type MilestoneGridProps = {
  milestones: RoadmapMilestone[];
  variant?: MilestoneVariant;
};

type MilestoneViewFilter = "all" | "done" | "remaining";

const COLLAPSED_COUNT = 8;

export default function MilestoneGrid({
  milestones,
  variant = "milestone"
}: MilestoneGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewFilter, setViewFilter] = useState<MilestoneViewFilter>("all");

  const doneCount = useMemo(
    () => milestones.filter((milestone) => milestone.done).length,
    [milestones]
  );

  const hasDoneData = variant === "milestone" && doneCount > 0;

  const filteredMilestones = useMemo(() => {
    if (!hasDoneData || viewFilter === "all") return milestones;
    if (viewFilter === "done") {
      return milestones.filter((milestone) => milestone.done);
    }
    return milestones.filter((milestone) => !milestone.done);
  }, [milestones, viewFilter, hasDoneData]);

  const canCollapse = filteredMilestones.length > COLLAPSED_COUNT;
  const visibleMilestones =
    isExpanded || !canCollapse
      ? filteredMilestones
      : filteredMilestones.slice(0, COLLAPSED_COUNT);

  return (
    <div className="flex flex-col gap-4">
      {hasDoneData ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] tracking-[0.14em] text-bone-faint">
            {doneCount} OF {milestones.length} LIVE ON THE SITE TODAY
          </span>
          <div className="flex items-center gap-1.5">
            {(
              [
                { label: "ALL", value: "all" },
                { label: "LIVE", value: "done" },
                { label: "REMAINING", value: "remaining" }
              ] as { label: string; value: MilestoneViewFilter }[]
            ).map((option) => {
              const isActive = viewFilter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setViewFilter(option.value)}
                  className={`rounded-full border px-3 py-1 text-[10px] tracking-[0.1em] transition-all duration-200 ${
                    isActive
                      ? "border-gold-500/60 bg-gold-500/10 text-gold-300"
                      : "border-ink-500 bg-ink-800/40 text-bone-faint hover:scale-105 hover:border-gold-500/40 hover:text-gold-300"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {filteredMilestones.length === 0 ? (
        <p className="rounded-sm border border-dashed border-ink-500 px-4 py-6 text-center text-xs text-bone-faint">
          Nothing in this view yet.
        </p>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {visibleMilestones.map((milestone, index) => (
            <MilestoneCard
              key={milestone.label}
              milestone={milestone}
              variant={variant}
              index={index}
            />
          ))}
        </div>
      )}

      {canCollapse ? (
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="inline-flex w-fit items-center gap-2 self-center rounded-full border border-ink-500 px-4 py-2 text-xs tracking-[0.12em] text-bone-dim transition-all duration-200 hover:scale-105 hover:border-gold-500/50 hover:text-gold-300"
        >
          {isExpanded ? (
            <>
              COLLAPSE ALL
              <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} />
            </>
          ) : (
            <>
              SHOW ALL {variant === "category" ? "CATEGORIES" : "MILESTONES"} (
              {filteredMilestones.length})
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}
