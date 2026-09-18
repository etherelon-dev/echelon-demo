import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import HistoryTimeline from "@/components/diagrams/HistoryTimeline";

export default function HistorySection() {
  return (
    <section className="border-t border-ink-600 bg-ink-800/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-content gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        <RevealOnScroll>
          <div className="flex flex-col gap-8">
            <SectionHeading
              title="EVERY ACTION LEAVES A TRACE."
              description="Important ownership and historical states can be recorded and verified through blockchain infrastructure."
            />
            <div className="flex flex-col gap-4 text-base leading-relaxed text-bone-dim">
              <p>A territory is not merely an asset. It has provenance.</p>
              <p>A title is not merely an achievement. It has history.</p>
              <p>A kingdom is not merely an object. It was created by someone.</p>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={150}>
          <HistoryTimeline />
        </RevealOnScroll>
      </div>
    </section>
  );
}
