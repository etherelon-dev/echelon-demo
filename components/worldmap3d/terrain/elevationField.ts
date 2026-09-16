import { PROJECTED_TERRAIN_REGIONS } from "@/lib/geo/terrainGeometry";
import { type TerrainTypeId } from "@/lib/geo/terrainTypes";
import { MAP_VIEWBOX_HEIGHT, MAP_VIEWBOX_WIDTH, WORLD_LAND_PATH } from "@/lib/geo/worldMapGeometry";
import type { ElevationField } from "@/components/worldmap3d/types";
import { ValueNoise2D } from "@/components/worldmap3d/terrain/noise";

/**
 * Builds the 3D terrain's heightmap + biome-color field by *rasterizing*
 * the game's existing 2D geographic data (`WORLD_LAND_PATH` and
 * `PROJECTED_TERRAIN_REGIONS`, both already real-world-accurate SVG path
 * data in the shared viewBox space) rather than re-deriving geography from
 * scratch. This is the "reuse existing assets" approach from the brief:
 * no new geographic dataset is introduced, and if `terrainRegions.ts`
 * changes, the 3D terrain automatically follows.
 *
 * There is no real elevation/DEM dataset anywhere in this project (see
 * lib/geo/README.md) and no network access to fetch one, so actual height
 * is a stylized approximation: each terrain type gets a baseline elevation
 * (mountains high, plains low, etc.), fractal value-noise breaks that up
 * into natural-looking relief, and a blur pass smooths region-to-region
 * seams and tapers land down to a flat ocean at the coastline. This is a
 * deliberate approximation, not sourced elevation data — real SRTM/ETOPO
 * data would be a drop-in upgrade to `HEIGHT_BY_TYPE`/the noise pass
 * without changing anything downstream (TerrainMesh, the ocean plane).
 */

/** Baseline normalized elevation (0 = sea level, 1 = peak) per terrain
 * type — the only place this mapping lives. Tuned by eye against the
 * reference image, not measured. Mountains pushed noticeably higher than
 * the first pass so ranges like the Alps/Scandinavian mountains read as
 * unmistakably raised, snow-capped terrain rather than a gentle bump. */
const HEIGHT_BY_TYPE: Record<TerrainTypeId, number> = {
  land: 0.15,
  plains: 0.12,
  mountains: 0.8,
  forest: 0.2,
  swamp: 0.08,
  tundra: 0.26,
  sand: 0.13,
  desert: 0.17,
  lake: 0.04,
  river: 0.04
};

/**
 * A separate, more saturated palette used ONLY for the 3D terrain's color
 * raster — the 2D `TerrainLayer` deliberately uses a restrained,
 * lower-contrast palette (see its own docstring) that reads well as flat
 * vector art, but the reference image's lit, three-dimensional terrain
 * wants richer, more photographic color. Keeping this separate from
 * `TERRAIN_TYPES` (lib/geo/terrainTypes.ts) means the 2D map's palette is
 * untouched — only the 3D scene's colors changed here. */
const TERRAIN_3D_COLOR: Record<TerrainTypeId, string> = {
  land: "#5c6b3d",
  plains: "#7fa050",
  mountains: "#8d8071",
  forest: "#2b4423",
  swamp: "#4d5631",
  tundra: "#aab29c",
  sand: "#dcc48d",
  desert: "#c99a5c",
  lake: "#1c4258",
  river: "#2a5878"
};

function grayCss(value01: number): string {
  const v = Math.max(0, Math.min(255, Math.round(value01 * 255)));
  return `rgb(${v},${v},${v})`;
}

/** Three separable box-blur passes over a row-major grid — cheap, and
 * enough to smooth hand-authored region edges into natural transitions
 * and taper land elevation down to the coastline instead of stopping
 * abruptly. Runs once at load, not per frame. */
function boxBlur(grid: Float32Array, width: number, height: number, passes: number): Float32Array {
  let src = grid;
  for (let p = 0; p < passes; p++) {
    const dst = new Float32Array(src.length);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= height) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx;
            if (xx < 0 || xx >= width) continue;
            sum += src[yy * width + xx];
            count++;
          }
        }
        dst[y * width + x] = sum / count;
      }
    }
    src = dst;
  }
  return src;
}

/**
 * Rasterizes the map's real geography into a heightmap.
 *
 * `gridScale` controls raster resolution as a fraction of the canonical
 * viewBox (see `worldMapGeometry.ts`) — lower on constrained devices (see
 * `QualitySettings`). Must only run in the browser (uses `document`), so
 * callers invoke this from a client-side effect, never at module scope.
 */
