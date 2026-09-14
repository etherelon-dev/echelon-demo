import { useCallback, useMemo, useRef, useState } from "react";

interface Transform {
  scale: number;
  x: number;
  y: number;
}

interface Options {
  minScale?: number;
  maxScale?: number;
}

const IDENTITY: Transform = { scale: 1, x: 0, y: 0 };

/**
 * Map navigation only — zoom, pan, reset. No territory selection or
 * click-to-interact here; that belongs to a later gameplay layer.
 *
 * The transform is applied to an inner <g> as:
 *   translate(x, y) translate(cx, cy) scale(scale) translate(-cx, -cy)
 * i.e. scale about the viewBox center, then an additive pixel-space pan —
 * which is what lets drag track the cursor 1:1 regardless of zoom level.
 */
export function useMapZoomPan(
  viewBoxWidth: number,
  viewBoxHeight: number,
  options: Options = {}
) {
  const minScale = options.minScale ?? 1;
  const maxScale = options.maxScale ?? 14;

  const [transform, setTransform] = useState<Transform>(IDENTITY);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lastPinchDistance = useRef<number | null>(null);
  const dragPointerId = useRef<number | null>(null);

  const cx = viewBoxWidth / 2;
  const cy = viewBoxHeight / 2;

  const clamp = useCallback(
    (t: Transform): Transform => {
      const scale = Math.min(maxScale, Math.max(minScale, t.scale));
      // Keep at least a slice of the map on-screen instead of letting it
      // drift away entirely.
      const maxX = viewBoxWidth * 0.5 * scale;
      const maxY = viewBoxHeight * 0.5 * scale;
      return {
        scale,
        x: Math.min(maxX, Math.max(-maxX, t.x)),
        y: Math.min(maxY, Math.max(-maxY, t.y))
      };
    },
    [minScale, maxScale, viewBoxWidth, viewBoxHeight]
  );

  const clientToViewBox = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return { x: cx, y: cy };
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return { x: cx, y: cy };
      return {
        x: ((clientX - rect.left) / rect.width) * viewBoxWidth,
        y: ((clientY - rect.top) / rect.height) * viewBoxHeight
      };
    },
    [viewBoxWidth, viewBoxHeight, cx, cy]
  );

  /** Zooms by `factor`, keeping the viewBox point (px, py) fixed on screen. */
  const zoomAtPoint = useCallback(
    (px: number, py: number, factor: number) => {
      setTransform((prev) => {
        const worldX = (px - prev.x - cx) / prev.scale + cx;
        const worldY = (py - prev.y - cy) / prev.scale + cy;
        const nextScale = Math.min(maxScale, Math.max(minScale, prev.scale * factor));
        const nextX = px - cx - (worldX - cx) * nextScale;
        const nextY = py - cy - (worldY - cy) * nextScale;
        return clamp({ scale: nextScale, x: nextX, y: nextY });
      });
    },
    [cx, cy, minScale, maxScale, clamp]
  );

  const zoomAtClient = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      const p = clientToViewBox(clientX, clientY);
      zoomAtPoint(p.x, p.y, factor);
    },
    [clientToViewBox, zoomAtPoint]
  );

  const zoomByFactor = useCallback(
    (factor: number) => zoomAtPoint(cx, cy, factor),
    [zoomAtPoint, cx, cy]
  );

  const reset = useCallback(() => setTransform(IDENTITY), []);

  const onWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      zoomAtClient(e.clientX, e.clientY, factor);
    },
    [zoomAtClient]
  );

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.current.size === 1) {
      dragPointerId.current = e.pointerId;
    } else if (activePointers.current.size === 2) {
      dragPointerId.current = null;
      const pts = [...activePointers.current.values()];
      lastPinchDistance.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    }
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!activePointers.current.has(e.pointerId)) return;
      const prevPoint = activePointers.current.get(e.pointerId)!;
      activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.current.size === 2) {
        const pts = [...activePointers.current.values()];
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const midClient = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
        if (lastPinchDistance.current) {
          const factor = dist / lastPinchDistance.current;
          zoomAtClient(midClient.x, midClient.y, factor);
        }
        lastPinchDistance.current = dist;
        return;
      }

      if (dragPointerId.current === e.pointerId) {
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const dx = (e.clientX - prevPoint.x) * (viewBoxWidth / rect.width);
        const dy = (e.clientY - prevPoint.y) * (viewBoxHeight / rect.height);
        setTransform((prev) => clamp({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      }
    },
    [zoomAtClient, viewBoxWidth, viewBoxHeight, clamp]
  );

  const endPointer = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    activePointers.current.delete(e.pointerId);
    if (dragPointerId.current === e.pointerId) dragPointerId.current = null;
    if (activePointers.current.size < 2) lastPinchDistance.current = null;
    if (activePointers.current.size === 1) {
      dragPointerId.current = [...activePointers.current.keys()][0];
    }
  }, []);

  const onDoubleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      zoomAtClient(e.clientX, e.clientY, 1.8);
    },
    [zoomAtClient]
  );

  const handlers = useMemo(
    () => ({
      onWheel,
      onPointerDown,
      onPointerMove,
      onPointerUp: endPointer,
      onPointerCancel: endPointer,
      onPointerLeave: endPointer,
      onDoubleClick
    }),
    [onWheel, onPointerDown, onPointerMove, endPointer, onDoubleClick]
  );

  const transformString = `translate(${transform.x} ${transform.y}) translate(${cx} ${cy}) scale(${transform.scale}) translate(${-cx} ${-cy})`;

  return {
    svgRef,
    transform,
    transformString,
    handlers,
    zoomIn: () => zoomByFactor(1.5),
    zoomOut: () => zoomByFactor(1 / 1.5),
    reset,
    minScale,
    maxScale
  };
}
