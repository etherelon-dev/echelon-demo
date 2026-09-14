import Badge from "@/components/ui/Badge";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import CommunityMapBackdrop from "@/components/community/CommunityMapBackdrop";
import { currentRoadmapPhase } from "@/lib/content/roadmap";

export default function RoadmapHero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-16 pt-40 sm:pb-20 sm:pt-44"
    >
      <CommunityMapBackdrop idPrefix="roadmap-hero" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 px-6 text-center">
        <RevealOnScroll>
          <div className="flex flex-col items-center gap-7">
            <Badge>DEVELOPMENT ROADMAP</Badge>

            <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.05] text-bone">
              THE ROAD TO A LIVING WORLD.
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-bone-dim sm:text-lg">
              Echelon is built in phases — from the first playable concept to
              a persistent world shaped by its players.
            </p>

            <div className="mt-2 inline-flex items-center gap-3 rounded-sm border border-gold-500/30 bg-ink-800/60 px-5 py-2.5">
              <span className="h-2 w-2 animate-marker-pulse rounded-full bg-gold-400" />
              <span className="text-xs tracking-[0.18em] text-bone-faint">
                CURRENT PHASE
              </span>
              <span className="font-display text-sm font-semibold text-gold-300">
                PHASE {currentRoadmapPhase.number} — {currentRoadmapPhase.title.toUpperCase()}
              </span>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
