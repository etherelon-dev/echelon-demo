import { PROJECTED_PEAKS, PROJECTED_TERRAIN_REGIONS } from "@/lib/geo/terrainGeometry";
import type { TerrainTypeId } from "@/lib/geo/terrainTypes";
import { MAP_VIEWBOX_WIDTH, WORLD_LAND_PATH } from "@/lib/geo/worldMapGeometry";

interface TerrainLayerProps {
  /** Whether to paint the classified terrain regions on top of the base
   * land color. When false, the map shows a plain land silhouette. */
  showClassification: boolean;
  /** Current pan/zoom scale (useMapZoomPan's transform.scale) — texture
   * overlays and snow accents fade in as the player zooms past the world
   * band, instead of cluttering the whole-world view. */
  zoomScale: number;
}

/** Diagonal light-to-dark tint pair per region type — a cheap stand-in for
 * directional hillshading. A flat fill reads as a color swatch; a
 * consistent upper-left-to-lower-right gradient across every region reads
 * as "lit from one direction", which is most of what makes relief legible
 * at a glance. No filters involved, so none of the cross-browser risk the
 * README describes for the old feTurbulence/feDiffuseLighting attempt —
 * this is just <linearGradient>, one of the most universally-supported
 * primitives in SVG. */
const REGION_GRADIENT_TINTS: Record<Exclude<TerrainTypeId, "lake" | "river">, [string, string]> = {
  land: ["#46573E", "#2E3A29"],
  plains: ["#8A9860", "#55622F"],
  mountains: ["#8B7358", "#493A2C"],
  forest: ["#33481F", "#16220E"],
  swamp: ["#5E5E3C", "#363622"],
  tundra: ["#A3AC9C", "#737E6E"],
  sand: ["#DDC793", "#B69860"],
  desert: ["#C79A62", "#8F6535"]
};

const TEXTURE_TILE = MAP_VIEWBOX_WIDTH / 380; // ~2.6 canonical units — fine at max zoom, invisible zoomed out

/** Regions whose overlay texture reads as "material", not just tint. */
const TREE_TYPES = new Set<TerrainTypeId>(["forest"]);
const DUNE_TYPES = new Set<TerrainTypeId>(["desert", "sand"]);
const MOUNTAIN_TYPES = new Set<TerrainTypeId>(["mountains"]);

/**
 * Layer — terrain relief.
 *
 * Base land silhouette, then each classified region filled with a
 * diagonal gradient (cheap pseudo-hillshade) instead of a flat swatch.
 * Mountains get a darker ridge-line stroke pass; forests and
 * deserts/dunes get a tiled texture overlay; major summits (peaks.ts) get
 * a soft snow-cap accent; the coastline gets a blurred "shallow water"
 * shelf glow sitting half in the water, half under the land fill. Texture
 * and snow accents fade in with zoom (see TEXTURE_TILE/zoomScale) so the
 * world view stays clean per the semantic-zoom brief.
 *
 * Everything region-shaped stays wrapped in the shared land clip-path, so
 * hand-authored edges can never spill past the real coastline. This
 * replaces the earlier feTurbulence/feDiffuseLighting "shaded relief"
 * attempt the README describes — that was procedural noise standing in for
 * terrain that didn't exist yet; the only filter used here is a single
 * plain feGaussianBlur (see #terrain-soft-blur below), applied to a couple
 * dozen small elements — the kind of filter chain that reliably renders
 * the same way everywhere, unlike that earlier attempt.
 */
export default function TerrainLayer({ showClassification, zoomScale }: TerrainLayerProps) {
  const textureOpacity = Math.max(0, Math.min(1, (zoomScale - 3) / 3.5));
  const snowOpacity = Math.max(0.35, Math.min(1, (zoomScale - 1) / 2));

  return (
    <>
      <defs>
        {(Object.keys(REGION_GRADIENT_TINTS) as Array<keyof typeof REGION_GRADIENT_TINTS>).map(
          (type) => {
            const [light, dark] = REGION_GRADIENT_TINTS[type];
            return (
              <linearGradient key={type} id={`terrain-grad-${type}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={light} />
                <stop offset="100%" stopColor={dark} />
              </linearGradient>
            );
          }
        )}

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
          <stop offset="55%" stopColor="#F4F6F8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F4F6F8" stopOpacity="0" />
        </radialGradient>

        <filter id="terrain-soft-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={MAP_VIEWBOX_WIDTH / 650} />
        </filter>
      </defs>

      {/* Coastal shallow-water shelf — drawn before the land fill so only
          its outward (water-side) half remains visible once land covers
          the rest. A single blurred wide stroke along the real coastline. */}
      <path
        d={WORLD_LAND_PATH}
        fill="none"
        stroke="#3E7C9A"
        strokeOpacity={0.35}
        strokeWidth={MAP_VIEWBOX_WIDTH / 90}
        fillRule="evenodd"
        filter="url(#terrain-soft-blur)"
      />

      <g clipPath="url(#echelon-land-clip)">
        <path d={WORLD_LAND_PATH} fill="url(#terrain-grad-land)" fillRule="evenodd" />

        {showClassification && (
          <>
            {PROJECTED_TERRAIN_REGIONS.map((region, index) => (
              <path key={index} d={region.path} fill={`url(#terrain-grad-${region.type})`} />
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
            const r = (peak.tier === "major" ? 7.5 : 4.5) * (MAP_VIEWBOX_WIDTH / 980);
            return (
              <circle key={peak.name} cx={peak.x} cy={peak.y} r={r} fill="url(#terrain-snow-cap)" />
            );
          })}
        </g>
      )}
    </>
  );
}
