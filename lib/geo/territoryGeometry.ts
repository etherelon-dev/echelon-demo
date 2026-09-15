import { HIGH_DETAIL_CANONICAL_BBOX } from "./focus";
import { isPointOnLand, ringsOverlapping } from "./landHitTest";
import { cellToPathData, mulberry32, scatterLandSeeds, voronoiCells } from "./voronoi";

export interface Territory {
  path: string;
  toneIndex: number;
}

/** Fixed seed — the same procedural layout every load, so it never
 * reshuffles between server/client render or across reloads. */
const TERRITORY_SEED = 1337;
export const TONE_COUNT = 5;

// Roughly this many cells across the high-detail bbox's width — tuned for
// a believable province-sized division without generating more <path>
// elements than the browser needs to.
const CELL_DIVISIONS = 22;

const bbox = HIGH_DETAIL_CANONICAL_BBOX;
const relevantRings = ringsOverlapping(bbox);
const isLand = (x: number, y: number) => isPointOnLand(x, y, relevantRings);

const cellSize = (bbox.maxX - bbox.minX) / CELL_DIVISIONS;
const rng = mulberry32(TERRITORY_SEED);
const seeds = scatterLandSeeds(bbox, cellSize, rng, isLand);
const rawCells = voronoiCells(seeds, bbox, cellSize * 3, cellSize * 6);

/**
 * Organic territory subdivisions — procedurally generated (Voronoi cells
 * seeded only on land within the high-detail region), NOT sourced
 * administrative boundaries. There is no admin-1 boundary dataset in this
 * project and this build has no network access to fetch one (see
 * lib/geo/README.md). This is what turns the high-detail region into real
 * organic, non-hex, non-grid subdivisions in the meantime — swap in real
 * admin boundaries here later without touching the rendering layer
 * (TerritoryBoundaryLayer just maps over this array).
 */
export const TERRITORIES: Territory[] = rawCells
  .map((cell, index) => ({ cell, index }))
  .filter(
    ({ cell }) => cell.length >= 3 && cell.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y))
  )
  .map(({ cell, index }) => ({
    path: cellToPathData(cell),
    toneIndex: index % TONE_COUNT
  }));
