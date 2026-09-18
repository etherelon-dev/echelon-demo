import type { LonLat } from "./path";
import type { TerrainTypeId } from "./terrainTypes";

export interface TerrainRegionDefinition {
  type: TerrainTypeId;
  /** Single outer ring, lon/lat degrees, in paint order (later entries in
   * TERRAIN_REGIONS draw on top of earlier ones). */
  ring: LonLat[];
}

/**
 * Macro-region terrain classification for Anatolia/Turkey and its
 * immediate context, extended to cover the whole of geographic Europe
 * (Iberia to the Urals, Scandinavia to the Mediterranean). Hand-authored,
 * not sourced GIS/biome data — there is no elevation or biome dataset in
 * this project and no network access to fetch one (see README.md). Shapes
 * follow real physical geography at a macro level (real mountain systems,
 * real lowland/plain regions, real forest belts, etc.) but are
 * deliberately approximate, low-vertex polygons, not precise
 * administrative or biome borders. Everything is clipped to the real
 * coastline (WORLD_LAND_PATH) by TerrainLayer, so imprecise edges never
 * spill past the shoreline.
 *
 * Classification is physical, not political: a mountain range, plain, or
 * forest belt is one region here even where it crosses several countries
 * (the Alps across France/Switzerland/Italy/Austria/Slovenia, the North
 * European Plain across a dozen countries, etc.) — there is no
 * `if (country === ...)` branching anywhere in this file.
 *
 * Land not covered by any region here simply stays the base "land" color —
 * that's the intended fallback, not a gap to fill in.
 *
 * Organized below as: Anatolia/Turkey context (original) → continental
 * Europe (broad plains, then mountain systems, then forests, tundra,
 * wetlands, and the handful of genuinely sandy/arid spots Europe has).
 * Later entries paint on top of earlier ones, so broad regions are listed
 * before the smaller, more specific overrides that sit on top of them.
 */