export function buildElevationField(gridScale: number, seed = 1): ElevationField {
  const width = Math.max(8, Math.round(MAP_VIEWBOX_WIDTH * gridScale));
  const height = Math.max(8, Math.round(MAP_VIEWBOX_HEIGHT * gridScale));

  const heightCanvas = document.createElement("canvas");
  heightCanvas.width = width;
  heightCanvas.height = height;
  const hctx = heightCanvas.getContext("2d");

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = width;
  colorCanvas.height = height;
  const cctx = colorCanvas.getContext("2d");

  if (!hctx || !cctx) {
    throw new Error("EchelonWorldMap3D: 2D canvas context unavailable while rasterizing terrain");
  }

  const landClip = new Path2D(WORLD_LAND_PATH);
  const sx = width / MAP_VIEWBOX_WIDTH;
  const sy = height / MAP_VIEWBOX_HEIGHT;

  for (const ctx of [hctx, cctx]) {
    ctx.save();
    ctx.scale(sx, sy);
    ctx.clip(landClip, "evenodd");
  }

  // Base land fill, then classified regions painted on top — same paint
  // order as the 2D TerrainLayer, so the two stay geographically
  // consistent even though the color palette itself differs (see
  // TERRAIN_3D_COLOR above).
  hctx.fillStyle = grayCss(HEIGHT_BY_TYPE.land);
  hctx.fillRect(0, 0, MAP_VIEWBOX_WIDTH, MAP_VIEWBOX_HEIGHT);
  cctx.fillStyle = TERRAIN_3D_COLOR.land;
  cctx.fillRect(0, 0, MAP_VIEWBOX_WIDTH, MAP_VIEWBOX_HEIGHT);

  for (const region of PROJECTED_TERRAIN_REGIONS) {
    const path = new Path2D(region.path);
    hctx.fillStyle = grayCss(HEIGHT_BY_TYPE[region.type]);
    hctx.fill(path);
    cctx.fillStyle = TERRAIN_3D_COLOR[region.type];
    cctx.fill(path);
  }

  hctx.restore();
  cctx.restore();

  const heightData = hctx.getImageData(0, 0, width, height).data;
  const colorData = cctx.getImageData(0, 0, width, height).data;

  const elevation = new Float32Array(width * height);
  const color = new Float32Array(width * height * 3);
  const isLand = new Uint8Array(width * height);
  const noise = new ValueNoise2D(seed);
  // Separate, higher-frequency noise just for color grain — makes flat
  // classified regions read as organic/textured (like the reference
  // image's satellite-ish terrain) instead of a single flat hue per
  // region, without touching the elevation itself.
  const colorNoise = new ValueNoise2D(seed + 97);

  const noiseCyclesX = 11;
  const noiseCyclesY = Math.max(4, Math.round((11 * height) / width));
  const colorNoiseCyclesX = noiseCyclesX * 3.5;
  const colorNoiseCyclesY = noiseCyclesY * 3.5;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const p = i * 4;
      const alpha = heightData[p + 3];
      const base = heightData[p] / 255;

      isLand[i] = alpha > 0 ? 1 : 0;

      if (alpha > 0) {
        const nx = (x / width) * noiseCyclesX;
        const ny = (y / height) * noiseCyclesY;
        const n = noise.fractal(nx, ny, 5, 0.5); // roughly [-1, 1]
        // Mountains get proportionally more relief than plains — plains
        // stay closer to flat, ranges get real ridgelines without
        // turning into uncontrolled noise-static.
        const amplitude = 0.06 + base * base * 0.6;
        elevation[i] = Math.max(0, Math.min(1, base + n * amplitude));
      } else {
        elevation[i] = 0;
      }

      const cr = colorData[p] / 255;
      const cg = colorData[p + 1] / 255;
      const cb = colorData[p + 2] / 255;

      let grain = 0;
      if (alpha > 0) {
        const cnx = (x / width) * colorNoiseCyclesX;
        const cny = (y / height) * colorNoiseCyclesY;
        grain = colorNoise.fractal(cnx, cny, 3, 0.55) * 0.07;
      }

      color[i * 3] = Math.max(0, Math.min(1, cr + grain));
      color[i * 3 + 1] = Math.max(0, Math.min(1, cg + grain));
      color[i * 3 + 2] = Math.max(0, Math.min(1, cb + grain));
    }
  }

  const smoothed = boxBlur(elevation, width, height, 2);
  // Re-flatten true ocean texels after blurring — the blur is what creates
  // the coastal taper on the land side, but open ocean should stay an
  // exact flat 0 so it registers cleanly against the separate ocean plane.
  for (let i = 0; i < smoothed.length; i++) {
    if (isLand[i] === 0) smoothed[i] = 0;
  }

  // Heavily blur the binary land mask to get a cheap "how close to shore"
  // signal for the ocean plane's shallow-water tint — not real bathymetry,
  // just enough to keep the ocean from reading as one flat rectangle.
  const landMask = new Float32Array(width * height);
  for (let i = 0; i < landMask.length; i++) landMask[i] = isLand[i];
  const coastalProximity = boxBlur(landMask, width, height, 8);

  return { width, height, elevation: smoothed, color, isLand, coastalProximity };
}

/** Referenced by TerrainMesh for the snow-blend threshold and by
 * MapCamera3D/EchelonWorldMap3D for scaling normalized elevation into
 * Three.js world units — kept in one place so the two stay in sync.
 * Lowered/raised respectively from the first pass so the tallest ranges
 * (Alps, Scandinavian mountains, Caucasus) read as unmistakably
 * snow-capped and raised, matching the reference image's mountains
 * rather than just gently pale hilltops. */
export const SNOW_LINE = 0.62;
export const MAX_TERRAIN_ELEVATION = 15;
