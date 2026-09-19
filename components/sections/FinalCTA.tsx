import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function FinalCTA() {
  return (
    <section className="border-t border-ink-600 py-28 sm:py-36">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 text-center">
        <RevealOnScroll>
          <div className="flex flex-col items-center gap-8">
            <span className="h-px w-16 bg-gold-500" />

            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight text-bone">
              WHAT WILL YOU BUILD?
            </h2>

            <div className="flex flex-col gap-1.5 text-base text-bone-dim sm:text-lg">
              <p>Every empire begins with territory.</p>
              <p>Every kingdom begins with a decision.</p>
              <p>Every history begins with a player.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
              <Button variant="primary" href="/demo">
                Try Demo
              </Button>
              <Button variant="secondary">Join Waitlist</Button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
