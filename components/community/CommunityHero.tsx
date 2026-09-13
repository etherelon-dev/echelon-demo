import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import CommunityMapBackdrop from "@/components/community/CommunityMapBackdrop";
import { telegramPlatform } from "@/lib/content/community";

export default function CommunityHero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-20 pt-40 sm:pb-28 sm:pt-44"
    >
      <CommunityMapBackdrop idPrefix="community-hero" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 px-6 text-center">
        <RevealOnScroll>
          <div className="flex flex-col items-center gap-7">
            <Badge>THE ECHELON COMMUNITY</Badge>

            <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.05] text-bone">
              BUILD THE WORLD WITH US.
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-bone-dim sm:text-lg">
              Echelon is being built as a living world shaped by the people
              who play it. Follow development, share ideas, and stay close
              to the evolution of the game.
            </p>

            <div className="flex flex-col items-center gap-3 pt-2">
              <Button
                variant="primary"
                href={telegramPlatform.href}
                external
              >
                Join Telegram
              </Button>
              <p className="text-sm text-bone-faint">
                More community spaces are coming.
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
