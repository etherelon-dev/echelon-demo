import type { TradableAsset } from "@/types/market";
import { calendarToMinutes } from "./time";

const GENESIS_2012 = calendarToMinutes({ year: 2012, month: 1, day: 1 });

/**
 * Bukan indeks mentah (poin IHSG/S&P 500 bukan "harga" yang bisa dibeli
 * langsung) — melainkan REKSA DANA INDEKS yang MELACAK pergerakan tiap
 * indeks, dikutip per unit dalam Rupiah dengan NAV awal Rp1.000/unit
 * (konvensi umum reksa dana Indonesia), supaya konsisten bisa dibeli
 * pakai `finance.cash` seperti aset lain. Parameter drift/volatilitas
 * dipilih agar terasa mencerminkan KARAKTER tiap pasar secara kasar
 * (mis. IHSG diasumsikan sedikit lebih fluktuatif daripada S&P 500, dan
 * versi Rupiah di sini juga membawa tren pelemahan Rupiah jangka panjang)
 * — bukan replikasi data historis nyata.
 */
export const INDEX_ASSETS: TradableAsset[] = [
  {
    id: "ihsg",
    assetClass: "index",
    symbol: "IHSG",
    name: "Reksa Dana Indeks IHSG",
    sector: "Indonesia — bursa gabungan",
    basePrice: 1_000,
    annualDriftPct: 0.07,
    annualVolatilityPct: 0.18,
    genesisMinute: GENESIS_2012,
  },
  {
    id: "sp500",
    assetClass: "index",
    symbol: "S&P500",
    name: "Reksa Dana Indeks S&P 500 (dalam Rupiah)",
    sector: "Amerika Serikat — 500 perusahaan besar",
    basePrice: 1_000,
    annualDriftPct: 0.09,
    annualVolatilityPct: 0.16,
    genesisMinute: GENESIS_2012,
    note: "Dikutip dalam Rupiah — sudah memperhitungkan tren kurs USD/IDR jangka panjang.",
  },
  {
    id: "nikkei225",
    assetClass: "index",
    symbol: "NIKKEI225",
    name: "Reksa Dana Indeks Nikkei 225 (dalam Rupiah)",
    sector: "Jepang — 225 perusahaan besar",
    basePrice: 1_000,
    annualDriftPct: 0.05,
    annualVolatilityPct: 0.2,
    genesisMinute: GENESIS_2012,
  },
];
