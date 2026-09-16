"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MapCamera3D } from "@/components/worldmap3d/MapCamera3D";
import { buildElevationField } from "@/components/worldmap3d/terrain/elevationField";
import { buildOceanMesh } from "@/components/worldmap3d/terrain/OceanMesh";
import { buildTerrainMesh } from "@/components/worldmap3d/terrain/TerrainMesh";
import { viewBoxToWorld } from "@/components/worldmap3d/terrain/coords";
import { getQualitySettings } from "@/components/worldmap3d/quality";
import type { QualityTier } from "@/components/worldmap3d/types";
import { TURKEY_FOCUS_BBOX } from "@/lib/geo/focus";
import { worldProjector } from "@/lib/geo/worldMapGeometry";

const WHEEL_ZOOM_SENSITIVITY = 0.045;
const PINCH_ZOOM_SENSITIVITY = 0.12;

/**
 * The 3D counterpart to `EchelonWorldMap` (the existing flat SVG map) —
 * see `components/worldmap3d/README.md` for what this does and doesn't
 * cover yet. Deliberately a separate component/route (`/demo3d`) rather
 * than replacing `EchelonWorldMap` outright, so the working 2D map keeps
 * functioning while this is reviewed.
 *
 * Real WebGL 3D terrain (heightmap-displaced geometry, not a flat plane
 * with a texture): see terrain/elevationField.ts + terrain/TerrainMesh.ts.
 * Pan + zoom only, fixed oblique camera angle — see MapCamera3D.ts for why
 * rotation isn't exposed.
 */
export default function EchelonWorldMap3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [qualityTier, setQualityTier] = useState<QualityTier | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const quality = getQualitySettings();
    setQualityTier(quality.tier);

    const scene = new THREE.Scene();
    const skyColor = new THREE.Color("#b9d0da");
    scene.background = skyColor;
    if (quality.fog) {
      scene.fog = new THREE.FogExp2(skyColor.getHex(), 0.0034);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: quality.tier !== "low" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.maxPixelRatio));
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    // --- Terrain + ocean, built from the game's real existing geography ---
    const field = buildElevationField(quality.gridScale);
    const terrain = buildTerrainMesh(field);
    scene.add(terrain.mesh);

    const ocean = buildOceanMesh(field, terrain.planeWidth, terrain.planeHeight, quality.animatedOcean);
    ocean.mesh.position.y = -0.12;
    scene.add(ocean.mesh);

    // --- Lighting: real per-vertex shading from actual terrain normals,
    // no baked/fake shadow texture ---
    const hemiLight = new THREE.HemisphereLight(0xdcebf5, 0x3a3222, 0.65);
    scene.add(hemiLight);
    const sunLight = new THREE.DirectionalLight(0xfff0d2, 1.35);
    sunLight.position.set(-60, 90, 40);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x50565f, 0.22));

    // --- Camera: fixed oblique angle, starts framing the same
    // Turkey/Anatolia focus the existing 2D map opens on ---
    const rect = container.getBoundingClientRect();
    const mapCamera = new MapCamera3D(
      Math.max(rect.width, 1) / Math.max(rect.height, 1),
      terrain.planeWidth,
      terrain.planeHeight
    );
    const centerLon = (TURKEY_FOCUS_BBOX.lonMin + TURKEY_FOCUS_BBOX.lonMax) / 2;
    const centerLat = (TURKEY_FOCUS_BBOX.latMin + TURKEY_FOCUS_BBOX.latMax) / 2;
    const [focusViewX, focusViewY] = worldProjector.project(centerLon, centerLat);
    const initialTarget = viewBoxToWorld(focusViewX, focusViewY, terrain.planeWidth, terrain.planeHeight);
    mapCamera.setTarget(initialTarget.x, initialTarget.z);

    renderer.setSize(rect.width, rect.height);

    // --- Pointer-driven pan + pinch/wheel zoom (Pointer Events cover
    // mouse, touch, and pen uniformly) ---
    const activePointers = new Map<number, { x: number; y: number }>();
    let lastPinchDistance: number | null = null;

    function pinchDistance(): number | null {
      if (activePointers.size !== 2) return null;
      const [a, b] = Array.from(activePointers.values());
      return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function handlePointerDown(event: PointerEvent): void {
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      lastPinchDistance = pinchDistance();
      renderer.domElement.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent): void {
      const previous = activePointers.get(event.pointerId);
      if (!previous) return;
      const current = { x: event.clientX, y: event.clientY };

      if (activePointers.size === 1) {
        const dx = current.x - previous.x;
        const dy = current.y - previous.y;
        mapCamera.pan(dx, dy, containerRef.current?.clientHeight || 1);
      } else if (activePointers.size === 2) {
        activePointers.set(event.pointerId, current);
        const distance = pinchDistance();
        if (distance !== null && lastPinchDistance !== null) {
          mapCamera.zoom((lastPinchDistance - distance) * PINCH_ZOOM_SENSITIVITY);
        }
        lastPinchDistance = distance;
        return;
      }

      activePointers.set(event.pointerId, current);
    }

    function handlePointerUp(event: PointerEvent): void {
      activePointers.delete(event.pointerId);
      lastPinchDistance = pinchDistance();
    }

    function handleWheel(event: WheelEvent): void {
      event.preventDefault();
      mapCamera.zoom(event.deltaY * WHEEL_ZOOM_SENSITIVITY);
    }

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", handlePointerDown);
    dom.addEventListener("pointermove", handlePointerMove);
    dom.addEventListener("pointerup", handlePointerUp);
    dom.addEventListener("pointercancel", handlePointerUp);
    dom.addEventListener("wheel", handleWheel, { passive: false });

    // --- Resize handling ---
    const resizeObserver = new ResizeObserver(() => {
      const size = container.getBoundingClientRect();
      if (size.width === 0 || size.height === 0) return;
      renderer.setSize(size.width, size.height);
      mapCamera.resize(size.width / size.height);
    });
    resizeObserver.observe(container);

    // --- Render loop ---
    let animationFrame = 0;
    const clock = new THREE.Clock();
    const renderLoop = () => {
      ocean.update(clock.getElapsedTime());
      renderer.render(scene, mapCamera.camera);
      animationFrame = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      dom.removeEventListener("pointerdown", handlePointerDown);
      dom.removeEventListener("pointermove", handlePointerMove);
      dom.removeEventListener("pointerup", handlePointerUp);
      dom.removeEventListener("pointercancel", handlePointerUp);
      dom.removeEventListener("wheel", handleWheel);
      terrain.dispose();
      ocean.dispose();
      renderer.dispose();
      if (dom.parentElement === container) {
        container.removeChild(dom);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full select-none overflow-hidden bg-[#b9d0da]">
      {qualityTier && (
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/40 px-2 py-1 text-[11px] uppercase tracking-wide text-white/60 backdrop-blur-sm">
          3D preview — {qualityTier} quality
        </div>
      )}
    </div>
  );
}
