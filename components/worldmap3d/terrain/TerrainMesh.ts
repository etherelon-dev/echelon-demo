import * as THREE from "three";
import type { ElevationField } from "@/components/worldmap3d/types";
import { MAX_TERRAIN_ELEVATION, SNOW_LINE } from "@/components/worldmap3d/terrain/elevationField";

/** Width of the terrain plane in Three.js world units. Height follows the
 * ElevationField's own aspect ratio, which is itself derived from the
 * canonical viewBox (see worldMapGeometry.ts) — so the 3D plane keeps the
 * same real-world proportions as the existing 2D map. */
export const WORLD_PLANE_WIDTH = 200;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export interface TerrainMeshResult {
  mesh: THREE.Mesh;
  /** World-unit size of the plane, so the camera/ocean/fog can size
   * themselves against it without recomputing from the field. */
  planeWidth: number;
  planeHeight: number;
  dispose: () => void;
}

/**
 * Turns a rasterized ElevationField into a real displaced 3D mesh: vertex
 * heights come from the field's elevation samples (not a flat plane with a
 * texture pretending to have relief), and per-vertex colors blend each
 * texel's biome color toward snow-white above `SNOW_LINE`. Normals are
 * computed from the *displaced* geometry, so ridges/valleys shade
 * correctly from a single directional light — no baked shadow texture.
 */
export function buildTerrainMesh(field: ElevationField): TerrainMeshResult {
  const planeWidth = WORLD_PLANE_WIDTH;
  const planeHeight = WORLD_PLANE_WIDTH * (field.height / field.width);

  const geometry = new THREE.PlaneGeometry(
    planeWidth,
    planeHeight,
    field.width - 1,
    field.height - 1
  );
  geometry.rotateX(-Math.PI / 2);

  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const vertexCount = position.count;
  const colors = new Float32Array(vertexCount * 3);

  for (let i = 0; i < vertexCount; i++) {
    const elevation = field.elevation[i];
    position.setY(i, elevation * MAX_TERRAIN_ELEVATION);

    const snowBlend = smoothstep(SNOW_LINE, SNOW_LINE + 0.16, elevation);
    // Small elevation-based brightness lift on top of real per-vertex
    // lighting — reads as "high ground catches more light", stays subtle
    // enough not to fight the directional light doing the actual shading.
    const lift = 0.85 + elevation * 0.3;

    const r = field.color[i * 3] * lift * (1 - snowBlend) + snowBlend;
    const g = field.color[i * 3 + 1] * lift * (1 - snowBlend) + snowBlend;
    const b = field.color[i * 3 + 2] * lift * (1 - snowBlend) + snowBlend;

    colors[i * 3] = Math.min(1, r);
    colors[i * 3 + 1] = Math.min(1, g);
    colors[i * 3 + 2] = Math.min(1, b);
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  position.needsUpdate = true;
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.95,
    metalness: 0,
    flatShading: false
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "echelon-terrain";

  return {
    mesh,
    planeWidth,
    planeHeight,
    dispose: () => {
      geometry.dispose();
      material.dispose();
    }
  };
}
