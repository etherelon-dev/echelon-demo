import type { AssetClass, TradableAsset } from "@/types/market";
import type { SimulationMinutes } from "@/types/time";
import { CURRENCY_ASSETS } from "./currencyCatalog";
import { STOCK_ASSETS } from "./stockCatalog";
import { INDEX_ASSETS } from "./indexCatalog";
import { CRYPTO_ASSETS } from "./cryptoCatalog";
import { isAssetAvailable } from "./priceEngine";

/**
 * Gabungan seluruh katalog aset (mata uang, saham, indeks, kripto) jadi
 * satu titik akses — dipakai lib/simulation/investments.ts &
 * app/game/pasar supaya tidak perlu tahu aset mana berasal dari katalog
 * mana. Id aset dijaga unik lintas katalog (lihat masing-masing file
 * katalog) supaya PortfolioHolding.assetId selalu bisa diselesaikan lewat
 * satu lookup di sini.
 */
export const ALL_ASSETS: TradableAsset[] = [
  ...CURRENCY_ASSETS,
  ...STOCK_ASSETS,
  ...INDEX_ASSETS,
  ...CRYPTO_ASSETS,
];

const ASSET_BY_ID: Record<string, TradableAsset> = Object.fromEntries(
  ALL_ASSETS.map((a) => [a.id, a])
);

export const ASSET_CLASS_LABEL_ID: Record<AssetClass, string> = {
  currency: "Mata Uang",
  stock: "Saham",
  index: "Reksa Dana Indeks",
  crypto: "Kripto",
};

export function getAsset(assetId: string): TradableAsset | null {
  return ASSET_BY_ID[assetId] ?? null;
}

/** Semua aset di kelas tertentu yang sudah tersedia (anti-anakronisme) pada waktu simulasi tsb. Tanpa `assetClass`, mengembalikan seluruh kelas. */
export function listAvailableAssets(nowMinute: SimulationMinutes, assetClass?: AssetClass): TradableAsset[] {
  return ALL_ASSETS.filter(
    (a) => (assetClass === undefined || a.assetClass === assetClass) && isAssetAvailable(a, nowMinute)
  );
}
