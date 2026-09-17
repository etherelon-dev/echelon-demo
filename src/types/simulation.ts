import type { Character } from "./character";
import type { EntityId } from "./common";
import type { SimulationMinutes } from "./time";
import type { SimulationEventOutcome } from "./ai";

/**
 * Satu entri riwayat naratif (Fase 2): ringkasan satu giliran, baik yang
 * dipicu perintah pemain lewat AI Agent maupun lewat lompatan waktu biasa.
 * Disimpan (bukan cuma ditampilkan sekali) supaya:
 * - lib/ai/contextBuilder.ts bisa memberi AI kesinambungan naratif, dan
 * - components/game/NarrativeFeed.tsx bisa menampilkan riwayat ke pemain.
 */
export interface TurnLogEntry {
  id: EntityId;
  /** Waktu simulasi (menit) saat giliran ini SELESAI. */
  atMinute: SimulationMinutes;
  /** Kosong untuk giliran yang bukan berasal dari kotak perintah (mis. tombol lewat-waktu cepat). */
  playerInput: string;
  narrativeTitle: string;
  narrativeText: string;
  /** Ringkasan tampilan tiap effect yang diterapkan, mis. "finance.cash -15000". */
  effectSummaries: string[];
  events: SimulationEventOutcome[];
  /** true jika AI Agent menolak aksi pemain sendiri (lihat lib/ai/prompt.ts). */
  rejected: boolean;
}

/** Batas jumlah entri riwayat yang disimpan di save — cukup untuk konteks AI + tampilan, tanpa membuat save membengkak tanpa batas. */
export const MAX_STORED_TURNS = 200;

/**
 * SimulationState = akar dari seluruh dunia game.
 *
 * CATATAN FASE 1: hanya berisi apa yang dibutuhkan untuk fondasi
 * (karakter + waktu). Field untuk negara, pasar, NPC, dsb. akan
 * ditambahkan pada fase-fase berikutnya (lihat MASTER_PROMPT.md #79)
 * tanpa mengubah bentuk field yang sudah ada di sini.
 *
 * FASE 2: `recentTurns` ditambahkan secara aditif — save lama (tanpa
 * field ini) dimigrasi lewat lib/simulation/migrations.ts, bukan lewat
 * default di sini, supaya migrasi tetap eksplisit & bisa diuji.
 */
export interface SimulationState {
  saveId: EntityId;
  /** Waktu simulasi saat ini, dalam menit sejak epoch (2012-01-01) */
  nowMinute: SimulationMinutes;
  characterId: EntityId;
  /** Versi skema state, dipakai untuk migrasi save lama */
  schemaVersion: number;
  /** Riwayat giliran terbaru, terbaru di akhir array. Lihat MAX_STORED_TURNS. */
  recentTurns: TurnLogEntry[];
}

export interface SimulationBundle {
  state: SimulationState;
  character: Character;
}

/**
 * v1 = Fase 1 (fondasi). v2 = Fase 2 (AI Agent, recentTurns, vitalStatus).
 * v3 = pembuatan karakter oleh pemain (character.gender & character.appearanceId).
 * v4 = Fase 3 "Kehidupan": character.finance.recurringExpenses & character.inventory
 * ditambahkan.
 * v5 = Fase 4 "Dunia": character.investments ditambahkan (array kosong untuk
 * save lama); character.location.countryId/cityId di-default-kan ke
 * Indonesia/Jakarta untuk save lama yang masih null — lihat
 * lib/simulation/migrations.ts.
 */
export const CURRENT_SCHEMA_VERSION = 5;
