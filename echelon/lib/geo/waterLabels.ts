import type { LonLat } from "./path";

export interface WaterLabelDefinition {
  name: string;
  point: LonLat;
  /** "ocean" — the handful of largest bodies, labeled even at the world
   * zoom band. "sea" — labeled from the regional band up. Purely a display
   * tier, not a data source distinction. */
  tier: "ocean" | "sea";
}

/**
 * Real sea/ocean names, hand-placed at an approximate visual center for
 * each body within the active map extent (lib/geo/activeMapExtent.ts) —
 * geographic context only, same spirit as the physical terrain/river/lake
 * data (see README.md). These are labels, not shapes: nothing here defines
 * where water "is" — TerrainLayer/PhysicalGeographyLayer already do that
 * via the real coastline — this just names it.
 */
export const WATER_LABELS: WaterLabelDefinition[] = [
  { name: "Atlantic Ocean", point: [-16, 48], tier: "ocean" },
  { name: "Mediterranean Sea", point: [16, 35.2], tier: "ocean" },
  { name: "Black Sea", point: [34.5, 43.2], tier: "ocean" },
  { name: "Norwegian Sea", point: [2, 68], tier: "sea" },
  { name: "Barents Sea", point: [36, 72.5], tier: "sea" },
  { name: "North Sea", point: [3.5, 56.3], tier: "sea" },
  { name: "Baltic Sea", point: [19, 58.5], tier: "sea" },
  { name: "Aegean Sea", point: [25.2, 39], tier: "sea" },
  { name: "Sea of Marmara", point: [28.3, 40.65], tier: "sea" },
  { name: "Adriatic Sea", point: [15.3, 42.7], tier: "sea" },
  { name: "Ionian Sea", point: [18.5, 38], tier: "sea" },
  { name: "Tyrrhenian Sea", point: [11.7, 40.2], tier: "sea" },
  { name: "Caspian Sea", point: [50.5, 41.8], tier: "sea" },
  { name: "Red Sea", point: [38, 20.5], tier: "sea" },
  { name: "Arabian Sea", point: [59, 15], tier: "sea" }
];
