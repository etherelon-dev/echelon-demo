import { ArrowDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { tokenFlowSteps } from "@/lib/content/tokenFlow";

export default function TokenFlow() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto flex max-w-content flex-col gap-14 px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-20">
        <RevealOnScroll>
          <div className="flex flex-col gap-6">
            <SectionHeading title="HOW VALUE MOVES THROUGH ECHELON." />
            <p className="text-base leading-relaxed text-bone-dim sm:text-lg">
              ECH connects player actions to the wider game economy. Exact
              token flows and sinks will evolve alongside game development.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={150}>
          <div className="flex flex-col items-stretch">
            {tokenFlowSteps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-full border px-6 py-4 text-center ${
                    step === "ECH"
                      ? "border-gold-500/60 bg-ink-800/80"
                      : "border-ink-500 bg-ink-900/70"
                  }`}
                >
                  <p
                    className={`font-display text-base font-medium ${
                      step === "ECH" ? "text-gold-300" : "text-bone"
                    }`}
                  >
                    {step}
                  </p>
                </div>
                {index !== tokenFlowSteps.length - 1 ? (
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
