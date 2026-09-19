/**
 * A small settlement glyph — a cluster of pitched-roof building silhouettes
 * (plus, at the "major" tier, a taller central keep with a banner) sitting
 * on a soft ground shadow — used in place of a flat colored dot to mark a
 * city on the map. Drawn in local, scale-stable units (the parent
 * ScaleStableLabel group already applies translate + counter-scale), with
 * (0, 0) as the settlement's ground anchor: everything here sits at y <= 0
 * so the glyph reads as standing "on" the geographic point, the same way
 * the dot it replaces was centered on it.
 *
 * Not a photograph and not trying to be one — this is still a fictional,
 * procedurally-placed grand-strategy map, so there's no real imagery of
 * these places to draw on. What "more realistic than a circle" means here
 * is a recognizable little settlement silhouette (walls, roofs, a keep for
 * the largest places) instead of an abstract dot, in the same spirit as
 * the icon-based city markers real grand-strategy maps use.
 */

interface SettlementMarkerProps {
  /** "major" gets a taller central keep + banner and a slightly larger
   * building cluster; "minor" is a plain two-roof hamlet. */
  tier: "major" | "minor";
  /** Kingdom color for the banner/roof accent; neutral wood-and-clay tones
   * when the settlement belongs to no kingdom yet. */
  accentColor: string | null;
  /** Drives dot-equivalent visibility — same opacity channel the old
   * circle used, so zoom fade-in behavior is unchanged. */
  opacity: number;
}

const WALL = "#C9B68C";
const WALL_SHADE = "#A28F63";
const ROOF = "#7A4636";
const ROOF_SHADE = "#5C3327";
const OUTLINE = "#241C14";

export default function SettlementMarker({ tier, accentColor, opacity }: SettlementMarkerProps) {
  const isMajor = tier === "major";
  const banner = accentColor ?? "#D0AD79";

  return (
    <g style={{ opacity }} stroke={OUTLINE} strokeWidth={0.25} strokeLinejoin="round">
      {/* Ground shadow */}
      <ellipse cx={0} cy={0.4} rx={isMajor ? 4.2 : 3} ry={isMajor ? 1.1 : 0.8} fill="#000000" fillOpacity={0.32} stroke="none" />

      {/* Left house */}
      <g transform={`translate(${isMajor ? -3.2 : -2.3} 0)`}>
        <rect x={-1.3} y={-3.2} width={2.6} height={3.2} fill={WALL} />
        <rect x={0} y={-3.2} width={1.3} height={3.2} fill={WALL_SHADE} />
        <path d={`M-1.7 -3.2 L0 -5.3 L1.7 -3.2 Z`} fill={ROOF} />
        <path d={`M0 -5.3 L1.7 -3.2 L0 -3.2 Z`} fill={ROOF_SHADE} />
      </g>

      {/* Right house */}
      <g transform={`translate(${isMajor ? 3.1 : 2.2} 0.15) scale(0.85)`}>
        <rect x={-1.3} y={-3.2} width={2.6} height={3.2} fill={WALL} />
        <rect x={0} y={-3.2} width={1.3} height={3.2} fill={WALL_SHADE} />
        <path d="M-1.7 -3.2 L0 -5.3 L1.7 -3.2 Z" fill={ROOF} />
        <path d="M0 -5.3 L1.7 -3.2 L0 -3.2 Z" fill={ROOF_SHADE} />
      </g>

      {isMajor ? (
        /* Central keep — taller, with crenellations and a small banner,
           marking this as a capital/major settlement rather than a hamlet. */
        <g>
          <rect x={-1.9} y={-6.4} width={3.8} height={6.4} fill={WALL} />
          <rect x={0} y={-6.4} width={1.9} height={6.4} fill={WALL_SHADE} />
          {/* crenellations */}
          <path d="M-1.9 -6.4 L-1.9 -7.5 L-1.1 -7.5 L-1.1 -6.7 L-0.3 -6.7 L-0.3 -7.5 L0.5 -7.5 L0.5 -6.7 L1.3 -6.7 L1.3 -7.5 L1.9 -7.5 L1.9 -6.4 Z" fill={WALL_SHADE} />
          {/* banner pole + flag, tinted by kingdom color */}
          <line x1={0} y1={-7.5} x2={0} y2={-10.6} stroke={OUTLINE} strokeWidth={0.3} />
          <path d="M0 -10.6 L2.6 -9.9 L0 -9.2 Z" fill={banner} stroke="none" />
        </g>
      ) : null}
    </g>
  );
}
