/**
 * Minimal seeded 2D value-noise, used only to break up the flat classified
 * terrain into natural-looking relief (ridges within a "mountains" region,
 * gentle undulation within "plains", etc.) — not a real geologic model.
 *
 * Reimplemented directly rather than pulling in `simplex-noise`: this
 * project has no network access for `npm install` (see lib/geo/README.md),
 * and a fractal sum of value-noise is plenty for stylized relief at the
 * resolution the heightmap actually renders at.
 */

/** Mulberry32 — tiny deterministic PRNG so the terrain is stable across
 * reloads instead of reshuffling every time the page mounts. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A fixed-size lattice of random gradients, sampled with bilinear
 * interpolation — "value noise", not true Perlin/simplex, but cheap and
 * dependency-free, which is all a stylized relief pass needs. */
export class ValueNoise2D {
  private readonly lattice: Float32Array;
  private readonly latticeSize: number;

  constructor(seed: number, latticeSize = 64) {
    this.latticeSize = latticeSize;
    const rand = mulberry32(seed);
    this.lattice = new Float32Array(latticeSize * latticeSize);
    for (let i = 0; i < this.lattice.length; i++) {
      this.lattice[i] = rand() * 2 - 1;
    }
  }

  private sampleLattice(xi: number, yi: number): number {
    const s = this.latticeSize;
    const x = ((xi % s) + s) % s;
    const y = ((yi % s) + s) % s;
    return this.lattice[y * s + x];
  }

  /** Smoothstep-interpolated noise at (x, y), where x/y are in "lattice
   * cell" units (fractional coordinates). Returns roughly [-1, 1]. */
  sample(x: number, y: number): number {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = x - x0;
    const ty = y - y0;
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);

    const n00 = this.sampleLattice(x0, y0);
    const n10 = this.sampleLattice(x0 + 1, y0);
    const n01 = this.sampleLattice(x0, y0 + 1);
    const n11 = this.sampleLattice(x0 + 1, y0 + 1);

    const nx0 = n00 + (n10 - n00) * sx;
    const nx1 = n01 + (n11 - n01) * sx;
    return nx0 + (nx1 - nx0) * sy;
  }

  /** Fractal (multi-octave) sample for more natural-looking relief than a
   * single lattice frequency gives. */
  fractal(x: number, y: number, octaves = 4, persistence = 0.5): number {
    let total = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxAmplitude = 0;
    for (let o = 0; o < octaves; o++) {
      total += this.sample(x * frequency, y * frequency) * amplitude;
      maxAmplitude += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }
    return total / maxAmplitude;
  }
}
