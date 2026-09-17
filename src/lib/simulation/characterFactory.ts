import { generateId } from "@/types/common";
import type { ValidationResult } from "@/types/common";
import type { Character, CharacterCreationInput } from "@/types/character";
import type { SimulationMinutes } from "@/types/time";
import { calendarToMinutes, minutesToCalendar, ageInYears } from "./time";
import { DEFAULT_APPEARANCE_ID } from "./appearance";
import { HOME_COUNTRY_ID, DEFAULT_CITY_ID, getCity } from "./worldCatalog";
import { calculatePortfolioValue } from "./investments";

/**
 * Titik mulai simulasi: 1 Januari 2012 (lihat README "Prinsip arsitektur").
 * Ini TIDAK berubah oleh pembuatan karakter — hanya kondisi karakter
 * (nama/gender/tanggal lahir/kostum) yang kini dipilih pemain.
 */
export const SIMULATION_START_MINUTE = calendarToMinutes({ year: 2012, month: 1, day: 1 });

const SIM_START_YEAR = minutesToCalendar(SIMULATION_START_MINUTE).year;

/**
 * Batas usia saat mulai hidup. Estyalife Fase 1-2 belum punya mekanisme
 * masa kecil (sekolah dasar, orang tua, dll) — semua aksi yang tersedia
 * (cari kerja, belajar, menabung) mengasumsikan karakter sudah cukup umur
 * untuk mengambil keputusan hidup sendiri. Simulasi masa kecil adalah
 * kandidat fase mendatang, bukan cakupan pembaruan ini.
 */
export const MIN_START_AGE = 15;
export const MAX_START_AGE = 90;

/** Batas tanggal lahir yang valid, diturunkan dari MIN/MAX_START_AGE relatif
 * terhadap SIMULATION_START_MINUTE — dipakai UI form (atribut min/max input
 * tanggal) maupun validateBirthMinute() di bawah. */
export const MIN_BIRTH_MINUTE = calendarToMinutes({
  year: SIM_START_YEAR - MAX_START_AGE,
  month: 1,
  day: 1,
});
export const MAX_BIRTH_MINUTE = calendarToMinutes({
  year: SIM_START_YEAR - MIN_START_AGE,
  month: 1,
  day: 1,
});

const STARTING_MONEY_CASH = 150_000; // Rp150.000 — sangat pas-pasan
const STARTING_MONEY_BANK = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Memvalidasi tanggal lahir pilihan pemain terhadap SIMULATION_START_MINUTE:
 * tidak boleh di masa depan relatif ke 1 Januari 2012, dan usia yang
 * dihasilkan harus berada dalam MIN_START_AGE..MAX_START_AGE. Dipakai baik
 * oleh UI (validasi form sebelum submit) maupun createCharacter() (jaring
 * pengaman terakhir sebelum karakter benar-benar dibuat).
 */
export function validateBirthMinute(
  birthMinute: SimulationMinutes,
  now: SimulationMinutes = SIMULATION_START_MINUTE
): ValidationResult<SimulationMinutes> {
  if (!Number.isFinite(birthMinute)) {
    return { valid: false, reason: "Tanggal lahir tidak valid." };
  }
  if (birthMinute > now) {
    return {
      valid: false,
      reason: "Tanggal lahir tidak boleh setelah 1 Januari 2012 — dunia ini dimulai di titik itu.",
    };
  }

  const age = ageInYears(birthMinute, now);
  if (age < MIN_START_AGE) {
    return {
      valid: false,
      reason: `Usia minimal untuk memulai hidup adalah ${MIN_START_AGE} tahun (belum ada simulasi masa kecil).`,
    };
  }
  if (age > MAX_START_AGE) {
    return {
      valid: false,
      reason: `Usia maksimal untuk memulai hidup adalah ${MAX_START_AGE} tahun.`,
    };
  }

  return { valid: true, value: birthMinute };
}

