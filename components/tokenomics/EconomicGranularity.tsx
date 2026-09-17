import { ArrowDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { granularityHierarchy } from "@/lib/content/economicGranularity";

export default function EconomicGranularity() {
  return (
    <section className="border-t border-ink-600 bg-ink-800/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-content gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        <RevealOnScroll>
          <div className="flex flex-col gap-6">
            <SectionHeading title="DESIGNED FOR ECONOMIC GRANULARITY." />
            <p className="text-base leading-relaxed text-bone-dim sm:text-lg">
              Echelon is not a single-asset game economy. It is designed as a
              large persistent world containing territories, resources,
              infrastructure, trade, markets, rewards, upgrades, and countless
              player interactions.
            </p>
            <p className="text-base leading-relaxed text-bone-dim sm:text-lg">
              A fixed supply of 1 trillion ECH gives the economy enough
              denomination granularity to represent small-value interactions
              without requiring every game mechanic to operate in large token
              units.
            </p>
            <p className="text-sm leading-relaxed text-bone-faint">
              Not every item will necessarily use ECH, and ECH is not intended
              to be used for every gameplay action.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={150}>
          <div className="flex flex-col items-stretch">
            {granularityHierarchy.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div className="w-full border border-ink-500 bg-ink-900/70 px-6 py-4 text-center">
                  <p className="font-display text-base font-medium text-bone">
                    {step}
                  </p>
                </div>
                {index !== granularityHierarchy.length - 1 ? (
                  <ArrowDown
                    className="my-2 h-4 w-4 text-gold-400"
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
