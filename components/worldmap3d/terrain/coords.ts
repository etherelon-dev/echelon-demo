import { MAP_VIEWBOX_HEIGHT, MAP_VIEWBOX_WIDTH } from "@/lib/geo/worldMapGeometry";

/**
 * Converts a point in the existing 2D map's canonical viewBox space (what
 * `worldProjector.project(lon, lat)` returns) into the 3D terrain plane's
 * world X/Z — the same conversion `TerrainMesh`/`OceanMesh` rely on
 * implicitly via row-major raster indexing, exposed here for callers (the
 * initial camera focus, future label placement) that need one specific
 * point rather than the whole field.
 */
export function viewBoxToWorld(
  viewBoxX: number,
  viewBoxY: number,
  planeWidth: number,
  planeHeight: number
): { x: number; z: number } {
  return {
    x: (viewBoxX / MAP_VIEWBOX_WIDTH - 0.5) * planeWidth,
    z: (viewBoxY / MAP_VIEWBOX_HEIGHT - 0.5) * planeHeight
  };
}
