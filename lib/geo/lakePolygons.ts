import type { LonLat } from "./path";

export interface LakeDefinition {
  name: string;
  /** Single outer ring, lon/lat degrees. Approximate closed shape at the
   * lake's real location, not precise hydrology. */
  ring: LonLat[];
}

/**
 * Major lakes of Anatolia, plus major lakes of continental Europe,
 * hand-authored at their real-world locations — there is no hydrography
 * dataset in this project and no network access to fetch one (see
 * README.md). Shapes are approximate closed polygons sized roughly to the
 * real lake, not sourced boundary data.
 */
export const LAKES: LakeDefinition[] = [
  {
    // Lake Van — Turkey's largest lake, far east.
    name: "van",
    ring: [
      [42.4, 38.3],
      [43.0, 38.2],
      [43.4, 38.5],
      [43.3, 38.9],
      [42.8, 39.0],
      [42.4, 38.7]
    ]
  },
  {
    // Tuz Gölü (Salt Lake) — central Anatolian plateau.
    name: "tuz",
    ring: [
      [33.1, 38.6],
      [33.5, 38.55],
      [33.6, 38.85],
      [33.4, 39.0],
      [33.1, 38.9]
    ]
  },
  {
    // Lake Beyşehir — southwestern Anatolia.
    name: "beysehir",
    ring: [
      [31.35, 37.6],
      [31.6, 37.6],
      [31.65, 37.85],
      [31.4, 37.9],
      [31.3, 37.75]
    ]
  },
  {
    // Lake Eğirdir — southwestern Anatolia.
    name: "egirdir",
    ring: [
      [30.78, 37.85],
      [30.92, 37.85],
      [30.95, 38.1],
      [30.8, 38.15],
      [30.75, 37.98]
    ]
  },
  {
    // Lake İznik — Marmara region.
    name: "iznik",
    ring: [
      [29.5, 40.38],
      [29.75, 40.38],
      [29.78, 40.48],
      [29.55, 40.5]
    ]
  },

  // --- Continental Europe ---

  {
    // Lake Ladoga — northwestern Russia, Europe's largest lake.
    name: "ladoga",
    ring: [
      [29.8, 60.9],
      [31.0, 61.6],
      [32.0, 61.3],
      [32.5, 60.5],
      [31.5, 60.0],
      [30.0, 60.2]
    ]
  },
  {
    // Lake Onega — northwestern Russia.
    name: "onega",
    ring: [
      [34.8, 62.0],
      [35.8, 62.8],
      [36.5, 62.2],
      [36.0, 61.0],
      [35.0, 61.0]
    ]
  },
  {
    // Lake Vänern — Sweden.
    name: "vanern",
    ring: [
      [12.5, 59.6],
      [13.5, 59.9],
      [13.9, 59.0],
      [13.2, 58.6],
      [12.4, 58.9]
    ]
  },
  {
    // Lake Vättern — Sweden.
    name: "vattern",
    ring: [
      [14.4, 58.7],
      [14.9, 58.5],
      [14.7, 58.0],
      [14.3, 58.2]
    ]
  },
  {
    // Lake Saimaa — Finland.
    name: "saimaa",
    ring: [
      [27.6, 61.4],
      [28.5, 61.9],
      [29.2, 61.5],
      [28.5, 61.0],
      [27.8, 61.1]
    ]
  },
  {
    // Lake Peipus — Estonia/Russia border.
    name: "peipus",
    ring: [
      [27.2, 58.9],
      [27.9, 59.0],
      [28.1, 58.4],
      [27.6, 58.1],
      [27.1, 58.5]
    ]
  },
  {
    // Lake Geneva — Switzerland/France.
    name: "geneva",
    ring: [
      [6.15, 46.4],
      [6.5, 46.5],
      [6.9, 46.4],
      [6.6, 46.25],
      [6.2, 46.3]
    ]
  },
  {
    // Lake Constance — Germany/Switzerland/Austria.
    name: "constance",
    ring: [
      [9.15, 47.65],
      [9.4, 47.7],
      [9.65, 47.55],
      [9.4, 47.5],
      [9.15, 47.55]
    ]
  },
  {
    // Lake Balaton — Hungary, Central Europe's largest lake.
    name: "balaton",
    ring: [
      [17.25, 46.95],
      [17.7, 47.05],
      [18.15, 46.9],
      [17.9, 46.75],
      [17.4, 46.8]
    ]
  },
  {
    // Lake Garda — northern Italy.
    name: "garda",
    ring: [
      [10.5, 45.75],
      [10.7, 45.9],
      [10.9, 45.6],
      [10.7, 45.45],
      [10.55, 45.55]
    ]
  }
];
