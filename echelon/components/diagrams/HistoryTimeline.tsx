import { historyEvents } from "@/lib/content/historyEvents";

export default function HistoryTimeline() {
  return (
    <ol className="flex flex-col">
      {historyEvents.map((event, index) => (
        <li key={event.year} className="grid grid-cols-[88px_24px_1fr] gap-x-4">
          <span className="pt-1 text-sm text-gold-300">{event.year}</span>
          <div className="flex flex-col items-center">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-gold-400" />
            {index !== historyEvents.length - 1 ? (
              <span className="w-px flex-1 bg-ink-500" />
            ) : null}
          </div>
          <p className="pb-10 text-base text-bone sm:text-lg">{event.title}</p>
        </li>
      ))}
    </ol>
  );
}
