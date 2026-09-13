import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { developmentJourneyStages } from "@/lib/content/developmentJourney";

export default function DevelopmentJourney() {
  return (
    <section className="border-t border-ink-600 bg-ink-800/40 py-24 sm:py-32">
      <div className="mx-auto flex max-w-content flex-col gap-14 px-6">
        <RevealOnScroll>
          <SectionHeading
            align="center"
            title="FOLLOW THE JOURNEY"
            description="From early concepts to a living multiplayer world, Echelon will evolve in public."
          />
        </RevealOnScroll>

        <RevealOnScroll delayMs={120}>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-6">
            {developmentJourneyStages.map((stage, index) => (
              <div key={stage} className="flex items-center gap-3">
                <span className="rounded-sm border border-ink-500 bg-ink-800/60 px-5 py-2.5 text-xs tracking-[0.14em] text-bone-dim sm:text-sm">
                  {stage.toUpperCase()}
                </span>
                {index !== developmentJourneyStages.length - 1 ? (
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-gold-500/60"
                    strokeWidth={1.5}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
