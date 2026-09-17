import type { Character } from "@/types/character";
import type { EntityId, Money, ValidationResult } from "@/types/common";
import { generateId } from "@/types/common";
import type { SimulationMinutes } from "@/types/time";
import type { PortfolioHolding, TradableAsset } from "@/types/market";
import { computeAssetPrice, isAssetAvailable } from "./priceEngine";
import { getAsset } from "./marketRegistry";

/**
 * Fase 4 — jual-beli aset finansial (mata uang, saham, reksa dana indeks,
 * kripto). Pola sama seperti lib/simulation/inventory.ts (fungsi validate
 * dan apply terpisah, harga & ketersediaan divalidasi ULANG tepat sebelum
 * eksekusi di lib/simulation/engine.ts — bukan cuma sekali saat form
 * dibuka — supaya time-travel-cheat lewat form yang dibiarkan terbuka
 * lama tidak mungkin, sama seperti performPurchase()).
 */

const MIN_TRANSACTION_VALUE: Money = 1_000;

export interface BuyPreview {
  asset: TradableAsset;
  unitPrice: Money;
  quantity: number;
  totalCost: Money;
}

export function validateBuyAsset(
  character: Character,
  saveId: string,
  assetId: string,
  quantity: number,
  nowMinute: SimulationMinutes
): ValidationResult<BuyPreview> {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { valid: false, reason: "Jumlah pembelian harus lebih dari nol." };
  }
  const asset = getAsset(assetId);
  if (!asset) {
    return { valid: false, reason: "Aset tidak dikenal." };
  }
  if (!isAssetAvailable(asset, nowMinute)) {
    return { valid: false, reason: `${asset.name} belum bisa diperdagangkan pada tahun ini.` };
  }

  const unitPrice = computeAssetPrice(saveId, asset, nowMinute);
  const totalCost = Math.round(unitPrice * quantity);

  if (totalCost < MIN_TRANSACTION_VALUE) {
    return { valid: false, reason: `Nilai transaksi minimal Rp${MIN_TRANSACTION_VALUE.toLocaleString("id-ID")}.` };
  }
  if (totalCost > character.finance.cash) {
    return { valid: false, reason: "Saldo tunai tidak cukup." };
  }

  return { valid: true, value: { asset, unitPrice, quantity, totalCost } };
}

/** Menggabungkan pembelian baru ke holding yang sudah ada (rata-rata tertimbang) kalau aset yang sama sudah dimiliki, atau membuat holding baru. */
export function applyBuyAsset(character: Character, preview: BuyPreview, nowMinute: SimulationMinutes): Character {
  const { asset, unitPrice, quantity, totalCost } = preview;
  const existing = character.investments.find((h) => h.assetId === asset.id);

  let investments: PortfolioHolding[];
  if (existing) {
    const combinedQuantity = existing.quantity + quantity;
    const combinedCost = existing.avgBuyPrice * existing.quantity + unitPrice * quantity;
    const nextHolding: PortfolioHolding = {
      ...existing,
      quantity: combinedQuantity,
      avgBuyPrice: Math.round(combinedCost / combinedQuantity),
    };
    investments = character.investments.map((h) => (h.id === existing.id ? nextHolding : h));
  } else {
    const nextHolding: PortfolioHolding = {
      id: generateId("hold"),
      assetId: asset.id,
      assetClass: asset.assetClass,
      quantity,
      avgBuyPrice: unitPrice,
      acquiredAtMinute: nowMinute,
    };
    investments = [...character.investments, nextHolding];
  }

  return {
    ...character,
    finance: { ...character.finance, cash: character.finance.cash - totalCost },
    investments,
  };
}

export interface SellPreview {
  holding: PortfolioHolding;
  asset: TradableAsset;
  unitPrice: Money;
  quantity: number;
  proceeds: Money;
}

export function validateSellAsset(
  character: Character,
  saveId: string,
  holdingId: EntityId,
  quantity: number,
  nowMinute: SimulationMinutes
): ValidationResult<SellPreview> {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { valid: false, reason: "Jumlah penjualan harus lebih dari nol." };
  }
  const holding = character.investments.find((h) => h.id === holdingId);
  if (!holding) {
    return { valid: false, reason: "Kamu tidak memiliki aset ini." };
  }
  if (quantity > holding.quantity + 1e-9) {
    return { valid: false, reason: "Jumlah melebihi kepemilikanmu." };
  }
  const asset = getAsset(holding.assetId);
  if (!asset) {
    return { valid: false, reason: "Aset tidak dikenal." };
  }

  const unitPrice = computeAssetPrice(saveId, asset, nowMinute);
  const proceeds = Math.round(unitPrice * quantity);

  return { valid: true, value: { holding, asset, unitPrice, quantity, proceeds } };
}

/** Menjual sebagian → sisa kuantitas holding berkurang. Menjual seluruhnya (dalam toleransi floating-point) → holding dihapus dari daftar. */
export function applySellAsset(character: Character, preview: SellPreview): Character {
  const { holding, quantity, proceeds } = preview;
  const remaining = holding.quantity - quantity;

  const investments =
    remaining > 1e-9
      ? character.investments.map((h) => (h.id === holding.id ? { ...h, quantity: remaining } : h))
      : character.investments.filter((h) => h.id !== holding.id);

  return {
    ...character,
    finance: { ...character.finance, cash: character.finance.cash + proceeds },
    investments,
  };
}

export interface PortfolioLine {
  holding: PortfolioHolding;
  asset: TradableAsset;
  currentPrice: Money;
  currentValue: Money;
  costBasis: Money;
  profitLoss: Money;
  profitLossPct: number;
}

/** Baris siap-tampil untuk daftar "Portofolio Saya" di app/game/pasar — menghitung ulang harga terkini tiap holding sekali panggil. */
export function buildPortfolioLines(character: Character, saveId: string, nowMinute: SimulationMinutes): PortfolioLine[] {
  return character.investments.flatMap((holding) => {
    const asset = getAsset(holding.assetId);
    if (!asset) return [];
    const currentPrice = computeAssetPrice(saveId, asset, nowMinute);
    const currentValue = Math.round(currentPrice * holding.quantity);
    const costBasis = Math.round(holding.avgBuyPrice * holding.quantity);
    const profitLoss = currentValue - costBasis;
    const profitLossPct = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
    return [{ holding, asset, currentPrice, currentValue, costBasis, profitLoss, profitLossPct }];
  });
}

/** Total nilai portofolio saat ini dalam Rupiah — dipakai untuk ringkasan net worth (lib/simulation/characterFactory.ts::calculateNetWorthWithPortfolio) & konteks AI (lib/ai/contextBuilder.ts). */
export function calculatePortfolioValue(character: Character, saveId: string, nowMinute: SimulationMinutes): Money {
  return buildPortfolioLines(character, saveId, nowMinute).reduce((total, line) => total + line.currentValue, 0);
}
