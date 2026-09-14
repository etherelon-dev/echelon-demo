# Echelon world map — geographic foundation

## What's here

- `topojson.ts` — dependency-free TopoJSON decoder (arc delta-decoding, arc-index
  → ring stitching, antimeridian unwrapping). Stands in for `topojson-client`.
- `projection.ts` — Equal Earth projection + viewport-fitting projector. Stands
  in for `d3-geo` / `d3-geo-projection`.
- `path.ts` — projected polygons → SVG path `d` string.
- `worldLand.ts` — decodes `data/world-land-110m.json` (the existing project
  asset — Natural Earth land geometry via world-atlas, public domain) into
  `Polygon[]`.
- `worldMapGeometry.ts` — the canonical viewBox, a projector fit to it, and the
  precomputed land path. Every map layer should project through
  `worldProjector` so layers stay in registration.

No external mapping packages (`d3-geo`, `topojson-client`, etc.) were
installed — this session has no network access for `npm install`, so the
handful of primitives actually needed were reimplemented directly instead.
They're small, self-contained, and swappable for the real packages later
with no change to callers.

## What's rendered right now

Layer 1 (Physical Geography) only: the 110m-resolution world land silhouette,
zoom/pan/reset navigation, dark premium styling. This is world-scale (zoom
level 1 from the spec) — recognizable continents, no labels, no political
color, no territory interaction.

## What's not implemented yet, and why

The spec calls for three zoom levels (world → regional → local/strategic)
with increasing detail: organic sub-territory boundaries, terrain (mountains,
forests, plains, deserts), rivers, lakes, and higher-resolution coastlines at
closer zoom. None of that is in the single dataset this project has
(`world-land-110m.json` — coastline only, no rivers/lakes/elevation/admin
boundaries), and this session couldn't fetch additional Natural Earth data or
install packages to generate it (no network access).

Two ways to move this forward:

1. **Real data.** Natural Earth 50m/10m coastlines, rivers, lakes, and admin-1
   boundaries (all public domain) would slot into the existing `topojson.ts`
   decoder as-is — it doesn't care about resolution, just the TopoJSON shape.
2. **Procedural.** Organic territory subdivisions (level 2/3) don't strictly
   need sourced data — seed points scattered across each landmass, fed into a
   Voronoi diagram clipped to the coastline, would produce non-hex, non-grid
   regions from the geometry we already have. Needs a Voronoi implementation
   (`d3-delaunay` isn't installed).

`TerrainLayer.tsx`, `RiverLayer.tsx`, and `TerritoryBoundaryLayer.tsx` exist
as stub components (render `null`) so either path slots into
`EchelonWorldMap.tsx`'s existing layer stack without restructuring it.
