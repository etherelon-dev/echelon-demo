import * as THREE from "three";
import type { ElevationField } from "@/components/worldmap3d/types";

const DEEP_COLOR = new THREE.Color("#0a3654");
const SHALLOW_COLOR = new THREE.Color("#2f8fa8");

const ANIMATED_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  attribute float aProximity;
  varying float vProximity;
  void main() {
    vProximity = aProximity;
    vec3 pos = position;
    float wave = sin(pos.x * 0.18 + uTime * 0.6) * 0.05 + cos(pos.z * 0.23 + uTime * 0.5) * 0.05;
    // Water right at the shoreline stays calmer than the open ocean.
    pos.y += wave * (1.0 - vProximity);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const ANIMATED_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  varying float vProximity;
  void main() {
    vec3 color = mix(uDeep, uShallow, clamp(vProximity, 0.0, 1.0));
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface OceanMeshResult {
  mesh: THREE.Mesh;
  /** No-op for the static (low-tier) material; advances the ripple shader
   * for the animated one. Safe to call every frame either way. */
  update: (elapsedSeconds: number) => void;
  dispose: () => void;
}

/**
 * The ocean plane sits at a fixed y just below the terrain's sea-level
 * texels (see EchelonWorldMap3D), so it reads as a real body of water the
 * coastline meets rather than a colored backdrop behind the terrain.
 * Resolution is deliberately much coarser than the terrain heightmap —
 * open water doesn't need per-texel geometry, just a believable
 * deep/shallow gradient and (on higher tiers) a cheap animated ripple.
 */
export function buildOceanMesh(
  field: ElevationField,
  planeWidth: number,
  planeHeight: number,
  animated: boolean
): OceanMeshResult {
  const divisor = 5;
  const segX = Math.max(2, Math.floor((field.width - 1) / divisor));
  const segY = Math.max(2, Math.floor((field.height - 1) / divisor));

  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segX, segY);
  geometry.rotateX(-Math.PI / 2);

  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const vertexCount = position.count;
  const proximity = new Float32Array(vertexCount);
  const gridW = segX + 1;
  const gridH = segY + 1;

  // Nearest-sample the (much higher-resolution) elevation field's
  // coastal-proximity data down onto this coarser ocean grid.
  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const fx = Math.min(field.width - 1, Math.round((gx / (gridW - 1)) * (field.width - 1)));
      const fy = Math.min(field.height - 1, Math.round((gy / (gridH - 1)) * (field.height - 1)));
      proximity[gy * gridW + gx] = field.coastalProximity[fy * field.width + fx];
    }
  }

  let mesh: THREE.Mesh;
  let update: (elapsedSeconds: number) => void;
  let dispose: () => void;

  if (animated) {
    geometry.setAttribute("aProximity", new THREE.BufferAttribute(proximity, 1));
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDeep: { value: DEEP_COLOR },
        uShallow: { value: SHALLOW_COLOR }
      },
      vertexShader: ANIMATED_VERTEX_SHADER,
      fragmentShader: ANIMATED_FRAGMENT_SHADER
    });
    mesh = new THREE.Mesh(geometry, material);
    update = (elapsedSeconds: number) => {
      material.uniforms.uTime.value = elapsedSeconds;
    };
    dispose = () => {
      geometry.dispose();
      material.dispose();
    };
  } else {
    // Low tier: same deep/shallow gradient baked as static vertex colors,
    // no shader, no per-frame uniform updates — cheapest possible ocean
    // that still isn't a flat single color.
    const colors = new Float32Array(vertexCount * 3);
    const tmp = new THREE.Color();
    for (let i = 0; i < vertexCount; i++) {
      tmp.copy(DEEP_COLOR).lerp(SHALLOW_COLOR, proximity[i]);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.MeshBasicMaterial({ vertexColors: true });
    mesh = new THREE.Mesh(geometry, material);
    update = () => {};
    dispose = () => {
      geometry.dispose();
      material.dispose();
    };
  }

  mesh.name = "echelon-ocean";
  return { mesh, update, dispose };
}
