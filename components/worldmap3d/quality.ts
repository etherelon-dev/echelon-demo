import type { QualitySettings, QualityTier } from "@/components/worldmap3d/types";

/** `navigator.deviceMemory` is real but non-standard (Chromium-only, no
 * TypeScript lib entry) — narrowed locally rather than widening the global
 * Navigator type. */
interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number;
}

/**
 * Rough, conservative device heuristic — favors dropping to a lower tier
 * over risking jank, per the brief's "map should never become unusable".
 * Every tier still renders real 3D terrain (see QualitySettings/quality.ts
 * callers); only raster resolution, pixel ratio, and effects scale down.
 */
export function detectQualityTier(): QualityTier {
  if (typeof navigator === "undefined") return "medium";

  const nav = navigator as NavigatorWithDeviceMemory;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const isCoarsePointer =
    typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches === true;

  if (memory <= 2 || cores <= 2) return "low";
  if (isCoarsePointer && (memory <= 4 || cores <= 4)) return "medium";
  if (!isCoarsePointer && memory >= 8 && cores >= 8) return "high";
  return "medium";
}

export function getQualitySettings(tier: QualityTier = detectQualityTier()): QualitySettings {
  switch (tier) {
    case "low":
      return { tier, gridScale: 0.18, maxPixelRatio: 1, fog: false, animatedOcean: false };
    case "high":
      return { tier, gridScale: 0.4, maxPixelRatio: 2, fog: true, animatedOcean: true };
    case "medium":
    default:
      return { tier, gridScale: 0.28, maxPixelRatio: 1.5, fog: true, animatedOcean: false };
  }
}
