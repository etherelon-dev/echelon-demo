import type { Character } from "@/types/character";
import type { EffectOperation, SimulationEffect } from "@/types/ai";
import { FIXED_EFFECT_PATHS } from "@/types/ai";
import type { ValidationResult } from "@/types/common";

/**
 * Lapisan validasi & penerapan effect (MASTER_PROMPT.md #10, #11, #59).
 *
 * AI TIDAK PERNAH mengubah state secara langsung — ia hanya mengusulkan
 * `SimulationEffect[]`. Modul ini adalah satu-satunya tempat yang boleh
 * menerjemahkan effect menjadi perubahan `Character` nyata, dan HARUS
 * menolak effect yang: memakai path di luar whitelist, bernilai
 * NaN/Infinity, membuat uang negatif, atau melebihi batas kewajaran.
 */

const SKILL_ID_PATTERN = /^[a-zA-Z0-9_]{1,32}$/;

const PERCENT_PATHS = new Set<string>([
  "needs.health",
  "needs.energy",
  "needs.hunger",
  "needs.stress",
  "needs.happiness",
  "progression.education",
  "progression.reputation",
]);

const NON_NEGATIVE_FINANCE_PATHS = new Set<string>([
  "finance.cash",
  "finance.bankBalance",
  "finance.savings",
  "finance.debt",
]);

/** Batas kewajaran satu effect finansial tunggal — mencegah AI berhalusinasi
 * angka absurd (mis. "dapat 1 triliun rupiah"). Nilai ini generus untuk
 * kondisi awal karakter yang sangat miskin, tapi tetap terbatas (#59). */
const MAX_ABS_FINANCE_DELTA = 2_000_000_000;

function extractSkillId(path: string): string | null {
  const match = path.match(/^progression\.skills\.([\s\S]+)$/);
  if (!match) return null;
  const id = match[1];
  return id && SKILL_ID_PATTERN.test(id) ? id : null;
}

function isAllowedPath(path: string): boolean {
  if ((FIXED_EFFECT_PATHS as readonly string[]).includes(path)) return true;
  return extractSkillId(path) !== null;
}

function readPath(character: Character, path: string): number {
  if (path.startsWith("needs.")) {
    const key = path.slice("needs.".length) as keyof Character["needs"];
    return character.needs[key];
  }
  if (path.startsWith("finance.")) {
    const key = path.slice("finance.".length) as keyof Omit<Character["finance"], "recurringExpenses">;
    return character.finance[key];
  }
  if (path === "progression.education") return character.progression.education;
  if (path === "progression.experience") return character.progression.experience;
  if (path === "progression.reputation") return character.progression.reputation;
  const skillId = extractSkillId(path);
  if (skillId) return character.progression.skills[skillId] ?? 0;
  throw new Error(`Path effect tidak dikenal: ${path}`);
}

function writePath(character: Character, path: string, value: number): Character {
  if (path.startsWith("needs.")) {
    const key = path.slice("needs.".length) as keyof Character["needs"];
    return { ...character, needs: { ...character.needs, [key]: value } };
  }
  if (path.startsWith("finance.")) {
    const key = path.slice("finance.".length) as keyof Omit<Character["finance"], "recurringExpenses">;
    return { ...character, finance: { ...character.finance, [key]: value } };
  }
  if (path === "progression.education") {
    return { ...character, progression: { ...character.progression, education: value } };
  }
  if (path === "progression.experience") {
    return { ...character, progression: { ...character.progression, experience: value } };
  }
  if (path === "progression.reputation") {
    return { ...character, progression: { ...character.progression, reputation: value } };
  }
  const skillId = extractSkillId(path);
  if (skillId) {
    return {
      ...character,
      progression: {
        ...character.progression,
        skills: { ...character.progression.skills, [skillId]: value },
      },
    };
  }
  throw new Error(`Path effect tidak dikenal: ${path}`);
}

