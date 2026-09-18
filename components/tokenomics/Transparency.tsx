import { Check } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { transparencyPoints } from "@/lib/content/transparency";

export default function Transparency() {
  return (
    <section className="border-t border-ink-600 bg-ink-800/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-content gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        <RevealOnScroll>
          <div className="flex flex-col gap-6">
            <SectionHeading
              title="TRANSPARENCY BY DESIGN."
              description="Tokenomics are designed to be understandable before they are complex."
            />
            <p className="text-sm leading-relaxed text-bone-faint">
              Token utility, distribution mechanics, and ecosystem economics
              may evolve during development. Final terms will be published
              before the relevant launch or distribution events.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={150}>
          <ul className="flex flex-col gap-4">
            {transparencyPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-4 border-b border-ink-600 pb-4"
              >
                <Check
                  className="h-4 w-4 shrink-0 text-gold-400"
                  strokeWidth={1.5}
                />
                <span className="text-sm text-bone-dim sm:text-base">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  );
}
