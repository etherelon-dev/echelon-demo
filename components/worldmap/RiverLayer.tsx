import { PROJECTED_RIVERS } from "@/lib/geo/terrainGeometry";
import { TERRAIN_TYPES } from "@/lib/geo/terrainTypes";

/**
 * Layer — rivers.
 *
 * Simple flat-color stroked lines following major rivers' real courses
 * (lib/geo/riverPaths.ts) — no animation, no glow, no flow simulation.
 * Clipped to the land clip-path so a river never draws a visible segment
 * out over open water.
 */
export default function RiverLayer() {
  return (
    <g clipPath="url(#echelon-land-clip)">
      {PROJECTED_RIVERS.map((river) => (
        <path
          key={river.name}
          d={river.path}
          fill="none"
          stroke={TERRAIN_TYPES.river.color}
          strokeWidth={0.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  );
}
