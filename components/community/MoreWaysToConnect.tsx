import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import ComingSoonCard from "@/components/community/ComingSoonCard";
import { upcomingPlatforms } from "@/lib/content/community";

export default function MoreWaysToConnect() {
  return (
    <section className="border-t border-ink-600 bg-ink-800/40 py-24 sm:py-32">
      <div className="mx-auto flex max-w-content flex-col gap-14 px-6">
        <RevealOnScroll>
          <SectionHeading
            align="center"
            title="MORE WAYS TO CONNECT"
            description="As Echelon grows, new spaces for the community will follow."
          />
        </RevealOnScroll>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingPlatforms.map((platform, index) => (
            <RevealOnScroll key={platform.key} delayMs={index * 80}>
              <ComingSoonCard platform={platform} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
