import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import KingdomMockup from "@/components/diagrams/KingdomMockup";

export default function KingdomSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-content gap-14 px-6 lg:grid-cols-2 lg:items-center lg:gap-20">
        <RevealOnScroll>
          <SectionHeading
            title="CREATE A NATION OF YOUR OWN."
            description="Once a player satisfies the requirements for territory, population, economic strength, stability, resources, and legitimacy, they can establish a kingdom of their own. From there, a political entity can develop its own identity, economy, titles, and eventually its own currency."
          />
        </RevealOnScroll>

        <RevealOnScroll delayMs={150}>
          <KingdomMockup />
        </RevealOnScroll>
      </div>
    </section>
  );
}
