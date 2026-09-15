import type { LonLat } from "./path";

export interface LakeDefinition {
  name: string;
  /** Single outer ring, lon/lat degrees. Approximate closed shape at the
   * lake's real location, not precise hydrology. */
  ring: LonLat[];
}

/**
 * Major lakes of Anatolia, hand-authored at their real-world locations —
 * there is no hydrography dataset in this project and no network access to
 * fetch one (see README.md). Shapes are approximate closed polygons sized
 * roughly to the real lake, not sourced boundary data.
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
  }
];
