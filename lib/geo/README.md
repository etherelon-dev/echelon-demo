# Echelon world map — geographic foundation

## What's here

- `topojson.ts` — dependency-free TopoJSON decoder (arc delta-decoding, arc-index
  → ring stitching, antimeridian unwrapping). Stands in for `topojson-client`.
- `bbox.ts` — shared `LonLatBBox`/`CanonicalBBox` shape types, with no logic
  of their own, so `activeMapExtent.ts` and `focus.ts` can both use them
  without a circular import between the two.
- `activeMapExtent.ts` — computes `ACTIVE_MAP_BBOX`: the lon/lat box the
  active game map actually renders (the existing terrain/river/lake data's
  own bounding box, plus a small self-scaling padding margin). Everything
  outside it is cropped away — see `worldLand.ts` and `worldMapGeometry.ts`.
- `clip.ts` — Sutherland-Hodgman rectangle clipping for lon/lat polygon rings
  (`clipPolygonsToBBox`), used to crop the world land dataset down to
  `ACTIVE_MAP_BBOX`. Correct even for a landmass that straddles the box (the
  real-world Natural Earth data's Afro-Eurasian supercontinent, trimmed down
  to just its Europe/Anatolia portion) — see the module doc comment for why.
- `projection.ts` — the flat/equirectangular projection the active map uses
  (`equirectangularRaw`; x = longitude, y = latitude, no spherical curvature)
  plus two viewport-fitting projector builders: `createProjector` (fits to
  scanned polygon geometry — a general utility, not currently used to build
  the active map's projector) and `createProjectorForBBox` (fits to a
  *declared* lon/lat box — this is what `worldMapGeometry.ts` uses, fitting
  to `ACTIVE_MAP_BBOX`). Every `Projector` also carries `invert` (canonical
  coordinates back to lon/lat), used by `scale.ts`'s distance-scale math. The
  old Equal Earth globe projection (`equalEarthRaw`) is kept for reference
  but is no longer used. Stands in for `d3-geo` / `d3-geo-projection`.
- `path.ts` — projected geometry → SVG path `d` strings: `polygonsToPathData`
  for topojson-decoded land, `ringToPathData`/`lineToPathData` for the
  simplified terrain/lake/river/peak/label data below.
- `worldLand.ts` — decodes `data/world-land-110m.json` (the existing project
  asset — Natural Earth land geometry via world-atlas, public domain) into
  `Polygon[]`, then crops it to `ACTIVE_MAP_BBOX` via `clip.ts`. The exported
  `WORLD_LAND_POLYGONS` is the *cropped* set — real coastline geometry, just
  trimmed to the geography the game actually uses.
- `worldMapGeometry.ts` — the canonical viewBox (sized to `ACTIVE_MAP_BBOX`'s
  own lon/lat aspect ratio, so the flat projection fills it with no wasted
  space), the flat projector fit to that box, and the precomputed cropped
  land path. Every map layer projects through `worldProjector` so layers
  stay in registration.
- `terrainTypes.ts` — centralized terrain classification: id, display name,
  flat color, and layer kind (region/water/line) for land, plains, mountains,
  forest, swamp, tundra, sand, desert, lake, and river. The only place any
  *base* terrain color is defined — `TerrainLayer.tsx`'s relief gradients
  derive their light/dark tint pairs from these, rather than duplicating
  the palette.
- `terrainRegions.ts` — hand-authored macro-region polygons classifying land
  into the types above: Anatolia's mountain rims/plateau/arid southeast, plus
  continental Europe's major mountain systems (Alps, Pyrenees, Carpathians,
  Apennines, Dinaric Alps, Balkans, Scandes, Urals, and more), lowland plains
  (North/East European Plain, Pannonian Basin, Po Valley, and more), forest
  belts (Scandinavian/Karelian taiga, Baltic and Central European forests),
  tundra (northern Scandinavia, Kola Peninsula), wetlands (Pripyat Marshes,
  Danube Delta, Camargue), and Europe's few genuinely sandy/arid spots
  (Tabernas Desert, coastal dune systems), plus North Africa/Arabia. Approximate,
  not sourced biome/GIS data (see below).
