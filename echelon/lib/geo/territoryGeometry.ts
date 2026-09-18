import { HIGH_DETAIL_CANONICAL_BBOX } from "./focus";
import { isPointOnLand, ringsOverlapping } from "./landHitTest";
import {
  cellToPathData,
  mulberry32,
  scatterLandSeeds,
  voronoiCells,
  type Point
} from "./voronoi";

export interface Territory {
  path: string;
  toneIndex: number;
  /** Canonical-space seed point this cell grew from — also its approximate
   * label anchor (cheaper and more stable than a true polygon centroid for
   * these mostly-convex clipped cells). */
  seed: Point;
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
 * (PoliticalLayer just maps over this array).
 */
const validRawCells = rawCells
  .map((cell, rawIndex) => ({ cell, rawIndex }))
  .filter(
    ({ cell }) => cell.length >= 3 && cell.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y))
  );

export const TERRITORIES: Territory[] = validRawCells.map(({ cell, rawIndex }, index) => ({
  path: cellToPathData(cell),
  toneIndex: index % TONE_COUNT,
  seed: seeds[rawIndex]
}));

/**
 * Adjacency between territories, indexed to match `TERRITORIES` (i.e.
 * `TERRITORY_ADJACENCY[i]` lists the indices of `TERRITORIES` bordering
 * `TERRITORIES[i]`). Derived from seed proximity rather than true polygon
 * edge-sharing — cheap and, given the seeds are a jittered grid with
 * spacing `cellSize`, a reliable stand-in: true Voronoi neighbors are
 * always well within this radius, and the rare extra pair it includes
 * (a diagonal that isn't a real shared edge) only means a kingdom can
 * annex a territory that's one cell further than a strict edge-adjacency
 * check would allow — harmless for gameplay. Used by the kingdom-formation
 * flow to offer "expand into a neighboring territory".
 */
const ADJACENCY_RADIUS = cellSize * 2.6;
export const TERRITORY_ADJACENCY: number[][] = TERRITORIES.map((territory, i) => {
  const neighbors: number[] = [];
  const [sx, sy] = territory.seed;
  for (let j = 0; j < TERRITORIES.length; j++) {
    if (j === i) continue;
    const [ox, oy] = TERRITORIES[j].seed;
    const dist = Math.hypot(sx - ox, sy - oy);
    if (dist <= ADJACENCY_RADIUS) neighbors.push(j);
  }
  return neighbors;
});
