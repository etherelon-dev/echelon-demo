import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { DOCS_URL } from "@/lib/content/links";
import { TOTAL_SUPPLY } from "@/lib/content/tokenomics";

export default function TokenomicsHero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-20 pt-40 sm:pb-28 sm:pt-44"
    >
      <div className="mx-auto flex max-w-content flex-col gap-16 px-6 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
        <RevealOnScroll>
          <div className="flex flex-col gap-7">
            <Badge>ECHELON TOKENOMICS</Badge>

            <h1 className="font-display text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.08] text-bone">
              BUILT FOR A LIVING ECONOMY.
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-bone-dim sm:text-lg">
              A fixed 1 trillion ECH supply designed to support the scale,
              granularity, and long-term evolution of Echelon&apos;s
              player-driven economy.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Button variant="primary" href={DOCS_URL}>
                Read the Docs
              </Button>
              <Button variant="secondary">Join Waitlist</Button>
              <Button variant="ghost" comingSoon>
                Try Demo
              </Button>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={150}>
          <div className="relative flex flex-col items-center gap-3 border border-ink-500 bg-ink-800/60 px-8 py-12 text-center">
            <span
              aria-hidden="true"
              className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"
            />
            <p className="font-display text-[clamp(1.75rem,4.5vw,2.75rem)] font-semibold tabular-nums tracking-tight text-bone">
              {TOTAL_SUPPLY}
            </p>
            <p className="text-xs tracking-[0.24em] text-gold-300">
              FIXED TOTAL SUPPLY
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
