# Echelon 3D terrain map — starter implementation

## What this is

A real WebGL terrain renderer (Three.js), built alongside the existing flat
2D `EchelonWorldMap` rather than replacing it — mounted at `/demo3d`
(`app/demo3d/page.tsx`), leaving `/demo` (the existing 2D map) untouched.

This was written in a sandboxed environment with **no network access**, so
none of it has been `npm install`'d, built, or opened in an actual browser.
It's a real, complete-looking implementation, not a plan — but "compiles
clean, works exactly as intended, first try, with zero live iteration" is
not a realistic claim for a WebGL/shader codebase this size, and no one
should treat it as one. Budget a debugging pass.

## To actually run it

```
npm install     # pulls in the new "three" + "@types/three" deps
npm run dev
# open /demo3d
```

If your usual dev setup also has no network access (this repo's own
`lib/geo/README.md` notes it was built that way), you'll need a machine
that does, at least for this one `npm install`.

## What's implemented

- **Real height-displaced terrain**, not a flat plane with a texture —
  `terrain/elevationField.ts` rasterizes the game's *existing* geography
  (`WORLD_LAND_PATH` + `PROJECTED_TERRAIN_REGIONS`, both already real-world
  accurate) into a heightmap via an offscreen canvas, then
  `terrain/TerrainMesh.ts` displaces every vertex of a `PlaneGeometry` by
  that sampled elevation and computes real normals from the result — so
  lighting/shading comes from actual 3D geometry, not a faked hillshade.
- **No new geographic dataset.** Terrain type → elevation is a hand-tuned
  lookup (`HEIGHT_BY_TYPE`); the shapes themselves are the same
  `terrainRegions.ts`/coastline data the 2D map already uses. If that data
  changes, the 3D terrain follows automatically.
- **Fractal value-noise** (`terrain/noise.ts`, dependency-free — same
  reasoning as this project's existing dependency-free `lib/geo/` modules)
  breaks up flat classified regions into natural-looking relief, weighted
  higher for mountains than plains.
- **Ocean plane** (`terrain/OceanMesh.ts`) with a real deep/shallow color
  gradient driven by a blurred land-proximity field (not a flat rectangle),
  plus an optional cheap animated-ripple shader on the high quality tier.
- **Fixed-oblique camera** (`MapCamera3D.ts`) — pan (drag) + zoom
  (wheel/pinch) only, no free rotation, per the brief's "don't make
  rotation annoying on mobile". Starts framing the same Turkey/Anatolia
  focus the 2D map opens on, computed from the real `TURKEY_FOCUS_BBOX` +
  `worldProjector`, not a guessed position.
- **Three-tier progressive quality** (`quality.ts`) — heightmap
  resolution, renderer pixel ratio, fog, and the animated-ocean shader all
  scale down on weaker devices (rough `navigator.hardwareConcurrency` /
  `deviceMemory` / coarse-pointer heuristic). Every tier still renders real
  3D terrain; only resolution/effects change.
- Atmospheric depth via `THREE.FogExp2` (medium/high tiers only) and a sky
  color matching the fog so the horizon doesn't show a hard edge.
- Proper disposal on unmount (geometries, materials, renderer, listeners,
  `ResizeObserver`) and a `ResizeObserver`-driven resize handler.

## What's explicitly NOT done (follow-ups, scoped out to keep this pass reviewable)

- **Rivers, lakes, labels** aren't in the 3D scene yet. The 2D map's
  `RiverLayer`/`LakeLayer`/label data exists and could project onto the
  terrain the same way regions do — not wired up here.
- **No LOD-by-zoom** (the brief's "Zoom Level 1/2/3" system) beyond the
  device-quality tiers — the heightmap resolution is fixed once at load,
  it doesn't get denser as you zoom in. A real implementation would
  re-rasterize (or use chunked/tiled geometry) around the camera target at
  higher zoom.
- **No minimap integration** — `WorldMinimap`/`RegionMinimap` still only
  know about the 2D camera's transform, not `MapCamera3D`'s target/distance.
- **No click/hover country selection** — the existing selection system
  (`TerritoryBoundaryLayer`, currently unused per its own docstring) isn't
  wired to this scene; that needs raycasting against the terrain mesh.
- **No `MapHud`/`MapControls` UI** — `/demo3d` only has the bare canvas
  plus a small "quality tier" debug badge; it doesn't reuse the 2D map's
  HUD chrome, which is wired to `useMapZoomPan`'s state shape, not this
  camera's.
- Camera angle, elevation scale (`MAX_TERRAIN_ELEVATION` in
  `elevationField.ts`), fog density, and noise amplitude were all tuned by
  eye against the reference image's *description*, not against a live
  render — expect to need real visual tuning passes once you can actually
  see it.
- No mobile GPU/perf testing at all (no browser here). The quality-tier
  vertex-count budget (roughly 18k/45k/92k triangles low/medium/high) is a
  reasonable starting guess, not a measured one.

## Visual tuning pass (this round)

Adjusted to push closer to the reference image's look — none of this was
visually verified (still no browser here), it's a second round of
by-eye/by-description tuning on top of the first pass:

- **Separate, richer 3D-only color palette** (`TERRAIN_3D_COLOR` in
  `elevationField.ts`) instead of reusing the 2D map's intentionally muted
  `TERRAIN_TYPES` colors — lusher greens, warmer tan/desert tones, deeper
  water. The 2D map's palette is untouched.
- **Per-texel color-noise "grain"** so flat classified regions don't read
  as one flat hue — a cheap stand-in for the reference's textured,
  photographic-looking terrain.
- **Taller, more dramatic mountains** — raised the mountain baseline and
  ridge-noise amplitude, and lowered `SNOW_LINE` — so ranges like the Alps
  and Scandinavian mountains read as clearly raised and snow-capped rather
  than gentle pale bumps.
- **Richer ocean gradient** — deeper navy in open water, a lighter
  teal/cyan shallow tone near coasts (was a narrower dark-blue range).
- **Steeper camera pitch** (52° → 58°) for a more top-down, aerial-photo
  feel closer to the reference framing.
- **Lighter, hazier sky/fog color** and a stronger, warmer directional
  light for more contrast and a daytime-aerial mood instead of a dark
  night-map look.

## Still the biggest visual gaps vs. the reference

Everything in "explicitly NOT done" above still applies. The two that
matter most for matching the photo specifically:

- **Political borders** — the reference's thin white/light border lines
  aren't drawn on the 3D terrain at all yet. Doing this properly means
  draping a line along the terrain's actual displaced height at each
  border point (not just a flat line at y=0), which needs its own pass.
- **Labels + HUD chrome** (sea/country name labels, compass, scale bar,
  minimap) — the reference's premium-strategy-game framing comes as much
  from that UI layer as from the terrain itself, and none of it is wired
  into `/demo3d` yet.

## Files changed/added

- `package.json` — added `three` + `@types/three`.
- `components/worldmap3d/` — everything new (this module).
- `app/demo3d/page.tsx` — new route; `app/demo/page.tsx` (2D map) untouched.
