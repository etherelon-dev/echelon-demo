import { describe, expect, it } from "vitest";
import { neglectEffects, rollDisasterEvents } from "../randomEvents";
import { createArtisio, SIMULATION_START_MINUTE } from "../characterFactory";
import { mulberry32, rngForTick } from "../rng";

describe("neglectEffects", () => {
  it("tidak menghasilkan apa pun jika semua kebutuhan sehat", () => {
    const { effects, events } = neglectEffects(
      { health: 70, energy: 60, hunger: 50, stress: 40, happiness: 45 },
      4,
      "Artisio"
    );
    expect(effects).toHaveLength(0);
    expect(events).toHaveLength(0);
  });

  it("mengurangi kesehatan jika kelaparan dibiarkan (hunger kritis)", () => {
    const { effects, events } = neglectEffects(
      { health: 70, energy: 60, hunger: 2, stress: 40, happiness: 45 },
      3,
      "Artisio"
    );
    expect(effects.length).toBeGreaterThan(0);
    expect(effects[0]?.path).toBe("needs.health");
    expect(effects[0]?.operation).toBe("subtract");
    expect(effects[0]?.value).toBeGreaterThan(0);
    expect(events[0]?.description).toContain("kelaparan");
  });

  it("mengakumulasi kerusakan dari beberapa faktor sekaligus", () => {
    const single = neglectEffects(
      { health: 70, energy: 60, hunger: 2, stress: 40, happiness: 45 },
      5,
      "Artisio"
    );
    const combined = neglectEffects(
      { health: 70, energy: 2, hunger: 2, stress: 95, happiness: 45 },
      5,
      "Artisio"
    );
    expect(combined.effects[0]?.value ?? 0).toBeGreaterThan(single.effects[0]?.value ?? 0);
  });
});

describe("rollDisasterEvents", () => {
  it("tidak pernah memicu apa pun jika rng selalu mengembalikan nilai tinggi", () => {
    const character = createArtisio(SIMULATION_START_MINUTE);
    const alwaysHigh = () => 0.999999;
    const { effects, events } = rollDisasterEvents(character, 48, alwaysHigh);
    expect(effects).toHaveLength(0);
    expect(events).toHaveLength(0);
  });

  it("memicu peristiwa setiap jam jika rng selalu mengembalikan 0", () => {
    const character = createArtisio(SIMULATION_START_MINUTE);
    const alwaysZero = () => 0;
    const { effects, events } = rollDisasterEvents(character, 3, alwaysZero);
    expect(events.length).toBe(3);
    expect(effects.length).toBeGreaterThan(0);
  });

  it("tidak melakukan apa pun jika hoursElapsed <= 0", () => {
    const character = createArtisio(SIMULATION_START_MINUTE);
    const { effects, events } = rollDisasterEvents(character, 0, () => 0);
    expect(effects).toHaveLength(0);
    expect(events).toHaveLength(0);
  });

  it("tidak memicu apa pun untuk karakter yang sudah meninggal", () => {
    const character = {
      ...createArtisio(SIMULATION_START_MINUTE),
      vitalStatus: "deceased" as const,
    };
    const { effects, events } = rollDisasterEvents(character, 10, () => 0);
    expect(effects).toHaveLength(0);
    expect(events).toHaveLength(0);
  });
});

describe("rng deterministik", () => {
  it("seed yang sama selalu menghasilkan urutan yang sama", () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it("rngForTick deterministik terhadap saveId + waktu", () => {
    const a = rngForTick("save_1", 1000);
    const b = rngForTick("save_1", 1000);
    expect(a()).toBe(b());
  });

  it("rngForTick berbeda untuk saveId atau waktu yang berbeda", () => {
    const a = rngForTick("save_1", 1000)();
    const b = rngForTick("save_2", 1000)();
    const c = rngForTick("save_1", 2000)();
    expect(a).not.toBe(b);
    expect(a).not.toBe(c);
  });
});
