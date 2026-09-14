import type { Polygon } from "./topojson";
import type { Projector } from "./projection";

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
