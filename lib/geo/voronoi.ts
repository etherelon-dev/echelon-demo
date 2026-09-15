export type Point = [number, number];

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Deterministic PRNG (mulberry32) — the same seed always produces the same
 * territory layout, so it doesn't reshuffle on reload or differ between
 * server and client render.
 */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Jittered-grid scatter, kept only where `isLand` reports true — gives a
 * natural, non-uniform point set without testing every point in the world
 * against the full coastline.
 */
export function scatterLandSeeds(
  bounds: Bounds,
  cellSize: number,
  rng: () => number,
  isLand: (x: number, y: number) => boolean
): Point[] {
  const seeds: Point[] = [];
  const cols = Math.ceil((bounds.maxX - bounds.minX) / cellSize);
  const rows = Math.ceil((bounds.maxY - bounds.minY) / cellSize);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const baseX = bounds.minX + (c + 0.5) * cellSize;
      const baseY = bounds.minY + (r + 0.5) * cellSize;
      const x = baseX + (rng() - 0.5) * cellSize * 0.8;
      const y = baseY + (rng() - 0.5) * cellSize * 0.8;
      if (isLand(x, y)) seeds.push([x, y]);
    }
  }
  return seeds;
}

function clipHalfPlane(poly: Point[], px: number, py: number, qx: number, qy: number): Point[] {
  const midX = (px + qx) / 2;
  const midY = (py + qy) / 2;
  const dirX = qx - px;
  const dirY = qy - py;
  const side = (x: number, y: number) => (x - midX) * dirX + (y - midY) * dirY;

  const out: Point[] = [];
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const cur = poly[i];
    const prev = poly[(i - 1 + n) % n];
    const curSide = side(cur[0], cur[1]);
    const prevSide = side(prev[0], prev[1]);
    const curIn = curSide <= 0;
    const prevIn = prevSide <= 0;
    if (curIn) {
      if (!prevIn) {
        const t = prevSide / (prevSide - curSide);
        out.push([prev[0] + t * (cur[0] - prev[0]), prev[1] + t * (cur[1] - prev[1])]);
      }
      out.push(cur);
    } else if (prevIn) {
      const t = prevSide / (prevSide - curSide);
      out.push([prev[0] + t * (cur[0] - prev[0]), prev[1] + t * (cur[1] - prev[1])]);
    }
  }
  return out;
}

/**
 * Naive O(n^2) half-plane-clip Voronoi diagram — perfectly fine at the
 * seed counts used here (a few hundred). Each cell starts as the padded
 * bounding rect and is clipped against every sufficiently-close
 * neighbour's perpendicular bisector; `neighborRadius` skips seeds too far
 * away to possibly bound the cell, keeping this fast in practice.
 */
export function voronoiCells(
  seeds: Point[],
  bounds: Bounds,
  boundsPad: number,
  neighborRadius: number
): Point[][] {
  const minX = bounds.minX - boundsPad;
  const maxX = bounds.maxX + boundsPad;
  const minY = bounds.minY - boundsPad;
  const maxY = bounds.maxY + boundsPad;
  const initial: Point[] = [
    [minX, minY],
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY]
  ];
  const radiusSq = neighborRadius * neighborRadius;

  const cells: Point[][] = [];
  for (let i = 0; i < seeds.length; i++) {
    let poly = initial;
    const [px, py] = seeds[i];
    for (let j = 0; j < seeds.length; j++) {
      if (i === j) continue;
      const [qx, qy] = seeds[j];
      if ((qx - px) ** 2 + (qy - py) ** 2 > radiusSq) continue;
      poly = clipHalfPlane(poly, px, py, qx, qy);
      if (poly.length === 0) break;
    }
    cells.push(poly);
  }
  return cells;
}

export function cellToPathData(cell: Point[]): string {
  if (cell.length < 3) return "";
  let d = "";
  for (let i = 0; i < cell.length; i++) {
    const [x, y] = cell[i];
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }
  return `${d}Z`;
}
