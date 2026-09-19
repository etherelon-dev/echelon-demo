"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { mapPaths } from "@/lib/map/mapData";
import { clampView, fitBox, moveAnchor, type View } from "@/lib/map/viewport";

const COLORS = {
  sea: "#090d12",
  land: "#212b35",
  coast: "#71818f",
  cityArea: "rgba(208, 173, 121, 0.3)",
  cityEdge: "#d0ad79",
  marker: "#d0ad79",
  markerEdge: "#08080a",
  label: "#eceae5",
  labelHalo: "#090d12"
};

/** Half-diagonal, in screen pixels, of the diamond marker for each city tier. */
const MARKER_HALF = [8, 7, 6, 5] as const;

/** Diamonds, not dots: a square turned 45 degrees. */
const MARKER_PATH = MARKER_HALF.map((h) => `M0 ${-h}L${h} 0L0 ${h}L${-h} 0Z`);

/**
 * Zoom bands, in screen pixels per kilometre. They decide which city labels
 * are readable and when the built-up areas become large enough to show.
 */
function zoomLevel(k: number): 0 | 1 | 2 | 3 {
  if (k < 0.5) return 0;
  if (k < 1.2) return 1;
  if (k < 3) return 2;
  return 3;
}

const MAP_CSS = `
.echelon-world:not([data-level="2"]):not([data-level="3"]) .echelon-areas{display:none}
.echelon-world[data-level="0"] .echelon-label:not([data-tier="0"]){display:none}
.echelon-world[data-level="1"] .echelon-label[data-tier="2"],
.echelon-world[data-level="1"] .echelon-label[data-tier="3"]{display:none}
.echelon-world[data-level="2"] .echelon-label[data-tier="3"]{display:none}
`;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Point = { x: number; y: number };

/** Safari's trackpad-pinch event (not part of lib.dom). */
type GestureEventLike = Event & { scale: number; clientX: number; clientY: number };

/**
 * Flat 2D map with pan and zoom. The SVG is drawn once; navigation only
 * rewrites a single transform on the <g> that wraps it, so dragging never
 * re-renders React.
 */
