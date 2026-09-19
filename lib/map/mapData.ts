import type { ProjectionParams, Projector } from "./projection";
import { createProjector } from "./projection";
import raw from "./data/france-mediterranean.geo.json";

/**
 * Turns the GeoJSON produced by scripts/map/convert.py into SVG path strings
 * in projected kilometres. Runs once at module load (a few thousand points).
 */

type Position = [number, number]; // [lon, lat]

type LandFeature = {
  type: "Feature";
  properties: { kind: "land"; name: string; role: "main" | "context" };
  geometry:
    | { type: "Polygon"; coordinates: Position[][] }
    | { type: "MultiPolygon"; coordinates: Position[][][] };
};

type LineFeature = {
  type: "Feature";
  properties: { kind: "border" | "coast" };
  geometry: { type: "MultiLineString"; coordinates: Position[][] };
};

export type Box = { x0: number; y0: number; x1: number; y1: number };

type MapDataset = {
  type: "FeatureCollection";
  echelon: {
    source: string;
    projection: ProjectionParams;
    extentKm: Box;
    defaultViewKm: Box;
  };
  features: Array<LandFeature | LineFeature>;
};

export type MapPaths = {
  /** Land of every country except France, as one path. */
  land: string;
  /** France, as one path (drawn a touch lighter so it reads as the focus). */
  main: string;
  /** Shared country borders. */
  borders: string;
  /** Coastlines. */
  coast: string;
  /** Everything outside this rectangle is off-limits to pan/zoom. */
  extent: Box;
  /** What the first screen frames. */
  defaultView: Box;
};

// Segments longer than this (degrees) are subdivided before projecting, so a
// long straight edge in lon/lat bends the way it should on the flat map.
const MAX_SEGMENT_DEG = 0.5;

const fmt = (v: number) => String(Math.round(v * 10) / 10);

function lineToPath(points: Position[], project: Projector, close: boolean): string {
  if (points.length < 2) return "";
  let d = "";
  let prev: Position | null = null;

  for (const p of points) {
    if (prev) {
      const steps = Math.ceil(
        Math.max(Math.abs(p[0] - prev[0]), Math.abs(p[1] - prev[1])) / MAX_SEGMENT_DEG
      );
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        const [x, y] = project(
          prev[0] + (p[0] - prev[0]) * t,
          prev[1] + (p[1] - prev[1]) * t
        );
        d += `L${fmt(x)} ${fmt(y)}`;
      }
    }
    const [x, y] = project(p[0], p[1]);
    d += `${prev ? "L" : "M"}${fmt(x)} ${fmt(y)}`;
    prev = p;
  }
  return close ? d + "Z" : d;
}

function build(data: MapDataset): MapPaths {
  const project = createProjector(data.echelon.projection);
  let land = "";
  let main = "";
  let borders = "";
  let coast = "";

  for (const feature of data.features) {
    if (feature.properties.kind === "land") {
      const f = feature as LandFeature;
      const polygons =
        f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
      let d = "";
      for (const rings of polygons) {
        for (const ring of rings) d += lineToPath(ring, project, true);
      }
      if (f.properties.role === "main") main += d;
      else land += d;
    } else {
      const f = feature as LineFeature;
      let d = "";
      for (const line of f.geometry.coordinates) d += lineToPath(line, project, false);
      if (f.properties.kind === "border") borders += d;
      else coast += d;
    }
  }

  return {
    land,
    main,
    borders,
    coast,
    extent: data.echelon.extentKm,
    defaultView: data.echelon.defaultViewKm
  };
}

export const mapPaths: MapPaths = build(raw as unknown as MapDataset);
