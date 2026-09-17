import type { TradableAsset } from "@/types/market";
import { calendarToMinutes } from "./time";

const GENESIS_2012 = calendarToMinutes({ year: 2012, month: 1, day: 1 });

/**
 * Saham individual di Bursa Efek Indonesia (fiktif). SENGAJA memakai nama
 * & ticker perusahaan REKAAN, bukan emiten sungguhan — mensimulasikan
 * harga saham atas nama perusahaan nyata akan menyesatkan (seolah data
 * pergerakan harga historisnya faktual, padahal seluruhnya hasil random
 * walk buatan lib/simulation/priceEngine.ts). "IHSG" & indeks luar negeri
 * (lib/simulation/indexCatalog.ts) dipakai sebagai TOLOK UKUR pasar —
 * bukan bagian dari daftar saham individual ini.
 *
 * Dua emiten (`gdnu`, `esin`) sengaja diberi genesisMinute setelah 2012 —
 * "IPO" di tengah permainan — supaya anti-anakronisme (Product/Job Fase 3)
 * juga berlaku di pasar saham: perusahaan rintisan digital/energi baru
 * mulai bisa dibeli setelah "melantai di bursa".
 */
export const STOCK_ASSETS: TradableAsset[] = [
  {
    id: "bnmk",
    assetClass: "stock",
    symbol: "BNMK",
    name: "Bank Nusantara Makmur Tbk",
    sector: "Perbankan",
    basePrice: 4_500,
    annualDriftPct: 0.1,
    annualVolatilityPct: 0.25,
    genesisMinute: GENESIS_2012,
  },
  {
    id: "tpdi",
    assetClass: "stock",
    symbol: "TPDI",
    name: "Telkom Persada Digital Tbk",
    sector: "Telekomunikasi",
    basePrice: 3_200,
    annualDriftPct: 0.08,
    annualVolatilityPct: 0.2,
    genesisMinute: GENESIS_2012,
  },
  {
    id: "stab",
    assetClass: "stock",
    symbol: "STAB",
    name: "Sumber Tambang Abadi Tbk",
    sector: "Pertambangan",
    basePrice: 2_100,
    annualDriftPct: 0.06,
    annualVolatilityPct: 0.35,
    genesisMinute: GENESIS_2012,
  },
  {
    id: "psej",
    assetClass: "stock",
    symbol: "PSEJ",
    name: "Pangan Sejahtera Tbk",
    sector: "Barang konsumen",
    basePrice: 1_500,
    annualDriftPct: 0.09,
    annualVolatilityPct: 0.18,
    genesisMinute: GENESIS_2012,
  },
  {
    id: "kcak",
    assetClass: "stock",
    symbol: "KCAK",
    name: "Konstruksi Cakrawala Tbk",
    sector: "Konstruksi & infrastruktur",
    basePrice: 980,
    annualDriftPct: 0.07,
    annualVolatilityPct: 0.28,
    genesisMinute: GENESIS_2012,
  },
  {
    id: "ogpk",
    assetClass: "stock",
    symbol: "OGPK",
    name: "Otomotif Garuda Perkasa Tbk",
    sector: "Otomotif",
    basePrice: 2_500,
    annualDriftPct: 0.05,
    annualVolatilityPct: 0.22,
    genesisMinute: GENESIS_2012,
  },
  {
    id: "gdnu",
    assetClass: "stock",
    symbol: "GDNU",
    name: "Gerbang Digital Nusantara Tbk",
    sector: "Teknologi/e-commerce",
    basePrice: 500,
    annualDriftPct: 0.15,
    annualVolatilityPct: 0.45,
    genesisMinute: calendarToMinutes({ year: 2019, month: 3, day: 1 }),
    note: "Perusahaan rintisan digital — baru melantai di bursa (IPO) Maret 2019.",
  },
  {
    id: "esin",
    assetClass: "stock",
    symbol: "ESIN",
    name: "Energi Surya Indonesia Tbk",
    sector: "Energi terbarukan",
    basePrice: 800,
    annualDriftPct: 0.12,
    annualVolatilityPct: 0.3,
    genesisMinute: calendarToMinutes({ year: 2021, month: 6, day: 1 }),
    note: "IPO Juni 2021, seiring meningkatnya minat pada energi terbarukan.",
  },
];
