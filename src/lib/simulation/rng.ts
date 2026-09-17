/**
 * PRNG berbasis seed (mulberry32) — dipakai untuk peristiwa acak dunia
 * (lib/simulation/randomEvents.ts) supaya deterministik: state + waktu
 * simulasi yang sama selalu menghasilkan peluang yang sama, sehingga
 * bisa diuji (MASTER_PROMPT.md #80) dan tidak bergantung pada
 * `Math.random()` global yang tidak bisa direproduksi.
 */

/** Hash string sederhana (djb2) -> integer 32-bit, dipakai sebagai seed. */
export function hashStringToSeed(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

export type RandomFn = () => number;

/** Membuat generator angka acak [0, 1) deterministik dari seed integer. */
export function mulberry32(seed: number): RandomFn {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Helper: RNG deterministik untuk satu tick simulasi tertentu. */
export function rngForTick(saveId: string, atMinute: number): RandomFn {
  return mulberry32(hashStringToSeed(`${saveId}:${atMinute}`));
}
