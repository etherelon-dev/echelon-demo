import type { Box } from "./mapData";

/**
 * 2D camera maths. A view maps map-space kilometres to screen pixels:
 *
 *     screenX = mapX * k + tx      screenY = mapY * k + ty
 *
 * There is no rotation, pitch or perspective — just scale and translation.
 */

export type View = { k: number; tx: number; ty: number };

/**
 * Deepest zoom, in pixels per kilometre. At 30, a city of a few kilometres
 * fills the screen, which is what the c. 1800 city outlines need. The bundled
 * 110m coastline has one point roughly every 20 km, so coasts look angular this
 * close. Swap in the 50m dataset for finer coasts (see scripts/map/convert.py).
 */
export const MAX_SCALE = 30;

/** Smallest scale at which the extent still covers the whole viewport. */
export function minScale(extent: Box, vw: number, vh: number): number {
  return Math.max(vw / (extent.x1 - extent.x0), vh / (extent.y1 - extent.y0));
}

/** Keep the zoom in range and the viewport inside the extent (never any empty edge). */
export function clampView(view: View, extent: Box, vw: number, vh: number): View {
  const kMin = minScale(extent, vw, vh);
  const k = Math.min(Math.max(view.k, kMin), Math.max(kMin, MAX_SCALE));
  return {
    k,
    tx: Math.min(-extent.x0 * k, Math.max(vw - extent.x1 * k, view.tx)),
    ty: Math.min(-extent.y0 * k, Math.max(vh - extent.y1 * k, view.ty))
  };
}

/** Largest scale that still shows the whole box, centred in the viewport. */
export function fitBox(box: Box, vw: number, vh: number): View {
  const k = Math.min(vw / (box.x1 - box.x0), vh / (box.y1 - box.y0));
  return {
    k,
    tx: vw / 2 - ((box.x0 + box.x1) / 2) * k,
    ty: vh / 2 - ((box.y0 + box.y1) / 2) * k
  };
}

/**
 * Move the view so the map point that was under screen position (fromX, fromY)
 * ends up under (toX, toY) at the new scale. Covers zoom-at-cursor (from = to),
 * pinch (from/to are the two-finger midpoint before/after) and plain panning
 * (newK = view.k).
 */
export function moveAnchor(
  view: View,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  newK: number
): View {
  const mapX = (fromX - view.tx) / view.k;
  const mapY = (fromY - view.ty) / view.k;
  return { k: newK, tx: toX - mapX * newK, ty: toY - mapY * newK };
}
