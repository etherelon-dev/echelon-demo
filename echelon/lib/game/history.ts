import type { HistoryEvent } from "./types";

let nextEventSeq = 0;

export function createHistoryEvent(year: number, text: string): HistoryEvent {
  nextEventSeq += 1;
  return { id: `evt-${year}-${nextEventSeq}`, year, text };
}

export const DEMO_START_YEAR = 1;
