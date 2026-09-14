import type { Polygon } from "./topojson";

/**
 * Equal Earth projection (Šavrič, Patterson & Jenny, 2018) — a pseudocylindrical,
 * equal-area projection that keeps continents' relative size and shape honest,
 * which is what a strategic geographic map wants (unlike Mercator, which
 * inflates high-latitude landmasses). This is the same closed-form formula
 * used by d3-geo-projection; reimplemented here directly since we have no
 * network access to install that package in this session.
 */
const A1 = 1.340264;
const A2 = -0.081106;
const A3 = 0.000893;
const A4 = 0.003796;
const M = Math.sqrt(3) / 2;

/** Raw (unscaled) Equal Earth projection. Input in degrees. */
export function equalEarthRaw(lonDeg: number, latDeg: number): [number, number] {
  const lambda = (lonDeg * Math.PI) / 180;
  const phi = (latDeg * Math.PI) / 180;
  const theta = Math.asin(M * Math.sin(phi));
  const theta2 = theta * theta;
  const theta6 = theta2 * theta2 * theta2;
  const x =
    (lambda * Math.cos(theta)) /
    (M * (A1 + 3 * A2 * theta2 + theta6 * (7 * A3 + 9 * A4 * theta2)));
  const y = theta * (A1 + A2 * theta2 + theta6 * (A3 + A4 * theta2));
  return [x, y];
}

export interface Projector {
  project: (lonDeg: number, latDeg: number) => [number, number];
  scale: number;
}

/**
 * Projects a set of polygons and fits them to a width x height viewport
 * (uniform scale, centered, optional padding) — a hand-rolled equivalent of
 * d3.geoPath().fitExtent().
 */
export function createProjector(
  polygons: Polygon[],
  width: number,
  height: number,
  padding = 0
): Projector {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const rings of polygons) {
    for (const ring of rings) {
      for (const [lon, lat] of ring) {
        const [x, y] = equalEarthRaw(lon, lat);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const dataWidth = maxX - minX;
  const dataHeight = maxY - minY;
  const availW = width - padding * 2;
  const availH = height - padding * 2;
  const scale = Math.min(availW / dataWidth, availH / dataHeight);

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const translateX = width / 2 - cx * scale;
  const translateY = height / 2 + cy * scale; // + because SVG y grows down, projected y grows north

  const project = (lonDeg: number, latDeg: number): [number, number] => {
    const [x, y] = equalEarthRaw(lonDeg, latDeg);
    return [x * scale + translateX, -y * scale + translateY];
  };

  return { project, scale };
}
