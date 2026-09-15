import type { LonLat } from "./path";

export interface RiverDefinition {
  name: string;
  /** Ordered points along the river's real-world course, lon/lat degrees.
   * Simplified polylines (a handful of points), not precise hydrology. */
  points: LonLat[];
}

/**
 * Major rivers of Anatolia and its immediate surroundings, plus the major
 * rivers of continental Europe, hand-authored from their known real-world
 * courses — there is no hydrography dataset in this project and no network
 * access to fetch one (see README.md). Paths are simplified but follow the
 * real route (source region to real mouth), not invented geography.
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
  },

  // --- Continental Europe ---

  {
    // Danube — Germany's Black Forest, through Vienna and Budapest, out
    // to the Black Sea via Romania's delta.
    name: "danube",
    points: [
      [8.6, 47.9],
      [12.1, 48.1],
      [14.3, 48.3],
      [16.4, 48.2],
      [19.0, 47.5],
      [20.5, 44.8],
      [22.7, 44.2],
      [24.9, 43.8],
      [27.5, 45.2],
      [29.6, 45.2]
    ]
  },
  {
    // Rhine — Swiss Alps through Lake Constance, Basel, and Germany's
    // Rhineland, out to the North Sea via the Netherlands.
    name: "rhine",
    points: [
      [9.4, 46.9],
      [9.3, 47.5],
      [7.6, 47.55],
      [8.0, 49.0],
      [7.0, 50.4],
      [6.1, 51.2],
      [5.0, 51.8],
      [4.1, 52.0]
    ]
  },
  {
    // Volga — Europe's longest river; central Russia south past Kazan
    // and Volgograd to the Caspian Sea.
    name: "volga",
    points: [
      [32.5, 57.3],
      [38.8, 58.0],
      [44.0, 56.3],
      [49.1, 55.8],
      [50.2, 53.2],
      [47.0, 50.0],
      [44.5, 48.7],
      [47.5, 46.5],
      [48.0, 46.0]
    ]
  },
  {
    // Dnieper — Russia through Belarus and Ukraine (Kyiv), out to the
    // Black Sea near Kherson.
    name: "dnieper",
    points: [
      [32.5, 55.0],
      [30.5, 53.9],
      [30.2, 52.0],
      [30.5, 50.45],
      [32.0, 49.0],
      [34.0, 48.5],
      [33.5, 47.5],
      [32.6, 46.6]
    ]
  },
  {
    // Dniester — Ukrainian Carpathians through Moldova, out to the Black
    // Sea near Odesa.
    name: "dniester",
    points: [
      [23.4, 49.1],
      [25.0, 48.5],
      [27.0, 48.0],
      [28.9, 47.0],
      [29.8, 46.5],
      [30.3, 46.3]
    ]
  },
  {
    // Don — central Russia south past Voronezh to the Sea of Azov near
    // Rostov.
    name: "don",
    points: [
      [38.2, 54.0],
      [39.0, 52.0],
      [39.8, 50.0],
      [40.0, 48.5],
      [39.7, 47.5],
      [39.3, 47.1]
    ]
  },
  {
    // Elbe — Czechia's Krkonoše mountains through Dresden and Hamburg,
    // out to the North Sea.
    name: "elbe",
    points: [
      [15.7, 50.8],
      [14.4, 50.6],
      [13.7, 51.05],
      [12.4, 51.9],
      [11.6, 52.1],
      [10.0, 53.55],
      [9.0, 53.7],
      [8.7, 53.9]
    ]
  },
  {
    // Oder — Czechia through the Poland/Germany border, out to the
    // Baltic near Szczecin.
    name: "oder",
    points: [
      [17.6, 49.6],
      [17.9, 50.0],
      [17.0, 51.1],
      [15.0, 52.3],
      [14.6, 53.0],
      [14.6, 53.9]
    ]
  },
  {
    // Vistula — southern Poland through Kraków and Warsaw, out to the
    // Baltic near Gdańsk.
    name: "vistula",
    points: [
      [18.9, 49.6],
      [19.9, 50.06],
      [20.5, 51.0],
      [21.0, 52.23],
      [19.5, 53.2],
      [18.6, 53.5],
      [18.8, 54.35]
    ]
  },
  {
    // Loire — Massif Central through Orléans and Nantes, out to the
    // Atlantic.
    name: "loire",
    points: [
      [4.2, 44.8],
      [3.5, 45.6],
      [2.5, 47.0],
      [1.9, 47.9],
      [0.3, 47.5],
      [-1.55, 47.2],
      [-2.2, 47.3]
    ]
  },
  {
    // Seine — near Dijon through Paris and Rouen, out to the English
    // Channel near Le Havre.
    name: "seine",
    points: [
      [4.5, 47.5],
      [3.5, 48.2],
      [2.35, 48.85],
      [1.4, 49.2],
      [1.1, 49.4],
      [0.1, 49.5]
    ]
  },
  {
    // Rhône — Swiss Alps through Lake Geneva and Lyon, out to the
    // Mediterranean via the Camargue.
    name: "rhone",
    points: [
      [8.4, 46.6],
      [6.15, 46.2],
      [4.85, 45.76],
      [4.8, 44.9],
      [4.8, 43.95],
      [4.6, 43.4]
    ]
  },
  {
    // Po — Cottian Alps through Turin, across the Po Valley, out to the
    // Adriatic via its delta.
    name: "po",
    points: [
      [7.1, 44.7],
      [7.68, 45.07],
      [9.2, 45.1],
      [10.5, 45.0],
      [11.5, 44.95],
      [12.5, 44.9]
    ]
  },
  {
    // Tagus — central Spain through Toledo and Portugal, out to the
    // Atlantic at Lisbon.
    name: "tagus",
    points: [
      [1.7, 40.4],
      [-1.0, 40.2],
      [-4.03, 39.86],
      [-6.5, 39.6],
      [-7.9, 39.5],
      [-9.2, 38.7]
    ]
  },
  {
    // Ebro — Cantabrian Mountains through Zaragoza, out to the
    // Mediterranean near Tortosa.
    name: "ebro",
    points: [
      [-4.15, 43.0],
      [-2.5, 42.6],
      [-0.88, 41.65],
      [0.2, 41.3],
      [0.85, 40.7]
    ]
  },
  {
    // Thames — near Cirencester through Oxford and London, out to its
    // North Sea estuary.
    name: "thames",
    points: [
      [-1.97, 51.7],
      [-1.26, 51.75],
      [-0.6, 51.5],
      [-0.1, 51.5],
      [0.7, 51.5]
    ]
  }
];
