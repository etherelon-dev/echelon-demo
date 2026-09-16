import { useEffect, useState, type RefObject } from "react";

interface ElementSize {
  width: number;
  height: number;
}

/**
 * Tracks an element's live rendered size via ResizeObserver. Used to know
 * the map `<svg>`'s actual on-screen box so the minimaps can work out
 * exactly what `preserveAspectRatio="xMidYMid slice"` crops off (see
 * `visibleCanonicalBBoxForContainer` in lib/geo/focus.ts) — a plain CSS
 * height (vh units, breakpoints) isn't knowable at render time, so this
 * reads the real box instead of guessing it.
 */
export function useElementSize<T extends Element>(ref: RefObject<T | null>): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize((prev) => (prev.width === rect.width && prev.height === rect.height ? prev : { width: rect.width, height: rect.height }));
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
