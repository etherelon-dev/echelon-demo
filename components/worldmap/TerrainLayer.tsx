import { WORLD_COASTLINE_STROKE_PATH } from "@/lib/geo/coastlineStroke";
import { PROJECTED_PEAKS, PROJECTED_TERRAIN_REGIONS } from "@/lib/geo/terrainGeometry";
import { TERRAIN_TYPES, type TerrainTypeId } from "@/lib/geo/terrainTypes";
import { MAP_VIEWBOX_HEIGHT, MAP_VIEWBOX_WIDTH, WORLD_LAND_PATH } from "@/lib/geo/worldMapGeometry";

interface TerrainLayerProps {
  /** Whether to paint the classified terrain regions on top of the base
   * land color. When false, the map shows a plain land silhouette. */
  showClassification: boolean;
  /** Current pan/zoom scale (useMapZoomPan's transform.scale) — texture
   * overlays and snow accents fade in as the player zooms past the world
   * band, instead of cluttering the whole-world view. */
  zoomScale: number;
}

const TEXTURE_TILE = MAP_VIEWBOX_WIDTH / 380; // ~2.6 canonical units — fine at max zoom, invisible zoomed out

/** Regions whose overlay texture reads as "material", not just tint. */
const TREE_TYPES = new Set<TerrainTypeId>(["forest"]);
const DUNE_TYPES = new Set<TerrainTypeId>(["desert", "sand"]);
const MOUNTAIN_TYPES = new Set<TerrainTypeId>(["mountains"]);

/**
 * Layer — terrain relief.
 *
 * Base land silhouette, then each classified region filled with its own
 * flat TERRAIN_TYPES color (single source of truth — see terrainTypes.ts),
 * plus ONE map-wide hillshade overlay (see #terrain-hillshade below)
 * instead of a per-region diagonal gradient.
 *
 * That per-region gradient is what the previous version used for cheap
 * pseudo-hillshading, and it's why the terrain used to read as blotchy: an
 * SVG <linearGradient> with no `gradientUnits` defaults to
 * "objectBoundingBox", meaning its light-to-dark direction is relative to
 * *each shape's own* bounding box. With hundreds of irregularly sized,
 * irregularly rotated hand-authored region polygons, that gave every
 * region its own, mutually inconsistent "light direction" — small or
 * odd-shaped regions in particular could come out looking like a random
 * light/dark (occasionally green- or blue-tinted) blob dropped on the map,
 * unrelated to its neighbors. A single `userSpaceOnUse` gradient, sized to
 * the whole map and laid on top of flat region colors with
 * `mixBlendMode: multiply`, gives one consistent light source across the
 * entire terrain instead — the same trick real hillshaded maps use — and
 * reads as smooth, coherent relief rather than a patchwork.
 *
 * Everything region-shaped stays wrapped in the shared land clip-path, so
 * hand-authored edges can never spill past the real coastline. The coastal
 * "shallow water" glow strokes WORLD_COASTLINE_STROKE_PATH, not the raw
 * WORLD_LAND_PATH used for fills — see coastlineStroke.ts for why that
 * matters (the raw fill path can contain synthetic bbox-clip seams that
 * are invisible when filled but show up as a stray line when stroked).
 * No SVG filters are used here at all (the old feGaussianBlur on the
 * coastline was removed for rendering performance).
 */
