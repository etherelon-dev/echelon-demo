import { describe, expect, it } from "vitest";
import { eatMeal, estimateMonthlyExpenseTotal, processRecurringExpenses } from "../finance";
import { createArtisio, SIMULATION_START_MINUTE } from "../characterFactory";
import type { Character } from "@/types/character";

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return { ...createArtisio(SIMULATION_START_MINUTE), ...overrides };
}

describe("processRecurringExpenses", () => {
  it("memotong tunai saat tagihan jatuh tempo", () => {
    const character = makeCharacter({
      finance: {
        cash: 500_000,
        bankBalance: 0,
        savings: 0,
        debt: 0,
        recurringExpenses: [
          {
            id: "e1",
            label: "Sewa",
            category: "sewa",
            frequency: "monthly",
            amount: 300_000,
            nextDueMinute: SIMULATION_START_MINUTE,
          },
        ],
      },
    });
    const result = processRecurringExpenses(character, SIMULATION_START_MINUTE);
    expect(result.character.finance.cash).toBe(200_000);
    expect(result.character.finance.debt).toBe(0);
    expect(result.character.finance.recurringExpenses).toHaveLength(1);
    expect(result.character.finance.recurringExpenses[0]?.nextDueMinute).toBeGreaterThan(
      SIMULATION_START_MINUTE
    );
  });

  it("mencatat utang & event saat tunai tidak cukup", () => {
    const character = makeCharacter({
      finance: {
        cash: 100_000,
        bankBalance: 0,
        savings: 0,
        debt: 0,
        recurringExpenses: [
          {
            id: "e1",
            label: "Listrik",
            category: "listrik",
            frequency: "monthly",
            amount: 300_000,
            nextDueMinute: SIMULATION_START_MINUTE,
          },
        ],
      },
    });
    const result = processRecurringExpenses(character, SIMULATION_START_MINUTE);
    expect(result.character.finance.cash).toBe(0);
    expect(result.character.finance.debt).toBe(200_000);
    expect(result.events.length).toBe(1);
  });

  it("tidak menagih apa pun sebelum jatuh tempo", () => {
    const character = makeCharacter({
      finance: {
        cash: 500_000,
        bankBalance: 0,
        savings: 0,
        debt: 0,
        recurringExpenses: [
          {
            id: "e1",
            label: "Sewa",
            category: "sewa",
            frequency: "monthly",
            amount: 300_000,
            nextDueMinute: SIMULATION_START_MINUTE + 60 * 24 * 30,
          },
        ],
      },
    });
    const result = processRecurringExpenses(character, SIMULATION_START_MINUTE);
    expect(result.character.finance.cash).toBe(500_000);
    expect(result.events.length).toBe(0);
  });
});

describe("estimateMonthlyExpenseTotal", () => {
  it("menjumlahkan tagihan bulanan apa adanya", () => {
    const character = makeCharacter({
      finance: {
        cash: 0,
        bankBalance: 0,
        savings: 0,
        debt: 0,
        recurringExpenses: [
          { id: "e1", label: "Sewa", category: "sewa", frequency: "monthly", amount: 300_000, nextDueMinute: 0 },
          { id: "e2", label: "Listrik", category: "listrik", frequency: "monthly", amount: 100_000, nextDueMinute: 0 },
        ],
      },
    });
    expect(estimateMonthlyExpenseTotal(character)).toBe(400_000);
  });
});

describe("eatMeal", () => {
  it("makan layak saat uang cukup", () => {
    const character = makeCharacter({
      finance: { cash: 200_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] },
    });
    const result = eatMeal(character);
    expect(result.cost).toBe(15_000);
    expect(result.character.needs.hunger).toBeGreaterThan(character.needs.hunger);
  });

  it("makan seadanya saat uang pas-pasan", () => {
    const character = makeCharacter({
      finance: { cash: 5_000, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] },
    });
    const result = eatMeal(character);
    expect(result.cost).toBe(3_000);
  });

  it("tidak bisa makan sama sekali saat benar-benar tidak punya uang", () => {
    const character = makeCharacter({
      finance: { cash: 0, bankBalance: 0, savings: 0, debt: 0, recurringExpenses: [] },
    });
    const result = eatMeal(character);
    expect(result.cost).toBe(0);
    expect(result.character.finance.cash).toBe(0);
    expect(result.hungerRestored).toBeLessThan(20);
  });
});
