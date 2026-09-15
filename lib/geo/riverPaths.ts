import type { LonLat } from "./path";

export interface RiverDefinition {
  name: string;
  /** Ordered points along the river's real-world course, lon/lat degrees.
   * Simplified polylines (a handful of points), not precise hydrology. */
  points: LonLat[];
}

/**
 * Major rivers of Anatolia and its immediate surroundings, hand-authored
 * from their known real-world courses — there is no hydrography dataset in
 * this project and no network access to fetch one (see README.md). Paths
 * are simplified but follow the real route (source region to real mouth/
 * border-crossing), not invented geography.
 */
export const RIVERS: RiverDefinition[] = [
  {
    // Kızılırmak (Halys) — Turkey's longest river, loops through central
    // Anatolia from near Sivas out to the Black Sea near Bafra.
    name: "kizilirmak",
    points: [
      [38.3, 39.7],
      [36.5, 39.3],
      [34.7, 39.6],
      [33.7, 40.0],
      [34.3, 40.7],
      [35.0, 41.1],
      [35.8, 41.65]
    ]
  },
  {
    // Sakarya — northwest Anatolia, out to the Black Sea near Karasu.
    name: "sakarya",
    points: [
      [31.4, 38.7],
      [30.9, 39.4],
      [30.5, 40.0],
      [30.4, 40.6],
      [30.3, 41.0],
      [30.6, 41.1]
    ]
  },
  {
    // Euphrates (Fırat) — eastern Turkey, south toward the Syrian border.
    name: "euphrates",
    points: [
      [41.3, 39.9],
      [40.3, 39.4],
      [39.5, 38.7],
      [38.9, 38.0],
      [38.4, 37.2],
      [38.1, 36.4]
    ]
  },
  {
    // Tigris (Dicle) — southeastern Turkey toward the Iraq border.
    name: "tigris",
    points: [
      [39.8, 38.6],
      [40.1, 38.1],
      [40.6, 37.6],
      [41.3, 37.2],
      [42.0, 37.05],
      [42.6, 36.9]
    ]
  },
  {
    // Yeşilırmak — central Black Sea region.
    name: "yesilirmak",
    points: [
      [36.6, 40.3],
      [36.5, 40.7],
      [36.4, 41.1],
      [36.3, 41.35]
    ]
  },
  {
    // Seyhan — southern Anatolia, out to the Mediterranean near Adana.
    name: "seyhan",
    points: [
      [36.0, 37.9],
      [35.7, 37.3],
      [35.4, 36.8],
      [35.3, 36.6]
    ]
  }
];
