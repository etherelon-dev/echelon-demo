import type { TerrainTypeId } from "@/lib/geo/terrainTypes";

/**
 * A rasterized height/biome field the terrain mesh is built from — the 3D
 * equivalent of the 2D module's `PROJECTED_TERRAIN_REGIONS`. Produced once
 * by `buildElevationField()` and consumed by `buildTerrainMesh()`; nothing
 * downstream needs to know how it was rasterized.
 */
export interface ElevationField {
  /** Vertices per row (matches PlaneGeometry widthSegments + 1). */
  width: number;
  /** Vertices per column (matches PlaneGeometry heightSegments + 1). */
  height: number;
  /** Normalized elevation per texel, row-major, 0 (sea level) – 1 (peak). */
  elevation: Float32Array;
  /** Biome color per texel as packed [r, g, b] in 0–1, row-major, same
   * indexing as `elevation`. Length is width * height * 3. */
  color: Float32Array;
  /** Which texels fall on real land (inside the coastline) vs. ocean —
   * used to decide where the ocean plane should show through. */
  isLand: Uint8Array;
  /** 0 (open ocean) – 1 (at the coastline), row-major like `elevation` —
   * a heavily-blurred land mask, used only to tint the ocean plane
   * lighter near shore. Not a real bathymetry/depth dataset. */
  coastalProximity: Float32Array;
}

/** Render-quality tier — see MapPerformance.md / EchelonWorldMap3D's
 * device heuristic. Every tier renders the same *kind* of scene (real 3D
 * terrain, never a flatter fallback) — only resolution/effects scale
 * down, per the "map should never become unusable" requirement. */
export type QualityTier = "high" | "medium" | "low";

export interface QualitySettings {
  tier: QualityTier;
  /** Raster resolution multiplier applied to the heightmap grid. */
  gridScale: number;
  /** DevicePixelRatio cap passed to the WebGL renderer. */
  maxPixelRatio: number;
  /** Whether atmospheric fog is enabled. */
  fog: boolean;
  /** Whether the ocean uses the animated wave shader vs. a static material. */
  animatedOcean: boolean;
}

/** A single classified terrain region, in the lon/lat-free canonical
 * viewBox space the rest of lib/geo already projects into. */
export interface RasterRegion {
  type: TerrainTypeId;
  path: string;
}

export interface CameraState {
  /** Ground-plane look-at target, in Three.js world units. */
  targetX: number;
  targetZ: number;
  /** Distance from target to camera along the fixed oblique offset. */
  distance: number;
}