export default function TerrainLayer({ showClassification, zoomScale }: TerrainLayerProps) {
  const textureOpacity = Math.max(0, Math.min(1, (zoomScale - 3) / 3.5));
  // Lower floor + steeper ramp than before: at the wide world-view zoom the
  // screenshot this was reported from was taken at, snow caps no longer sit
  // at a permanent 35% floor reading as loose white blobs — they're mostly
  // faded out until the player has zoomed in enough for them to read as
  // "snow on that specific peak" rather than "smudge near that peak".
  const snowOpacity = Math.max(0.12, Math.min(1, (zoomScale - 2) / 2.5));

  return (
    <>
      <defs>
        <pattern
          id="terrain-forest-texture"
          patternUnits="userSpaceOnUse"
          width={TEXTURE_TILE}
          height={TEXTURE_TILE}
        >
          <rect width={TEXTURE_TILE} height={TEXTURE_TILE} fill="none" />
          <path
            d={`M${TEXTURE_TILE * 0.5} ${TEXTURE_TILE * 0.12} L${TEXTURE_TILE * 0.82} ${TEXTURE_TILE * 0.72} L${TEXTURE_TILE * 0.18} ${TEXTURE_TILE * 0.72} Z`}
            fill="#0E1A09"
          />
        </pattern>

        <pattern
          id="terrain-dune-texture"
          patternUnits="userSpaceOnUse"
          width={TEXTURE_TILE * 2}
          height={TEXTURE_TILE}
          patternTransform="rotate(-8)"
        >
          <path
            d={`M0 ${TEXTURE_TILE * 0.7} Q${TEXTURE_TILE * 0.5} ${TEXTURE_TILE * 0.35} ${TEXTURE_TILE} ${TEXTURE_TILE * 0.7} T${TEXTURE_TILE * 2} ${TEXTURE_TILE * 0.7}`}
            fill="none"
            stroke="#8F6535"
            strokeWidth={TEXTURE_TILE * 0.12}
            strokeLinecap="round"
          />
        </pattern>

        <radialGradient id="terrain-snow-cap" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#F4F6F8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F4F6F8" stopOpacity="0" />
        </radialGradient>

        {/* One consistent light-from-upper-left -> shadow-to-lower-right
            direction across the *whole* map, in fixed canonical
            coordinates (userSpaceOnUse) rather than per-shape bounding-box
            coordinates. Multiplied onto the flat terrain colors below. */}
        <linearGradient
          id="terrain-hillshade"
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={0}
          x2={MAP_VIEWBOX_WIDTH}
          y2={MAP_VIEWBOX_HEIGHT}
        >
          <stop offset="0%" stopColor="#F3EFE4" stopOpacity={0.16} />
          <stop offset="45%" stopColor="#F3EFE4" stopOpacity={0} />
          <stop offset="62%" stopColor="#050608" stopOpacity={0} />
          <stop offset="100%" stopColor="#050608" stopOpacity={0.24} />
        </linearGradient>
      </defs>

      {/* Coastal shallow-water shelf — drawn before the land fill so only
          its outward (water-side) half remains visible once land covers
          the rest. A single plain wide stroke along the real coastline (no blur
          filter — too heavy to re-render while panning/zooming). */}
      <path
        d={WORLD_COASTLINE_STROKE_PATH}
        fill="none"
        stroke="#3E7C9A"
        strokeOpacity={0.28}
        strokeWidth={MAP_VIEWBOX_WIDTH / 110}
        strokeLinecap="round"
      />

      <g clipPath="url(#echelon-land-clip)">
        <path d={WORLD_LAND_PATH} fill={TERRAIN_TYPES.land.color} fillRule="evenodd" />

        {showClassification && (
          <>
            {PROJECTED_TERRAIN_REGIONS.map((region, index) => (
              <path key={index} d={region.path} fill={TERRAIN_TYPES[region.type].color} />
            ))}

            {/* Mountain ridge definition — a darker stroke retraces each
                mountain region's own outline at partial opacity, reading as
                ridge shadow without a second full-size shape per region. */}
            <g opacity={0.55}>
              {PROJECTED_TERRAIN_REGIONS.filter((r) => MOUNTAIN_TYPES.has(r.type)).map(
                (region, index) => (
                  <path
                    key={index}
                    d={region.path}
                    fill="none"
                    stroke="#2E2319"
                    strokeWidth={MAP_VIEWBOX_WIDTH / 700}
                    vectorEffect="non-scaling-stroke"
                  />
                )
              )}
            </g>

            {/* Forest / dune texture overlays — fade in with zoom. */}
            <g opacity={textureOpacity * 0.6}>
              {PROJECTED_TERRAIN_REGIONS.filter((r) => TREE_TYPES.has(r.type)).map(
                (region, index) => (
                  <path key={index} d={region.path} fill="url(#terrain-forest-texture)" />
                )
              )}
            </g>
            <g opacity={textureOpacity * 0.5}>
              {PROJECTED_TERRAIN_REGIONS.filter((r) => DUNE_TYPES.has(r.type)).map(
                (region, index) => (
                  <path key={index} d={region.path} fill="url(#terrain-dune-texture)" />
                )
              )}
            </g>

            {/* Single map-wide hillshade pass — see this file's docstring
                for why this replaced the old per-region gradient fills. */}
            <rect
              x={0}
              y={0}
              width={MAP_VIEWBOX_WIDTH}
              height={MAP_VIEWBOX_HEIGHT}
              fill="url(#terrain-hillshade)"
              style={{ mixBlendMode: "multiply" }}
              pointerEvents="none"
            />
          </>
        )}
      </g>

      {/* Snow-capped summits — outside the region clip's per-path list on
          purpose (cheap: circles, not full polygon clips), but still
          wrapped in the land clip so a peak near the coast can never
          bleed into open water. */}
      {showClassification && (
        <g clipPath="url(#echelon-land-clip)" opacity={snowOpacity}>
          {PROJECTED_PEAKS.map((peak) => {
            const r = (peak.tier === "major" ? 6 : 3.5) * (MAP_VIEWBOX_WIDTH / 980);
            return (
              <circle key={peak.name} cx={peak.x} cy={peak.y} r={r} fill="url(#terrain-snow-cap)" />
            );
          })}
        </g>
      )}
    </>
  );
}
