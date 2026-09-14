"use client";

import { roadmapFilterOptions } from "@/lib/content/roadmap";
import type { RoadmapFilterValue } from "@/types/roadmap";

type RoadmapFiltersProps = {
  activeFilter: RoadmapFilterValue;
  onChange: (value: RoadmapFilterValue) => void;
};

export default function RoadmapFilters({
  activeFilter,
  onChange
}: RoadmapFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="mr-1 text-xs tracking-[0.18em] text-bone-faint">
        VIEW
      </span>
      {roadmapFilterOptions.map((option) => {
        const isActive = activeFilter === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-4 py-1.5 text-xs tracking-[0.1em] transition-colors duration-200 ${
              isActive
                ? "border-gold-500/60 bg-gold-500/10 text-gold-300"
                : "border-ink-500 bg-ink-800/40 text-bone-dim hover:border-gold-500/40 hover:text-gold-300"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