/**
 * Merakit `Character` baru dari input pembuatan karakter (form di sampul).
 * Prinsip inti Estyalife tetap dipertahankan apa pun pilihan pemain: mulai
 * SANGAT MISKIN secara finansial (uang tunai pas-pasan, tabungan nol,
 * pendidikan formal rendah). Yang diskalakan ringan mengikuti usia awal
 * HANYA pendidikan/pengalaman/reputasi dasar — masuk akal secara realistis
 * bahwa orang yang memulai di usia lebih tua sudah pernah mengenyam sedikit
 * sekolah/pengalaman kerja, tanpa membuatnya berkecukupan secara finansial.
 */
export function createCharacter(
  input: CharacterCreationInput,
  now: SimulationMinutes = SIMULATION_START_MINUTE
): Character {
  const validated = validateBirthMinute(input.birthMinute, now);
  const birthMinute = validated.valid ? validated.value : SIMULATION_START_MINUTE;
  const age = ageInYears(birthMinute, now);
  const ageAboveMin = Math.max(0, age - MIN_START_AGE);

  const character: Character = {
    id: generateId("char"),
    name: input.name.trim() || "Tanpa Nama",
    gender: input.gender,
    birthMinute,
    appearanceId: input.appearanceId || DEFAULT_APPEARANCE_ID,
    needs: {
      health: 70,
      energy: 60,
      hunger: 50,
      stress: 40,
      happiness: 45,
    },
    finance: {
      cash: STARTING_MONEY_CASH,
      bankBalance: STARTING_MONEY_BANK,
      savings: 0,
      debt: 0,
      recurringExpenses: [],
    },
    progression: {
      education: Math.round(clamp(10 + ageAboveMin * 0.7, 10, 55)),
      skills: {},
      experience: Math.round(clamp(ageAboveMin * 40, 0, 2000)),
      reputation: Math.round(clamp(5 + ageAboveMin * 0.3, 5, 25)),
    },
    location: {
      countryId: HOME_COUNTRY_ID,
      // getCity() menjaga id tak dikenal (mis. hasil edit save manual) tidak lolos begitu saja.
      cityId: (input.cityId && getCity(input.cityId) ? input.cityId : DEFAULT_CITY_ID),
    },
    inventory: [],
    investments: [],
    careerJobId: null,
    vitalStatus: "alive",
    causeOfDeath: null,
    deceasedAtMinute: null,
    createdAtMinute: now,
    updatedAtMinute: now,
  };

  return character;
}

/**
 * Karakter contoh Estyalife asli (Artisio Libalo, 18 tahun, 2012) —
 * dipertahankan sebagai default untuk unit test & fallback, BUKAN lagi
 * satu-satunya cara memulai hidup baru. Alur pemain sesungguhnya lewat
 * createCharacter() + CharacterCreationInput dari form di sampul.
 */
export function createArtisio(now: number = SIMULATION_START_MINUTE): Character {
  return createCharacter(
    {
      name: "Artisio Libalo",
      gender: "male",
      birthMinute: calendarToMinutes({ year: 1994, month: 1, day: 1 }),
      appearanceId: DEFAULT_APPEARANCE_ID,
    },
    now
  );
}

export function calculateNetWorth(character: Character): number {
  const { cash, bankBalance, savings, debt } = character.finance;
  return cash + bankBalance + savings - debt;
}

/**
 * Fase 4: net worth + nilai portofolio investasi terkini (lib/simulation/investments.ts).
 * Fungsi TERPISAH dari calculateNetWorth() (bukan mengganti signature-nya)
 * supaya seluruh pemanggil lama (lib/simulation/saveService.ts, dashboard
 * Fase 1-3) tetap jalan tanpa perlu diberi saveId/nowMinute — hanya
 * tempat yang memang butuh angka "kekayaan total termasuk investasi" yang
 * beralih memakai fungsi ini.
 */
export function calculateNetWorthWithPortfolio(
  character: Character,
  saveId: string,
  nowMinute: SimulationMinutes
): number {
  return calculateNetWorth(character) + calculatePortfolioValue(character, saveId, nowMinute);
}
