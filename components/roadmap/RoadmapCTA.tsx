import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import CommunityMapBackdrop from "@/components/community/CommunityMapBackdrop";

export default function RoadmapCTA() {
  return (
    <section className="relative overflow-hidden border-t border-ink-600 py-28 sm:py-36">
      <CommunityMapBackdrop idPrefix="roadmap-cta" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <span
          className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-blob-float rounded-full bg-gold-500/10 blur-[110px] mix-blend-screen"
          style={{ animationDuration: "14s" }}
        />
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 text-center">
        <RevealOnScroll>
          <div className="flex flex-col items-center gap-8">
            <span className="h-px w-16 bg-gold-500" />

            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight text-bone">
              THE NEXT PHASE STARTS HERE.
            </h2>

            <p className="max-w-xl text-base leading-relaxed text-bone-dim sm:text-lg">
              Follow Echelon as the world takes shape.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
              <Button variant="primary" href="/community">
                Join the Community
              </Button>
              <Button variant="secondary" comingSoon>
                Try the Demo
              </Button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
