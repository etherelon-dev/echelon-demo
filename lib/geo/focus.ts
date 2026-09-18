import { MAP_VIEWBOX_HEIGHT, MAP_VIEWBOX_WIDTH, worldProjector } from "./worldMapGeometry";
import type { Projector } from "./projection";
import type { CanonicalBBox, LonLatBBox } from "./bbox";

export type { CanonicalBBox, LonLatBBox };

export interface FocusTransform {
  scale: number;
  x: number;
  y: number;
}

/**
 * Samples the edge of a lon/lat bounding box (not just its four corners)
 * and projects every sample point, returning the box's bounds in the
 * canonical (unscaled, un-panned) viewBox coordinate system. Sampling the
 * edge matters because the projection is non-linear — a straight lon/lat
 * edge does not project to a straight line, so corner-only sampling can
 * under-estimate the true extent.
 */
export function projectBBoxToCanonical(
  bbox: LonLatBBox,
  project: Projector["project"],
  samples = 24
): CanonicalBBox {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const lon = bbox.lonMin + (bbox.lonMax - bbox.lonMin) * t;
    const lat = bbox.latMin + (bbox.latMax - bbox.latMin) * t;
    const points: Array<[number, number]> = [
      project(lon, bbox.latMin),
      project(lon, bbox.latMax),
      project(bbox.lonMin, lat),
      project(bbox.lonMax, lat)
    ];
    for (const [x, y] of points) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  return { minX, maxX, minY, maxY };
}

/**
 * Fits a lon/lat bounding box to the viewBox — the same scale-about-center
 * + additive-pan math `useMapZoomPan` uses — so the result is a drop-in
 * initial transform for that hook.
 */
export function computeFocusTransform(
  bbox: LonLatBBox,
  project: Projector["project"],
  viewBoxWidth: number,
  viewBoxHeight: number,
  options: { padding?: number; minScale?: number; maxScale?: number } = {}
): FocusTransform {
  const padding = options.padding ?? 24;
  const minScale = options.minScale ?? 1;
  const maxScale = options.maxScale ?? 14;

  const canonical = projectBBoxToCanonical(bbox, project);
  const dataWidth = canonical.maxX - canonical.minX;
  const dataHeight = canonical.maxY - canonical.minY;
  const availW = viewBoxWidth - padding * 2;
  const availH = viewBoxHeight - padding * 2;
  const fitScale = Math.min(availW / dataWidth, availH / dataHeight);
  const scale = Math.min(maxScale, Math.max(minScale, fitScale));

  const cx = viewBoxWidth / 2;
  const cy = viewBoxHeight / 2;
  const centerX = (canonical.minX + canonical.maxX) / 2;
  const centerY = (canonical.minY + canonical.maxY) / 2;

  return {
    scale,
    x: -scale * (centerX - cx),
    y: -scale * (centerY - cy)
  };
}

/** Shared tail: inverts the pan/zoom transform through an arbitrary
 * screen-space rectangle (in viewBox coordinates) back to canonical
 * (world-space) coordinates. */
function canonicalFromScreenRect(
  transform: FocusTransform,
  viewBoxWidth: number,
  viewBoxHeight: number,
  screenMinX: number,
  screenMinY: number,
  screenMaxX: number,
  screenMaxY: number
): CanonicalBBox {
  const cx = viewBoxWidth / 2;
  const cy = viewBoxHeight / 2;
  const toCanonical = (sx: number, sy: number): [number, number] => [
    (sx - transform.x - cx) / transform.scale + cx,
    (sy - transform.y - cy) / transform.scale + cy
  ];
  const [x0, y0] = toCanonical(screenMinX, screenMinY);
  const [x1, y1] = toCanonical(screenMaxX, screenMaxY);
  return {
    minX: Math.min(x0, x1),
    maxX: Math.max(x0, x1),
    minY: Math.min(y0, y1),
    maxY: Math.max(y0, y1)
  };
}

/**
 * Given the map's current pan/zoom transform, returns the currently
 * visible region in canonical (world-space / viewBox) coordinates — used
 * to draw the viewport-indicator rectangle on the minimaps.
 *
 * This assumes the full viewBox is on screen (as with
 * `preserveAspectRatio="meet"`). The live map uses "slice" instead (see
 * EchelonWorldMap.tsx), which crops part of the viewBox off screen — use
 * `visibleCanonicalBBoxForContainer` below for a result that matches what
 * "slice" actually shows.
 */
