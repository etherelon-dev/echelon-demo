"use client";

import type { KeyboardEvent } from "react";
import type { Allocation, AllocationId } from "@/types/tokenomics";
import { TOTAL_SUPPLY_SHORT } from "@/lib/content/tokenomics";

type TokenomicsChartProps = {
  allocations: Allocation[];
  activeId: AllocationId | null;
  onHover: (id: AllocationId | null) => void;
  onSelect: (id: AllocationId) => void;
};

const CENTER = 200;
const INNER_RADIUS = 104;
const OUTER_RADIUS = 168;
const EXPANDED_RADIUS = 178;
const GAP_DEGREES = 1.6;

function polarToCartesian(radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad)
  };
}

function arcPath(outerRadius: number, startAngle: number, endAngle: number) {
  const startOuter = polarToCartesian(outerRadius, endAngle);
  const endOuter = polarToCartesian(outerRadius, startAngle);
  const startInner = polarToCartesian(INNER_RADIUS, endAngle);
  const endInner = polarToCartesian(INNER_RADIUS, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 1 ${startInner.x} ${startInner.y}`,
    "Z"
  ].join(" ");
}

export default function TokenomicsChart({
  allocations,
  activeId,
  onHover,
  onSelect
}: TokenomicsChartProps) {
  let cursor = 0;
  const segments = allocations.map((allocation) => {
    const sweep = (allocation.percentage / 100) * 360;
    const startAngle = cursor + GAP_DEGREES / 2;
    const endAngle = cursor + sweep - GAP_DEGREES / 2;
    cursor += sweep;
    return { allocation, startAngle, endAngle };
  });

  const active = allocations.find((allocation) => allocation.id === activeId) ?? null;

  const handleKeyDown = (event: KeyboardEvent<SVGPathElement>, id: AllocationId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Echelon token allocation breakdown"
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={OUTER_RADIUS + 6}
          fill="none"
          stroke="#212125"
          strokeWidth={1}
        />
        {segments.map(({ allocation, startAngle, endAngle }) => {
          const isActive = allocation.id === activeId;
          return (
            <path
              key={allocation.id}
              d={arcPath(isActive ? EXPANDED_RADIUS : OUTER_RADIUS, startAngle, endAngle)}
              style={{
                fill: `var(${allocation.colorVar})`,
                opacity: activeId && !isActive ? 0.35 : 1,
                filter: isActive ? "drop-shadow(0 0 14px rgba(208,173,121,0.35))" : "none",
                transition: "d 0.25s ease, opacity 0.25s ease, filter 0.25s ease"
              }}
              role="button"
              tabIndex={0}
              aria-label={`${allocation.name}, ${allocation.percentage} percent, ${allocation.amountShort}`}
              onMouseEnter={() => onHover(allocation.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(allocation.id)}
              onBlur={() => onHover(null)}
              onClick={() => onSelect(allocation.id)}
              onKeyDown={(event) => handleKeyDown(event, allocation.id)}
              className="cursor-pointer outline-none focus-visible:stroke-gold-300 focus-visible:stroke-2"
            />
          );
        })}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-14 text-center">
        {active ? (
          <div className="flex flex-col items-center gap-1.5">
            <p className="font-display text-3xl font-semibold text-bone">
              {active.percentage}%
            </p>
            <p className="text-sm text-gold-300">{active.amountShort}</p>
            <p className="text-xs tracking-[0.18em] text-bone-dim">
              {active.name.toUpperCase()}
            </p>
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-bone-faint">
              {active.description}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="font-display text-3xl font-semibold text-bone">
              {TOTAL_SUPPLY_SHORT}
            </p>
            <p className="text-xs tracking-[0.24em] text-gold-300">
              TOTAL SUPPLY
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
