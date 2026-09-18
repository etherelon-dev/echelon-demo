import { visibleCanonicalBBoxForContainer, type FocusTransform } from "@/lib/geo/focus";
import { MAP_VIEWBOX_HEIGHT, MAP_VIEWBOX_WIDTH, WORLD_LAND_PATH } from "@/lib/geo/worldMapGeometry";

interface WorldMinimapProps {
  transform: FocusTransform;
  /** The main map <svg>'s live rendered size — see useElementSize's
   * docstring — so the indicator rectangle matches what "slice" actually
   * shows instead of the full (partially cropped-off) viewBox. */
  containerSize: { width: number; height: number };
}

const DIAMETER = 88;
const INNER = DIAMETER - 20;

/**
 * Small circular "globe" locator. Reuses the same land path and canonical
 * viewBox as the main map — just rendered at a smaller physical size — so
 * no separate projection or geometry is needed here.
 *
 * NOT currently rendered by EchelonWorldMap: the visual-reference upgrade
 * put a single rectangular minimap at bottom-right (RegionMinimap, which
 * already includes this same viewport-rect indicator) and a compass +
 * scale bar at bottom-left (MapCompassHud) — two minimaps in opposite
 * corners didn't match the reference and was redundant besides. Left in
 * place, unmounted, rather than deleted — same reasoning the old
 * TerritoryBoundaryLayer docstring used to give for itself before it
 * became PoliticalLayer: a genuine building block (e.g. for a future
 * settings toggle between circular/rectangular minimap style) that slots
 * back in with no changes needed.
 */
export default function WorldMinimap({ transform, containerSize }: WorldMinimapProps) {
  const view = visibleCanonicalBBoxForContainer(
    transform,
    MAP_VIEWBOX_WIDTH,
    MAP_VIEWBOX_HEIGHT,
    containerSize.width,
    containerSize.height
  );

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
