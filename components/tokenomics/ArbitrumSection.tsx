import { Check } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Badge from "@/components/ui/Badge";
import { arbitrumReasons } from "@/lib/content/arbitrum";

export default function ArbitrumSection() {
  return (
    <section className="border-t border-ink-600 bg-ink-800/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-content gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        <RevealOnScroll>
          <div className="flex flex-col gap-6">
            <SectionHeading title="POWERED BY THE ARBITRUM ECOSYSTEM." />
            <p className="text-base leading-relaxed text-bone-dim sm:text-lg">
              Echelon&apos;s planned blockchain infrastructure is based on the
              Arbitrum ecosystem, giving Echelon an EVM-compatible environment
              while preserving a path toward more specialized infrastructure
              as the project grows.
            </p>
            <p className="text-sm leading-relaxed text-bone-dim">
              Arbitrum One can serve as an initial deployment environment,
              while an Arbitrum Orbit-based dedicated chain is a potential
              long-term direction.
            </p>
            <div>
              <Badge>POTENTIAL FUTURE ARCHITECTURE</Badge>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={150}>
          <ul className="flex flex-col gap-4">
            {arbitrumReasons.map((reason) => (
              <li
                key={reason}
                className="flex items-center gap-4 border-b border-ink-600 pb-4"
              >
                <Check
                  className="h-4 w-4 shrink-0 text-gold-400"
                  strokeWidth={1.5}
                />
                <span className="text-sm text-bone-dim sm:text-base">
                  {reason}
                </span>
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  );
}
