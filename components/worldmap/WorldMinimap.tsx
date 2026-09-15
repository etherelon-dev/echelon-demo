import { visibleCanonicalBBox, type FocusTransform } from "@/lib/geo/focus";
import { MAP_VIEWBOX_HEIGHT, MAP_VIEWBOX_WIDTH, WORLD_LAND_PATH } from "@/lib/geo/worldMapGeometry";

interface WorldMinimapProps {
  transform: FocusTransform;
}

const DIAMETER = 88;
const INNER = DIAMETER - 20;

/**
 * Small circular "globe" locator, bottom-left. Reuses the same land path
 * and canonical viewBox as the main map — just rendered at a smaller
 * physical size — so no separate projection or geometry is needed here.
 */
export default function WorldMinimap({ transform }: WorldMinimapProps) {
  const view = visibleCanonicalBBox(transform, MAP_VIEWBOX_WIDTH, MAP_VIEWBOX_HEIGHT);

  return (
    <div
      className="absolute bottom-4 left-4 z-10 hidden items-center justify-center overflow-hidden rounded-full border border-gold-500/25 bg-ink-900/85 backdrop-blur-sm sm:flex"
      style={{ width: DIAMETER, height: DIAMETER }}
    >
      <svg
        viewBox={`0 0 ${MAP_VIEWBOX_WIDTH} ${MAP_VIEWBOX_HEIGHT}`}
        width={INNER}
        height={INNER * (MAP_VIEWBOX_HEIGHT / MAP_VIEWBOX_WIDTH)}
        aria-hidden="true"
      >
        <path d={WORLD_LAND_PATH} fill="#33362D" fillRule="evenodd" />
        <rect
          x={view.minX}
          y={view.minY}
          width={Math.max(2, view.maxX - view.minX)}
          height={Math.max(2, view.maxY - view.minY)}
          fill="none"
          stroke="#E1C594"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
