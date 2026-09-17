import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { SaveMetadata } from "@/types/save";
import type { SimulationBundle } from "@/types/simulation";

/**
 * Skema IndexedDB Estyalife.
 *
 * FASE 1: hanya menyimpan save metadata + bundle simulasi (state + character).
 * Store tambahan (npcs, countries, companies, markets, dst — lihat
 * MASTER_PROMPT.md #5) akan ditambahkan pada fase berikutnya lewat
 * `upgrade()` di bawah, tanpa menghapus data yang sudah ada.
 */
export interface EstyalifeDBSchema extends DBSchema {
  saveMetadata: {
    key: string; // saveId
    value: SaveMetadata;
    indexes: { "by-updatedAt": string };
  };
  simulationBundles: {
    key: string; // saveId
    value: SimulationBundle;
  };
  settings: {
    key: string;
    value: unknown;
  };
}

const DB_NAME = "estyalife-db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<EstyalifeDBSchema>> | null = null;

export function getDB(): Promise<IDBPDatabase<EstyalifeDBSchema>> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(
      new Error("IndexedDB tidak tersedia di lingkungan ini (bukan browser).")
    );
  }

  if (!dbPromise) {
    dbPromise = openDB<EstyalifeDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const saveStore = db.createObjectStore("saveMetadata", { keyPath: "id" });
          saveStore.createIndex("by-updatedAt", "updatedAt");

          db.createObjectStore("simulationBundles", { keyPath: "state.saveId" });
          db.createObjectStore("settings");
        }
        // Migrasi versi berikutnya ditambahkan di sini sebagai:
        // if (oldVersion < 2) { ... }
      },
    });
  }

  return dbPromise;
}

/** Hanya untuk testing/debug: menghapus seluruh database. */
export async function resetDatabase(): Promise<void> {
  const db = await getDB();
  db.close();
  dbPromise = null;
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
}
