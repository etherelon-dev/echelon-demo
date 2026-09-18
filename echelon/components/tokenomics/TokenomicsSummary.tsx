import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { allocations, TOTAL_SUPPLY } from "@/lib/content/tokenomics";

export default function TokenomicsSummary() {
  return (
    <section className="border-t border-ink-600 py-28 sm:py-36">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-12 px-6 text-center">
        <RevealOnScroll>
          <div className="flex flex-col items-center gap-4">
            <span className="h-px w-16 bg-gold-500" />
            <p className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tabular-nums tracking-tight text-bone">
              {TOTAL_SUPPLY}
            </p>
            <p className="text-xs tracking-[0.24em] text-gold-300">
              FIXED TOTAL SUPPLY
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={120}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {allocations.map((allocation) => (
              <div key={allocation.id} className="flex flex-col items-center gap-2">
                <p className="font-display text-3xl font-semibold text-bone">
                  {allocation.percentage}%
                </p>
                <p className="text-xs tracking-[0.1em] text-bone-dim">
                  {allocation.shortName.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
