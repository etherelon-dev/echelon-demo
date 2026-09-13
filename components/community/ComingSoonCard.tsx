import Badge from "@/components/ui/Badge";
import type { CommunityPlatform } from "@/types/content";

type ComingSoonCardProps = {
  platform: CommunityPlatform;
};

export default function ComingSoonCard({ platform }: ComingSoonCardProps) {
  const Icon = platform.icon;

  return (
    <div
      aria-disabled="true"
      className="flex flex-col gap-6 rounded-sm border border-ink-600 bg-ink-800/30 p-7 opacity-70"
    >
      <div className="flex items-center justify-between gap-3">
        <Icon className="h-5 w-5 text-bone-faint" strokeWidth={1.5} />
        <Badge tone="muted">COMING SOON</Badge>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-display text-lg font-medium text-bone-dim">
          {platform.label.toUpperCase()}
        </h3>
        <p className="text-sm leading-relaxed text-bone-faint">
          {platform.description}
        </p>
      </div>
    </div>
  );
}
