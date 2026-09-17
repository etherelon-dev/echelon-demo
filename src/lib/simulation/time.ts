import { SIMULATION_EPOCH, type CalendarDateTime, type SimulationMinutes } from "@/types/time";

const EPOCH_MS = Date.parse(SIMULATION_EPOCH);
const MS_PER_MINUTE = 60_000;

/** Mengubah menit simulasi menjadi tanggal kalender (UTC, deterministik — tidak bergantung timezone browser). */
export function minutesToCalendar(minutes: SimulationMinutes): CalendarDateTime {
  const ms = EPOCH_MS + minutes * MS_PER_MINUTE;
  const d = new Date(ms);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    weekday: d.getUTCDay(),
  };
}

export function calendarToMinutes(cal: {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
}): SimulationMinutes {
  const ms = Date.UTC(cal.year, cal.month - 1, cal.day, cal.hour ?? 0, cal.minute ?? 0);
  return Math.round((ms - EPOCH_MS) / MS_PER_MINUTE);
}

/** Format tanggal untuk atribut `<input type="date">`, mis. "2012-01-01" (bukan untuk ditampilkan ke pemain). */
export function calendarToISODateString(cal: CalendarDateTime): string {
  const y = String(cal.year).padStart(4, "0");
  const m = String(cal.month).padStart(2, "0");
  const d = String(cal.day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Kebalikan dari calendarToISODateString — mengurai nilai `<input type="date">`
 * ("YYYY-MM-DD") menjadi menit simulasi. Mengembalikan null jika formatnya
 * tidak valid (input tanggal browser selalu ISO, tapi tetap dijaga). */
export function isoDateStringToMinutes(value: string): SimulationMinutes | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  return calendarToMinutes({ year: Number(y), month: Number(m), day: Number(d) });
}

/** Format tanggal untuk UI, mis. "17 April 2012" */
const MONTH_NAMES_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function formatCalendarDateID(cal: CalendarDateTime): string {
  return `${cal.day} ${MONTH_NAMES_ID[cal.month - 1]} ${cal.year}`;
}

export function formatCalendarDateTimeID(cal: CalendarDateTime): string {
  const hh = String(cal.hour).padStart(2, "0");
  const mm = String(cal.minute).padStart(2, "0");
  return `${formatCalendarDateID(cal)}, ${hh}:${mm}`;
}

/** Menambah N bulan kalender (menangani rollover tahun & kliping akhir bulan, mis. 31 Jan + 1 bulan -> 28/29 Feb). */
export function addCalendarMonths(minute: SimulationMinutes, months: number): SimulationMinutes {
  const cal = minutesToCalendar(minute);
  const totalMonthIndex = cal.month - 1 + months;
  const year = cal.year + Math.floor(totalMonthIndex / 12);
  const month = ((totalMonthIndex % 12) + 12) % 12;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(cal.day, daysInMonth);
  return calendarToMinutes({ year, month: month + 1, day, hour: cal.hour, minute: cal.minute });
}

/** Menghitung umur (tahun penuh) dari menit lahir dan menit "sekarang". */
export function ageInYears(birthMinute: SimulationMinutes, nowMinute: SimulationMinutes): number {
  const birth = minutesToCalendar(birthMinute);
  const now = minutesToCalendar(nowMinute);
  let age = now.year - birth.year;
  const hasHadBirthdayThisYear =
    now.month > birth.month || (now.month === birth.month && now.day >= birth.day);
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

/**
 * Durasi standar aksi pemain, dalam menit (MASTER_PROMPT.md #13).
 * Nilai eksak bisa disesuaikan simulation engine berdasarkan konteks
 * (jarak, kompleksitas, dsb) — ini adalah baseline.
 */
export const ACTION_DURATIONS_MINUTES = {
  eat: 20,
  shopShort: 30,
  shopLong: 120,
  workShift: 8 * 60,
  studyShort: 2 * 60,
  studyLong: 6 * 60,
  sleep: 8 * 60,
  /** Fase 4: transaksi di halaman Pasar (beli/jual mata uang/saham/indeks/kripto) — cepat, mirip shopShort. */
  tradeMarket: 20,
  /** Fase 4: pindah kota (performRelocate di lib/simulation/engine.ts) — makan waktu berhari-hari (kemasi barang, cari tempat baru), bukan sekadar jalan-jalan. */
  relocate: 3 * 24 * 60,
} as const;
