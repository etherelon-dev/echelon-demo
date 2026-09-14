import { Check, Circle, Sparkles } from "lucide-react";
import type { RoadmapMilestone, MilestoneVariant } from "@/types/roadmap";

type MilestoneCardProps = {
  milestone: RoadmapMilestone;
  variant: MilestoneVariant;
  index: number;
};

export default function MilestoneCard({
  milestone,
  variant,
  index
}: MilestoneCardProps) {
  const Icon = variant === "category" ? Sparkles : milestone.confirmed ? Check : Circle;

  return (
    <div
      className={`reveal is-visible flex items-start gap-3 rounded-sm border px-4 py-3 ${
        milestone.confirmed
          ? "border-gold-500/50 bg-gold-500/5"
          : milestone.highlight
            ? "border-gold-500/25 bg-ink-800/50"
            : "border-ink-500 bg-ink-800/30"
      }`}
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
    >
      <Icon
        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
          milestone.confirmed
            ? "text-gold-300"
            : milestone.highlight
              ? "text-gold-400"
              : "text-bone-faint"
        }`}
        strokeWidth={1.5}
      />
      <div className="flex flex-1 flex-col gap-1.5">
        <span className="text-sm leading-snug text-bone-dim">
          {milestone.label}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {milestone.confirmed ? (
            <span className="inline-flex w-fit items-center rounded-full border border-gold-500/40 bg-gold-500/10 px-2 py-0.5 text-[9px] tracking-[0.14em] text-gold-300">
              CONFIRMED
            </span>
          ) : null}
          {milestone.highlight && !milestone.confirmed ? (
            <span className="inline-flex w-fit items-center rounded-full border border-ink-500 px-2 py-0.5 text-[9px] tracking-[0.14em] text-bone-faint">
              KEY MILESTONE
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
