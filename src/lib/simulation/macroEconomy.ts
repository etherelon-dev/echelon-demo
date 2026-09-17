import type { EntityId } from "@/types/common";
import type { SimulationMinutes } from "@/types/time";
import type { MacroEconomySnapshot } from "@/types/world";
import { rngForTick } from "./rng";
import { calendarToMinutes, minutesToCalendar } from "./time";
import { getCountry } from "./worldCatalog";

/**
 * Fase 4 — statistik makro suatu negara berevolusi per TAHUN KALENDER
 * lewat random walk mean-reverting ber-seed (kembali perlahan ke baseline
 * katalog + kejutan acak tahunan) — pola yang sama seperti mesin harga
 * aset (lib/simulation/priceEngine.ts) dan peristiwa dunia acak
 * (lib/simulation/randomEvents.ts, lib/simulation/rng.ts): dihitung ulang
 * deterministik dari `saveId + negara + tahun`, TIDAK disimpan sebagai
 * time-series di save.
 *
 * CATATAN CAKUPAN: pembaruan tahunan di sini SENGAJA independen antar
 * negara & antar aset finansial (tidak ada propagasi sebab-akibat, mis.
 * inflasi tinggi belum otomatis melemahkan kurs mata uang negara itu).
 * Guncangan ekonomi & causal graph lintas sistem adalah cakupan Fase 5
 * ("Peristiwa") & Fase 8 ("Lanjutan") — lihat docs/ROADMAP.md.
 */

const GAME_START_YEAR = 2012;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Satu langkah random walk mean-reverting: 85% nilai sebelumnya + 15% tarikan ke baseline, plus kejutan acak simetris. */
function stepTowardBaseline(
  previous: number,
  baseline: number,
  shockMagnitude: number,
  rng: () => number,
  min: number,
  max: number
): number {
  const reverted = previous * 0.85 + baseline * 0.15;
  const shock = (rng() - 0.5) * 2 * shockMagnitude;
  return clamp(reverted + shock, min, max);
}

/**
 * Statistik makro suatu negara pada waktu simulasi tertentu. Mengembalikan
 * null kalau id negara tidak dikenal katalog (lihat worldCatalog.ts).
 */
export function getMacroEconomySnapshot(
  saveId: string,
  countryId: EntityId,
  nowMinute: SimulationMinutes
): MacroEconomySnapshot | null {
  const country = getCountry(countryId);
  if (!country) return null;

  const targetYear = minutesToCalendar(nowMinute).year;
  let inflationPct = country.baseline.inflationPct;
  let unemploymentPct = country.baseline.unemploymentPct;
  let gdpGrowthPct = country.baseline.gdpGrowthPct;
  let interestRatePct = country.baseline.interestRatePct;

  for (let year = GAME_START_YEAR + 1; year <= targetYear; year += 1) {
    const yearMinute = calendarToMinutes({ year, month: 1, day: 1 });
    const rng = rngForTick(`macro:${saveId}:${countryId}`, yearMinute);
    inflationPct = stepTowardBaseline(inflationPct, country.baseline.inflationPct, 2.5, rng, -5, 60);
    unemploymentPct = stepTowardBaseline(unemploymentPct, country.baseline.unemploymentPct, 1.5, rng, 0, 35);
    gdpGrowthPct = stepTowardBaseline(gdpGrowthPct, country.baseline.gdpGrowthPct, 2.5, rng, -15, 18);
    interestRatePct = stepTowardBaseline(interestRatePct, country.baseline.interestRatePct, 1.2, rng, 0, 30);
  }

  return {
    countryId,
    year: targetYear,
    inflationPct: Math.round(inflationPct * 100) / 100,
    unemploymentPct: Math.round(unemploymentPct * 100) / 100,
    gdpGrowthPct: Math.round(gdpGrowthPct * 100) / 100,
    interestRatePct: Math.round(interestRatePct * 100) / 100,
  };
}
