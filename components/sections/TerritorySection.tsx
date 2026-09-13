import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { domainCards } from "@/lib/content/domainCards";

export default function TerritorySection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto flex max-w-content flex-col gap-14 px-6">
        <RevealOnScroll>
          <SectionHeading
            title="FROM TERRITORY TO KINGDOM."
            description="Every empire in Echelon begins the same way: with a single claim. From there, players decide how far it grows."
          />
        </RevealOnScroll>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {domainCards.map((card, index) => (
            <RevealOnScroll key={card.title} delayMs={index * 100}>
              <Card
                title={card.title}
                description={card.description}
                icon={card.icon}
              />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