export const TERRAIN_REGIONS: TerrainRegionDefinition[] = [
  // --- Broad base regions first; specific overrides layer on top below ---

  // Central Anatolian Plateau — plains/plateau around Ankara/Konya/Kayseri/Sivas.
  {
    type: "plains",
    ring: [
      [29.3, 38.2],
      [30.5, 37.9],
      [32.0, 37.7],
      [33.5, 37.6],
      [35.0, 37.8],
      [36.3, 38.3],
      [37.0, 39.0],
      [36.7, 39.8],
      [35.5, 40.2],
      [33.8, 40.3],
      [32.0, 40.1],
      [30.3, 39.7],
      [29.2, 39.0]
    ]
  },

  // Southeastern Anatolia — broad dry steppe/lowlands around
  // Diyarbakır/Mardin/Urfa/Gaziantep, north of the Syrian border.
  {
    type: "plains",
    ring: [
      [37.0, 36.6],
      [38.5, 36.5],
      [40.0, 36.6],
      [41.5, 36.7],
      [42.6, 37.0],
      [42.8, 37.7],
      [41.5, 38.0],
      [40.0, 38.0],
      [38.5, 37.9],
      [37.3, 37.5],
      [36.8, 37.0]
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

  // Pontic Mountains — belt along the Black Sea coast, Sakarya to the
  // Georgian border past Trabzon.
  {
    type: "mountains",
    ring: [
      [27.3, 40.9],
      [29.0, 41.0],
      [31.0, 41.15],
      [33.0, 41.1],
      [35.0, 41.0],
      [37.0, 40.9],
      [39.0, 40.75],
      [41.0, 40.6],
      [42.3, 40.5],
      [42.5, 41.2],
      [41.5, 41.5],
      [40.0, 41.6],
      [38.0, 41.75],
      [36.0, 41.85],
      [34.0, 41.9],
      [32.0, 41.8],
      [30.0, 41.6],
      [28.0, 41.4],
      [27.0, 41.1]
    ]
  },

  // Taurus Mountains — belt along the Mediterranean coast from Antalya
  // through Adana, bending northeast to meet the Eastern Highlands.
  {
    type: "mountains",
    ring: [
      [29.0, 36.5],
      [30.2, 36.3],
      [31.5, 36.5],
      [32.8, 36.5],
      [34.2, 36.7],
      [35.3, 36.9],
      [36.3, 37.2],
      [37.3, 37.4],
      [38.3, 37.6],
      [38.0, 38.1],
      [37.0, 38.0],
      [35.8, 37.9],
      [34.5, 37.7],
      [33.0, 37.6],
      [31.5, 37.5],
      [30.0, 37.3],
      [29.0, 37.0]
    ]
  },

  // Caucasus — Greater and Lesser Caucasus, northeast of Anatolia beyond
  // the Turkish border, toward Tbilisi/Yerevan/Baku.
  {
    type: "mountains",
    ring: [
      [41.0, 40.9],
      [42.5, 41.5],
      [44.0, 42.2],
      [45.5, 42.7],
      [47.0, 42.5],
      [48.3, 41.8],
      [47.5, 41.0],
      [46.0, 40.5],
      [44.0, 40.2],
      [42.0, 40.5]
    ]
  },

  // Zagros — Iran/Iraq border range past Kirkuk/Sulaymaniyah/Kermanshah,
  // southeast edge of the visible region.
  {
    type: "mountains",
    ring: [
      [43.5, 34.8],
      [44.5, 33.3],
      [46.5, 32.5],
      [48.0, 32.8],
      [48.3, 34.5],
      [47.5, 36.3],
      [45.5, 37.3],
      [44.0, 37.0],
      [43.3, 35.8]
    ]
  },

  // Balkan uplift — Dinaric Alps' southern continuation through Albania
  // and the Šar/Korab ranges, western edge of the visible region.
  {
    type: "mountains",
    ring: [
      [19.0, 40.0],
      [19.8, 40.7],
      [20.5, 41.3],
      [21.5, 41.8],
      [22.5, 42.0],
      [23.5, 42.2],
      [23.8, 42.8],
      [22.5, 43.2],
      [21.0, 43.0],
      [19.8, 42.5],
      [19.0, 41.5],
      [18.7, 40.7]
    ]
  },

  // Aegean coast/hills — vegetated western Anatolia around
  // İzmir/Bodrum/Çanakkale.
  {
    type: "forest",
    ring: [
      [26.0, 37.9],
      [27.2, 37.0],
      [28.3, 37.5],
      [29.0, 38.0],
      [29.4, 38.7],
      [29.0, 39.5],
      [28.2, 40.0],
      [27.0, 40.2],
      [26.2, 39.6],
      [25.9, 38.7]
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

  // Levant coastal strip — Lebanon mountains and coast, Haifa to Latakia.
  {
    type: "forest",
    ring: [
      [34.9, 32.7],
      [35.3, 33.0],
      [35.6, 33.5],
      [35.95, 33.9],
      [36.2, 34.4],
      [36.5, 35.0],
      [36.2, 35.7],
      [35.6, 35.6],
      [35.2, 34.9],
      [34.9, 34.1],
      [34.7, 33.3]
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

  // Syrian desert — visible south of the Anatolian focus, past
  // Damascus/Palmyra/Deir ez-Zor. Continues into the North Africa &
  // Arabian Peninsula desert belt added further below.
  {
    type: "desert",
    ring: [
      [36.5, 32.5],
      [38.0, 31.8],
      [40.0, 31.6],
      [42.0, 31.4],
      [43.0, 32.5],
      [42.5, 34.0],
      [40.5, 35.3],
      [38.5, 35.6],
      [37.0, 34.8],
      [36.0, 33.8]
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
  },

  // ============================================================
  // Continental Europe — broad plains first, then mountain systems,
  // then forests, tundra, wetlands, and Europe's few genuinely sandy/
  // arid spots. See file docstring above.
  // ============================================================

  // --- Plains / lowlands ---

  // North European Plain — Netherlands/Belgium across northern Germany
  // and Poland into the Baltic states and Belarus.
  {
    type: "plains",
    ring: [
      [3.0, 51.5],
      [7.0, 53.0],
      [14.0, 53.5],
      [19.5, 54.0],
      [24.0, 55.0],
      [27.0, 54.5],
      [24.0, 52.0],
      [18.0, 51.0],
      [12.0, 50.5],
      [6.0, 50.0],
      [2.5, 50.3]
    ]
  },

  // East European Plain — Belarus/Ukraine into western Russia.
  {
    type: "plains",
    ring: [
      [24.0, 54.0],
      [30.0, 55.5],
      [36.0, 56.5],
      [42.0, 56.0],
      [45.0, 53.0],
      [42.0, 49.5],
      [35.0, 48.5],
      [29.0, 49.0],
      [25.0, 50.5]
    ]
  },

  // Pannonian Basin — Hungary and the Carpathians' inner lowland rim.
  {
    type: "plains",
    ring: [
      [16.7, 46.3],
      [18.5, 47.8],
      [20.5, 48.0],
      [21.8, 47.0],
      [21.0, 45.5],
      [19.0, 45.0],
      [17.0, 45.5]
    ]
  },

  // Po Valley — northern Italy, between the Alps and the Apennines.
  {
    type: "plains",
    ring: [
      [7.6, 45.0],
      [8.5, 45.6],
      [10.5, 45.7],
      [12.3, 45.5],
      [12.0, 44.8],
      [9.5, 44.7],
      [8.0, 44.6]
    ]
  },

  // Paris Basin — northern France.
  {
    type: "plains",
    ring: [
      [-0.3, 49.0],
      [1.5, 49.8],
      [3.5, 49.5],
      [4.0, 48.2],
      [2.0, 47.7],
      [-0.2, 48.2]
    ]
  },

  // Wallachian Plain — the Danube lowlands of southern Romania.
  {
    type: "plains",
    ring: [
      [22.2, 44.0],
      [24.0, 44.5],
      [26.5, 44.3],
      [28.0, 43.8],
      [26.0, 43.6],
      [23.0, 43.6]
    ]
  },

  // Meseta Central — Spain's central plateau.
  {
    type: "plains",
    ring: [
      [-6.5, 40.0],
      [-4.0, 41.3],
      [-2.0, 41.0],
      [-2.5, 39.0],
      [-5.0, 38.5],
      [-6.8, 39.2]
    ]
  },

  // Lowland England — the agricultural belt between the Highlands/Wales
  // uplands and the Channel.
  {
    type: "plains",
    ring: [
      [-3.0, 50.5],
      [0.5, 51.0],
      [1.4, 52.5],
      [-1.0, 53.5],
      [-3.0, 53.0],
      [-4.5, 51.5]
    ]
  },

  // Central Irish lowlands.
  {
    type: "plains",
    ring: [
      [-9.5, 53.0],
      [-7.0, 53.8],
      [-6.0, 53.5],
      [-6.5, 52.3],
      [-8.5, 52.0],
      [-9.8, 52.5]
    ]
  },

  // --- Mountain systems ---

  // Alps — France/Switzerland/Italy/Austria/Slovenia.
  {
    type: "mountains",
    ring: [
      [6.7, 45.9],
      [7.0, 46.5],
      [8.5, 47.2],
      [10.5, 47.4],
      [13.0, 47.3],
      [15.0, 47.0],
      [14.5, 46.2],
      [13.0, 46.3],
      [11.0, 46.0],
      [9.0, 45.8],
      [7.5, 44.5],
      [6.5, 44.8]
    ]
  },

  // Pyrenees — France/Spain border.
  {
    type: "mountains",
    ring: [
      [-1.8, 43.3],
      [0.0, 42.9],
      [1.5, 42.5],
      [2.8, 42.4],
      [3.3, 42.5],
      [2.5, 42.9],
      [0.5, 43.2],
      [-1.5, 43.4]
    ]
  },

  // Carpathians — the great arc through Slovakia, southern Poland,
  // Ukraine, and Romania around Transylvania.
  {
    type: "mountains",
    ring: [
      [17.2, 49.4],
      [20.0, 49.5],
      [22.8, 49.0],
      [25.0, 47.8],
      [26.3, 46.0],
      [25.5, 45.4],
      [23.5, 45.3],
      [22.5, 44.8],
      [23.0, 46.0],
      [21.5, 46.8],
      [20.0, 47.8],
      [18.0, 48.5]
    ]
  },

  // Apennines — the spine of peninsular Italy.
  {
    type: "mountains",
    ring: [
      [8.8, 44.5],
      [11.0, 44.2],
      [13.5, 42.5],
      [15.5, 40.5],
      [16.3, 39.0],
      [15.8, 38.3],
      [15.0, 39.5],
      [13.0, 41.5],
      [11.5, 43.0],
      [9.3, 44.0]
    ]
  },

  // Dinaric Alps — the Adriatic coastal range from Slovenia through
  // Croatia, Bosnia, and Montenegro into northern Albania.
  {
    type: "mountains",
    ring: [
      [14.0, 46.0],
      [15.5, 45.3],
      [16.5, 44.5],
      [17.8, 43.7],
      [19.0, 43.0],
      [20.0, 42.3],
      [20.3, 41.3],
      [19.0, 42.0],
      [18.0, 43.2],
      [16.8, 44.2],
      [15.3, 45.0]
    ]
  },

  // Balkan Mountains (Stara Planina) — central Bulgaria.
  {
    type: "mountains",
    ring: [
      [22.6, 43.2],
      [24.5, 43.5],
      [26.5, 43.3],
      [27.3, 43.0],
      [26.0, 42.6],
      [24.0, 42.7],
      [22.8, 42.8]
    ]
  },

  // Rhodope Mountains — southern Bulgaria/northern Greece border.
  {
    type: "mountains",
    ring: [
      [22.8, 42.2],
      [24.5, 42.0],
      [25.5, 41.6],
      [24.5, 41.2],
      [23.0, 41.3],
      [22.5, 41.7]
    ]
  },

  // Pindus range — the spine of mainland Greece.
  {
    type: "mountains",
    ring: [
      [20.7, 40.2],
      [21.6, 39.8],
      [21.9, 38.8],
      [21.3, 37.8],
      [22.3, 37.0],
      [21.0, 37.5],
      [20.3, 38.5],
      [20.4, 39.5]
    ]
  },

  // Scandinavian Mountains (Scandes) — the long spine along the
  // Norway/Sweden border, Arctic Circle and beyond.
  {
    type: "mountains",
    ring: [
      [6.5, 58.5],
      [8.0, 61.0],
      [9.5, 63.5],
      [13.0, 66.0],
      [16.5, 68.0],
      [20.0, 69.0],
      [22.0, 69.3],
      [19.0, 67.0],
      [15.5, 64.5],
      [12.0, 61.5],
      [9.0, 60.0],
      [7.0, 58.8]
    ]
  },

  // Ural Mountains — the conventional Europe/Asia divide.
  {
    type: "mountains",
    ring: [
      [58.0, 68.0],
      [60.5, 65.0],
      [59.5, 61.0],
      [57.5, 57.0],
      [56.0, 53.0],
      [54.5, 51.0],
      [52.5, 52.0],
      [54.0, 56.0],
      [55.5, 60.0],
      [56.5, 64.0],
      [56.0, 67.5]
    ]
  },

  // Massif Central — south-central France.
  {
    type: "mountains",
    ring: [
      [2.2, 45.0],
      [3.5, 45.8],
      [4.3, 45.3],
      [4.0, 44.3],
      [2.8, 44.2],
      [2.0, 44.6]
    ]
  },

  // Scottish Highlands.
  {
    type: "mountains",
    ring: [
      [-5.5, 56.8],
      [-4.3, 57.5],
      [-3.3, 58.5],
      [-4.5, 58.6],
      [-5.8, 57.8],
      [-5.9, 57.0]
    ]
  },

  // Cantabrian Mountains — northern Spain.
  {
    type: "mountains",
    ring: [
      [-7.0, 43.2],
      [-5.0, 43.3],
      [-3.0, 43.1],
      [-1.5, 43.0],
      [-1.8, 42.6],
      [-4.0, 42.7],
      [-6.5, 42.8]
    ]
  },

  // Sierra Nevada — southern Spain.
  {
    type: "mountains",
    ring: [
      [-3.6, 37.2],
      [-2.8, 37.3],
      [-2.6, 36.9],
      [-3.4, 36.9]
    ]
  },

  // Iceland's volcanic interior highlands.
  {
    type: "mountains",
    ring: [
      [-19.0, 64.5],
      [-16.5, 64.8],
      [-15.5, 64.3],
      [-17.0, 63.8],
      [-19.5, 64.0]
    ]
  },

  // --- Forests ---

  // Scandinavian boreal forest/taiga — interior Sweden and Finland.
  {
    type: "forest",
    ring: [
      [13.0, 60.5],
      [18.0, 61.0],
      [24.0, 62.0],
      [29.0, 64.0],
      [30.5, 66.5],
      [27.0, 67.5],
      [20.0, 66.5],
      [15.0, 64.0],
      [12.5, 61.5]
    ]
  },

  // Karelian/northwest Russian taiga.
  {
    type: "forest",
    ring: [
      [29.5, 61.0],
      [34.0, 61.5],
      [38.5, 62.5],
      [40.0, 64.5],
      [37.0, 66.0],
      [32.0, 65.0],
      [29.0, 63.0]
    ]
  },

  // Baltic forests — Estonia, Latvia, Lithuania.
  {
    type: "forest",
    ring: [
      [21.5, 55.0],
      [24.0, 56.5],
      [27.5, 58.5],
      [26.0, 59.3],
      [22.5, 58.5],
      [21.0, 56.0]
    ]
  },

  // Belarusian forest belt, north of the Pripyat Marshes.
  {
    type: "forest",
    ring: [
      [24.0, 53.0],
      [27.5, 54.0],
      [30.0, 53.5],
      [29.0, 52.3],
      [25.5, 52.3]
    ]
  },

  // Black Forest — southwestern Germany.
  {
    type: "forest",
    ring: [
      [7.6, 47.6],
      [8.5, 48.8],
      [9.0, 49.8],
      [8.0, 50.2],
      [7.6, 49.0]
    ]
  },

  // Bavarian/Bohemian Forest — Germany/Czechia border.
  {
    type: "forest",
    ring: [
      [12.0, 48.5],
      [13.5, 49.2],
      [13.8, 50.0],
      [12.5, 49.7],
      [11.8, 49.0]
    ]
  },

  // Ardennes/Vosges — Belgium/Luxembourg/northeastern France.
  {
    type: "forest",
    ring: [
      [4.5, 49.5],
      [6.0, 50.2],
      [5.7, 49.0],
      [4.2, 49.7]
    ]
  },

  // --- Tundra ---

  // Northern Scandinavia, above the Arctic Circle.
  {
    type: "tundra",
    ring: [
      [15.0, 68.0],
      [20.0, 69.5],
      [25.0, 70.3],
      [29.5, 69.8],
      [31.0, 69.0],
      [27.0, 68.2],
      [21.0, 67.8],
      [16.5, 67.7]
    ]
  },

  // Kola Peninsula and far northern European Russia.
  {
    type: "tundra",
    ring: [
      [28.5, 67.0],
      [33.0, 68.5],
      [37.5, 68.8],
      [40.5, 67.5],
      [38.0, 66.5],
      [32.0, 66.3],
      [29.0, 66.5]
    ]
  },

  // --- Wetlands ---

  // Pripyat Marshes (Polesia) — Belarus/Ukraine border, one of Europe's
  // largest wetland systems.
  {
    type: "swamp",
    ring: [
      [23.0, 51.3],
      [26.5, 52.2],
      [29.5, 52.0],
      [30.5, 51.3],
      [27.5, 50.8],
      [24.0, 50.8]
    ]
  },

  // Danube Delta — Romania/Ukraine, on the Black Sea.
  {
    type: "swamp",
    ring: [
      [28.6, 45.0],
      [29.2, 45.4],
      [29.7, 45.2],
      [29.4, 44.85],
      [28.9, 44.85]
    ]
  },

  // Camargue — the Rhône delta wetlands, southern France.
  {
    type: "swamp",
    ring: [
      [4.4, 43.4],
      [4.8, 43.5],
      [4.9, 43.3],
      [4.5, 43.2]
    ]
  },

  // --- Sand / arid (Europe has very little of either) ---

  // Tabernas Desert — Almería, southeastern Spain; mainland Europe's
  // only true desert.
  {
    type: "desert",
    ring: [
      [-2.6, 37.05],
      [-2.3, 37.1],
      [-2.2, 36.9],
      [-2.5, 36.85]
    ]
  },

  // Curonian Spit — dune system on the Lithuania/Kaliningrad coast.
  {
    type: "sand",
    ring: [
      [20.9, 55.0],
      [21.1, 55.3],
      [21.0, 55.5],
      [20.7, 55.2]
    ]
  },

  // Landes dunes — France's Atlantic coast, Europe's largest dune system.
  {
    type: "sand",
    ring: [
      [-1.4, 44.0],
      [-1.2, 44.6],
      [-1.1, 45.0],
      [-1.5, 44.5]
    ]
  },

  // Wadden coast dune belt — Netherlands/Denmark North Sea coast.
  {
    type: "sand",
    ring: [
      [4.5, 52.3],
      [5.0, 53.0],
      [8.5, 55.0],
      [8.0, 55.3],
      [7.0, 53.5],
      [4.3, 52.5]
    ]
  },

  // Iceland's volcanic sandur (glacial outwash) plains, south coast.
  {
    type: "sand",
    ring: [
      [-18.0, 63.6],
      [-16.0, 63.5],
      [-15.5, 63.8],
      [-17.5, 63.9]
    ]
  },

  // ============================================================
  // North Africa & the Arabian Peninsula — extends the map south from
  // the original Anatolia/Levant coverage to the natural next ring of
  // real geography around the Mediterranean and Red Sea basins: the
  // Maghreb, the Sahara, the Nile, and the Arabian desert/mountain belt.
  // Same rules as above: broad regions first, specific overrides on top;
  // hand-authored macro-shapes anchored on real cities/ranges, not
  // sourced boundary data.
  // ============================================================

  // --- North Africa ---

  // Sahara Desert — western half, Western Sahara through the Algerian
  // interior (Tindouf/Adrar).
  {
    type: "desert",
    ring: [
      [-13.5, 21.0],
      [-11.5, 25.5],
      [-9.0, 28.5],
      [-5.0, 30.5],
      [0.0, 31.0],
      [3.0, 30.0],
      [3.0, 27.0],
      [0.0, 23.0],
      [-5.0, 21.0],
      [-10.0, 20.5]
    ]
  },

  // Sahara Desert — Libyan/Egyptian half, Ghat and Kufra through Egypt's
  // Western Desert, up to the Nile Valley/Delta (painted on top below).
  {
    type: "desert",
    ring: [
      [3.0, 23.0],
      [3.0, 30.0],
      [9.0, 31.5],
      [15.0, 32.3],
      [20.0, 31.8],
      [25.0, 31.3],
      [29.5, 30.8],
      [29.8, 28.0],
      [28.0, 24.0],
      [24.0, 20.5],
      [18.0, 19.5],
      [10.0, 20.0],
      [5.0, 20.5]
    ]
  },

  // High Atlas — Morocco, Agadir through Marrakech to Midelt.
  {
    type: "mountains",
    ring: [
      [-9.7, 30.4],
      [-8.5, 30.9],
      [-7.0, 31.2],
      [-5.5, 31.8],
      [-4.3, 32.4],
      [-3.8, 32.9],
      [-4.5, 33.1],
      [-6.0, 32.6],
      [-7.8, 32.0],
      [-9.2, 31.3]
    ]
  },

  // Rif — northern Morocco coastal range, Tetouan to Al Hoceima.
  {
    type: "mountains",
    ring: [
      [-5.8, 35.1],
      [-5.0, 35.0],
      [-3.9, 35.1],
      [-3.6, 35.35],
      [-4.3, 35.7],
      [-5.3, 35.75],
      [-5.9, 35.4]
    ]
  },

  // Tell Atlas — coastal Algeria/Tunisia, Algiers through Constantine to
  // Tunis and the Kabylie hills.
  {
    type: "mountains",
    ring: [
      [-1.5, 35.0],
      [0.5, 35.6],
      [3.0, 36.5],
      [5.5, 36.4],
      [7.5, 36.7],
      [9.5, 36.9],
      [10.3, 36.9],
      [9.5, 36.3],
      [7.0, 36.0],
      [4.0, 35.9],
      [1.0, 35.2],
      [-1.0, 34.7]
    ]
  },

  // Jebel Akhdar — Cyrenaica's forested highlands, Benghazi to Al Bayda,
  // the one green patch on Libya's coast.
  {
    type: "forest",
    ring: [
      [20.0, 32.2],
      [20.8, 32.7],
      [21.8, 32.85],
      [22.5, 32.6],
      [22.2, 32.1],
      [21.2, 31.9],
      [20.3, 31.9]
    ]
  },

  // Sinai Peninsula — between the Gulf of Suez and Gulf of Aqaba.
  {
    type: "desert",
    ring: [
      [32.4, 29.9],
      [33.2, 31.1],
      [34.3, 31.1],
      [34.9, 29.5],
      [34.6, 28.0],
      [33.9, 27.85],
      [33.2, 28.7],
      [32.5, 29.5]
    ]
  },

  // Nile Valley — the fertile ribbon from Aswan to Cairo, painted over
  // the desert base above.
  {
    type: "plains",
    ring: [
      [32.7, 23.9],
      [32.4, 25.6],
      [31.6, 27.0],
      [31.0, 28.5],
      [30.9, 29.8],
      [31.3, 29.9],
      [31.5, 28.5],
      [32.0, 27.0],
      [32.8, 25.7],
      [33.1, 24.0]
    ]
  },

  // Nile Delta — Cairo out to the Mediterranean past Alexandria/Damietta.
  {
    type: "swamp",
    ring: [
      [30.9, 29.9],
      [31.5, 29.9],
      [31.2, 30.5],
      [32.0, 30.9],
      [32.35, 31.25],
      [31.8, 31.55],
      [31.0, 31.5],
      [30.2, 31.3],
      [29.85, 30.9],
      [30.5, 30.3]
    ]
  },

  // --- Arabian Peninsula & extended Middle East ---

  // An Nafud & ad-Dahna — the northern sand-sea corridor curving from
  // Nafud southeast toward the Empty Quarter.
  {
    type: "desert",
    ring: [
      [37.5, 29.0],
      [40.0, 31.0],
      [43.0, 31.0],
      [45.5, 29.5],
      [47.0, 27.0],
      [46.5, 24.5],
      [44.5, 23.5],
      [42.0, 24.0],
      [40.0, 25.5],
      [38.0, 27.0]
    ]
  },

  // Rub' al Khali — the Empty Quarter, the world's largest contiguous
  // sand desert, southern Arabia.
  {
    type: "desert",
    ring: [
      [44.0, 22.0],
      [47.0, 21.0],
      [50.0, 20.0],
      [53.0, 19.5],
      [55.5, 20.5],
      [55.0, 18.0],
      [52.0, 16.5],
      [48.5, 16.0],
      [45.5, 17.0],
      [43.5, 19.0]
    ]
  },

  // Hejaz Mountains — the Red Sea coastal range from the Jordanian
  // border down past Mecca/Medina.
  {
    type: "mountains",
    ring: [
      [35.1, 29.5],
      [36.0, 28.5],
      [37.0, 27.0],
      [37.8, 25.0],
      [38.3, 23.0],
      [39.3, 21.5],
      [40.0, 20.5],
      [39.0, 20.3],
      [37.8, 21.8],
      [36.8, 23.5],
      [36.0, 25.5],
      [35.2, 27.5],
      [34.7, 29.0]
    ]
  },

  // Asir & Yemen Highlands — the southwestern escarpment, Abha down to
  // Sanaa/Taiz.
  {
    type: "mountains",
    ring: [
      [42.0, 19.5],
      [43.0, 18.5],
      [43.8, 17.0],
      [44.3, 15.5],
      [44.5, 14.0],
      [43.8, 13.2],
      [43.0, 13.8],
      [42.5, 15.0],
      [42.0, 16.5],
      [41.7, 18.0]
    ]
  },

  // Najd Plateau — central Arabia around Riyadh/Buraydah/Hail, painted
  // over the desert belt above.
  {
    type: "plains",
    ring: [
      [43.0, 27.0],
      [45.5, 27.3],
      [47.5, 26.0],
      [48.0, 24.0],
      [47.0, 22.0],
      [45.0, 21.5],
      [43.0, 22.5],
      [42.0, 24.5],
      [42.3, 26.0]
    ]
  },

  // Al Hajar Mountains — northeastern Oman/UAE, up to the Musandam tip.
  {
    type: "mountains",
    ring: [
      [55.8, 25.4],
      [56.5, 24.8],
      [57.5, 23.8],
      [58.5, 23.2],
      [59.3, 22.5],
      [58.8, 21.8],
      [57.8, 22.5],
      [56.8, 23.5],
      [56.0, 24.5]
    ]
  },

  // Persian Gulf coastal dunes — UAE/Qatar coast.
  {
    type: "sand",
    ring: [
      [50.5, 24.5],
      [51.5, 25.5],
      [53.0, 25.0],
      [54.5, 24.8],
      [55.8, 25.3],
      [55.5, 24.2],
      [53.5, 24.0],
      [51.5, 24.2],
      [50.3, 24.0]
    ]
  },

  // Mesopotamian Plain — the Tigris-Euphrates lowlands from Baghdad down
  // to Basra and the Gulf, continuing south from the Southeastern
  // Anatolia plains above.
  {
    type: "plains",
    ring: [
      [42.5, 34.2],
      [44.0, 34.5],
      [45.5, 33.8],
      [47.0, 32.0],
      [48.0, 30.0],
      [48.5, 29.3],
      [47.0, 29.5],
      [45.5, 31.0],
      [44.0, 32.0],
      [43.0, 33.0]
    ]
  },

  // --- Eastern Mediterranean islands ---

  // Cyprus — Troodos massif and the Kyrenia range.
  {
    type: "mountains",
    ring: [
      [32.3, 34.65],
      [32.7, 34.95],
      [33.0, 35.0],
      [33.4, 35.0],
      [33.9, 35.35],
      [34.0, 35.7],
      [33.5, 35.68],
      [32.9, 35.4],
      [32.4, 35.05]
    ]
  },

  // Crete — the mountainous spine south of the Aegean.
  {
    type: "mountains",
    ring: [
      [23.5, 35.3],
      [24.0, 35.55],
      [25.0, 35.45],
      [25.7, 35.3],
      [26.3, 35.3],
      [25.5, 35.15],
      [24.5, 35.0],
      [23.7, 35.1]
    ]
  }
];
