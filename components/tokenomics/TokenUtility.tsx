import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { tokenUtilityCategories } from "@/lib/content/tokenUtility";

export default function TokenUtility() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto flex max-w-content flex-col gap-14 px-6">
        <RevealOnScroll>
          <SectionHeading
            title="WHAT IS ECH USED FOR?"
            description="ECH's utility and economic mechanics may evolve as development continues. Nothing below is a financial promise."
          />
        </RevealOnScroll>

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {tokenUtilityCategories.map((category, index) => (
            <RevealOnScroll key={category.title} delayMs={index * 60}>
              <div className="flex flex-col gap-3 border-l border-ink-500 pl-6">
                <h3 className="font-display text-base font-medium text-bone">
                  {category.title}
                </h3>
                <p className="text-sm leading-relaxed text-bone-dim">
                  {category.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