function computeNext(current: number, operation: EffectOperation, value: number): number {
  switch (operation) {
    case "add":
      return current + value;
    case "subtract":
      return current - value;
    case "multiply":
      return current * value;
    case "set":
      return value;
    default:
      return current;
  }
}

function clampForPath(path: string, value: number): number {
  if (PERCENT_PATHS.has(path)) return Math.max(0, Math.min(100, value));
  if (extractSkillId(path)) return Math.max(0, Math.min(100, value));
  if (path === "progression.experience") return Math.max(0, value);
  return value;
}

export interface EffectValidationOptions {
  /** Batas jumlah effect per giliran — mencegah satu aksi membanjiri state. */
  maxEffects?: number;
}

/**
 * Memvalidasi satu batch effect TANPA menerapkannya. Mengembalikan
 * `{ valid: false }` jika salah satu effect melanggar aturan — dalam hal
 * itu SELURUH batch ditolak (bukan diterapkan sebagian), supaya state
 * tidak pernah setengah-konsisten dengan narasi yang ditolak.
 */
export function validateEffects(
  character: Character,
  effects: SimulationEffect[],
  options: EffectValidationOptions = {}
): ValidationResult<SimulationEffect[]> {
  const maxEffects = options.maxEffects ?? 12;
  if (effects.length > maxEffects) {
    return {
      valid: false,
      reason: `Terlalu banyak effect dalam satu aksi (${effects.length} > ${maxEffects}).`,
    };
  }

  let draft = character;
  for (const effect of effects) {
    if (!isAllowedPath(effect.path)) {
      return { valid: false, reason: `Path effect tidak diizinkan: "${effect.path}".` };
    }
    if (!Number.isFinite(effect.value)) {
      return {
        valid: false,
        reason: `Nilai effect untuk "${effect.path}" bukan angka valid (NaN/Infinity).`,
      };
    }
    if (!(["add", "subtract", "set", "multiply"] as string[]).includes(effect.operation)) {
      return { valid: false, reason: `Operasi effect tidak dikenal: "${effect.operation}".` };
    }

    const current = readPath(draft, effect.path);
    let next = computeNext(current, effect.operation, effect.value);

    if (NON_NEGATIVE_FINANCE_PATHS.has(effect.path)) {
      if (Math.abs(next - current) > MAX_ABS_FINANCE_DELTA) {
        return {
          valid: false,
          reason: `Perubahan pada "${effect.path}" tidak masuk akal (melebihi ${MAX_ABS_FINANCE_DELTA.toLocaleString(
            "id-ID"
          )}).`,
        };
      }
      if (next < -0.001) {
        return {
          valid: false,
          reason: `Aksi ini akan membuat "${effect.path}" negatif — tidak mungkin secara realistis (mis. tidak bisa membelanjakan uang yang tidak dimiliki).`,
        };
      }
      next = Math.max(0, Math.round(next));
    } else {
      next = clampForPath(effect.path, next);
    }

    draft = writePath(draft, effect.path, next);
  }

  return { valid: true, value: effects };
}

/** Menerapkan effect yang SUDAH lolos `validateEffects()`. Jangan panggil sendirian. */
export function applyEffects(character: Character, effects: SimulationEffect[]): Character {
  let next = character;
  for (const effect of effects) {
    const current = readPath(next, effect.path);
    let value = computeNext(current, effect.operation, effect.value);
    if (NON_NEGATIVE_FINANCE_PATHS.has(effect.path)) {
      value = Math.max(0, Math.round(value));
    } else {
      value = clampForPath(effect.path, value);
    }
    next = writePath(next, effect.path, value);
  }
  return next;
}

export function summarizeEffect(effect: SimulationEffect): string {
  const arrow =
    effect.operation === "subtract"
      ? "-"
      : effect.operation === "add"
        ? "+"
        : effect.operation === "multiply"
          ? "×"
          : "=";
  return `${effect.path} ${arrow}${effect.value}`;
}
