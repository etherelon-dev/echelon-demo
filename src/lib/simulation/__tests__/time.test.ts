import { describe, expect, it } from "vitest";
import { ageInYears, calendarToMinutes, minutesToCalendar } from "../time";

describe("calendarToMinutes / minutesToCalendar", () => {
  it("adalah invers satu sama lain untuk epoch (2012-01-01)", () => {
    const minutes = calendarToMinutes({ year: 2012, month: 1, day: 1 });
    expect(minutes).toBe(0);
    const cal = minutesToCalendar(minutes);
    expect(cal).toMatchObject({ year: 2012, month: 1, day: 1, hour: 0, minute: 0 });
  });

  it("menghitung tanggal dengan benar setelah beberapa hari", () => {
    const minutes = calendarToMinutes({ year: 2012, month: 4, day: 17, hour: 14, minute: 30 });
    const cal = minutesToCalendar(minutes);
    expect(cal).toMatchObject({ year: 2012, month: 4, day: 17, hour: 14, minute: 30 });
  });
});

describe("ageInYears", () => {
  it("Artisio berusia 18 tahun pada 1 Januari 2012", () => {
    const birth = calendarToMinutes({ year: 1994, month: 1, day: 1 });
    const now = calendarToMinutes({ year: 2012, month: 1, day: 1 });
    expect(ageInYears(birth, now)).toBe(18);
  });

  it("belum bertambah umur sebelum tanggal ulang tahun", () => {
    const birth = calendarToMinutes({ year: 1994, month: 6, day: 15 });
    const now = calendarToMinutes({ year: 2012, month: 6, day: 14 });
    expect(ageInYears(birth, now)).toBe(17);
  });
});
