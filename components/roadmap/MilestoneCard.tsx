import { CheckCircle2, Circle, Sparkles } from "lucide-react";
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
  const isComplete = milestone.done || milestone.confirmed;

  const Icon =
    variant === "category" ? Sparkles : isComplete ? CheckCircle2 : Circle;

  return (
    <div
      className={`reveal is-visible group flex items-start gap-3 rounded-sm border px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 ${
        milestone.done
          ? "border-gold-500/45 bg-gold-500/[0.06] hover:border-gold-400/60 hover:shadow-[0_8px_20px_-12px_rgba(208,173,121,0.5)]"
          : milestone.confirmed
            ? "border-gold-500/50 bg-gold-500/5 hover:shadow-[0_8px_20px_-12px_rgba(208,173,121,0.5)]"
            : milestone.highlight
              ? "border-gold-500/25 bg-ink-800/50 hover:border-gold-500/40"
              : "border-ink-500 bg-ink-800/30 hover:border-ink-400"
      }`}
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
    >
      <Icon
        className={`mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
          isComplete
            ? "text-gold-300"
            : milestone.highlight
              ? "text-gold-400"
              : "text-bone-faint"
        }`}
        strokeWidth={isComplete ? 1.75 : 1.5}
        fill={milestone.done ? "currentColor" : "none"}
        fillOpacity={milestone.done ? 0.15 : undefined}
      />
      <div className="flex flex-1 flex-col gap-1.5">
        <span
          className={`text-sm leading-snug ${
            milestone.done ? "text-bone" : "text-bone-dim"
          }`}
        >
          {milestone.label}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {milestone.done ? (
            <span className="inline-flex w-fit items-center gap-1 rounded-full border border-gold-500/40 bg-gold-500/10 px-2 py-0.5 text-[9px] tracking-[0.14em] text-gold-300">
              LIVE NOW
            </span>
          ) : milestone.confirmed ? (
            <span className="inline-flex w-fit items-center rounded-full border border-gold-500/40 bg-gold-500/10 px-2 py-0.5 text-[9px] tracking-[0.14em] text-gold-300">
              CONFIRMED
            </span>
          ) : null}
          {milestone.highlight && !isComplete ? (
            <span className="inline-flex w-fit items-center rounded-full border border-ink-500 px-2 py-0.5 text-[9px] tracking-[0.14em] text-bone-faint">
              KEY MILESTONE
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