export default function FlatMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<SVGGElement>(null);
  const [ready, setReady] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const world = worldRef.current;
    if (!container || !world) return;

    const { extent, defaultView } = mapPaths;
    let size = { w: 0, h: 0 };
    let view: View = { k: 1, tx: 0, ty: 0 };
    let frame = 0;
    const pointers = new Map<number, Point>();

    const paint = () => {
      frame = 0;
      world.setAttribute(
        "transform",
        `translate(${view.tx} ${view.ty}) scale(${view.k})`
      );
      // city markers and labels cancel the zoom so they keep a constant pixel size
      world.style.setProperty("--inv", String(1 / view.k));
      const level = String(zoomLevel(view.k));
      if (world.dataset.level !== level) world.dataset.level = level;
    };

    const commit = (next: View) => {
      view = clampView(next, extent, size.w, size.h);
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const localPoint = (e: { clientX: number; clientY: number }): Point => {
      const rect = container.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    // --- sizing -----------------------------------------------------------
    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      if (size.w === 0) {
        // first layout: frame the whole of Europe
        size = { w: rect.width, h: rect.height };
        view = clampView(fitBox(defaultView, size.w, size.h), extent, size.w, size.h);
        setReady(true);
      } else {
        // later resizes (rotation, window resize): keep the screen centre fixed
        const cx = (size.w / 2 - view.tx) / view.k;
        const cy = (size.h / 2 - view.ty) / view.k;
        size = { w: rect.width, h: rect.height };
        view = clampView(
          { k: view.k, tx: size.w / 2 - cx * view.k, ty: size.h / 2 - cy * view.k },
          extent,
          size.w,
          size.h
        );
      }
      paint();
    };

    // --- mouse drag, touch drag, pinch ------------------------------------
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      container.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, localPoint(e));
    };

    const onPointerMove = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      const now = localPoint(e);

      if (pointers.size === 1) {
        commit(moveAnchor(view, prev.x, prev.y, now.x, now.y, view.k));
      } else if (pointers.size === 2) {
        let other = prev;
        pointers.forEach((p, id) => {
          if (id !== e.pointerId) other = p;
        });
        const prevDist = Math.hypot(prev.x - other.x, prev.y - other.y);
        const nowDist = Math.hypot(now.x - other.x, now.y - other.y);
        const scale = prevDist > 0 ? nowDist / prevDist : 1;
        commit(
          moveAnchor(
            view,
            (prev.x + other.x) / 2,
            (prev.y + other.y) / 2,
            (now.x + other.x) / 2,
            (now.y + other.y) / 2,
            view.k * scale
          )
        );
      }
      pointers.set(e.pointerId, now);
    };

    const onPointerEnd = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
    };

    // --- mouse wheel / trackpad pinch (Chrome, Firefox, Edge) -------------
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { x, y } = localPoint(e);
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      else if (e.deltaMode === 2) delta *= size.h;
      delta = Math.max(-240, Math.min(240, delta));
      const factor = Math.exp(-delta * (e.ctrlKey ? 0.01 : 0.0018));
      commit(moveAnchor(view, x, y, x, y, view.k * factor));
    };

    // --- trackpad pinch (Safari desktop) ----------------------------------
    let gestureStartScale = 1;
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      gestureStartScale = view.k;
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      // On iOS a two-finger touch pinch is already handled by pointer events.
      if (pointers.size >= 2) return;
      const g = e as GestureEventLike;
      const { x, y } = localPoint(g);
      commit(moveAnchor(view, x, y, x, y, gestureStartScale * g.scale));
    };
    const onGestureEnd = (e: Event) => e.preventDefault();

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerEnd);
    container.addEventListener("pointercancel", onPointerEnd);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("gesturestart", onGestureStart, { passive: false });
    container.addEventListener("gesturechange", onGestureChange, { passive: false });
    container.addEventListener("gestureend", onGestureEnd, { passive: false });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerEnd);
      container.removeEventListener("pointercancel", onPointerEnd);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("gesturestart", onGestureStart);
      container.removeEventListener("gesturechange", onGestureChange);
      container.removeEventListener("gestureend", onGestureEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-grab touch-none select-none overflow-hidden active:cursor-grabbing"
      style={{ backgroundColor: COLORS.sea }}
    >
      <style>{MAP_CSS}</style>
      <svg
        className="block h-full w-full"
        style={{ opacity: ready ? 1 : 0 }}
        role="img"
        aria-label="Flat map of Europe with the cities and built-up areas of the year 1800"
      >
        <g
          ref={worldRef}
          className="echelon-world"
          fill="none"
          strokeLinecap="butt"
          strokeLinejoin="bevel"
        >
          <path
            d={mapPaths.land}
            fill={COLORS.land}
            fillRule="evenodd"
            stroke={COLORS.land}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={mapPaths.coast}
            stroke={COLORS.coast}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="echelon-areas"
            d={mapPaths.cityAreas}
            fill={COLORS.cityArea}
            stroke={COLORS.cityEdge}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          {mapPaths.cities.map((city) => (
            <g
              key={city.name}
              style={{
                transform: `translate(${city.x}px, ${city.y}px) scale(var(--inv, 1))`
              }}
            >
              <title>{`${city.name} (c. 1800, about ${city.pop},000 inhabitants)`}</title>
              <path
                d={MARKER_PATH[city.tier]}
                fill={COLORS.marker}
                stroke={COLORS.markerEdge}
                strokeWidth={1}
              />
              <text
                className="echelon-label"
                data-tier={city.tier}
                x={MARKER_HALF[city.tier] + 5}
                y={4}
                fill={COLORS.label}
                stroke={COLORS.labelHalo}
                strokeWidth={3}
                paintOrder="stroke"
                fontSize={11}
                fontWeight={500}
                style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}
              >
                {city.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
