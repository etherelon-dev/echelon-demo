import { classifyTerrainAt } from "../geo/terrainGeometry";
import { TERRITORIES } from "../geo/territoryGeometry";
import { mulberry32 } from "../geo/voronoi";
import { generateTerritoryName } from "./names";
import type { EconomicPower, ResourceId, TerritoryId, TerritoryState } from "./types";

/** Which resources a territory is likely to have, biased by what its land
 * actually looks like (lib/geo/classifyTerrainAt) — flavor only, not a
 * simulation. A territory always gets exactly one resource from its
 * biased pool plus a 50/50 chance of one more from the general pool, so
 * every territory has at least one resource and most have two. */
const BIASED_RESOURCE_POOL: Record<string, ResourceId[]> = {
  mountains: ["iron", "ore", "stone"],
  forest: ["timber", "wool"],
  swamp: ["fish", "grain"],
  tundra: ["wool", "fish"],
  sand: ["spice", "stone"],
  desert: ["spice", "stone"],
  lake: ["fish"],
  plains: ["grain", "wool"],
  land: ["grain", "wool"]
};

const GENERAL_RESOURCE_POOL: ResourceId[] = [
  "grain",
  "timber",
  "iron",
  "ore",
  "wool",
  "fish",
  "spice",
  "stone"
];

function pickResources(rng: () => number, biasPool: ResourceId[]): ResourceId[] {
  const first = biasPool[Math.floor(rng() * biasPool.length)];
  const resources = new Set<ResourceId>([first]);
  if (rng() < 0.5) {
    resources.add(GENERAL_RESOURCE_POOL[Math.floor(rng() * GENERAL_RESOURCE_POOL.length)]);
  }
  return Array.from(resources);
}

function deriveEconomicPower(development: number, infrastructure: number): EconomicPower {
  const score = development * 20 + infrastructure * 0.5;
  if (score >= 130) return "dominant";
  if (score >= 100) return "strong";
  if (score >= 70) return "moderate";
  if (score >= 45) return "modest";
  return "minor";
}

function buildTerritoryState(id: TerritoryId): TerritoryState {
  const rng = mulberry32(0x2c4a + id * 104729); // 104729 is prime
  const seed = TERRITORIES[id].seed;
  const terrainType = classifyTerrainAt(seed[0], seed[1]);
  const biasPool = BIASED_RESOURCE_POOL[terrainType] ?? BIASED_RESOURCE_POOL.land;

  const population = Math.round(1200 + rng() * rng() * 46000);
  const development = Math.max(1, Math.min(5, Math.floor(1 + rng() * rng() * 5.2)));
  const infrastructure = Math.max(
    4,
    Math.min(100, Math.round(development * 14 + rng() * 26))
  );
  const stability = Math.round(42 + rng() * 56);

  return {
    id,
    name: generateTerritoryName(id),
    population,
    development,
    resources: pickResources(rng, biasPool),
    infrastructure,
    economicPower: deriveEconomicPower(development, infrastructure),
    stability,
    kingdomId: null
  };
}

/** One deterministic state per territory, generated once at module load —
 * the demo's starting world. useGameState.ts is what actually mutates
 * ownership/development/etc. from here on; this module never re-runs. */
export const INITIAL_TERRITORIES: Record<TerritoryId, TerritoryState> = Object.fromEntries(
  TERRITORIES.map((_, id) => [id, buildTerritoryState(id)])
);
