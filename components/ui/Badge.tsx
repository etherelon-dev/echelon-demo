import type { ReactNode } from "react";

type BadgeTone = "gold" | "muted";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
};

const toneClasses: Record<BadgeTone, string> = {
  gold: "border-gold-500/30 bg-gold-500/5 text-gold-300",
  muted: "border-ink-500 bg-ink-800/60 text-bone-faint"
};

export default function Badge({ children, tone = "gold" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs tracking-[0.18em] ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
