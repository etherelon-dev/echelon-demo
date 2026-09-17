import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { economyPrinciples } from "@/lib/content/economyPrinciples";

export default function EconomySection() {
  return (
    <section id="economy" className="border-t border-ink-600 bg-ink-800/40 py-24 sm:py-32">
      <div className="mx-auto flex max-w-content flex-col gap-14 px-6">
        <RevealOnScroll>
          <SectionHeading
            title="ECONOMIES ARE BUILT, NOT SCRIPTED."
            description="Every economy in Echelon emerges from player behavior, not a fixed script."
          />
        </RevealOnScroll>

        <div className="grid gap-x-12 gap-y-5 sm:grid-cols-2">
          {economyPrinciples.map((principle, index) => (
            <RevealOnScroll key={principle} delayMs={index * 60}>
              <div className="flex items-baseline gap-3 border-b border-ink-600 pb-5">
                <span className="h-px w-4 shrink-0 translate-y-[-4px] bg-gold-400" />
                <p className="text-base text-bone-dim">{principle}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
