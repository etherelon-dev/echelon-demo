import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { worldEvents } from "@/lib/content/worldEvents";

export default function WorldSection() {
  return (
    <section id="world" className="border-t border-ink-600 bg-ink-800/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-content gap-14 px-6 lg:grid-cols-2 lg:items-center lg:gap-20">
        <RevealOnScroll>
          <SectionHeading
            title="THE WORLD IS NOT SCRIPTED."
            description="Echelon is a persistent world shaped by its players. Nations rise through ambition, borders change through conflict, economies evolve through trade, and history is written through the actions of those who control the world."
          />
        </RevealOnScroll>

        <RevealOnScroll delayMs={150}>
          <div className="rounded-sm border border-ink-500 bg-ink-900/60">
            {worldEvents.map((event, index) => (
              <div
                key={event}
                className={`flex items-center gap-4 px-6 py-5 ${
                  index !== worldEvents.length - 1 ? "border-b border-ink-600" : ""
                }`}
              >
                <ArrowRight className="h-4 w-4 shrink-0 text-gold-400" strokeWidth={1.5} />
                <p className="text-sm text-bone-dim sm:text-base">{event}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
