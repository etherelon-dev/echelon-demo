import type { City, Country } from "@/types/world";

/**
 * Katalog statis negara & kota (Fase 4 — "Dunia"). Pola sama seperti
 * PRODUCT_CATALOG/JOB_CATALOG di Fase 3: bukan bagian dari save, hanya
 * dirujuk lewat id dari Character.location (types/character.ts).
 *
 * Statistik `baseline` adalah TITIK AWAL ilustratif untuk simulasi tahun
 * 2012 (dipilih agar terasa masuk akal secara kasar), BUKAN data resmi
 * lembaga statistik mana pun — lihat lib/simulation/macroEconomy.ts untuk
 * bagaimana angka ini berevolusi secara deterministik seiring waktu.
 *
 * Indonesia adalah SATU-SATUNYA negara domisili yang bisa dipilih pemain
 * (lihat catatan di types/world.ts) — negara lain di sini murni konteks
 * dunia & penerbit mata uang/indeks asing yang bisa diperdagangkan lewat
 * halaman Pasar (lib/simulation/currencyCatalog.ts, indexCatalog.ts).
 */
export const HOME_COUNTRY_ID = "id_indonesia";

export const COUNTRY_CATALOG: Country[] = [
  {
    id: HOME_COUNTRY_ID,
    name: "Indonesia",
    currencyCode: "IDR",
    baseline: { inflationPct: 4.3, unemploymentPct: 6.1, gdpGrowthPct: 6.0, interestRatePct: 5.75 },
  },
  {
    id: "id_amerika_serikat",
    name: "Amerika Serikat",
    currencyCode: "USD",
    baseline: { inflationPct: 2.1, unemploymentPct: 8.1, gdpGrowthPct: 2.2, interestRatePct: 0.25 },
  },
  {
    id: "id_singapura",
    name: "Singapura",
    currencyCode: "SGD",
    baseline: { inflationPct: 4.6, unemploymentPct: 2.0, gdpGrowthPct: 3.4, interestRatePct: 0.3 },
  },
  {
    id: "id_jepang",
    name: "Jepang",
    currencyCode: "JPY",
    baseline: { inflationPct: 0.0, unemploymentPct: 4.3, gdpGrowthPct: 1.7, interestRatePct: 0.1 },
  },
  {
    id: "id_tiongkok",
    name: "Tiongkok",
    currencyCode: "CNY",
    baseline: { inflationPct: 2.6, unemploymentPct: 4.1, gdpGrowthPct: 7.7, interestRatePct: 6.0 },
  },
  {
    id: "id_uni_eropa",
    name: "Uni Eropa",
    currencyCode: "EUR",
    baseline: { inflationPct: 2.5, unemploymentPct: 10.5, gdpGrowthPct: -0.4, interestRatePct: 0.75 },
  },
];

export const DEFAULT_CITY_ID = "ct_jakarta";

export const CITY_CATALOG: City[] = [
  { id: DEFAULT_CITY_ID, countryId: HOME_COUNTRY_ID, name: "Jakarta", isCapital: true, costOfLivingIndex: 1.3 },
  { id: "ct_surabaya", countryId: HOME_COUNTRY_ID, name: "Surabaya", costOfLivingIndex: 1.0 },
  { id: "ct_bandung", countryId: HOME_COUNTRY_ID, name: "Bandung", costOfLivingIndex: 0.9 },
  { id: "ct_medan", countryId: HOME_COUNTRY_ID, name: "Medan", costOfLivingIndex: 0.85 },
  { id: "ct_yogyakarta", countryId: HOME_COUNTRY_ID, name: "Yogyakarta", costOfLivingIndex: 0.8 },
  { id: "ct_makassar", countryId: HOME_COUNTRY_ID, name: "Makassar", costOfLivingIndex: 0.85 },

  { id: "ct_new_york", countryId: "id_amerika_serikat", name: "New York", isCapital: false, costOfLivingIndex: 2.4 },
  { id: "ct_singapore", countryId: "id_singapura", name: "Singapura", isCapital: true, costOfLivingIndex: 2.1 },
  { id: "ct_tokyo", countryId: "id_jepang", name: "Tokyo", isCapital: true, costOfLivingIndex: 1.9 },
  { id: "ct_shanghai", countryId: "id_tiongkok", name: "Shanghai", isCapital: false, costOfLivingIndex: 1.2 },
  { id: "ct_frankfurt", countryId: "id_uni_eropa", name: "Frankfurt", isCapital: false, costOfLivingIndex: 1.7 },
];

export function getCountry(id: string): Country | null {
  return COUNTRY_CATALOG.find((c) => c.id === id) ?? null;
}

export function getCity(id: string): City | null {
  return CITY_CATALOG.find((c) => c.id === id) ?? null;
}

/** Kota yang bisa DIHUNI pemain lewat performRelocate() — hanya kota-kota di HOME_COUNTRY_ID (lihat catatan cakupan di types/world.ts). */
export function listHomeCities(): City[] {
  return CITY_CATALOG.filter((c) => c.countryId === HOME_COUNTRY_ID);
}

/** Negara-negara lain di luar domisili pemain — dipakai app/game/dunia untuk dashboard perbandingan ekonomi dunia. */
export function listForeignCountries(): Country[] {
  return COUNTRY_CATALOG.filter((c) => c.id !== HOME_COUNTRY_ID);
}
