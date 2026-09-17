import { describe, expect, it } from "vitest";
import { computeAssetPrice, computeAssetPriceSeries, isAssetAvailable } from "../priceEngine";
import type { TradableAsset } from "@/types/market";

const BASE_ASSET: TradableAsset = {
  id: "test_asset",
  assetClass: "stock",
  symbol: "TEST",
  name: "Aset Uji",
  basePrice: 1_000,
  annualDriftPct: 0.1,
  annualVolatilityPct: 0.3,
  genesisMinute: 0,
};

describe("priceEngine", () => {
  it("mengembalikan basePrice pada atau sebelum genesisMinute", () => {
    expect(computeAssetPrice("save1", BASE_ASSET, 0)).toBe(BASE_ASSET.basePrice);
    expect(computeAssetPrice("save1", BASE_ASSET, -100)).toBe(BASE_ASSET.basePrice);
  });

  it("deterministik: save+waktu yang sama selalu menghasilkan harga yang sama", () => {
    const minute = 60 * 24 * 400; // ~400 hari setelah genesis
    const a = computeAssetPrice("save-abc", BASE_ASSET, minute);
    const b = computeAssetPrice("save-abc", BASE_ASSET, minute);
    expect(a).toBe(b);
  });

  it("save berbeda menghasilkan harga berbeda (namespace RNG terpisah per save)", () => {
    const minute = 60 * 24 * 400;
    const a = computeAssetPrice("save-A", BASE_ASSET, minute);
    const b = computeAssetPrice("save-B", BASE_ASSET, minute);
    expect(a).not.toBe(b);
  });

  it("harga selalu bilangan bulat positif (Money = integer Rupiah)", () => {
    const minute = 60 * 24 * 3650; // ~10 tahun
    const price = computeAssetPrice("save-long", BASE_ASSET, minute);
    expect(Number.isInteger(price)).toBe(true);
    expect(price).toBeGreaterThanOrEqual(1);
  });

  it("isAssetAvailable menolak sebelum genesis, menerima sesudahnya", () => {
    expect(isAssetAvailable(BASE_ASSET, -1)).toBe(false);
    expect(isAssetAvailable(BASE_ASSET, 0)).toBe(true);
    expect(isAssetAvailable(BASE_ASSET, 100)).toBe(true);
  });

  it("computeAssetPriceSeries mengembalikan titik terurut yang diakhiri tepat di atMinute", () => {
    const minute = 60 * 24 * 200;
    const series = computeAssetPriceSeries("save-series", BASE_ASSET, minute, 10);
    expect(series.length).toBeGreaterThan(0);
    expect(series[series.length - 1]?.atMinute).toBe(minute);
    for (let i = 1; i < series.length; i += 1) {
      expect(series[i]!.atMinute).toBeGreaterThan(series[i - 1]!.atMinute);
    }
  });

  it("titik terakhir dari computeAssetPriceSeries konsisten dengan computeAssetPrice", () => {
    const minute = 60 * 24 * 200;
    const series = computeAssetPriceSeries("save-consistency", BASE_ASSET, minute, 5);
    const direct = computeAssetPrice("save-consistency", BASE_ASSET, minute);
    expect(series[series.length - 1]?.price).toBe(direct);
  });
});
