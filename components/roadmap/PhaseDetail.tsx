import Badge from "@/components/ui/Badge";
import AnimatedCounter from "@/components/roadmap/AnimatedCounter";
import MilestoneGrid from "@/components/roadmap/MilestoneGrid";
import { roadmapStatusLabels } from "@/lib/content/roadmap";
import type { RoadmapPhase, RoadmapStatus } from "@/types/roadmap";

type PhaseDetailProps = {
  phase: RoadmapPhase;
};

const badgeTone: Record<RoadmapStatus, "gold" | "muted"> = {
  completed: "gold",
  current: "gold",
  confirmed: "gold",
  planned: "muted",
  "coming-soon": "gold"
};

export default function PhaseDetail({ phase }: PhaseDetailProps) {
  const Icon = phase.icon;
  const milestoneVariant = phase.milestoneVariant ?? "milestone";

  return (
    <div
      id={`phase-detail-${phase.id}`}
      className="reveal is-visible flex flex-col gap-6 rounded-sm border border-ink-500 bg-ink-800/50 p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-gold-500/40 bg-ink-900 text-gold-300">
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div className="flex flex-col">
            <span className="text-[11px] tracking-[0.16em] text-bone-faint">
              PHASE {phase.number}
            </span>
            <h3 className="font-display text-xl font-semibold text-bone sm:text-2xl">
              {phase.title.toUpperCase()}
            </h3>
          </div>
        </div>
        <Badge tone={badgeTone[phase.status]}>
          {roadmapStatusLabels[phase.status]}
        </Badge>
      </div>

      <p className="font-display text-base text-gold-300 sm:text-lg">
        {phase.narrative}
      </p>

      <p className="text-sm leading-relaxed text-bone-dim sm:text-base">
        {phase.description}
      </p>

      {phase.platforms ? (
        <div className="flex flex-wrap gap-2">
          {phase.platforms.map((platform) => (
            <span
              key={platform}
              className="rounded-full border border-gold-500/30 bg-gold-500/5 px-3 py-1 text-xs tracking-[0.12em] text-gold-300"
            >
              {platform.toUpperCase()}
            </span>
          ))}
        </div>
      ) : null}

      {phase.spotlight ? (
        <div className="flex flex-col gap-2 rounded-sm border border-gold-500/50 bg-gold-500/10 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-gold-500/50 bg-gold-500/15 px-2.5 py-0.5 text-[10px] tracking-[0.14em] text-gold-300">
              CONFIRMED
            </span>
            <span className="font-display text-base font-semibold text-gold-200 sm:text-lg">
              {phase.spotlight.label.toUpperCase()}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-bone-dim">
            {phase.spotlight.note}
          </p>
        </div>
      ) : null}

      {phase.closingMessage ? (
        <p className="font-display text-lg tracking-[0.04em] text-gold-300 sm:text-xl">
          {phase.closingMessage}
        </p>
      ) : null}

      <div className="flex items-baseline gap-2 border-t border-ink-600 pt-5">
        <span className="font-display text-3xl font-semibold text-bone">
          <AnimatedCounter value={phase.milestones.length} />
        </span>
        <span className="text-xs tracking-[0.16em] text-bone-faint">
          {phase.countLabel}
        </span>
      </div>

      <MilestoneGrid milestones={phase.milestones} variant={milestoneVariant} />

      {phase.note ? (
        <p className="border-t border-ink-600 pt-4 text-xs leading-relaxed text-bone-faint">
          {phase.note}
        </p>
      ) : null}
    </div>
  );
}
