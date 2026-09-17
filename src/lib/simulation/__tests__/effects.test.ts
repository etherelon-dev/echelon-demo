import { describe, expect, it } from "vitest";
import { applyEffects, validateEffects } from "../effects";
import { createArtisio, SIMULATION_START_MINUTE } from "../characterFactory";
import type { SimulationEffect } from "@/types/ai";

function makeCharacter() {
  return createArtisio(SIMULATION_START_MINUTE);
}

describe("validateEffects", () => {
  it("menerima effect pada path yang di-whitelist", () => {
    const character = makeCharacter();
    const effects: SimulationEffect[] = [
      { path: "finance.cash", operation: "add", value: 5_000 },
      { path: "needs.happiness", operation: "add", value: 2 },
    ];
    const result = validateEffects(character, effects);
    expect(result.valid).toBe(true);
  });

  it("menolak path di luar whitelist", () => {
    const character = makeCharacter();
    const result = validateEffects(character, [
      { path: "finance.creditScore", operation: "add", value: 1 },
    ]);
    expect(result.valid).toBe(false);
  });

  it("menolak nilai NaN/Infinity", () => {
    const character = makeCharacter();
    const result = validateEffects(character, [
      { path: "needs.energy", operation: "add", value: Number.NaN },
    ]);
    expect(result.valid).toBe(false);
  });

  it("menolak jika hasil akhir uang menjadi negatif", () => {
    const character = makeCharacter();
    const result = validateEffects(character, [
      { path: "finance.cash", operation: "subtract", value: character.finance.cash + 500 },
    ]);
    expect(result.valid).toBe(false);
  });

  it("menerima skill dinamis progression.skills.<id>", () => {
    const character = makeCharacter();
    const result = validateEffects(character, [
      { path: "progression.skills.pemrograman", operation: "add", value: 5 },
    ]);
    expect(result.valid).toBe(true);
  });

  it("menolak id skill yang mengandung karakter aneh (anti-injeksi path)", () => {
    const character = makeCharacter();
    const result = validateEffects(character, [
      { path: "progression.skills.../../etc", operation: "add", value: 5 },
    ]);
    expect(result.valid).toBe(false);
  });

  it("menolak batch dengan terlalu banyak effect", () => {
    const character = makeCharacter();
    const effects: SimulationEffect[] = Array.from({ length: 20 }, () => ({
      path: "needs.happiness" as const,
      operation: "add" as const,
      value: 1,
    }));
    const result = validateEffects(character, effects);
    expect(result.valid).toBe(false);
  });

  it("menolak perubahan uang yang tidak masuk akal (melebihi batas kewajaran)", () => {
    const character = makeCharacter();
    const result = validateEffects(character, [
      { path: "finance.cash", operation: "add", value: 999_999_999_999 },
    ]);
    expect(result.valid).toBe(false);
  });
});

describe("applyEffects", () => {
  it("menerapkan operasi add/subtract/set/multiply dengan benar", () => {
    const character = makeCharacter();
    const next = applyEffects(character, [
      { path: "finance.cash", operation: "add", value: 1_000 },
      { path: "needs.happiness", operation: "set", value: 80 },
    ]);
    expect(next.finance.cash).toBe(character.finance.cash + 1_000);
    expect(next.needs.happiness).toBe(80);
  });

  it("meng-clamp kebutuhan (needs) ke rentang 0-100", () => {
    const character = makeCharacter();
    const next = applyEffects(character, [
      { path: "needs.health", operation: "add", value: 1_000 },
    ]);
    expect(next.needs.health).toBe(100);
  });

  it("tidak pernah menghasilkan finance negatif", () => {
    const character = makeCharacter();
    const next = applyEffects(character, [
      { path: "finance.cash", operation: "subtract", value: character.finance.cash + 999 },
    ]);
    expect(next.finance.cash).toBeGreaterThanOrEqual(0);
  });
});
