interface NeedBarProps {
  label: string;
  value: number; // 0-100
}

export function NeedBar({ label, value }: NeedBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 font-ledger text-xs text-ink-muted">{label}</span>
      <div className="h-2 flex-1 border border-ink-muted/40">
        <div className="h-full bg-brass" style={{ width: `${clamped}%` }} />
      </div>
      <span className="w-8 shrink-0 text-right font-ledger text-xs text-ink">
        {Math.round(clamped)}
      </span>
    </div>
  );
}
