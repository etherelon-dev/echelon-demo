import type { ProjectionParams, Projector } from "./projection";
import { createProjector } from "./projection";
import { CITIES, type City } from "./cities";
import raw from "./data/europe.geo.json";

/**
 * Turns the GeoJSON produced by scripts/map/convert.py into SVG path strings
 * in projected kilometres, and places the cities of c. 1800 on the same plane.
 * Runs once at module load.
 */

type Position = [number, number]; // [lon, lat]

type LandFeature = {
  type: "Feature";
  properties: { kind: "land"; name: string };
  geometry:
    | { type: "Polygon"; coordinates: Position[][] }
    | { type: "MultiPolygon"; coordinates: Position[][][] };
};

type LineFeature = {
  type: "Feature";
  properties: { kind: "coast" };
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

/** 0 = largest cities (always labelled) … 3 = smallest (labelled only when zoomed in). */
export type CityTier = 0 | 1 | 2 | 3;

export type CityShape = {
  name: string;
  /** Approximate population c. 1800, in thousands. */
  pop: number;
  tier: CityTier;
  /** Centre, in projected kilometres. */
  x: number;
  y: number;
};

export type MapPaths = {
  /** All land in the window, as one path. No political borders are drawn. */
  land: string;
  /** Coastlines. */
  coast: string;
  /** Built-up area of every city c. 1800, as one path. */
  cityAreas: string;
  /** City centres with their labels. */
  cities: CityShape[];
  /** Everything outside this rectangle is off-limits to pan/zoom. */
  extent: Box;
  /** What the first screen frames. */
  defaultView: Box;
};

// Segments longer than this (degrees) are subdivided before projecting, so a
// long straight edge in lon/lat bends the way it should on the flat map.
const MAX_SEGMENT_DEG = 0.5;

const fmt = (v: number) => String(Math.round(v * 10) / 10);
const fmtFine = (v: number) => String(Math.round(v * 100) / 100);

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

// --- cities -----------------------------------------------------------------

/** Inhabitants per square kilometre inside a c. 1800 town (walls, tight streets). */
const DENSITY_PER_KM2 = 18000;
const MIN_AREA_KM2 = 0.8;

function tierOf(pop: number): CityTier {
  if (pop >= 200) return 0;
  if (pop >= 100) return 1;
  if (pop >= 50) return 2;
  return 3;
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small seeded generator, so every city keeps the same outline on every load. */
function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Angular, elongated footprint centred on (x, y). Its area follows the city's
 * population; its corner count, stretch and direction are fixed per city name.
 */
function footprintPath(city: City, x: number, y: number): string {
  const rand = seeded(hashString(city.name));
  const area = Math.max(MIN_AREA_KM2, (city.pop * 1000) / DENSITY_PER_KM2);
  const radius = Math.sqrt(area / Math.PI);
  const corners = 8 + Math.floor(rand() * 4);
  const stretch = 1.3 + rand() * 0.5;
  const axis = rand() * Math.PI;
  const sx = Math.sqrt(stretch);
  const sy = 1 / Math.sqrt(stretch);
  const cosA = Math.cos(axis);
  const sinA = Math.sin(axis);

  let d = "";
  for (let i = 0; i < corners; i++) {
    const angle = ((i + (rand() - 0.5) * 0.5) / corners) * Math.PI * 2;
    const r = radius * (0.8 + rand() * 0.4);
    const lx = Math.cos(angle) * r * sx;
    const ly = Math.sin(angle) * r * sy;
    const px = x + lx * cosA - ly * sinA;
    const py = y + lx * sinA + ly * cosA;
    d += `${i ? "L" : "M"}${fmtFine(px)} ${fmtFine(py)}`;
  }
  return d + "Z";
}

function buildCities(project: Projector): Pick<MapPaths, "cities" | "cityAreas"> {
  const cities: CityShape[] = [];
  let cityAreas = "";

  for (const city of CITIES) {
    const [x, y] = project(city.lon, city.lat);
    cities.push({ name: city.name, pop: city.pop, tier: tierOf(city.pop), x, y });
    cityAreas += city.outline
      ? lineToPath(city.outline, project, true)
      : footprintPath(city, x, y);
  }

  // smaller cities first, so the larger ones are painted on top of them
  cities.sort((a, b) => a.pop - b.pop);
  return { cities, cityAreas };
}

// --- land and coast -----------------------------------------------------------

function build(data: MapDataset): MapPaths {
  const project = createProjector(data.echelon.projection);
  let land = "";
  let coast = "";

  for (const feature of data.features) {
    if (feature.properties.kind === "land") {
      const f = feature as LandFeature;
      const polygons =
        f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
      for (const rings of polygons) {
        for (const ring of rings) land += lineToPath(ring, project, true);
      }
    } else {
      const f = feature as LineFeature;
      for (const line of f.geometry.coordinates) coast += lineToPath(line, project, false);
    }
  }

  return {
    land,
    coast,
    ...buildCities(project),
    extent: data.echelon.extentKm,
    defaultView: data.echelon.defaultViewKm
  };
}

export const mapPaths: MapPaths = build(raw as unknown as MapDataset);
