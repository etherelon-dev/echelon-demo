/**
 * Layer: Territory boundaries (the organic regional/local subdivisions
 * described in the spec — NOT hex or square tiles).
 *
 * Not implemented yet. Two viable paths once this is picked back up:
 *  1. Source real administrative boundaries (Natural Earth admin-1, or
 *     similar) and use those directly as the organic divisions.
 *  2. Generate them procedurally — scatter seed points across each
 *     landmass and build a Voronoi diagram clipped to the coastline —
 *     which needs no extra geographic data, only a Voronoi/Delaunay
 *     implementation (e.g. d3-delaunay, currently not installed).
 * Either way this is what turns zoom levels 2 and 3 from "just the
 * coastline, more zoomed in" into actual regional/local subdivisions.
 */
export default function TerritoryBoundaryLayer() {
  return null;
}
