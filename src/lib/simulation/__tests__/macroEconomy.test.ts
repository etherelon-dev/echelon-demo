import { describe, expect, it } from "vitest";
import { getMacroEconomySnapshot } from "../macroEconomy";
import { HOME_COUNTRY_ID } from "../worldCatalog";
import { calendarToMinutes } from "../time";

describe("macroEconomy", () => {
  it("mengembalikan null untuk id negara tak dikenal", () => {
    expect(getMacroEconomySnapshot("save1", "id_atlantis", 0)).toBeNull();
  });

  it("pada tahun awal (2012) hasilnya dekat dengan baseline katalog", () => {
    const startMinute = calendarToMinutes({ year: 2012, month: 6, day: 1 });
    const snapshot = getMacroEconomySnapshot("save1", HOME_COUNTRY_ID, startMinute);
    expect(snapshot).not.toBeNull();
    expect(snapshot!.year).toBe(2012);
    // Belum ada iterasi tahunan (loop mulai dari 2013), jadi harus persis baseline.
    expect(snapshot!.inflationPct).toBeCloseTo(4.3, 5);
  });

  it("deterministik: save+waktu yang sama selalu menghasilkan angka yang sama", () => {
    const minute = calendarToMinutes({ year: 2020, month: 1, day: 1 });
    const a = getMacroEconomySnapshot("save-x", HOME_COUNTRY_ID, minute);
    const b = getMacroEconomySnapshot("save-x", HOME_COUNTRY_ID, minute);
    expect(a).toEqual(b);
  });

  it("tetap berada dalam batas wajar (clamp) meski disimulasikan puluhan tahun", () => {
    const minute = calendarToMinutes({ year: 2060, month: 1, day: 1 });
    const snapshot = getMacroEconomySnapshot("save-far-future", HOME_COUNTRY_ID, minute);
    expect(snapshot).not.toBeNull();
    expect(snapshot!.inflationPct).toBeGreaterThanOrEqual(-5);
    expect(snapshot!.inflationPct).toBeLessThanOrEqual(60);
    expect(snapshot!.unemploymentPct).toBeGreaterThanOrEqual(0);
    expect(snapshot!.unemploymentPct).toBeLessThanOrEqual(35);
    expect(snapshot!.interestRatePct).toBeGreaterThanOrEqual(0);
    expect(snapshot!.interestRatePct).toBeLessThanOrEqual(30);
  });
});
