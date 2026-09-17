import { getDB } from "../db";
import type { SaveMetadata } from "@/types/save";

export async function listSaves(): Promise<SaveMetadata[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex("saveMetadata", "by-updatedAt");
  return all.reverse(); // terbaru dulu
}

export async function getSaveMetadata(saveId: string): Promise<SaveMetadata | undefined> {
  const db = await getDB();
  return db.get("saveMetadata", saveId);
}

export async function putSaveMetadata(meta: SaveMetadata): Promise<void> {
  const db = await getDB();
  await db.put("saveMetadata", meta);
}

export async function renameSave(saveId: string, newName: string): Promise<void> {
  const db = await getDB();
  const existing = await db.get("saveMetadata", saveId);
  if (!existing) throw new Error(`Save ${saveId} tidak ditemukan`);
  existing.name = newName;
  existing.updatedAt = new Date().toISOString();
  await db.put("saveMetadata", existing);
}

export async function deleteSaveMetadata(saveId: string): Promise<void> {
  const db = await getDB();
  await db.delete("saveMetadata", saveId);
}
