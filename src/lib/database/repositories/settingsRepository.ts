import { getDB } from "../db";

/**
 * Store "settings" bersifat generik (key -> unknown) — dipakai untuk
 * preferensi ringan yang BUKAN bagian dari save game (mis. kunci API
 * AI milik pemain sendiri). Tidak pernah ikut dalam `exportGame()` /
 * `ExportedSave`, jadi aman dari kebocoran saat save dibagikan
 * (MASTER_PROMPT.md #6, #58).
 */
export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  return (await db.get("settings", key)) as T | undefined;
}

export async function putSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDB();
  await db.put("settings", value, key);
}

export async function deleteSetting(key: string): Promise<void> {
  const db = await getDB();
  await db.delete("settings", key);
}
