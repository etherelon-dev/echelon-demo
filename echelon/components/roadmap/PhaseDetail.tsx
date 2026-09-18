import Badge from "@/components/ui/Badge";
import AnimatedCounter from "@/components/roadmap/AnimatedCounter";
import MilestoneGrid from "@/components/roadmap/MilestoneGrid";
import { getPhaseProgress, roadmapStatusLabels } from "@/lib/content/roadmap";
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
  const progress = getPhaseProgress(phase);
  const showProgress = milestoneVariant === "milestone" && progress.done > 0;

  const isCurrent = phase.status === "current";

  return (
    <div
      id={`phase-detail-${phase.id}`}
      className={`reveal is-visible relative flex flex-col gap-6 overflow-hidden rounded-sm border bg-ink-800/50 p-6 sm:p-8 ${
        isCurrent
          ? "border-gold-500/40 shadow-[0_0_50px_-16px_rgba(208,173,121,0.4)]"
          : "border-ink-500"
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-70"
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
            {isCurrent ? (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-gold-400 animate-marker-pulse"
              />
            ) : null}
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold-500/40 bg-ink-900 text-gold-300">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
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
        <div className="relative flex flex-col gap-2 overflow-hidden rounded-sm border border-gold-500/50 bg-gold-500/10 p-5">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-400/20 blur-2xl"
          />
          <div className="relative flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-gold-500/50 bg-gold-500/15 px-2.5 py-0.5 text-[10px] tracking-[0.14em] text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
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

      <div className="flex flex-col gap-4 border-t border-ink-600 pt-5">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-semibold text-bone">
            <AnimatedCounter value={phase.milestones.length} />
          </span>
          <span className="text-xs tracking-[0.16em] text-bone-faint">
            {phase.countLabel}
          </span>
        </div>

        {showProgress ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[0.14em] text-bone-faint">
                LIVE ON THE SITE TODAY
              </span>
              <span className="font-display text-sm font-semibold text-gold-300">
                <AnimatedCounter value={progress.percent} />%
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={progress.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${phase.title} completion`}
              className="h-1.5 w-full overflow-hidden rounded-full bg-ink-600"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300 transition-[width] duration-700 ease-out"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <span className="text-[11px] tracking-[0.1em] text-bone-faint">
              {progress.done} OF {progress.total} MILESTONES LIVE
            </span>
          </div>
        ) : null}
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