export function visibleCanonicalBBox(
  transform: FocusTransform,
  viewBoxWidth: number,
  viewBoxHeight: number
): CanonicalBBox {
  return canonicalFromScreenRect(transform, viewBoxWidth, viewBoxHeight, 0, 0, viewBoxWidth, viewBoxHeight);
}

/**
 * Same as `visibleCanonicalBBox`, but also accounts for
 * `preserveAspectRatio="xMidYMid slice"`: given the actual rendered
 * container size, first works out the centered sub-rectangle of the
 * viewBox that "slice" keeps on screen (it scales up to cover the
 * container on the binding axis and crops the other axis's excess), then
 * inverts the pan/zoom transform through *that* sub-rectangle instead of
 * the full viewBox. Falls back to the full-viewBox behavior when the
 * container size isn't known yet (e.g. before first layout).
 */
export function visibleCanonicalBBoxForContainer(
  transform: FocusTransform,
  viewBoxWidth: number,
  viewBoxHeight: number,
  containerWidth: number,
  containerHeight: number
): CanonicalBBox {
  if (!containerWidth || !containerHeight) {
    return visibleCanonicalBBox(transform, viewBoxWidth, viewBoxHeight);
  }
  const sliceScale = Math.max(containerWidth / viewBoxWidth, containerHeight / viewBoxHeight);
  const visibleWidth = Math.min(viewBoxWidth, containerWidth / sliceScale);
  const visibleHeight = Math.min(viewBoxHeight, containerHeight / sliceScale);
  const screenMinX = (viewBoxWidth - visibleWidth) / 2;
  const screenMinY = (viewBoxHeight - visibleHeight) / 2;
  return canonicalFromScreenRect(
    transform,
    viewBoxWidth,
    viewBoxHeight,
    screenMinX,
    screenMinY,
    screenMinX + visibleWidth,
    screenMinY + visibleHeight
  );
}

/** Turkey / Anatolia and the immediate surrounding region — the demo's initial camera. */
export const TURKEY_FOCUS_BBOX: LonLatBBox = {
  lonMin: 17,
  lonMax: 48,
  latMin: 29,
  latMax: 46.5
};

export const INITIAL_FOCUS_TRANSFORM: FocusTransform = computeFocusTransform(
  TURKEY_FOCUS_BBOX,
  worldProjector.project,
  MAP_VIEWBOX_WIDTH,
  MAP_VIEWBOX_HEIGHT,
  { padding: 20, minScale: 1, maxScale: 14 }
);

/**
 * The high-detail LOD region, derived directly from what the initial
 * camera actually shows (plus a margin) rather than a second guessed
 * lon/lat box. Guaranteed-by-construction to fully cover the initial
 * viewport — a separately-guessed lon/lat box can miss this, since the
 * viewBox's aspect ratio doesn't match TURKEY_FOCUS_BBOX's, so whichever
 * axis isn't the binding constraint in computeFocusTransform ends up
 * showing more than that box's own extent.
 */
const INITIAL_VIEWPORT_CANONICAL: CanonicalBBox = (() => {
  const cx = MAP_VIEWBOX_WIDTH / 2;
  const cy = MAP_VIEWBOX_HEIGHT / 2;
  const toCanonical = (sx: number, sy: number): [number, number] => [
    (sx - INITIAL_FOCUS_TRANSFORM.x - cx) / INITIAL_FOCUS_TRANSFORM.scale + cx,
    (sy - INITIAL_FOCUS_TRANSFORM.y - cy) / INITIAL_FOCUS_TRANSFORM.scale + cy
  ];
  const [x0, y0] = toCanonical(0, 0);
  const [x1, y1] = toCanonical(MAP_VIEWBOX_WIDTH, MAP_VIEWBOX_HEIGHT);
  return { minX: Math.min(x0, x1), maxX: Math.max(x0, x1), minY: Math.min(y0, y1), maxY: Math.max(y0, y1) };
})();

/** Canonical-space breathing room past the initial viewport's edges, so
 * panning a little doesn't immediately fall off the high-detail region. */
const HIGH_DETAIL_MARGIN = 40;

export const HIGH_DETAIL_CANONICAL_BBOX: CanonicalBBox = {
  minX: INITIAL_VIEWPORT_CANONICAL.minX - HIGH_DETAIL_MARGIN,
  maxX: INITIAL_VIEWPORT_CANONICAL.maxX + HIGH_DETAIL_MARGIN,
  minY: INITIAL_VIEWPORT_CANONICAL.minY - HIGH_DETAIL_MARGIN,
  maxY: INITIAL_VIEWPORT_CANONICAL.maxY + HIGH_DETAIL_MARGIN
};
