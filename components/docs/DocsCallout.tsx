import { Compass, Info, ShieldAlert, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CalloutVariant = "info" | "planned" | "principle" | "guardrail";

const VARIANT_CONFIG: Record<
  CalloutVariant,
  { icon: LucideIcon; label: string; border: string; iconColor: string }
> = {
  info: {
    icon: Info,
    label: "Note",
    border: "border-steel-500/50",
    iconColor: "text-steel-300"
  },
  planned: {
    icon: Clock,
    label: "Planned",
    border: "border-bone/15 border-dashed",
    iconColor: "text-bone-dim"
  },
  principle: {
    icon: Compass,
    label: "Principle",
    border: "border-gold-500/40",
    iconColor: "text-gold-400"
  },
  guardrail: {
    icon: ShieldAlert,
    label: "Important",
    border: "border-steel-400/50",
    iconColor: "text-steel-300"
  }
};

export default function DocsCallout({
  variant,
  title,
  text
}: {
  variant: CalloutVariant;
  title?: string;
  text: string;
}) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  return (
    <div
      className={`my-6 flex gap-3.5 rounded-sm border bg-ink-800/60 px-5 py-4 ${config.border}`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.iconColor}`} strokeWidth={1.75} />
      <div className="min-w-0">
        <p className={`text-xs font-medium tracking-wide ${config.iconColor}`}>
          {title ?? config.label}
        </p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-bone-dim">{text}</p>
      </div>
    </div>
  );
}
