import { mulberry32 } from "../geo/voronoi";

/**
 * Deterministic fantasy place-name generator. Same territory id always
 * produces the same name, every load — no name table to author and
 * maintain by hand for a few hundred procedural territories, and no risk
 * of colliding with a real place name (see DO-NOT-CLAIM-REAL-GEOPOLITICS
 * in the upgrade brief this implements: territory/kingdom names must read
 * as fictional).
 */

const A = [
  "North",
  "South",
  "East",
  "West",
  "High",
  "Low",
  "Black",
  "White",
  "Grey",
  "Green",
  "Gold",
  "Silver",
  "Iron",
  "Stone",
  "Oak",
  "Raven",
  "Wolf",
  "Stag",
  "Hollow",
  "Thorn",
  "Winter",
  "Summer",
  "Fell",
  "Marsh",
  "Vale",
  "Bright",
  "Dusk",
  "Storm",
  "Elder",
  "Far"
];

const B = [
  "vale",
  "march",
  "port",
  "hold",
  "ford",
  "haven",
  "reach",
  "moor",
  "field",
  "brook",
  "gate",
  "crest",
  "watch",
  "wood",
  "shire",
  "cliff",
  "harbor",
  "bridge",
  "spire",
  "hollow",
  "stead",
  "ridge",
  "wick",
  "bury",
  "keep"
];

/** Seeded per-index RNG — territory id N always draws from the same
 * pseudo-random stream, independent of every other territory. */
function rngForIndex(seed: number, index: number): () => number {
  return mulberry32(seed + index * 7919); // 7919 is prime — spreads adjacent indices apart
}

export function generateTerritoryName(territoryId: number): string {
  const rng = rngForIndex(0x9e17, territoryId);
  const a = A[Math.floor(rng() * A.length)];
  const b = B[Math.floor(rng() * B.length)];
  return `${a}${b}`;
}

const KINGDOM_SUFFIXES = ["Kingdom", "Realm", "Dominion", "Crown", "March", "League"];

/** Names a new kingdom after its capital territory (the spec's own example
 * — "The Kingdom of Northvale" — names the kingdom for its capital), with
 * a stable, seeded chance of a suffixed style instead of the bare name. */
export function generateKingdomName(capitalTerritoryName: string, seedTerritoryId: number): string {
  const rng = rngForIndex(0x51a7, seedTerritoryId);
  if (rng() < 0.55) return capitalTerritoryName;
  const suffix = KINGDOM_SUFFIXES[Math.floor(rng() * KINGDOM_SUFFIXES.length)];
  return `${capitalTerritoryName} ${suffix}`;
}
