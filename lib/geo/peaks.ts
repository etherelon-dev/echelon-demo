import type { LonLat } from "./path";

export interface PeakDefinition {
  name: string;
  point: LonLat;
  /** "major" peaks get a slightly larger snow-cap accent and are the ones
   * labeled first as zoom increases; "minor" fill out ranges that would
   * otherwise have no relief accent at all. Not real elevation data (see
   * README) — just a two-tier size hint for rendering. */
  tier: "major" | "minor";
}

/**
 * Hand-authored highest-profile summits, one or two per major range already
 * classified as "mountains" in terrainRegions.ts — real peaks, real
 * (approximate) coordinates, used to place the snow-cap relief accents and
 * (at high zoom) small summit labels. Not a comprehensive gazetteer: a
 * couple of representative points per range is enough to read as "this
 * range has elevation" without turning the map into a pile of icons. See
 * lib/geo/README.md for why this is hand-authored rather than sourced
 * elevation data.
 */
export const PEAKS: PeakDefinition[] = [
  // Anatolia / Caucasus context
  { name: "Ağrı Dağı", point: [44.3, 39.7], tier: "major" }, // Mount Ararat, Eastern Anatolian Highlands
  { name: "Aladağlar", point: [35.16, 37.98], tier: "minor" }, // Central Taurus
  { name: "Kaçkar Dağı", point: [41.1, 40.83], tier: "minor" }, // Pontic Mountains, near Trabzon

  // Continental Europe
  { name: "Mont Blanc", point: [6.86, 45.83], tier: "major" }, // Alps
  { name: "Aneto", point: [0.66, 42.63], tier: "minor" }, // Pyrenees
  { name: "Moldoveanu", point: [24.74, 45.6], tier: "minor" }, // Carpathians
  { name: "Triglav", point: [13.84, 46.38], tier: "minor" }, // Dinaric/Julian Alps
  { name: "Olympus", point: [22.35, 40.09], tier: "major" }, // Pindus, Greece
  { name: "Musala", point: [23.59, 42.18], tier: "minor" }, // Rila/Rhodope, Bulgaria
  { name: "Galdhøpiggen", point: [8.31, 61.64], tier: "major" }, // Scandes, Norway
  { name: "Narodnaya", point: [60.1, 65.03], tier: "minor" }, // Ural Mountains
  { name: "Mulhacén", point: [-3.31, 37.06], tier: "minor" }, // Sierra Nevada, Spain
  { name: "Ben Nevis", point: [-5.0, 56.8], tier: "minor" }, // Scottish Highlands
  { name: "Hvannadalshnúkur", point: [-16.68, 64.02], tier: "minor" }, // Iceland highlands

  // North Africa / Arabia context
  { name: "Toubkal", point: [-7.91, 31.06], tier: "major" }, // High Atlas, Morocco
  { name: "Jabal Shams", point: [56.19, 23.23], tier: "minor" }, // Al Hajar, Oman

  // Islands
  { name: "Olympus (Troodos)", point: [32.87, 34.94], tier: "minor" }, // Cyprus
  { name: "Psiloritis", point: [24.82, 35.21], tier: "minor" } // Crete
];
