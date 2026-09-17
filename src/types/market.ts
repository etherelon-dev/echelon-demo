import type { EntityId, Money } from "./common";
import type { SimulationMinutes } from "./time";

/**
 * Fase 4 — Dunia: lapisan pasar finansial (mata uang & nilai tukar, pasar
 * saham, kripto). Empat kelas aset di atas kertas bermacam-macam, tapi
 * secara mekanis DIPERLAKUKAN SAMA (satu "harga per unit" yang bergerak
 * deterministik lewat lib/simulation/priceEngine.ts) — lihat `TradableAsset`.
 * Ini sengaja disederhanakan: seluruh harga dikutip dalam Rupiah per unit
 * (termasuk "harga" mata uang asing = kurs IDR-nya, dan "harga" reksa dana
 * indeks IHSG/S&P 500 = NAV per unit dalam Rupiah), supaya pemain tetap
 * bertransaksi dengan `finance.cash` yang sama seperti Toko (Fase 3) tanpa
 * perlu mesin konversi mata uang terpisah.
 */
export type AssetClass = "currency" | "stock" | "index" | "crypto";

export interface TradableAsset {
  /** id stabil, mis. "usd", "bbca", "ihsg", "btc" — dipakai sebagai kunci PortfolioHolding.assetId. */
  id: string;
  assetClass: AssetClass;
  /** Kode ticker/simbol tampilan, mis. "USD", "BBCA", "IHSG", "BTC". */
  symbol: string;
  name: string;
  /** Harga dalam Rupiah per unit pada saat genesisMinute — lihat lib/simulation/priceEngine.ts. */
  basePrice: Money;
  /** Ekspektasi pertumbuhan tahunan jangka panjang (0.08 = 8%/tahun). Parameter gaya bermain, bukan klaim historis nyata — lihat catatan di lib/simulation/priceEngine.ts. */
  annualDriftPct: number;
  /** Volatilitas tahunan (semakin besar = harga makin liar, mis. kripto/saham startup). */
  annualVolatilityPct: number;
  /** Menit simulasi mulai tersedia diperdagangkan — anti-anakronisme, pola sama seperti Product.releaseYear & Job.availableFromYear di Fase 3 (lib/simulation/productCatalog.ts, lib/simulation/jobCatalog.ts). */
  genesisMinute: SimulationMinutes;
  sector?: string;
  /** Catatan singkat ditampilkan di UI, mis. konteks anakronisme ("Ethereum baru meluncur Juli 2015"). */
  note?: string;
}

/**
 * Satu posisi kepemilikan aset finansial milik karakter — lihat
 * Character.investments (types/character.ts) & lib/simulation/investments.ts.
 * Beberapa kali pembelian aset yang sama digabung jadi satu holding dengan
 * avgBuyPrice tertimbang (weighted average), bukan baris terpisah per
 * transaksi — supaya daftar portofolio tetap ringkas.
 */
export interface PortfolioHolding {
  id: EntityId;
  assetId: string;
  assetClass: AssetClass;
  /** Boleh pecahan (mis. 0.0032 BTC). */
  quantity: number;
  /** Rata-rata harga beli tertimbang per unit, dalam Rupiah — dasar hitung untung/rugi di UI. */
  avgBuyPrice: Money;
  acquiredAtMinute: SimulationMinutes;
}
