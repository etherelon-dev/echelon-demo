import type { ISODateTime } from "./common";

/**
 * Waktu simulasi disimpan sebagai satu angka: jumlah menit sejak epoch simulasi
 * (2012-01-01T00:00:00Z = 0). Ini membuat perhitungan waktu deterministik dan
 * murah, sekaligus mudah dikonversi ke tanggal kalender saat dibutuhkan UI.
 */
export type SimulationMinutes = number;

export const SIMULATION_EPOCH: ISODateTime = "2012-01-01T00:00:00.000Z";

export interface CalendarDateTime {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number; // 0-59
  /** Nama hari dalam seminggu, 0 = Minggu */
  weekday: number;
}

export interface WorldTick {
  id: string;
  /** Waktu simulasi (menit) saat tick ini terjadi */
  atMinute: SimulationMinutes;
  /** Kategori update yang dijalankan pada tick ini */
  scope: TickScope[];
}

export type TickScope =
  | "character_needs"
  | "local"
  | "country"
  | "global_economy"
  | "markets"
  | "technology"
  | "companies"
  | "news"
  | "events";
