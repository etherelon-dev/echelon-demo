import type { LonLat } from "./path";
import type { TerrainTypeId } from "./terrainTypes";

export interface TerrainRegionDefinition {
  type: TerrainTypeId;
  /** Single outer ring, lon/lat degrees, in paint order (later entries in
   * TERRAIN_REGIONS draw on top of earlier ones). */
  ring: LonLat[];
}

/**
 * Macro-region terrain classification for the Turkey/Anatolia focus area
 * and its immediate real-world context (Balkans, Caucasus, Levant, northern
 * Arabian/Syrian desert). Hand-authored, not sourced GIS/biome data — there
 * is no elevation or biome dataset in this project and no network access to
 * fetch one (see README.md). Shapes follow real physical geography at a
 * macro level (Anatolia's mountain rims, central plateau, arid southeast,
 * etc.) but are deliberately approximate, low-vertex polygons, not precise
 * administrative or biome borders. Everything is clipped to the real
 * coastline (WORLD_LAND_PATH) by TerrainLayer, so imprecise edges never
 * spill past the shoreline.
 *
 * Land not covered by any region here simply stays the base "land" color —
 * that's the intended fallback, not a gap to fill in.
 */
export const TERRAIN_REGIONS: TerrainRegionDefinition[] = [
  // --- Broad base regions first; specific overrides layer on top below ---

  // Central Anatolian Plateau — plains/plateau around Ankara/Konya.
  {
    type: "plains",
    ring: [
      [29.5, 38.0],
      [34.5, 37.8],
      [36.5, 38.8],
      [36.0, 40.0],
      [33.0, 40.3],
      [30.0, 39.6],
      [29.0, 38.8]
    ]
  },

  // Southeastern Anatolia — broad dry steppe/lowlands north of the Syrian border.
  {
    type: "plains",
    ring: [
      [37.0, 36.5],
      [42.5, 36.7],
      [42.8, 37.8],
      [40.0, 38.0],
      [38.0, 37.8],
      [37.0, 37.3]
    ]
  },

  // Eastern Anatolian Highlands — rugged, mountainous plateau toward the Caucasus/Iran.
  {
    type: "mountains",
    ring: [
      [38.5, 38.0],
      [44.5, 38.3],
      [44.8, 40.2],
      [41.5, 41.0],
      [39.0, 40.3],
      [38.0, 39.0]
    ]
  },

  // Pontic Mountains — belt along the Black Sea coast.
  {
    type: "mountains",
    ring: [
      [27.5, 40.8],
      [31.0, 41.0],
      [35.0, 40.9],
      [39.0, 40.6],
      [42.0, 40.4],
      [42.2, 41.3],
      [38.5, 41.7],
      [34.0, 41.8],
      [30.0, 41.6],
      [27.5, 41.3]
    ]
  },

  // Taurus Mountains — belt along the Mediterranean coast.
  {
    type: "mountains",
    ring: [
      [29.0, 36.4],
      [31.5, 36.6],
      [34.5, 36.8],
      [37.0, 37.0],
      [38.3, 37.5],
      [37.5, 38.0],
      [34.0, 37.8],
      [31.0, 37.6],
      [29.0, 37.2]
    ]
  },

  // Caucasus — northeast of Anatolia, beyond the Turkish border.
  {
    type: "mountains",
    ring: [
      [41.0, 40.8],
      [46.5, 40.8],
      [47.0, 43.0],
      [43.5, 43.5],
      [41.0, 42.0]
    ]
  },

  // Zagros foothills — southeast edge of the visible region (Iran/Iraq border).
  {
    type: "mountains",
    ring: [
      [44.0, 33.0],
      [48.0, 33.5],
      [48.0, 37.0],
      [45.0, 37.5],
      [43.5, 35.0]
    ]
  },

  // Balkan uplift — western edge of the visible region.
  {
    type: "mountains",
    ring: [
      [19.5, 41.0],
      [23.5, 41.0],
      [24.5, 42.5],
      [21.0, 43.0],
      [19.0, 42.0]
    ]
  },

  // Aegean coast/hills — vegetated western Anatolia.
  {
    type: "forest",
    ring: [
      [26.3, 38.0],
      [28.5, 37.8],
      [29.3, 38.8],
      [28.5, 39.8],
      [27.0, 40.0],
      [26.2, 39.0]
    ]
  },

  // Marmara/northwest — forested hills.
  {
    type: "forest",
    ring: [
      [26.5, 40.0],
      [29.5, 40.0],
      [30.0, 41.0],
      [28.0, 41.5],
      [26.5, 41.0]
    ]
  },

  // Levant coastal strip — Lebanon mountains and coast.
  {
    type: "forest",
    ring: [
      [35.0, 33.0],
      [36.5, 33.5],
      [36.8, 34.8],
      [35.8, 35.5],
      [35.3, 34.5],
      [34.8, 33.8]
    ]
  },

  // Harran/Urfa plain — genuinely sandy/arid corner of the southeast.
  {
    type: "sand",
    ring: [
      [38.5, 36.6],
      [39.5, 36.5],
      [39.8, 37.0],
      [39.0, 37.2],
      [38.3, 37.0]
    ]
  },

  // Syrian/northern Arabian desert — visible south of the Anatolian focus.
  {
    type: "desert",
    ring: [
      [37.0, 32.0],
      [42.0, 31.5],
      [42.5, 33.0],
      [40.0, 35.5],
      [37.5, 35.5],
      [36.5, 34.0]
    ]
  },

  // Kızılırmak delta wetlands, near Bafra on the Black Sea coast.
  {
    type: "swamp",
    ring: [
      [35.7, 41.6],
      [36.1, 41.6],
      [36.2, 41.85],
      [35.8, 41.9],
      [35.6, 41.75]
    ]
  }
];
