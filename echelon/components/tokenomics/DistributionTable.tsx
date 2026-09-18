import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { allocations, TOTAL_SUPPLY } from "@/lib/content/tokenomics";

export default function DistributionTable() {
  return (
    <section className="border-t border-ink-600 bg-ink-800/40 py-24 sm:py-32">
      <div className="mx-auto flex max-w-content flex-col gap-12 px-6">
        <RevealOnScroll>
          <SectionHeading title="TOKEN DISTRIBUTION." />
        </RevealOnScroll>

        <RevealOnScroll delayMs={100}>
          <div className="overflow-x-auto border border-ink-500">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink-500 bg-ink-800/60">
                  <th className="px-6 py-4 text-xs font-medium tracking-[0.14em] text-bone-faint">
                    ALLOCATION
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-[0.14em] text-bone-faint">
                    SHARE
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-[0.14em] text-bone-faint">
                    AMOUNT
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-[0.14em] text-bone-faint">
                    VESTING
                  </th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((allocation, index) => (
                  <tr
                    key={allocation.id}
                    className={
                      index !== allocations.length - 1
                        ? "border-b border-ink-600"
                        : ""
                    }
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: `var(${allocation.colorVar})` }}
                        />
                        <span className="text-sm text-bone">{allocation.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-bone-dim">
                      {allocation.percentage}%
                    </td>
                    <td className="px-6 py-4 text-sm text-bone-dim">
                      {allocation.amountShort}
                    </td>
                    <td className="px-6 py-4 text-sm text-bone-dim">
                      {allocation.vesting}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-ink-500">
                  <td className="px-6 py-4 text-sm font-medium text-bone">Total</td>
                  <td className="px-6 py-4 text-sm font-medium text-bone">100%</td>
                  <td className="px-6 py-4 text-sm font-medium text-bone">
                    {TOTAL_SUPPLY}
                  </td>
                  <td className="px-6 py-4" />
                </tr>
              </tfoot>
            </table>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
