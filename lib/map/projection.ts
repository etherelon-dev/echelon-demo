/**
 * Flat map projection: longitude/latitude -> planar X/Y.
 *
 * Lambert Conformal Conic — the standard choice for mid-latitude regions such
 * as Europe. Nothing here is spherical or 3D: it is a
 * pure function from (lon, lat) to a point on a flat sheet.
 *
 * Output units are kilometres from the projection origin, with +y pointing
 * south so the numbers can be used directly as SVG coordinates.
 */

export type ProjectionParams = {
  type: "lambertConformalConic";
  /** Central meridian, degrees east. */
  centerLon: number;
  /** Latitude of the projection origin, degrees north. */
  originLat: number;
  /** The two standard parallels, degrees north. */
  parallels: [number, number];
};

export type Projector = (lon: number, lat: number) => [number, number];

const EARTH_RADIUS_KM = 6371.0088;
const RAD = Math.PI / 180;

export function createProjector(params: ProjectionParams): Projector {
  const phi1 = params.parallels[0] * RAD;
  const phi2 = params.parallels[1] * RAD;
  const phi0 = params.originLat * RAD;

  const n =
    Math.log(Math.cos(phi1) / Math.cos(phi2)) /
    Math.log(Math.tan(Math.PI / 4 + phi2 / 2) / Math.tan(Math.PI / 4 + phi1 / 2));
  const F = (Math.cos(phi1) * Math.pow(Math.tan(Math.PI / 4 + phi1 / 2), n)) / n;
  const rho = (phi: number) => F / Math.pow(Math.tan(Math.PI / 4 + phi / 2), n);
  const rho0 = rho(phi0);

  return (lon, lat) => {
    const phi = Math.max(-85, Math.min(85, lat)) * RAD;
    const r = rho(phi);
    const theta = n * (lon - params.centerLon) * RAD;
    return [
      EARTH_RADIUS_KM * r * Math.sin(theta),
      // flip so north is up on screen (SVG y grows downward)
      -EARTH_RADIUS_KM * (rho0 - r * Math.cos(theta))
    ];
  };
}
