import { CURRENT_SCHEMA_VERSION, type SimulationBundle } from "@/types/simulation";
import { DEFAULT_APPEARANCE_ID } from "./appearance";
import { HOME_COUNTRY_ID, DEFAULT_CITY_ID } from "./worldCatalog";

/**
 * Migrasi save lama secara aditif (README: "prinsip arsitektur" — jangan
 * hapus/ubah bentuk field lama, hanya tambahkan default untuk field baru).
 *
 * schemaVersion 1 -> 2 (Fase 2):
 * - `state.recentTurns` ditambahkan (riwayat naratif ringkas)
 * - `character.vitalStatus` / `causeOfDeath` / `deceasedAtMinute` ditambahkan
 *   (status vital — lihat MASTER_PROMPT.md #76 & lib/simulation/death.ts)
 *
 * Save dari versi 1 tidak mungkin sudah meninggal (fitur itu belum ada),
 * jadi default yang aman adalah "alive".
 *
 * schemaVersion 2 -> 3 (pembuatan karakter oleh pemain):
 * - `character.gender` ditambahkan — save lama semuanya berasal dari
 *   karakter contoh awal (Artisio Libalo), jadi default aman adalah "male".
 * - `character.appearanceId` ditambahkan — default ke preset pertama
 *   (lib/simulation/appearance.ts) untuk save yang belum pernah memilih.
 *
 * schemaVersion 3 -> 4 (Fase 3 — Kehidupan):
 * - `character.finance.recurringExpenses` & `character.inventory` ditambahkan
 *   — default array kosong (save lama belum pernah punya sewa/listrik/barang).
 *
 * schemaVersion 4 -> 5 (Fase 4 — Dunia):
 * - `character.investments` ditambahkan — default array kosong (save lama
 *   belum pernah berinvestasi).
 * - `character.location.countryId`/`cityId` di-default-kan ke Indonesia/
 *   Jakarta kalau masih null — save lama dibuat sebelum field ini benar-benar
 *   dipakai (selalu null sejak Fase 1), jadi anggap saja mereka selalu
 *   tinggal di ibu kota sejak awal (lib/simulation/worldCatalog.ts).
 */
export function migrateBundle(bundle: SimulationBundle): SimulationBundle {
  let next = bundle;

  if (!next.state.recentTurns) {
    next = { ...next, state: { ...next.state, recentTurns: [] } };
  }

  if (!next.character.vitalStatus) {
    next = {
      ...next,
      character: {
        ...next.character,
        vitalStatus: "alive",
        causeOfDeath: next.character.causeOfDeath ?? null,
        deceasedAtMinute: next.character.deceasedAtMinute ?? null,
      },
    };
  }

  if (!next.character.gender) {
    next = { ...next, character: { ...next.character, gender: "male" } };
  }

  if (!next.character.appearanceId) {
    next = { ...next, character: { ...next.character, appearanceId: DEFAULT_APPEARANCE_ID } };
  }

  if (!next.character.finance.recurringExpenses) {
    next = {
      ...next,
      character: { ...next.character, finance: { ...next.character.finance, recurringExpenses: [] } },
    };
  }

  if (!next.character.inventory) {
    next = { ...next, character: { ...next.character, inventory: [] } };
  }

  if (!next.character.investments) {
    next = { ...next, character: { ...next.character, investments: [] } };
  }

  if (!next.character.location?.countryId || !next.character.location?.cityId) {
    next = {
      ...next,
      character: {
        ...next.character,
        location: {
          countryId: next.character.location?.countryId ?? HOME_COUNTRY_ID,
          cityId: next.character.location?.cityId ?? DEFAULT_CITY_ID,
        },
      },
    };
  }

  if (next.state.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    next = { ...next, state: { ...next.state, schemaVersion: CURRENT_SCHEMA_VERSION } };
  }

  return next;
}
