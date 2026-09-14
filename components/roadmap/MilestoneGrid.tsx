"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import MilestoneCard from "@/components/roadmap/MilestoneCard";
import type { MilestoneVariant, RoadmapMilestone } from "@/types/roadmap";

type MilestoneGridProps = {
  milestones: RoadmapMilestone[];
  variant?: MilestoneVariant;
};

const COLLAPSED_COUNT = 8;

export default function MilestoneGrid({
  milestones,
  variant = "milestone"
}: MilestoneGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const canCollapse = milestones.length > COLLAPSED_COUNT;
  const visibleMilestones =
    isExpanded || !canCollapse
      ? milestones
      : milestones.slice(0, COLLAPSED_COUNT);

  return (
    <div className="flex flex-col gap-4">
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

      {canCollapse ? (
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="inline-flex w-fit items-center gap-2 self-center rounded-full border border-ink-500 px-4 py-2 text-xs tracking-[0.12em] text-bone-dim transition-colors duration-200 hover:border-gold-500/50 hover:text-gold-300"
        >
          {isExpanded ? (
            <>
              COLLAPSE ALL
              <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} />
            </>
          ) : (
            <>
              SHOW ALL {variant === "category" ? "CATEGORIES" : "MILESTONES"} (
              {milestones.length})
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}
