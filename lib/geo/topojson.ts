/**
 * Minimal, dependency-free TopoJSON decoder.
 *
 * We deliberately don't pull in `topojson-client` — this project has no
 * network access for `npm install` mid-session, so the handful of things we
 * actually need (arc delta-decoding, arc-index → ring stitching, antimeridian
 * unwrapping) are implemented directly. Swappable for the real package later
 * with no change to callers, since the exported shape (Polygon[]) matches
 * what you'd get from `topojson-client#feature`.
 */

export type Position = [lon: number, lat: number];
export type Ring = Position[];
/** First ring is the outer boundary, any further rings are holes. */
export type Polygon = Ring[];

interface TopologyTransform {
  scale: [number, number];
  translate: [number, number];
}

interface TopologyGeometry {
  type: "Polygon" | "MultiPolygon" | string;
  arcs: number[][] | number[][][];
}

export interface Topology {
  type: "Topology";
  objects: Record<string, { type: string; geometries: TopologyGeometry[] }>;
  arcs: Array<Array<[number, number]>>;
  transform?: TopologyTransform;
}

function decodeArcs(topology: Topology): Position[][] {
  const { arcs, transform } = topology;
  if (!transform) {
    return arcs.map((arc) => arc.map(([x, y]) => [x, y] as Position));
  }
  const [sx, sy] = transform.scale;
  const [tx, ty] = transform.translate;
  return arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * sx + tx, y * sy + ty] as Position;
    });
  });
}

/**
 * A handful of landmasses in the land-110m dataset (Russia's far east,
 * Antarctica, Fiji...) cross the ±180° antimeridian. Rendered naively, a
 * ring that jumps from 179° to -179° draws a line straight across the whole
 * map. We greedily "unwrap" longitude — picking whichever branch (lon, lon
 * -360, lon+360) is closest to the previous point — so the ring stays
 * angularly continuous. Because the Equal Earth x-coordinate is linear in
 * longitude, a point that ends up a few degrees past ±180° just lands a
 * few degrees past the map's natural edge at that latitude, instead of
 * producing a cross-map streak.
 */
function unwrapLongitudes(ring: Ring): Ring {
  if (ring.length === 0) return ring;
  const out: Ring = [ring[0]];
  for (let i = 1; i < ring.length; i++) {
    const prevLon = out[i - 1][0];
    let [lon, lat] = ring[i];
    while (lon - prevLon > 180) lon -= 360;
    while (lon - prevLon < -180) lon += 360;
    out.push([lon, lat]);
  }
  return out;
}

function ringFromArcIndices(indices: number[], decodedArcs: Position[][]): Ring {
  const coords: Position[] = [];
  indices.forEach((idx, k) => {
    const arc = idx >= 0 ? decodedArcs[idx] : [...decodedArcs[~idx]].reverse();
    coords.push(...(k > 0 ? arc.slice(1) : arc));
  });
  return unwrapLongitudes(coords);
}

/** Decodes every Polygon/MultiPolygon geometry in a named object into a flat Polygon[]. */
export function decodePolygons(topology: Topology, objectName: string): Polygon[] {
  const object = topology.objects[objectName];
  if (!object) return [];
  const decodedArcs = decodeArcs(topology);
  const polygons: Polygon[] = [];

  for (const geometry of object.geometries) {
    if (geometry.type === "Polygon") {
      const rings = (geometry.arcs as number[][]).map((ring) =>
        ringFromArcIndices(ring, decodedArcs)
      );
      polygons.push(rings);
    } else if (geometry.type === "MultiPolygon") {
      for (const poly of geometry.arcs as number[][][]) {
        const rings = poly.map((ring) => ringFromArcIndices(ring, decodedArcs));
        polygons.push(rings);
      }
    }
  }

  return polygons;
}
