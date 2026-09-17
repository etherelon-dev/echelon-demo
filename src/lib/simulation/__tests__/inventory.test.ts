import { describe, expect, it } from "vitest";
import { applyPurchase, applySale, depreciateInventory, validatePurchase, validateSale } from "../inventory";
import { createArtisio, SIMULATION_START_MINUTE } from "../characterFactory";
import { calendarToMinutes } from "../time";
import type { Character } from "@/types/character";

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return { ...createArtisio(SIMULATION_START_MINUTE), ...overrides };
}

describe("validatePurchase", () => {
  it("menolak produk yang belum rilis (anti-anakronisme)", () => {
    const character = makeCharacter({
      finance: { cash: 10_000_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] },
    });
    const before2012 = calendarToMinutes({ year: 2005, month: 1, day: 1 });
    const result = validatePurchase(character, "iphone_5", 1, before2012);
    expect(result.valid).toBe(false);
  });

  it("mengizinkan produk generik kapan pun", () => {
    const character = makeCharacter({
      finance: { cash: 1_000_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] },
    });
    const result = validatePurchase(character, "kaos_polos", 1, SIMULATION_START_MINUTE);
    expect(result.valid).toBe(true);
  });

  it("menolak jika uang tidak cukup", () => {
    const character = makeCharacter({
      finance: { cash: 1_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] },
    });
    const result = validatePurchase(character, "motor_bekas", 1, SIMULATION_START_MINUTE);
    expect(result.valid).toBe(false);
  });
});

describe("applyPurchase", () => {
  it("barang durable masuk inventori dengan kondisi 100", () => {
    const character = makeCharacter({
      finance: { cash: 1_000_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] },
    });
    const check = validatePurchase(character, "kaos_polos", 2, SIMULATION_START_MINUTE);
    if (!check.valid) throw new Error("harus valid");
    const next = applyPurchase(character, check.value.product, 2, check.value.totalPrice, SIMULATION_START_MINUTE);
    expect(next.inventory.length).toBe(2);
    expect(next.inventory[0]?.condition).toBe(100);
    expect(next.finance.cash).toBe(character.finance.cash - check.value.totalPrice);
  });

  it("produk hunian menambah recurringExpense, bukan inventori", () => {
    const character = makeCharacter({
      finance: { cash: 1_000_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] },
    });
    const check = validatePurchase(character, "kontrakan_petak", 1, SIMULATION_START_MINUTE);
    if (!check.valid) throw new Error("harus valid");
    const next = applyPurchase(character, check.value.product, 1, check.value.totalPrice, SIMULATION_START_MINUTE);
    expect(next.inventory.length).toBe(0);
    expect(next.finance.recurringExpenses.some((e) => e.category === "sewa")).toBe(true);
  });
});

describe("validateSale & applySale", () => {
  it("nilai jual proporsional terhadap kondisi barang", () => {
    const character = makeCharacter();
    const item = { id: "item_1", productId: "motor_bekas", quantity: 1, condition: 50, acquiredAtMinute: 0 };
    character.inventory.push(item);
    const check = validateSale(character, "item_1");
    if (!check.valid) throw new Error("harus valid");
    expect(check.value.saleValue).toBeGreaterThan(0);
    const next = applySale(character, "item_1", check.value.saleValue);
    expect(next.inventory.length).toBe(0);
    expect(next.finance.cash).toBe(character.finance.cash + check.value.saleValue);
  });

  it("menolak jual barang habis pakai", () => {
    const character = makeCharacter();
    character.inventory.push({ id: "item_2", productId: "kontrakan_petak", quantity: 1, condition: null, acquiredAtMinute: 0 });
    const check = validateSale(character, "item_2");
    expect(check.valid).toBe(false);
  });
});

describe("depreciateInventory", () => {
  it("kondisi barang menurun seiring waktu", () => {
    const character = makeCharacter();
    character.inventory.push({ id: "item_1", productId: "motor_bekas", quantity: 1, condition: 100, acquiredAtMinute: 0 });
    const next = depreciateInventory(character, 24 * 30);
    expect(next.inventory[0]?.condition).toBeLessThan(100);
  });

  it("tidak pernah turun di bawah 0", () => {
    const character = makeCharacter();
    character.inventory.push({ id: "item_1", productId: "motor_bekas", quantity: 1, condition: 100, acquiredAtMinute: 0 });
    const next = depreciateInventory(character, 24 * 30 * 1000);
    expect(next.inventory[0]?.condition).toBe(0);
  });
});
