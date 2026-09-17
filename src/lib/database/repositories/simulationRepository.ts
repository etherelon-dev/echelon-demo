import { getDB } from "../db";
import type { SimulationBundle } from "@/types/simulation";

export async function getSimulationBundle(saveId: string): Promise<SimulationBundle | undefined> {
  const db = await getDB();
  return db.get("simulationBundles", saveId);
}

export async function putSimulationBundle(bundle: SimulationBundle): Promise<void> {
  const db = await getDB();
  await db.put("simulationBundles", bundle);
}

export async function deleteSimulationBundle(saveId: string): Promise<void> {
  const db = await getDB();
  await db.delete("simulationBundles", saveId);
}
