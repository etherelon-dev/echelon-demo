import { describe, expect, it } from "vitest";
import {
  validateBuyAsset,
  applyBuyAsset,
  validateSellAsset,
  applySellAsset,
  buildPortfolioLines,
  calculatePortfolioValue,
} from "../investments";
import { createArtisio, SIMULATION_START_MINUTE } from "../characterFactory";
import { computeAssetPrice } from "../priceEngine";
import { getAsset } from "../marketRegistry";
import type { Character } from "@/types/character";

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return { ...createArtisio(SIMULATION_START_MINUTE), ...overrides };
}

const SAVE_ID = "save-invest-test";
const USD = getAsset("usd")!;

describe("validateBuyAsset / applyBuyAsset", () => {
  it("menolak kuantitas nol atau negatif", () => {
    const character = makeCharacter({ finance: { cash: 1_000_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] } });
    const result = validateBuyAsset(character, SAVE_ID, "usd", 0, SIMULATION_START_MINUTE);
    expect(result.valid).toBe(false);
  });

  it("menolak aset yang tidak dikenal", () => {
    const character = makeCharacter({ finance: { cash: 1_000_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] } });
    const result = validateBuyAsset(character, SAVE_ID, "aset_ngawur", 1, SIMULATION_START_MINUTE);
    expect(result.valid).toBe(false);
  });

  it("menolak aset yang belum tersedia (anti-anakronisme) — Ethereum sebelum 2015", () => {
    const character = makeCharacter({ finance: { cash: 100_000_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] } });
    const result = validateBuyAsset(character, SAVE_ID, "eth", 1, SIMULATION_START_MINUTE);
    expect(result.valid).toBe(false);
  });

  it("menolak kalau saldo tunai tidak cukup", () => {
    const character = makeCharacter({ finance: { cash: 100, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] } });
    const result = validateBuyAsset(character, SAVE_ID, "usd", 1, SIMULATION_START_MINUTE);
    expect(result.valid).toBe(false);
  });

  it("berhasil membeli & mendebit tunai sebesar totalCost", () => {
    const character = makeCharacter({ finance: { cash: 1_000_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] } });
    const preview = validateBuyAsset(character, SAVE_ID, "usd", 10, SIMULATION_START_MINUTE);
    expect(preview.valid).toBe(true);
    if (!preview.valid) return;

    const unitPrice = computeAssetPrice(SAVE_ID, USD, SIMULATION_START_MINUTE);
    expect(preview.value.totalCost).toBe(Math.round(unitPrice * 10));

    const next = applyBuyAsset(character, preview.value, SIMULATION_START_MINUTE);
    expect(next.finance.cash).toBe(character.finance.cash - preview.value.totalCost);
    expect(next.investments).toHaveLength(1);
    expect(next.investments[0]?.assetId).toBe("usd");
    expect(next.investments[0]?.quantity).toBe(10);
  });

  it("pembelian kedua pada aset yang sama menggabungkan holding dengan rata-rata tertimbang", () => {
    let character = makeCharacter({ finance: { cash: 10_000_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] } });

    const firstPreview = validateBuyAsset(character, SAVE_ID, "usd", 10, SIMULATION_START_MINUTE);
    expect(firstPreview.valid).toBe(true);
    if (!firstPreview.valid) return;
    character = applyBuyAsset(character, firstPreview.value, SIMULATION_START_MINUTE);

    const laterMinute = SIMULATION_START_MINUTE + 60 * 24 * 500;
    const secondPreview = validateBuyAsset(character, SAVE_ID, "usd", 5, laterMinute);
    expect(secondPreview.valid).toBe(true);
    if (!secondPreview.valid) return;
    character = applyBuyAsset(character, secondPreview.value, laterMinute);

    expect(character.investments).toHaveLength(1);
    expect(character.investments[0]?.quantity).toBe(15);
  });
});

describe("validateSellAsset / applySellAsset", () => {
  function makeHoldingCharacter() {
    let character = makeCharacter({ finance: { cash: 1_000_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] } });
    const preview = validateBuyAsset(character, SAVE_ID, "usd", 20, SIMULATION_START_MINUTE);
    if (!preview.valid) throw new Error("setup gagal");
    character = applyBuyAsset(character, preview.value, SIMULATION_START_MINUTE);
    return character;
  }

  it("menolak menjual holding yang tidak dimiliki", () => {
    const character = makeHoldingCharacter();
    const result = validateSellAsset(character, SAVE_ID, "id_ngawur", 1, SIMULATION_START_MINUTE);
    expect(result.valid).toBe(false);
  });

  it("menolak menjual melebihi kepemilikan", () => {
    const character = makeHoldingCharacter();
    const holdingId = character.investments[0]!.id;
    const result = validateSellAsset(character, SAVE_ID, holdingId, 999, SIMULATION_START_MINUTE);
    expect(result.valid).toBe(false);
  });

  it("menjual sebagian mengurangi kuantitas, tidak menghapus holding", () => {
    const character = makeHoldingCharacter();
    const holdingId = character.investments[0]!.id;
    const preview = validateSellAsset(character, SAVE_ID, holdingId, 5, SIMULATION_START_MINUTE);
    expect(preview.valid).toBe(true);
    if (!preview.valid) return;
    const next = applySellAsset(character, preview.value);
    expect(next.investments).toHaveLength(1);
    expect(next.investments[0]?.quantity).toBe(15);
    expect(next.finance.cash).toBe(character.finance.cash + preview.value.proceeds);
  });

  it("menjual seluruhnya menghapus holding dari daftar", () => {
    const character = makeHoldingCharacter();
    const holdingId = character.investments[0]!.id;
    const preview = validateSellAsset(character, SAVE_ID, holdingId, 20, SIMULATION_START_MINUTE);
    expect(preview.valid).toBe(true);
    if (!preview.valid) return;
    const next = applySellAsset(character, preview.value);
    expect(next.investments).toHaveLength(0);
  });
});

describe("buildPortfolioLines / calculatePortfolioValue", () => {
  it("mengembalikan array kosong & nilai nol kalau belum berinvestasi", () => {
    const character = makeCharacter();
    expect(buildPortfolioLines(character, SAVE_ID, SIMULATION_START_MINUTE)).toEqual([]);
    expect(calculatePortfolioValue(character, SAVE_ID, SIMULATION_START_MINUTE)).toBe(0);
  });

  it("menghitung nilai total sesuai harga terkini", () => {
    let character = makeCharacter({ finance: { cash: 1_000_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] } });
    const preview = validateBuyAsset(character, SAVE_ID, "usd", 10, SIMULATION_START_MINUTE);
    if (!preview.valid) throw new Error("setup gagal");
    character = applyBuyAsset(character, preview.value, SIMULATION_START_MINUTE);

    const lines = buildPortfolioLines(character, SAVE_ID, SIMULATION_START_MINUTE);
    expect(lines).toHaveLength(1);
    expect(lines[0]?.currentValue).toBe(calculatePortfolioValue(character, SAVE_ID, SIMULATION_START_MINUTE));
    // Baru saja dibeli pada menit yang sama → belum untung/rugi.
    expect(lines[0]?.profitLoss).toBe(0);
  });
});
