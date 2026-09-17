import type { TurnLogEntry } from "@/types/simulation";
import { formatCalendarDateTimeID, minutesToCalendar } from "@/lib/simulation/time";

interface NarrativeFeedProps {
  turns: TurnLogEntry[];
}

const SEVERITY_LABEL: Record<string, string> = {
  info: "Info",
  minor: "Kecil",
  major: "Besar",
  critical: "Kritis",
};

export function NarrativeFeed({ turns }: NarrativeFeedProps) {
  if (turns.length === 0) {
    return (
      <p className="font-ledger text-xs text-ink-muted">
        Belum ada catatan. Ketik perintah di atas untuk memulai halaman pertama.
      </p>
    );
  }

  const reversed = [...turns].reverse();

  return (
    <ul className="space-y-4">
      {reversed.map((turn) => {
        const cal = minutesToCalendar(turn.atMinute);
        return (
          <li
            key={turn.id}
            className={`border-l-2 pl-4 ${turn.rejected ? "border-stamp/60" : "border-brass/60"}`}
          >
            <p className="font-ledger text-[11px] text-ink-muted">
              {formatCalendarDateTimeID(cal)}
              {turn.playerInput ? ` · "${turn.playerInput}"` : ""}
            </p>
            <p className="mt-1 font-heading text-lg italic text-ink">{turn.narrativeTitle}</p>
            <p className="mt-1 whitespace-pre-line font-ledger text-sm text-ink">
              {turn.narrativeText}
            </p>

            {turn.effectSummaries.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {turn.effectSummaries.map((s) => (
                  <span
                    key={s}
                    className="border border-paper-line px-2 py-0.5 font-ledger text-[11px] text-ink-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {turn.events.length > 0 && (
              <div className="mt-2 space-y-1">
                {turn.events.map((ev, i) => (
                  <p key={`${turn.id}-event-${i}`} className="font-ledger text-xs text-brass">
                    ⚠ [{SEVERITY_LABEL[ev.severity] ?? ev.severity}] {ev.title} — {ev.description}
                  </p>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
