import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import CommunityMapBackdrop from "@/components/community/CommunityMapBackdrop";
import { DOCS_URL } from "@/lib/content/links";
import { telegramPlatform } from "@/lib/content/community";

export default function CommunityCTA() {
  return (
    <section className="relative overflow-hidden border-t border-ink-600 py-28 sm:py-36">
      <CommunityMapBackdrop idPrefix="community-cta" />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 text-center">
        <RevealOnScroll>
          <div className="flex flex-col items-center gap-8">
            <span className="h-px w-16 bg-gold-500" />

            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight text-bone">
              THE WORLD IS BEING BUILT.
            </h2>

            <p className="max-w-xl text-base leading-relaxed text-bone-dim sm:text-lg">
              Join the community and follow Echelon from its earliest
              foundations to the world it becomes.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
              <Button
                variant="primary"
                href={telegramPlatform.href}
                external
              >
                Join Telegram
              </Button>
              <Button variant="secondary" href={DOCS_URL}>
                Read the Docs
              </Button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
