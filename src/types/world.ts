import type { EntityId } from "./common";

/**
 * Fase 4 — Dunia. Negara & kota disimpan sebagai KATALOG STATIS di kode
 * (lib/simulation/worldCatalog.ts), sama seperti pola PRODUCT_CATALOG /
 * JOB_CATALOG di Fase 3 — bukan bagian dari save. `Character.location`
 * (types/character.ts, sudah ada sejak Fase 1) hanya menyimpan REFERENSI
 * id ke katalog ini, supaya menambah/mengubah negara & kota tidak pernah
 * memerlukan migrasi save.
 *
 * CAKUPAN FASE 4: karakter tetap berdomisili di Indonesia (mata uang dasar
 * seluruh Fase 1-3 adalah Rupiah — sewa, gaji, harga produk, dst). Pemain
 * BISA pindah KOTA (lihat lib/simulation/engine.ts::performRelocate), tapi
 * BELUM bisa pindah NEGARA — itu memerlukan mendesain ulang seluruh sistem
 * finansial jadi multi-mata-uang asli, di luar cakupan pembaruan ini
 * (kandidat realistis untuk Fase 5+). Negara-negara lain di katalog ini
 * berfungsi sebagai KONTEKS DUNIA (ekonomi makro pembanding, penerbit
 * mata uang & indeks saham asing yang bisa diperdagangkan lewat halaman
 * Pasar — lihat types/market.ts), bukan tujuan domisili.
 */

export interface MacroEconomyBaseline {
  /** Inflasi tahunan (%), baseline ilustratif awal simulasi (2012) — BUKAN data resmi real-time. */
  inflationPct: number;
  /** Tingkat pengangguran (%). */
  unemploymentPct: number;
  /** Pertumbuhan PDB tahunan (%). */
  gdpGrowthPct: number;
  /** Suku bunga acuan bank sentral (%). */
  interestRatePct: number;
}

export interface Country {
  id: EntityId;
  name: string;
  /** Kode mata uang resmi negara ini — lihat CURRENCY_ASSETS di lib/simulation/currencyCatalog.ts. "IDR" tidak punya entri di sana (mata uang dasar pemain, tidak diperdagangkan terhadap dirinya sendiri). */
  currencyCode: string;
  baseline: MacroEconomyBaseline;
}

export interface City {
  id: EntityId;
  countryId: EntityId;
  name: string;
  /** true jika ini ibu kota — sekadar label tampilan. */
  isCapital?: boolean;
  /** Pengali biaya hidup relatif (1.0 = rata-rata nasional). Informasional Fase 4 — belum menggantikan harga tetap Fase 3 (lihat lib/simulation/productCatalog.ts), supaya keseimbangan ekonomi Fase 3 yang sudah diuji tidak berubah. */
  costOfLivingIndex: number;
}

/**
 * Statistik makro suatu negara pada tahun tertentu. TIDAK disimpan sebagai
 * time-series di save — dihitung ulang deterministik dari saveId + negara +
 * waktu simulasi lewat lib/simulation/macroEconomy.ts (mirip pola RNG
 * peristiwa dunia di lib/simulation/rng.ts & lib/simulation/randomEvents.ts).
 */
export interface MacroEconomySnapshot {
  countryId: EntityId;
  year: number;
  inflationPct: number;
  unemploymentPct: number;
  gdpGrowthPct: number;
  interestRatePct: number;
}
