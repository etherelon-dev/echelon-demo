import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { progressionSteps } from "@/lib/content/progressionSteps";

export default function CurrencySection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-content gap-14 px-6 lg:grid-cols-2 lg:items-center lg:gap-20">
        <RevealOnScroll>
          <SectionHeading
            title="WHEN A KINGDOM BECOMES A POWER."
            description="Established political entities may eventually issue a currency of their own, once they satisfy strict requirements. It is a late-stage marker of sovereignty, not a starting feature."
          />
        </RevealOnScroll>

        <RevealOnScroll delayMs={150}>
          <ol className="flex flex-col">
            {progressionSteps.map((item, index) => (
              <li key={item.step} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-500/50 text-sm text-gold-300">
                    {index + 1}
                  </span>
                  {index !== progressionSteps.length - 1 ? (
                    <span className="w-px flex-1 bg-ink-500" />
                  ) : null}
                </div>
                <p className="pb-8 text-base text-bone-dim sm:text-lg">
                  {item.step}
                </p>
              </li>
            ))}
          </ol>
        </RevealOnScroll>
      </div>
    </section>
  );
}
