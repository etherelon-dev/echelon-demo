import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StrategicMap from "@/components/map/StrategicMap";
import { DOCS_URL } from "@/lib/content/links";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-20 pt-40 sm:pb-28 sm:pt-44"
    >
      <div className="mx-auto flex max-w-content flex-col gap-16 px-6 lg:grid lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12">
        <div className="flex flex-col gap-7">
          <Badge>PLAYER-DRIVEN · PERSISTENT · ON-CHAIN</Badge>

          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.05] text-bone">
            BUILD. RULE.
            <br />
            SHAPE HISTORY.
          </h1>

          <p className="font-display text-xl text-gold-300 sm:text-2xl">
            A living world shaped by strategy, power, and ownership.
          </p>

          <p className="max-w-xl text-base leading-relaxed text-bone-dim sm:text-lg">
            Echelon is a player-driven grand strategy game where territories
            become kingdoms, economies become powers, and every decision
            contributes to a living history.
          </p>

          <div className="flex flex-wrap items-center gap-5 pt-2">
            <Button variant="primary" href="/demo">
              Try Demo
            </Button>
            <Button variant="secondary">Join Waitlist</Button>
            <Button variant="ghost" href={DOCS_URL}>
              Read Docs
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full">
          <StrategicMap />
        </div>
      </div>
    </section>
  );
}
