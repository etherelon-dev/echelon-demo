import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import ArchitectureDiagram from "@/components/diagrams/ArchitectureDiagram";
import { DOCS_URL } from "@/lib/content/links";

export default function BlockchainSection() {
  return (
    <section id="technology" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-content gap-14 px-6 lg:grid-cols-2 lg:items-center lg:gap-20">
        <RevealOnScroll>
          <div className="flex flex-col gap-6">
            <SectionHeading title="WEB3 WITHOUT THE FRICTION." />
            <p className="text-base leading-relaxed text-bone-dim sm:text-lg">
              Thousands of player actions can be processed by the game engine
              and compressed into efficient batches before being settled
              on-chain.
            </p>
            <p className="font-display text-lg text-bone">
              Players play. Echelon handles the complexity.
            </p>
            <div>
              <Button variant="ghost" href={DOCS_URL}>
                Read the Docs →
              </Button>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={150}>
          <ArchitectureDiagram />
        </RevealOnScroll>
      </div>
    </section>
  );
}
