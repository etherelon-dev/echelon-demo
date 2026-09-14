"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { roadmapFilterOptions } from "@/lib/content/roadmap";
import type { RoadmapFilterValue } from "@/types/roadmap";

type RoadmapFiltersProps = {
  activeFilter: RoadmapFilterValue;
  onChange: (value: RoadmapFilterValue) => void;
};

type IndicatorRect = {
  left: number;
  width: number;
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function RoadmapFilters({
  activeFilter,
  onChange
}: RoadmapFiltersProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null);
  const [isReady, setIsReady] = useState(false);

  const measure = () => {
    const track = trackRef.current;
    const activeButton = buttonRefs.current[activeFilter];
    if (!track || !activeButton) return;

    const trackRect = track.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    setIndicator({
      left: buttonRect.left - trackRect.left,
      width: buttonRect.width
    });
    setIsReady(true);
  };

  useIsomorphicLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className="text-xs tracking-[0.18em] text-bone-faint">VIEW</span>
      <div
        ref={trackRef}
        role="tablist"
        aria-label="Filter roadmap phases by status"
        className="relative flex flex-wrap items-center justify-center gap-1 rounded-full border border-ink-500 bg-ink-800/40 p-1"
      >
        {indicator ? (
          <span
            aria-hidden="true"
            className={`absolute inset-y-1 rounded-full bg-gold-500/15 ring-1 ring-inset ring-gold-500/50 ${
              isReady ? "transition-[left,width] duration-300 ease-out" : ""
            }`}
            style={{ left: indicator.left, width: indicator.width }}
          />
        ) : null}

        {roadmapFilterOptions.map((option) => {
          const isActive = activeFilter === option.value;
          return (
            <button
              key={option.value}
              ref={(node) => {
                buttonRefs.current[option.value] = node;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(option.value)}
              className={`relative z-10 rounded-full px-4 py-1.5 text-xs tracking-[0.1em] transition-colors duration-200 ${
                isActive
                  ? "text-gold-300"
                  : "text-bone-dim hover:text-gold-300"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
