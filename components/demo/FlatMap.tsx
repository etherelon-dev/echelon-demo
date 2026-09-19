"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { mapPaths } from "@/lib/map/mapData";
import { clampView, fitBox, moveAnchor, type View } from "@/lib/map/viewport";

const COLORS = {
  sea: "#090d12",
  land: "#1c242d",
  france: "#28323d",
  border: "#3f4c58",
  coast: "#71818f"
};

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
        // first layout: frame France, the Mediterranean and a strip of North Africa
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
      <svg
        className="block h-full w-full"
        style={{ opacity: ready ? 1 : 0 }}
        role="img"
        aria-label="Flat map of France, the Mediterranean Sea and the coast of North Africa"
      >
        <g
          ref={worldRef}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={mapPaths.land} fill={COLORS.land} fillRule="evenodd" />
          <path d={mapPaths.main} fill={COLORS.france} fillRule="evenodd" />
          <path
            d={mapPaths.borders}
            stroke={COLORS.border}
            strokeWidth={0.8}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={mapPaths.coast}
            stroke={COLORS.coast}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}
