/**
 * Game-state types — deliberately kept separate from lib/geo/*.
 *
 * lib/geo describes the world (real coastlines, terrain, rivers, and the
 * procedural territory *shapes*); everything in lib/game describes what
 * Echelon's players have done to it (names, ownership, development,
 * history). Selecting a territory or forming a kingdom never touches the
 * geometry — it only ever updates state here, keyed by the territory index
 * that lib/geo/territoryGeometry.ts already assigns. See lib/geo/README.md
 * and the DATA ARCHITECTURE section of the upgrade brief this module
 * implements.
 */

export type TerritoryId = number;
export type KingdomId = string;

export type ResourceId = "grain" | "timber" | "iron" | "ore" | "wool" | "fish" | "spice" | "stone";

export const RESOURCE_LABELS: Record<ResourceId, string> = {
  grain: "Grain",
  timber: "Timber",
  iron: "Iron",
  ore: "Ore",
  wool: "Wool",
  fish: "Fish",
  spice: "Spice",
  stone: "Stone"
};

export type EconomicPower = "minor" | "modest" | "moderate" | "strong" | "dominant";

export interface TerritoryState {
  id: TerritoryId;
  name: string;
  population: number;
  /** 1-5, shown to the player as "LEVEL n". */
  development: number;
  resources: ResourceId[];
  /** 0-100. */
  infrastructure: number;
  economicPower: EconomicPower;
  /** 0-100, percent. */
  stability: number;
  kingdomId: KingdomId | null;
}

export interface Kingdom {
  id: KingdomId;
  name: string;
  /** Hex color used for the political overlay fill and the emblem. */
  color: string;
  capitalTerritoryId: TerritoryId;
  memberTerritoryIds: TerritoryId[];
  foundedYear: number;
  /** Other kingdoms this one currently has a trade agreement with. */
  tradePartners: KingdomId[];
}

export interface HistoryEvent {
  id: string;
  year: number;
  text: string;
}
