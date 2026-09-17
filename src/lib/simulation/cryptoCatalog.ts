import type { TradableAsset } from "@/types/market";
import { calendarToMinutes } from "./time";

/**
 * Kripto — "mengikuti kronologi historis" (docs/ROADMAP.md Fase 4): setiap
 * aset baru bisa dibeli/dijual mulai `genesisMinute` yang mengikuti tahun
 * peluncuran ASLI mata uang kripto tersebut di dunia nyata (fakta publik
 * yang cukup pasti, sama seperti releaseYear di lib/simulation/productCatalog.ts
 * & availableFromYear di lib/simulation/jobCatalog.ts) — sebelum tahun itu,
 * lib/simulation/priceEngine.ts::isAssetAvailable() menolaknya.
 *
 * `basePrice` (harga di genesisMinute) & parameter drift/volatilitas
 * SEPENUHNYA gaya bermain (kripto secara umum jauh lebih liar daripada
 * saham/mata uang konvensional) — BUKAN kutipan harga historis nyata.
 * Karena permainan baru dimulai 1 Januari 2012, aset yang lahir sebelum
 * itu (mis. Bitcoin, 2009) akan sudah "berjalan" beberapa tahun secara
 * simulasi saat karakter pertama kali membuka halaman Pasar.
 */
export const CRYPTO_ASSETS: TradableAsset[] = [
  {
    id: "btc",
    assetClass: "crypto",
    symbol: "BTC",
    name: "Bitcoin",
    basePrice: 1_000,
    annualDriftPct: 0.6,
    annualVolatilityPct: 0.9,
    genesisMinute: calendarToMinutes({ year: 2009, month: 1, day: 3 }),
    note: "Kripto pertama — blok genesis 3 Januari 2009.",
  },
  {
    id: "ltc",
    assetClass: "crypto",
    symbol: "LTC",
    name: "Litecoin",
    basePrice: 500,
    annualDriftPct: 0.35,
    annualVolatilityPct: 0.7,
    genesisMinute: calendarToMinutes({ year: 2011, month: 10, day: 7 }),
    note: "Diluncurkan Oktober 2011.",
  },
  {
    id: "xrp",
    assetClass: "crypto",
    symbol: "XRP",
    name: "Ripple (XRP)",
    basePrice: 50,
    annualDriftPct: 0.3,
    annualVolatilityPct: 0.75,
    genesisMinute: calendarToMinutes({ year: 2012, month: 6, day: 2 }),
    note: "Diluncurkan Juni 2012.",
  },
  {
    id: "doge",
    assetClass: "crypto",
    symbol: "DOGE",
    name: "Dogecoin",
    basePrice: 1,
    annualDriftPct: 0.4,
    annualVolatilityPct: 1.1,
    genesisMinute: calendarToMinutes({ year: 2013, month: 12, day: 6 }),
    note: "Koin meme, diluncurkan Desember 2013 — paling liar di katalog ini.",
  },
  {
    id: "eth",
    assetClass: "crypto",
    symbol: "ETH",
    name: "Ethereum",
    basePrice: 15_000,
    annualDriftPct: 0.5,
    annualVolatilityPct: 0.8,
    genesisMinute: calendarToMinutes({ year: 2015, month: 7, day: 30 }),
    note: "Jaringan utama (mainnet) aktif 30 Juli 2015.",
  },
  {
    id: "bnb",
    assetClass: "crypto",
    symbol: "BNB",
    name: "Binance Coin",
    basePrice: 2_000,
    annualDriftPct: 0.45,
    annualVolatilityPct: 0.85,
    genesisMinute: calendarToMinutes({ year: 2017, month: 7, day: 25 }),
    note: "Diluncurkan lewat ICO Juli 2017.",
  },
  {
    id: "ada",
    assetClass: "crypto",
    symbol: "ADA",
    name: "Cardano",
    basePrice: 30,
    annualDriftPct: 0.3,
    annualVolatilityPct: 0.75,
    genesisMinute: calendarToMinutes({ year: 2017, month: 9, day: 29 }),
    note: "Diluncurkan September 2017.",
  },
  {
    id: "sol",
    assetClass: "crypto",
    symbol: "SOL",
    name: "Solana",
    basePrice: 5_000,
    annualDriftPct: 0.5,
    annualVolatilityPct: 0.9,
    genesisMinute: calendarToMinutes({ year: 2020, month: 3, day: 16 }),
    note: "Mainnet aktif Maret 2020.",
  },
];
