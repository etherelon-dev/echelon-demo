# Echelon world map — geographic foundation

## What's here

- `topojson.ts` — dependency-free TopoJSON decoder (arc delta-decoding, arc-index
  → ring stitching, antimeridian unwrapping). Stands in for `topojson-client`.
- `projection.ts` — Equal Earth projection + viewport-fitting projector. Stands
  in for `d3-geo` / `d3-geo-projection`.
- `path.ts` — projected geometry → SVG path `d` strings: `polygonsToPathData`
  for topojson-decoded land, `ringToPathData`/`lineToPathData` for the
  simplified terrain/lake/river data below.
- `worldLand.ts` — decodes `data/world-land-110m.json` (the existing project
  asset — Natural Earth land geometry via world-atlas, public domain) into
  `Polygon[]`.
- `worldMapGeometry.ts` — the canonical viewBox, a projector fit to it, and the
  precomputed land path. Every map layer projects through `worldProjector` so
  layers stay in registration.
- `terrainTypes.ts` — centralized terrain classification: id, display name,
  flat color, and layer kind (region/water/line) for land, plains, mountains,
  forest, swamp, tundra, sand, desert, lake, and river. The only place any
  terrain color is defined.
- `terrainRegions.ts` — hand-authored macro-region polygons (Anatolia's
  mountain rims, central plateau, arid southeast, etc.) classifying land into
  the types above. Approximate, not sourced biome/GIS data (see below).
- `riverPaths.ts` / `lakePolygons.ts` — hand-authored major rivers (as
  simplified polylines) and lakes (as approximate closed polygons), at their
  real-world locations.
- `terrainGeometry.ts` — projects the above into precomputed SVG path data,
  same pattern as `WORLD_LAND_PATH`.
- `focus.ts` — lon/lat bounding boxes → fitted pan/zoom transforms (used for
  the initial Turkey/Anatolia camera).
- `landHitTest.ts`, `voronoi.ts`, `territoryGeometry.ts` — procedural organic
  territory-subdivision generator. Currently unused (see
  `TerritoryBoundaryLayer.tsx`'s docstring) but left in place for a later
  gameplay layer.

No external mapping packages (`d3-geo`, `topojson-client`, etc.) were
installed — this project has no network access for `npm install`, so the
handful of primitives actually needed were reimplemented directly instead.
They're small, self-contained, and swappable for the real packages later
with no change to callers.

## What's rendered right now

- **Coastline** — the 110m-resolution world land silhouette (real Natural
  Earth data), zoom/pan/reset navigation.
- **Terrain classification** — flat colors only. The whole coastline is
  filled with the base "land" color, then hand-authored macro-regions
  (mountains, plains, forest, swamp, sand, desert) are painted on top for
  Anatolia and its immediate real-world context (Balkans, Caucasus, Levant,
  Syrian desert). No gradients, no shading, no procedural noise.
- **Lakes** — Van, Tuz, Beyşehir, Eğirdir, İznik, as flat-color closed water
  shapes distinct from the ocean background.
- **Rivers** — Kızılırmak, Sakarya, Euphrates, Tigris, Yeşilırmak, Seyhan, as
  simple flat-color stroked lines following their real courses.

Layer order (back to front): water background → base land → terrain regions
→ lakes → rivers → coastline. No political layers, no labels, no gameplay
systems.

## Why hand-authored instead of sourced data

`world-land-110m.json` is coastline only — no elevation, biome, hydrography,
or admin boundary data, and this project has no network access to fetch
Natural Earth's rivers/lakes/physical layers. The terrain/river/lake data
here is hand-authored from known real-world geography (mountain ranges,
major rivers' actual courses, major lakes' actual locations) as simplified,
low-vertex shapes — geographically plausible in distribution, not sourced
GIS data. Everything terrain-related renders clipped to the real coastline
(`echelon-land-clip`), so an imprecise hand-drawn edge can never spill past
the shoreline.

## Prior approach (replaced)

An earlier pass rendered terrain as a procedural shaded-relief texture (SVG
`feTurbulence` → `feDiffuseLighting`, clipped to the coastline). That stood
in for terrain classification that didn't exist yet, but complex filter
chains like that are a known source of inconsistent/black rendering across
browsers. It's been replaced entirely by the flat-color classification
system above — nothing downstream depends on how the fill was produced, so
the swap didn't touch any other layer.

## Moving this forward

Two ways to increase fidelity later without restructuring anything:

1. **Real data.** Natural Earth 50m/10m rivers, lakes, and admin-1
   boundaries (all public domain) would slot into the existing
   `topojson.ts` decoder as-is, replacing the hand-authored region/river/
   lake data with sourced geometry.
2. **Procedural territories.** `territoryGeometry.ts`'s Voronoi-based organic
   subdivision generator is ready to re-attach to `EchelonWorldMap.tsx`'s
   layer stack once political/gameplay territories are wanted — see
   `TerritoryBoundaryLayer.tsx`.
