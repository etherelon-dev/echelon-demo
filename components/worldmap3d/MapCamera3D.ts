import * as THREE from "three";

/** Degrees above the horizon the camera looks down from — the "oblique 3D
 * camera" angle from the brief. Fixed rather than user-adjustable: the
 * brief explicitly asks for smooth pan/zoom with only *optional* rotation,
 * and a fixed angle is what reads immediately as a strategy-game map
 * instead of a free 3D viewer. Tune this constant (and AZIMUTH_RADIANS
 * below) to taste — this was picked to be "clearly 3D and oblique", not
 * matched pixel-for-pixel against the reference image, which wasn't
 * possible to verify visually in this sandbox. */
const ELEVATION_ANGLE_DEGREES = 58;
const ELEVATION_ANGLE_RADIANS = (ELEVATION_ANGLE_DEGREES * Math.PI) / 180;

const MIN_DISTANCE = 18;
const MAX_DISTANCE = 220;
const DEFAULT_DISTANCE = 110;

/** How far past the terrain plane's own edge panning is allowed to go, as
 * a fraction of the plane's half-width/half-height — small enough that
 * the plane never scrolls completely out of view, generous enough that
 * coastal regions near the edge aren't stuck against the viewport edge. */
const PAN_OVERSHOOT_FRACTION = 0.15;

export class MapCamera3D {
  readonly camera: THREE.PerspectiveCamera;

  private targetX = 0;
  private targetZ = 0;
  private distance = DEFAULT_DISTANCE;

  private readonly maxTargetX: number;
  private readonly maxTargetZ: number;

  constructor(aspect: number, planeWidth: number, planeHeight: number) {
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.5, 600);
    this.maxTargetX = (planeWidth / 2) * (1 + PAN_OVERSHOOT_FRACTION);
    this.maxTargetZ = (planeHeight / 2) * (1 + PAN_OVERSHOOT_FRACTION);
    this.updateCameraTransform();
  }

  private updateCameraTransform(): void {
    const horizontal = this.distance * Math.cos(ELEVATION_ANGLE_RADIANS);
    const vertical = this.distance * Math.sin(ELEVATION_ANGLE_RADIANS);
    // Fixed azimuth: camera sits offset toward +Z from its target and
    // looks back toward -Z. No rotation control, so this vector is a
    // constant — see the module doc comment above.
    this.camera.position.set(this.targetX, vertical, this.targetZ + horizontal);
    this.camera.lookAt(this.targetX, 0, this.targetZ);
  }

  /** Directly seeds the pan target (e.g. the initial camera focus), still
   * clamped to the same bounds `pan()` uses. */
  setTarget(x: number, z: number): void {
    this.targetX = Math.max(-this.maxTargetX, Math.min(this.maxTargetX, x));
    this.targetZ = Math.max(-this.maxTargetZ, Math.min(this.maxTargetZ, z));
    this.updateCameraTransform();
  }

  resize(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  /** Pans by a raw screen-pixel delta. `viewportHeight` is used to scale
   * the drag into world units consistently across viewport sizes; the
   * vertical (dyScreen) component is corrected for the camera's oblique
   * angle so vertical drags don't feel slower than horizontal ones. This
   * is a reasonable approximation, not an exact ground-plane raycast. */
  pan(dxScreen: number, dyScreen: number, viewportHeight: number): void {
    const worldPerPixel = (this.distance / viewportHeight) * 1.15;
    const verticalCorrection = 1 / Math.sin(ELEVATION_ANGLE_RADIANS);

    this.targetX -= dxScreen * worldPerPixel;
    this.targetZ -= dyScreen * worldPerPixel * verticalCorrection;

    this.targetX = Math.max(-this.maxTargetX, Math.min(this.maxTargetX, this.targetX));
    this.targetZ = Math.max(-this.maxTargetZ, Math.min(this.maxTargetZ, this.targetZ));

    this.updateCameraTransform();
  }

  /** Zooms by a signed amount (positive = zoom out). Clamped to sensible
   * min/max distances, per the brief's "sensible zoom limits". */
  zoom(delta: number): void {
    this.distance = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, this.distance + delta));
    this.updateCameraTransform();
  }

  /** 0 (fully zoomed in) – 1 (fully zoomed out) — the input the LOD system
   * (label density, fog strength, etc.) reads to decide what to show. */
  get zoomFraction(): number {
    return (this.distance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE);
  }

  reset(): void {
    this.targetX = 0;
    this.targetZ = 0;
    this.distance = DEFAULT_DISTANCE;
    this.updateCameraTransform();
  }
}