- `riverPaths.ts` / `lakePolygons.ts` — hand-authored major rivers (as
  simplified polylines) and lakes (as approximate closed polygons), at their
  real-world locations.
- `peaks.ts` — hand-authored major summits (one or two per major range),
  real coordinates, used for TerrainLayer's snow-cap relief accents and
  high-zoom summit labels. Not sourced elevation data — see below.
- `waterLabels.ts` — hand-placed sea/ocean names (Atlantic, Mediterranean,
  Black Sea, Norwegian/Barents/North/Baltic/Aegean/Adriatic/Ionian/
  Tyrrhenian/Caspian/Red/Arabian Seas), tiered so the handful of largest
  bodies label even at the world zoom band.
- `terrainGeometry.ts` — projects all of the above into precomputed SVG path
  data / point coordinates, same pattern as `WORLD_LAND_PATH`. Also exports
  `classifyTerrainAt(x, y)`, a point-in-terrain-region test used by
  `lib/game/territories.ts` to bias a territory's generated resources toward
  what its land actually looks like.
- `scale.ts` — the map's distance scale-bar math: picks a round km value
  from the current zoom/pan and the projector's `invert`, the way a real
  map's scale bar does (never a hardcoded "0 500 1000 1500 km").
- `focus.ts` — lon/lat bounding boxes → fitted pan/zoom transforms (used for
  the initial Turkey/Anatolia camera and for search-to-select "jump to this
  territory" navigation).
- `landHitTest.ts`, `voronoi.ts`, `territoryGeometry.ts` — procedural organic
  territory-subdivision generator, now attached to the map as the political
  layer (see `PoliticalLayer.tsx` and `lib/game/`). `territoryGeometry.ts`
  also derives `TERRITORY_ADJACENCY` (which territories border which, from
  seed proximity) for the kingdom-annexation gameplay flow.

No external mapping packages (`d3-geo`, `topojson-client`, etc.) were
installed — this project has no network access for `npm install`, so the
handful of primitives actually needed were reimplemented directly instead.
They're small, self-contained, and swappable for the real packages later
with no change to callers.

## What's rendered right now

- **Map foundation** — a flat 2D equirectangular map (no globe projection, no
  spherical curvature), cropped to the geographic extent the terrain system
  below actually covers (`ACTIVE_MAP_BBOX`, in `activeMapExtent.ts`) rather
  than the whole world. Real Natural Earth land geometry throughout.
  `preserveAspectRatio="xMidYMid slice"` on the outer `<svg>` means the map
  always fills its panel edge to edge on any device width/aspect. The
  initial camera still frames Turkey/Anatolia (`TURKEY_FOCUS_BBOX` in
  `focus.ts`) — unchanged — but panning/zooming out reveals the rest of
  Europe/North Africa/Arabia within the active extent.
- **Terrain relief** (`TerrainLayer.tsx`) — each classified macro-region is
  filled with a diagonal light-to-dark gradient instead of a flat swatch (a
  cheap, universally-supported stand-in for directional hillshade — see
  "Prior approach" below for why this isn't `feTurbulence`/
  `feDiffuseLighting`), mountains get a darker ridge-line stroke pass and
  soft snow-cap accents at hand-placed summits (`peaks.ts`), forests and
  deserts/dunes get a tiled texture overlay, and the coastline gets a
  blurred "shallow water" shelf glow. Texture and snow accents fade in with
  zoom so the world view stays clean. Classification itself is still
  physical, never political — see `terrainTypes.ts`/`terrainRegions.ts`.
- **Political layer** (`PoliticalLayer.tsx` + `lib/game/`) — the procedural
  Voronoi territory subdivision, each cell filled by its kingdom's color at
  15-40% opacity (terrain stays visible underneath) or a muted neutral tone
  if unclaimed. Selecting, developing, forming a kingdom, annexing a
  neighbor, and proposing trade are all real, working interactions backed
  by `lib/game/useGameState.ts` — see that file and `lib/game/types.ts` for
  the full data model. Fictional Echelon names throughout
  (`lib/game/names.ts`, a seeded generator) — the real-world geography is
  foundation only, never claimed as a real-world political entity.
- **Labels** (`LabelLayer.tsx`) — sea/ocean names, mountain summit names, and
  settlement names (the top territories by generated population — not a
  separate hand-placed dataset), all in a serif italic type
  (`--font-map-label`, distinct from the UI's own display/body sans) and all
  zoom-gated per the semantic-zoom bands.
- **Lakes / rivers** — flat-color closed water shapes / stroked lines,
  unchanged from the prior pass.

Layer order (back to front): water background → base land + terrain relief →
lakes → rivers → political overlay → coastline → labels. Map-mode (the left
toolbar / "Layers" tab — `LeftToolbar.tsx`) re-weights several of these
(political opacity, settlement reveal, economy-vs-ownership coloring)
rather than turning whole layers on and off.

## Why hand-authored instead of sourced data

`world-land-110m.json` is coastline only — no elevation, biome, hydrography,
or admin boundary data, and this project has no network access to fetch
Natural Earth's rivers/lakes/physical layers (or to `npm install` a real
projection/topojson library). The terrain/river/lake/peak data here is
hand-authored from known real-world geography (real mountain systems, real
rivers' actual courses, real lakes' and summits' actual locations) as
simplified, low-vertex shapes/points: geographically plausible and
correctly located at a macro scale, not precise sourced GIS/elevation data.
Everything terrain-related renders clipped to the real coastline
(`echelon-land-clip`), so an imprecise hand-drawn edge can never spill past
the shoreline. If real Natural Earth 50m/10m data (or real elevation data)
becomes available later, swapping it in replaces the arrays in
`terrainRegions.ts`/`riverPaths.ts`/`lakePolygons.ts`/`peaks.ts` — nothing
downstream needs to change, since consumers only read those arrays' shape.

## Prior approach (replaced)

An earlier pass rendered terrain as a procedural shaded-relief texture (SVG
`feTurbulence` → `feDiffuseLighting`, clipped to the coastline). That stood
in for terrain classification that didn't exist yet, but complex filter
chains like that are a known source of inconsistent/black rendering across
browsers. It was replaced by flat-color classification, and now by the
gradient/texture-based relief described above — still no `feTurbulence` or
`feDiffuseLighting` anywhere; the only filter in the current terrain/
political layers is a single plain `feGaussianBlur` per use (the coastal
shelf glow, the snow-cap softness, the selection glow), which renders
consistently everywhere unlike the old filter chain.

## Moving this forward

- **Real data.** Natural Earth 50m/10m rivers, lakes, admin-1 boundaries,
  and real elevation data (all public domain) would slot into the existing
  `topojson.ts` decoder as-is, replacing the hand-authored data with sourced
  geometry — real elevation in particular would let `TerrainLayer.tsx`
  drive its relief from actual heightmap data instead of the current
  gradient/texture approximation.
- **Real admin boundaries.** `territoryGeometry.ts`'s Voronoi cells are a
  stand-in for sourced administrative/political boundaries — swapping them
  in later means the political layer (`PoliticalLayer.tsx`) and the game
  state built on top of it (`lib/game/`) need no changes, since both only
  consume `TERRITORIES`'/`TERRITORY_ADJACENCY`'s shape.
- **A real backend.** `lib/game/useGameState.ts` is a client-only
  `useReducer` — real multiplayer/persistence would replace it with a
  server-backed store, without the rendering layers needing to change (they
  already only consume `territories`/`kingdoms`/`history` as plain data).
