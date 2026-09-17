import type { EntityId, ISODateTime } from "./common";
import type { SimulationBundle } from "./simulation";

export interface SaveMetadata {
  id: EntityId;
  name: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  /** Ringkasan singkat ditampilkan di daftar save (nama karakter, umur, uang, dsb.) */
  summary: SaveSummary;
}

export interface SaveSummary {
  characterName: string;
  simulationYear: number;
  simulationMonth: number;
  netWorth: number;
}

/**
 * Format portabel untuk export/import save (MASTER_PROMPT.md #6).
 * PENTING: tidak pernah berisi API key AI apa pun.
 */
export interface ExportedSave {
  formatVersion: 1;
  exportedAt: ISODateTime;
  metadata: SaveMetadata;
  bundle: SimulationBundle;
}
