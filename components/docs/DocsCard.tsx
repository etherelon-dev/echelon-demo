export default function DocsCard({
  title,
  text
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-sm border border-ink-500 bg-ink-800/40 p-5 transition-colors duration-200 hover:border-gold-500/40">
      <p className="font-display text-[15px] font-medium text-bone">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-bone-dim">{text}</p>
    </div>
  );
}
