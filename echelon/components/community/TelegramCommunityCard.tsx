import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { telegramPlatform } from "@/lib/content/community";

export default function TelegramCommunityCard() {
  const Icon = telegramPlatform.icon;

  return (
    <section className="border-t border-ink-600 py-20 sm:py-28">
      <div className="mx-auto max-w-content px-6">
        <RevealOnScroll>
          <div className="group relative overflow-hidden rounded-sm border border-gold-500/40 bg-ink-800/60 p-8 transition-colors duration-300 hover:border-gold-400 sm:p-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"
            />

            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-gold-500/40 bg-gold-500/5">
                  <Icon
                    className="h-6 w-6 text-gold-300"
                    strokeWidth={1.5}
                  />
                </span>

                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-xl font-semibold tracking-wide text-bone">
                      TELEGRAM
                    </h2>
                    <Badge>AVAILABLE NOW</Badge>
                  </div>
                  <p className="max-w-md text-sm leading-relaxed text-bone-dim sm:text-base">
                    {telegramPlatform.description}
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                href={telegramPlatform.href}
                external
                className="shrink-0"
              >
                Join Telegram
              </Button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
