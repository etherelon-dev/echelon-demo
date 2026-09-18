import { worldProjector } from "./worldMapGeometry";

const KM_PER_DEGREE_LATITUDE = 111.32;

/**
 * How many kilometers one canonical viewBox unit covers, measured along a
 * line of latitude through `canonicalY` (i.e. east-west distance — the
 * direction a horizontal scale bar actually measures). Longitude degrees
 * shrink toward the poles (km per degree ≈ 111.32 * cos(lat)); latitude
 * degrees don't, but a scale bar drawn horizontally on an equirectangular
 * map is measuring longitude distance, so that's the correct term to use.
 */
function kmPerCanonicalUnitAt(canonicalY: number): number {
  const [, latDeg] = worldProjector.invert(0, canonicalY);
  const kmPerDegreeLon = KM_PER_DEGREE_LATITUDE * Math.cos((latDeg * Math.PI) / 180);
  // worldProjector.scale is canonical units per degree (equirectangular, so
  // this is the same in both x and y) — see projection.ts.
  return kmPerDegreeLon / worldProjector.scale;
}

const NICE_KM_STEPS = [
  1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 1500, 2000, 2500, 5000, 10000
];

export interface ScaleBarReading {
  /** Round distance the bar should represent, in km. */
  km: number;
  /** Width the bar should be drawn at, in screen pixels. */
  widthPx: number;
}

/**
 * Picks a "nice" round km value whose on-screen width lands close to
 * `targetPx`, the way a real map's scale bar does (never an arbitrary
 * number like "743 km"). `pxPerCanonicalUnit` is the current render's
 * screen-px-per-viewBox-unit at the given zoom/pan (i.e.
 * containerWidthPx / visibleCanonicalWidth), and `canonicalY` is the
 * viewBox y of the point the bar should be accurate at (its latitude —
 * typically the vertical center of the current viewport, since accuracy
 * away from that latitude on an equirectangular map drifts).
 */
export function pickScaleBarReading(
  pxPerCanonicalUnit: number,
  canonicalY: number,
  targetPx = 90
): ScaleBarReading {
  const kmPerUnit = kmPerCanonicalUnitAt(canonicalY);
  const pxPerKm = pxPerCanonicalUnit / kmPerUnit;

  let best = NICE_KM_STEPS[0];
  let bestDiff = Infinity;
  for (const step of NICE_KM_STEPS) {
    const widthPx = step * pxPerKm;
    if (widthPx > targetPx * 2.2) break; // steps are ascending — no point continuing
    const diff = Math.abs(widthPx - targetPx);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = step;
    }
  }

  return { km: best, widthPx: best * pxPerKm };
}
