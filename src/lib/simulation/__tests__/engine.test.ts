import { describe, expect, it } from "vitest";
import { advanceTime } from "../engine";
import { createArtisio, SIMULATION_START_MINUTE } from "../characterFactory";
import { CURRENT_SCHEMA_VERSION } from "@/types/simulation";
import type { SimulationBundle } from "@/types/simulation";

function makeBundle(): SimulationBundle {
  const character = createArtisio(SIMULATION_START_MINUTE);
  return {
    state: {
      saveId: "save_test",
      nowMinute: SIMULATION_START_MINUTE,
      characterId: character.id,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      recentTurns: [],
    },
    character,
  };
}

describe("advanceTime", () => {
  it("memajukan nowMinute sesuai jumlah menit yang diberikan", () => {
    const bundle = makeBundle();
    const { bundle: next } = advanceTime(bundle, 60);
    expect(next.state.nowMinute).toBe(bundle.state.nowMinute + 60);
  });

  it("menurunkan energi dan lapar setelah waktu berlalu", () => {
    const bundle = makeBundle();
    const { bundle: next } = advanceTime(bundle, 120); // 2 jam
    expect(next.character.needs.energy).toBeLessThan(bundle.character.needs.energy);
    expect(next.character.needs.hunger).toBeLessThan(bundle.character.needs.hunger);
  });

  it("tidak pernah membuat kebutuhan di bawah 0", () => {
    const bundle = makeBundle();
    const { bundle: next } = advanceTime(bundle, 60 * 24 * 30); // 30 hari tanpa istirahat
    expect(next.character.needs.energy).toBeGreaterThanOrEqual(0);
    expect(next.character.needs.hunger).toBeGreaterThanOrEqual(0);
  });

  it("menolak durasi negatif", () => {
    const bundle = makeBundle();
    expect(() => advanceTime(bundle, -10)).toThrow();
  });
});

describe("createArtisio", () => {
  it("Artisio mulai miskin sesuai spesifikasi", () => {
    const character = createArtisio(SIMULATION_START_MINUTE);
    expect(character.finance.cash).toBeLessThan(1_000_000);
    expect(character.finance.debt).toBe(0);
    expect(character.progression.reputation).toBeLessThan(20);
  });
});
