import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedCounter from "@/components/roadmap/AnimatedCounter";
import {
  currentRoadmapPhase,
  getPhaseProgress,
  initialPhaseCount,
  overallRoadmapProgress,
  roadmapPhases
} from "@/lib/content/roadmap";

const RING_ACTIVE_COLOR = "#D0AD79";
const RING_TRACK_COLOR = "#212125";

export default function RoadmapProgress() {
  return (
    <RevealOnScroll>
      <div className="flex flex-col items-center gap-10">
        <div className="flex w-full max-w-md flex-col items-center gap-3 text-center">
          <span className="text-xs tracking-[0.24em] text-bone-faint">
            ECHELON DEVELOPMENT PROGRESS
          </span>

          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-semibold text-gold-300 sm:text-5xl">
              <AnimatedCounter value={overallRoadmapProgress.percent} />%
            </span>
            <span className="text-xs tracking-[0.14em] text-bone-faint">
              OF THE INITIAL ROADMAP LIVE
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={overallRoadmapProgress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall roadmap completion"
            className="h-1.5 w-full overflow-hidden rounded-full bg-ink-600"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300 transition-[width] duration-700 ease-out"
              style={{ width: `${overallRoadmapProgress.percent}%` }}
            />
          </div>

          <span className="text-[11px] tracking-[0.1em] text-bone-faint">
            {overallRoadmapProgress.done} OF {overallRoadmapProgress.total}{" "}
            MILESTONES LIVE ACROSS PHASES 0–{initialPhaseCount}
          </span>
        </div>

        <div
          className="flex flex-wrap items-start justify-center gap-x-1.5 gap-y-5"
          role="list"
          aria-label="Roadmap phases — jump to a phase below"
        >
          {roadmapPhases.map((phase, index) => {
            const isFuture = phase.status === "coming-soon";
            const isCurrent = phase.status === "current";
            const isReached = isCurrent || phase.status === "completed";
            const progress = getPhaseProgress(phase);
            const hasRing = !isFuture && progress.percent > 0;

            return (
              <a
                key={phase.id}
                href={`#phase-node-${phase.id}`}
                role="listitem"
                title={`${phase.title} — ${progress.percent}% live — jump to phase`}
                className="group relative flex flex-col items-center gap-2 rounded-sm px-1.5 py-1 transition-colors duration-200 hover:bg-ink-800/60"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <span className="relative flex h-8 w-8 items-center justify-center">
                  {isCurrent ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-gold-400 animate-marker-pulse"
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:scale-110"
                    style={
                      hasRing
                        ? {
                            background: `conic-gradient(${RING_ACTIVE_COLOR} ${progress.percent}%, ${RING_TRACK_COLOR} ${progress.percent}%)`
                          }
                        : undefined
                    }
                  >
                    <span
                      className={`flex h-[26px] w-[26px] items-center justify-center rounded-full border text-[10px] transition-colors duration-200 ${
                        isFuture
                          ? "border-dashed border-gold-500/50 bg-ink-900 text-gold-300"
                          : isReached
                            ? "border-gold-400 bg-ink-900 text-gold-300 group-hover:border-gold-300"
                            : "border-ink-500 bg-ink-900 text-bone-faint group-hover:border-gold-500/50 group-hover:text-gold-300"
                      }`}
                    >
                      {isFuture ? "∞" : isReached ? "●" : "○"}
                    </span>
                  </span>
                </span>
                <span
                  className={`text-[10px] tracking-[0.1em] transition-colors duration-200 ${
                    isCurrent
                      ? "text-gold-300"
                      : "text-bone-faint group-hover:text-gold-300"
                  }`}
                >
                  P{phase.number}
                </span>

                <span className="pointer-events-none absolute -top-9 left-1/2 z-10 w-max max-w-[10rem] -translate-x-1/2 scale-95 whitespace-nowrap rounded-sm border border-gold-500/30 bg-ink-800 px-2.5 py-1 text-[10px] tracking-[0.06em] text-bone-dim opacity-0 shadow-lg shadow-ink-900/50 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                  {phase.title} · {progress.percent}%
                </span>
              </a>
            );
          })}
        </div>

        <p className="font-display text-sm tracking-[0.1em] text-bone-dim">
          PHASE {currentRoadmapPhase.number} OF {initialPhaseCount} INITIAL
          PHASES
        </p>
      </div>
    </RevealOnScroll>
  );
}
