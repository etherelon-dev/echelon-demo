import type { Character } from "@/types/character";
import type { SimulationMinutes } from "@/types/time";

/**
 * Aturan kematian (permintaan pengguna: dunia harus realistis, TANPA
 * plot armor). Jika kesehatan menyentuh 0, karakter meninggal — ini
 * ditentukan murni oleh engine berdasarkan angka, bukan oleh narasi AI
 * (MASTER_PROMPT.md #10). AI boleh menulis narasi tentang kematian, tapi
 * tidak pernah AI yang MEMUTUSKAN apakah karakter mati.
 */
export function checkVitalStatus(
  character: Character,
  nowMinute: SimulationMinutes,
  causeHint?: string
): Character {
  if (character.vitalStatus === "deceased") return character;
  if (character.needs.health > 0) return character;

  return {
    ...character,
    vitalStatus: "deceased",
    causeOfDeath: causeHint ?? "Kesehatan menurun hingga titik kritis.",
    deceasedAtMinute: nowMinute,
  };
}

export function isAlive(character: Character): boolean {
  return character.vitalStatus === "alive";
}
