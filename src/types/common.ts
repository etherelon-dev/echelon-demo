/**
 * Tipe-tipe dasar yang dipakai di seluruh simulasi.
 *
 * Aturan penting (lihat MASTER_PROMPT.md #5):
 * - ID entitas TIDAK PERNAH berupa nama tampilan. Selalu string stabil
 *   yang dihasilkan oleh generateId().
 */

export type EntityId = string;

/** Nilai uang disimpan sebagai integer (unit terkecil mata uang, mis. Rupiah penuh) untuk menghindari floating-point drift. */
export type Money = number;

/** ISO date string, contoh: "2012-04-17" */
export type ISODate = string;

/** ISO datetime string, contoh: "2012-04-17T14:30:00.000Z" */
export type ISODateTime = string;

export function generateId(prefix: string): EntityId {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}_${random}`;
}

/** Wrapper hasil validasi, dipakai di seluruh simulation engine & AI validation layer. */
export type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; reason: string };
