import type { TradableAsset } from "@/types/market";
import { calendarToMinutes } from "./time";

/** Awal simulasi (1 Januari 2012) — dihitung lokal (bukan impor dari characterFactory.ts) supaya katalog aset tetap modul "daun" tanpa dependensi silang, sama seperti productCatalog.ts/jobCatalog.ts. */
const GENESIS = calendarToMinutes({ year: 2012, month: 1, day: 1 });

/**
 * Mata uang asing yang bisa ditukar (beli/jual) lewat halaman Pasar,
 * dikutip sebagai "harga" = kurs dalam Rupiah per 1 unit (per 100 unit
 * untuk Yen, supaya angkanya tetap enak dibaca). Rupiah sendiri (IDR)
 * TIDAK punya entri di sini — dia mata uang dasar `finance.cash`, bukan
 * aset yang diperdagangkan terhadap dirinya sendiri.
 *
 * `basePrice` adalah titik awal kurs pada 1 Januari 2012 — nilai bulat
 * yang masuk akal secara kasar untuk suasana permainan, bukan kutipan
 * resmi. Pergerakan setelahnya sepenuhnya simulasi (lihat priceEngine.ts).
 */
export const CURRENCY_ASSETS: TradableAsset[] = [
  {
    id: "usd",
    assetClass: "currency",
    symbol: "USD",
    name: "Dolar Amerika Serikat",
    basePrice: 9_000,
    annualDriftPct: 0.03,
    annualVolatilityPct: 0.08,
    genesisMinute: GENESIS,
  },
  {
    id: "eur",
    assetClass: "currency",
    symbol: "EUR",
    name: "Euro",
    basePrice: 11_500,
    annualDriftPct: 0.02,
    annualVolatilityPct: 0.09,
    genesisMinute: GENESIS,
  },
  {
    id: "jpy100",
    assetClass: "currency",
    symbol: "JPY/100",
    name: "Yen Jepang (per 100)",
    basePrice: 11_000,
    annualDriftPct: 0.01,
    annualVolatilityPct: 0.1,
    genesisMinute: GENESIS,
  },
  {
    id: "sgd",
    assetClass: "currency",
    symbol: "SGD",
    name: "Dolar Singapura",
    basePrice: 7_300,
    annualDriftPct: 0.025,
    annualVolatilityPct: 0.07,
    genesisMinute: GENESIS,
  },
  {
    id: "cny",
    assetClass: "currency",
    symbol: "CNY",
    name: "Yuan Tiongkok",
    basePrice: 1_450,
    annualDriftPct: 0.02,
    annualVolatilityPct: 0.07,
    genesisMinute: GENESIS,
  },
];
