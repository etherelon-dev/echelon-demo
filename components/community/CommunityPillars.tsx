import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { communityPillars } from "@/lib/content/communityPillars";

export default function CommunityPillars() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto flex max-w-content flex-col gap-14 px-6">
        <RevealOnScroll>
          <SectionHeading
            align="center"
            title="MORE THAN AN AUDIENCE."
            description="Echelon is designed to become a world shaped by its players. The community will not simply watch the world evolve — it will help shape the ideas, systems, strategies, and stories that emerge from it."
          />
        </RevealOnScroll>

        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-3">
          {communityPillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <RevealOnScroll key={pillar.title} delayMs={index * 100}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm text-gold-400">
                      {pillar.number}
                    </span>
                    <Icon
                      className="h-5 w-5 text-gold-400"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="font-display text-lg font-medium text-bone">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-bone-dim">
                    {pillar.description}
                  </p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
