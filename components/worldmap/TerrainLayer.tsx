import { HIGH_DETAIL_CANONICAL_BBOX } from "@/lib/geo/focus";
import { WORLD_LAND_PATH } from "@/lib/geo/worldMapGeometry";

/**
 * Layer — stylized terrain relief.
 *
 * There is no elevation/biome dataset in this project
 * (world-land-110m.json is coastline only) and this build has no network
 * access to fetch one — see lib/geo/README.md. Real elevation-derived
 * shading isn't possible here, so this uses a procedural shaded-relief
 * texture instead (SVG feTurbulence -> feDiffuseLighting, clipped to the
 * coastline via the source shape's own alpha channel): geographically
 * plausible in tone and texture, but not sourced from real elevation
 * data. Swap this for the real thing once a relief/biome dataset is
 * available; nothing downstream depends on how the fill is produced.
 *
 * Two fidelity tiers implement the requested LOD: a coarse pass across all
 * land, and a finer pass layered on top only within the high-detail
 * region around Turkey, feathered at the edge so the transition isn't a
 * hard seam.
 */
export default function TerrainLayer() {
  const hd = HIGH_DETAIL_CANONICAL_BBOX;
  const hdWidth = hd.maxX - hd.minX;
  const hdHeight = hd.maxY - hd.minY;

  return (
    <>
      <defs>
        <filter id="echelon-terrain-coarse" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.018"
            numOctaves={3}
            seed={11}
            result="noise"
          />
          <feDiffuseLighting
            in="noise"
            surfaceScale={2.2}
            diffuseConstant={1.05}
            lightingColor="#5B5138"
            result="lit"
          >
            <feDistantLight azimuth={235} elevation={55} />
          </feDiffuseLighting>
          <feComponentTransfer in="lit" result="toned">
            <feFuncR type="linear" slope={0.9} intercept={0.02} />
            <feFuncG type="linear" slope={0.82} intercept={0.03} />
            <feFuncB type="linear" slope={0.6} intercept={0.02} />
          </feComponentTransfer>
          <feComposite in="toned" in2="SourceAlpha" operator="in" />
        </filter>

        <filter id="echelon-terrain-fine" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.045 0.065"
            numOctaves={5}
            seed={7}
            result="noise"
          />
          <feDiffuseLighting
            in="noise"
            surfaceScale={3.4}
            diffuseConstant={1.15}
            lightingColor="#6B5D3E"
            result="lit"
          >
            <feDistantLight azimuth={235} elevation={52} />
          </feDiffuseLighting>
          <feComponentTransfer in="lit" result="toned">
            <feFuncR type="linear" slope={0.95} intercept={0.03} />
            <feFuncG type="linear" slope={0.86} intercept={0.04} />
            <feFuncB type="linear" slope={0.62} intercept={0.02} />
          </feComponentTransfer>
          <feComposite in="toned" in2="SourceAlpha" operator="in" />
        </filter>

        {/* Soft radial falloff so the fine/coarse LOD boundary fades
            instead of cutting off as a hard rectangle. */}
        <radialGradient id="echelon-detail-falloff" cx="50%" cy="50%" r="58%">
          <stop offset="65%" stopColor="#ffffff" stopOpacity={1} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </radialGradient>
        <mask id="echelon-detail-mask">
          <rect x={hd.minX} y={hd.minY} width={hdWidth} height={hdHeight} fill="url(#echelon-detail-falloff)" />
        </mask>
      </defs>

      {/* Solid base first so filter antialiasing never leaves a coastline
          hairline showing the ocean underneath. */}
      <path d={WORLD_LAND_PATH} fill="#24261F" fillRule="evenodd" />
      <path d={WORLD_LAND_PATH} fill="#24261F" fillRule="evenodd" filter="url(#echelon-terrain-coarse)" />
      <g mask="url(#echelon-detail-mask)">
        <path d={WORLD_LAND_PATH} fill="#24261F" fillRule="evenodd" filter="url(#echelon-terrain-fine)" />
      </g>
    </>
  );
}
