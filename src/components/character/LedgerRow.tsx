interface LedgerRowProps {
  label: string;
  value: string;
  emphasis?: "normal" | "debt";
}

export function LedgerRow({ label, value, emphasis = "normal" }: LedgerRowProps) {
  return (
    <div className="flex items-baseline justify-between border-b border-dotted border-paper-line py-1.5">
      <span className="font-ledger text-sm text-ink-muted">{label}</span>
      <span
        className={`font-ledger text-sm ${emphasis === "debt" ? "text-stamp" : "text-ink"}`}
      >
        {value}
      </span>
    </div>
  );
}
