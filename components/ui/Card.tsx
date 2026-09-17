import type { LucideIcon } from "lucide-react";

type CardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function Card({ title, description, icon: Icon }: CardProps) {
  return (
    <div className="group flex flex-col gap-5 rounded-sm border border-ink-500 bg-ink-800/60 p-7 transition-colors duration-300 hover:border-gold-500/50">
      <Icon
        className="h-6 w-6 text-gold-400 transition-colors duration-300 group-hover:text-gold-300"
        strokeWidth={1.5}
      />
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-lg font-medium text-bone">{title}</h3>
        <p className="text-sm leading-relaxed text-bone-dim">{description}</p>
      </div>
    </div>
  );
}
