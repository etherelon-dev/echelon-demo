import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { powerPaths } from "@/lib/content/powerPaths";

export default function GameplaySection() {
  return (
    <section id="gameplay" className="border-t border-ink-600 bg-ink-800/40 py-24 sm:py-32">
      <div className="mx-auto flex max-w-content flex-col gap-14 px-6">
        <RevealOnScroll>
          <SectionHeading
            title="RULE. CONQUER. NEGOTIATE."
            description="There is no single correct way to become powerful in Echelon. Players wage war, defend borders, form alliances, negotiate, trade, and expand, competing for strategic resources and political hierarchies."
          />
        </RevealOnScroll>

        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {powerPaths.map((path, index) => {
            const Icon = path.icon;
            return (
              <RevealOnScroll key={path.title} delayMs={index * 80}>
                <div className="flex gap-4">
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-gold-400" strokeWidth={1.5} />
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-display text-base font-medium text-bone">
                      {path.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-bone-dim">
                      {path.description}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
