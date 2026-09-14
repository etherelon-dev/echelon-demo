import worldLandTopology from "./data/world-land-110m.json";
import { decodePolygons, type Polygon, type Topology } from "./topojson";

/**
 * Real-world land geometry (Natural Earth, 110m resolution, via the
 * world-atlas dataset — public domain). This is the existing asset from
 * the prior session: kept as-is, decoded here rather than re-generated.
 *
 * 110m is coarse — it's built for continent/world-scale rendering. It is
 * the right resolution for zoom level 1 (world view). Regional (level 2)
 * and local/strategic (level 3) detail — finer coastlines, rivers, lakes,
 * terrain, and organic sub-territory boundaries — need additional
 * higher-resolution geographic data (e.g. Natural Earth 50m/10m, or
 * admin-1 boundaries) that isn't part of this asset. See
 * lib/geo/README.md for what's implemented vs. still needed.
 */
export const WORLD_LAND_POLYGONS: Polygon[] = decodePolygons(
  worldLandTopology as unknown as Topology,
  "land"
);
