import { describe, expect, it } from "vitest";
import { applyForJob, canApply, resignFromJob, workShift } from "../career";
import { createArtisio, SIMULATION_START_MINUTE } from "../characterFactory";
import type { Character } from "@/types/character";

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return { ...createArtisio(SIMULATION_START_MINUTE), ...overrides };
}

describe("canApply", () => {
  it("menolak jika pendidikan kurang", () => {
    const character = makeCharacter({ progression: { education: 5, skills: {}, experience: 0, reputation: 50 } });
    const result = canApply(character, { id: "x", title: "X", category: "y", minEducation: 30, minReputation: 0, wagePerHour: 1000, hoursPerShift: 8 }, 2012);
    expect(result.valid).toBe(false);
  });

  it("menolak pekerjaan anakronistik sebelum tahun tersedia", () => {
    const character = makeCharacter();
    character.inventory.push({ id: "m1", productId: "motor_bekas", quantity: 1, condition: 100, acquiredAtMinute: 0 });
    const result = canApply(
      character,
      {
        id: "ojek",
        title: "Ojek online",
        category: "transportasi",
        minEducation: 0,
        minReputation: 0,
        wagePerHour: 1000,
        hoursPerShift: 8,
        requiredItemProductId: "motor_bekas",
        availableFromYear: 2015,
      },
      2012
    );
    expect(result.valid).toBe(false);
  });

  it("menolak jika barang wajib belum dimiliki", () => {
    const character = makeCharacter();
    const result = canApply(
      character,
      {
        id: "ojek",
        title: "Ojek online",
        category: "transportasi",
        minEducation: 0,
        minReputation: 0,
        wagePerHour: 1000,
        hoursPerShift: 8,
        requiredItemProductId: "motor_bekas",
        availableFromYear: 2015,
      },
      2016
    );
    expect(result.valid).toBe(false);
  });

  it("mengizinkan saat semua syarat terpenuhi", () => {
    const character = makeCharacter();
    const result = canApply(character, { id: "x", title: "X", category: "y", minEducation: 0, minReputation: 0, wagePerHour: 1000, hoursPerShift: 8 }, 2012);
    expect(result.valid).toBe(true);
  });
});

describe("applyForJob & resignFromJob", () => {
  it("berhasil melamar pekerjaan yang valid", () => {
    const character = makeCharacter();
    const result = applyForJob(character, "buruh_cuci", 2012);
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.value.careerJobId).toBe("buruh_cuci");
  });

  it("resign mengosongkan careerJobId", () => {
    const character = makeCharacter({ careerJobId: "buruh_cuci" });
    const next = resignFromJob(character);
    expect(next.careerJobId).toBeNull();
  });
});

describe("workShift", () => {
  it("kerja serabutan saat belum punya pekerjaan tetap", () => {
    const character = makeCharacter({ careerJobId: null });
    const result = workShift(character);
    expect(result.jobTitle).toBe("Kerja serabutan");
    expect(result.character.finance.cash).toBeGreaterThan(character.finance.cash);
  });

  it("dibayar sesuai upah pekerjaan tetap & mendapat pengalaman", () => {
    const character = makeCharacter({ careerJobId: "buruh_cuci" });
    const result = workShift(character);
    expect(result.wage).toBeGreaterThan(0);
    expect(result.character.progression.experience).toBeGreaterThan(character.progression.experience);
  });

  it("skill bertambah untuk pekerjaan yang memberi skillGained", () => {
    const character = makeCharacter({
      careerJobId: "admin_toko",
      progression: { education: 50, skills: { komputer: 20 }, experience: 0, reputation: 20 },
    });
    const result = workShift(character);
    expect(result.character.progression.skills.komputer).toBeGreaterThan(20);
  });
});
