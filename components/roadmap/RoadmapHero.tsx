import { ChevronDown } from "lucide-react";
import Badge from "@/components/ui/Badge";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import CommunityMapBackdrop from "@/components/community/CommunityMapBackdrop";
import {
  currentRoadmapPhase,
  overallRoadmapProgress
} from "@/lib/content/roadmap";

export default function RoadmapHero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-20 pt-40 sm:pb-24 sm:pt-44"
    >
      <CommunityMapBackdrop idPrefix="roadmap-hero" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <span
          className="absolute -left-24 top-10 h-72 w-72 animate-blob-float rounded-full bg-gold-500/15 blur-[100px] sm:h-96 sm:w-96"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="absolute -right-16 top-40 h-64 w-64 animate-blob-float rounded-full bg-steel-400/15 blur-[100px] sm:h-80 sm:w-80"
          style={{ animationDelay: "3.5s", animationDuration: "13s" }}
        />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 px-6 text-center">
        <RevealOnScroll>
          <div className="flex flex-col items-center gap-7">
            <Badge>DEVELOPMENT ROADMAP</Badge>

            <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.05] text-bone">
              THE ROAD TO A{" "}
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">
                LIVING WORLD.
              </span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-bone-dim sm:text-lg">
              Echelon is built in phases — from the first playable concept to
              a persistent world shaped by its players.
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <div className="group inline-flex items-center gap-3 rounded-full border border-gold-500/30 bg-ink-800/60 px-5 py-2.5 transition-colors duration-300 hover:border-gold-500/50">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-marker-pulse rounded-full bg-gold-400" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
                </span>
                <span className="text-xs tracking-[0.18em] text-bone-faint">
                  CURRENT PHASE
                </span>
                <span className="font-display text-sm font-semibold text-gold-300">
                  PHASE {currentRoadmapPhase.number} —{" "}
                  {currentRoadmapPhase.title.toUpperCase()}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-ink-500 bg-ink-800/40 px-5 py-2.5">
                <span className="font-display text-sm font-semibold text-bone">
                  {overallRoadmapProgress.percent}%
                </span>
                <span className="text-xs tracking-[0.14em] text-bone-faint">
                  LIVE TODAY
                </span>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <a
          href="#progress"
          aria-label="Scroll to roadmap progress"
          className="group mt-4 flex flex-col items-center gap-1.5 text-bone-faint transition-colors duration-300 hover:text-gold-300"
        >
          <span className="text-[10px] tracking-[0.24em]">EXPLORE</span>
          <ChevronDown
            className="h-4 w-4 animate-chevron-bounce"
            strokeWidth={1.5}
          />
        </a>
      </div>
    </section>
  );
}
