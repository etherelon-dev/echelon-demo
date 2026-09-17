import type { Polygon } from "./topojson";
import type { Projector } from "./projection";

/** A single [lon, lat] point in degrees — the common input shape for the
 * simplified terrain/river/lake data (as opposed to `Polygon`, which is the
 * ring-of-rings shape topojson decoding produces). */
export type LonLat = [lon: number, lat: number];

/**
 * Builds a single SVG path `d` string from a set of polygons. Holes and
 * outer rings are just emitted as separate subpaths — pair this with
 * fill-rule="evenodd" on the <path> so holes render correctly regardless
 * of winding order.
 */
export function polygonsToPathData(
  polygons: Polygon[],
  project: Projector["project"]
): string {
  const parts: string[] = [];

  for (const rings of polygons) {
    for (const ring of rings) {
      if (ring.length === 0) continue;
      let d = "";
      for (let i = 0; i < ring.length; i++) {
        const [lon, lat] = ring[i];
        const [x, y] = project(lon, lat);
        d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      }
      d += "Z";
      parts.push(d);
    }
  }

  return parts.join(" ");
}

/** Projects a single closed ring (e.g. a terrain region or lake) into a
 * filled SVG path `d` string. */
export function ringToPathData(ring: LonLat[], project: Projector["project"]): string {
  if (ring.length === 0) return "";
  let d = "";
  for (let i = 0; i < ring.length; i++) {
    const [lon, lat] = ring[i];
    const [x, y] = project(lon, lat);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }
  return `${d}Z`;
}

/** Projects an open polyline (e.g. a river course) into a stroked SVG path
 * `d` string — no closing `Z`, since a river isn't a filled shape. */
export function lineToPathData(points: LonLat[], project: Projector["project"]): string {
  if (points.length === 0) return "";
  let d = "";
  for (let i = 0; i < points.length; i++) {
    const [lon, lat] = points[i];
    const [x, y] = project(lon, lat);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }
  return d;
}
