import type { Character } from "@/types/character";
import type { RecurringExpense } from "@/types/finance";
import type { SimulationEffect, SimulationEventOutcome } from "@/types/ai";
import type { Money } from "@/types/common";
import type { SimulationMinutes } from "@/types/time";
import { addCalendarMonths } from "./time";

const MAX_CYCLES_PER_TICK = 60;

function nextDueAfter(expense: RecurringExpense): SimulationMinutes {
  switch (expense.frequency) {
    case "daily":
      return expense.nextDueMinute + 60 * 24;
    case "weekly":
      return expense.nextDueMinute + 60 * 24 * 7;
    case "monthly":
      return addCalendarMonths(expense.nextDueMinute, 1);
  }
}

export interface ProcessExpensesResult {
  character: Character;
  /** Hanya untuk log tampilan (effectSummaries) — sudah diterapkan langsung ke character, jangan dipakai ulang lewat applyEffects(). */
  effectLog: SimulationEffect[];
  events: SimulationEventOutcome[];
}

/** Melunasi/menagih semua RecurringExpense yang sudah jatuh tempo hingga nowMinute. Dipanggil dari engine.ts::advanceTimeRealistic() supaya berlaku di semua jalur waktu. */
export function processRecurringExpenses(
  character: Character,
  nowMinute: SimulationMinutes
): ProcessExpensesResult {
  if (character.finance.recurringExpenses.length === 0) {
    return { character, effectLog: [], events: [] };
  }

  let cash = character.finance.cash;
  let debt = character.finance.debt;
  const effectLog: SimulationEffect[] = [];
  const events: SimulationEventOutcome[] = [];
  const nextExpenses: RecurringExpense[] = [];

  for (const expense of character.finance.recurringExpenses) {
    let due = expense.nextDueMinute;
    let cycles = 0;
    let paidTotal = 0;
    let missedTotal = 0;

    while (due <= nowMinute && cycles < MAX_CYCLES_PER_TICK) {
      if (cash >= expense.amount) {
        cash -= expense.amount;
        paidTotal += expense.amount;
      } else {
        debt += expense.amount - cash;
        missedTotal += expense.amount;
        cash = 0;
      }
      due = nextDueAfter({ ...expense, nextDueMinute: due });
      cycles += 1;
    }

    if (paidTotal > 0) {
      effectLog.push({ path: "finance.cash", operation: "subtract", value: paidTotal, reason: expense.label });
    }
    if (missedTotal > 0) {
      effectLog.push({ path: "finance.debt", operation: "add", value: missedTotal, reason: `Gagal bayar ${expense.label}` });
      events.push({
        title: `Gagal bayar ${expense.label}`,
        description: `${character.name} tidak sanggup membayar ${expense.label} tepat waktu — tercatat sebagai utang.`,
        severity: "minor",
        source: "world_random",
      });
    }

    nextExpenses.push({ ...expense, nextDueMinute: due });
  }

  const nextCharacter: Character = {
    ...character,
    finance: { ...character.finance, cash, debt, recurringExpenses: nextExpenses },
  };

  return { character: nextCharacter, effectLog, events };
}

export function addOrReplaceRecurringExpense(
  character: Character,
  expense: RecurringExpense
): Character {
  const filtered = character.finance.recurringExpenses.filter((e) => e.category !== expense.category);
  return {
    ...character,
    finance: { ...character.finance, recurringExpenses: [...filtered, expense] },
  };
}

export function estimateMonthlyExpenseTotal(character: Character): Money {
  return character.finance.recurringExpenses.reduce((total, e) => {
    if (e.frequency === "daily") return total + e.amount * 30;
    if (e.frequency === "weekly") return total + e.amount * 4.345;
    return total + e.amount;
  }, 0);
}

const MEAL_COST_NORMAL: Money = 15_000;
const MEAL_COST_MINIMAL: Money = 3_000;

export interface EatMealResult {
  character: Character;
  cost: Money;
  hungerRestored: number;
  narrative: string;
}

/** Tiga tingkat makan tergantung uang tunai yang dimiliki saat itu — mengisi celah lama di mana tombol "Makan" tidak benar-benar memberi makan. */
export function eatMeal(character: Character): EatMealResult {
  const cash = character.finance.cash;
  let cost: Money;
  let hungerRestored: number;
  let stressDelta = 0;
  let happinessDelta = 0;
  let narrative: string;

  if (cash >= MEAL_COST_NORMAL) {
    cost = MEAL_COST_NORMAL;
    hungerRestored = 45;
    happinessDelta = 2;
    narrative = `${character.name} makan dengan layak di warung.`;
  } else if (cash >= MEAL_COST_MINIMAL) {
    cost = MEAL_COST_MINIMAL;
    hungerRestored = 20;
    stressDelta = 1;
    narrative = `${character.name} makan seadanya — mi instan tanpa lauk.`;
  } else {
    cost = 0;
    hungerRestored = 3;
    stressDelta = 4;
    happinessDelta = -3;
    narrative = `${character.name} tidak punya cukup uang untuk makan hari ini — hanya minum air untuk mengganjal perut.`;
  }

  const needs = {
    ...character.needs,
    hunger: Math.min(100, character.needs.hunger + hungerRestored),
    stress: Math.min(100, Math.max(0, character.needs.stress + stressDelta)),
    happiness: Math.min(100, Math.max(0, character.needs.happiness + happinessDelta)),
  };

  return {
    character: {
      ...character,
      finance: { ...character.finance, cash: Math.max(0, cash - cost) },
      needs,
    },
    cost,
    hungerRestored,
    narrative,
  };
}
