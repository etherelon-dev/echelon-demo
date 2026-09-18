export default function DemoHero() {
  return (
    <section className="border-b border-ink-600 bg-ink-900 px-6 pb-8 pt-10 text-center sm:pb-10 sm:pt-14">
      <a
        href="/"
        className="font-display text-xs uppercase tracking-[0.4em] text-gold-400/80 transition-colors hover:text-gold-300"
      >
        Echelon
      </a>
      <h1 className="mt-3 font-display text-[clamp(1.5rem,4vw,2.75rem)] font-semibold tracking-[0.03em] text-bone">
        Build. Rule. Shape History.
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm text-bone-dim sm:text-base">
        A persistent grand-strategy world shaped by its players.
      </p>
    </section>
  );
}
