import RevealOnScroll from "@/components/ui/RevealOnScroll";
import {
  currentRoadmapPhase,
  initialPhaseCount,
  roadmapPhases
} from "@/lib/content/roadmap";

export default function RoadmapProgress() {
  return (
    <RevealOnScroll>
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="text-xs tracking-[0.24em] text-bone-faint">
          ECHELON DEVELOPMENT PROGRESS
        </span>

        <div
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3"
          role="list"
          aria-label="Roadmap phases"
        >
          {roadmapPhases.map((phase) => {
            const isFuture = phase.status === "coming-soon";
            const isReached =
              phase.status === "current" || phase.status === "completed";

            return (
              <div
                key={phase.id}
                role="listitem"
                className="flex items-center gap-2"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] ${
                      isFuture
                        ? "border-dashed border-gold-500/50 text-gold-300"
                        : isReached
                          ? "border-gold-400 bg-gold-500/15 text-gold-300"
                          : "border-ink-500 text-bone-faint"
                    }`}
                  >
                    {isFuture ? "∞" : isReached ? "●" : "○"}
                  </span>
                  <span className="text-[10px] tracking-[0.1em] text-bone-faint">
                    P{phase.number}
                  </span>
                </div>
              </div>
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
