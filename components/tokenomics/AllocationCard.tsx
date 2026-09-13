"use client";

import type { Allocation } from "@/types/tokenomics";

type AllocationCardProps = {
  allocation: Allocation;
  isActive: boolean;
  onHover: (id: Allocation["id"] | null) => void;
  onSelect: (id: Allocation["id"]) => void;
};

export default function AllocationCard({
  allocation,
  isActive,
  onHover,
  onSelect
}: AllocationCardProps) {
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(allocation.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(allocation.id)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(allocation.id)}
      className={`flex flex-col gap-5 rounded-sm border p-6 text-left transition-all duration-300 ${
        isActive
          ? "-translate-y-1 border-gold-500/60 bg-ink-800/80"
          : "border-ink-500 bg-ink-800/40 hover:-translate-y-1 hover:border-gold-500/40"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: `var(${allocation.colorVar})` }}
          />
          <span className="font-display text-sm font-medium tracking-[0.06em] text-bone">
            {allocation.name.toUpperCase()}
          </span>
        </div>
        <span className="font-display text-2xl font-semibold text-bone">
          {allocation.percentage}%
        </span>
      </div>

      <p className="font-display text-lg text-gold-300">
        {allocation.amountShort}
      </p>

      <p className="text-sm leading-relaxed text-bone-dim">
        {allocation.purpose}
      </p>

      <div className="flex items-center gap-2 border-t border-ink-600 pt-4 text-xs">
        <span className="tracking-[0.14em] text-bone-faint">VESTING</span>
        <span className="text-bone-dim">{allocation.vesting}</span>
      </div>
    </button>
  );
}
