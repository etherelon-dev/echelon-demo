import { generateId } from "@/types/common";
import type { ExportedSave, SaveMetadata } from "@/types/save";
import type { CharacterCreationInput } from "@/types/character";
import { CURRENT_SCHEMA_VERSION, type SimulationBundle } from "@/types/simulation";
import {
  deleteSaveMetadata,
  getSaveMetadata,
  listSaves,
  putSaveMetadata,
  renameSave,
} from "@/lib/database/repositories/saveMetadataRepository";
import {
  deleteSimulationBundle,
  getSimulationBundle,
  putSimulationBundle,
} from "@/lib/database/repositories/simulationRepository";
import { createCharacter, calculateNetWorthWithPortfolio, SIMULATION_START_MINUTE } from "./characterFactory";
import { minutesToCalendar } from "./time";
import { migrateBundle } from "./migrations";

function buildSummary(bundle: SimulationBundle): SaveMetadata["summary"] {
  const cal = minutesToCalendar(bundle.state.nowMinute);
  return {
    characterName: bundle.character.name,
    simulationYear: cal.year,
    simulationMonth: cal.month,
    // Fase 4: termasuk nilai portofolio investasi (lib/simulation/investments.ts) — lihat calculateNetWorthWithPortfolio().
    netWorth: calculateNetWorthWithPortfolio(bundle.character, bundle.state.saveId, bundle.state.nowMinute),
  };
}

export async function startNewGame(input: CharacterCreationInput): Promise<SimulationBundle> {
  const character = createCharacter(input, SIMULATION_START_MINUTE);
  const saveId = generateId("save");

  const bundle: SimulationBundle = {
    state: {
      saveId,
      nowMinute: SIMULATION_START_MINUTE,
      characterId: character.id,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      recentTurns: [],
    },
    character,
  };

  const now = new Date().toISOString();
  const metadata: SaveMetadata = {
    id: saveId,
    name: character.name || "Permainan Baru",
    createdAt: now,
    updatedAt: now,
    summary: buildSummary(bundle),
  };

  await putSimulationBundle(bundle);
  await putSaveMetadata(metadata);

  return bundle;
}

export async function saveGame(bundle: SimulationBundle): Promise<void> {
  await putSimulationBundle(bundle);
  const meta = await getSaveMetadata(bundle.state.saveId);
  const now = new Date().toISOString();
  await putSaveMetadata({
    id: bundle.state.saveId,
    name: meta?.name ?? bundle.character.name,
    createdAt: meta?.createdAt ?? now,
    updatedAt: now,
    summary: buildSummary(bundle),
  });
}

/**
 * Memuat save lalu memigrasikannya ke schemaVersion saat ini (Fase 2:
 * menambahkan `recentTurns` & `vitalStatus` secara aditif untuk save
 * dari Fase 1 — lihat lib/simulation/migrations.ts). Kalau migrasi
 * benar-benar mengubah bentuknya, hasilnya langsung disimpan ulang
 * supaya save tidak perlu dimigrasi berulang kali di kemudian hari.
 */
export async function loadGame(saveId: string): Promise<SimulationBundle | undefined> {
  const bundle = await getSimulationBundle(saveId);
  if (!bundle) return undefined;

  const migrated = migrateBundle(bundle);
  if (migrated !== bundle) {
    await putSimulationBundle(migrated);
  }
  return migrated;
}

export async function listAllSaves(): Promise<SaveMetadata[]> {
  return listSaves();
}

export async function deleteGame(saveId: string): Promise<void> {
  await deleteSimulationBundle(saveId);
  await deleteSaveMetadata(saveId);
}

export async function renameGame(saveId: string, newName: string): Promise<void> {
  await renameSave(saveId, newName);
}

/** Export save sebagai JSON portabel. Tidak pernah menyertakan API key (MASTER_PROMPT.md #6, #58). */
export async function exportGame(saveId: string): Promise<ExportedSave> {
  const bundle = await getSimulationBundle(saveId);
  const metadata = await getSaveMetadata(saveId);
  if (!bundle || !metadata) throw new Error(`Save ${saveId} tidak ditemukan`);

  return {
    formatVersion: 1,
    exportedAt: new Date().toISOString(),
    metadata,
    bundle,
  };
}

export async function importGame(exported: ExportedSave): Promise<SimulationBundle> {
  if (exported.formatVersion !== 1) {
    throw new Error("Format save tidak dikenali");
  }
  // Beri ID baru agar tidak bentrok dengan save yang sudah ada secara lokal.
  const newSaveId = generateId("save");
  const bundle: SimulationBundle = migrateBundle({
    ...exported.bundle,
    state: { ...exported.bundle.state, saveId: newSaveId },
  });
  const now = new Date().toISOString();
  const metadata: SaveMetadata = {
    ...exported.metadata,
    id: newSaveId,
    createdAt: now,
    updatedAt: now,
  };

  await putSimulationBundle(bundle);
  await putSaveMetadata(metadata);
  return bundle;
}
