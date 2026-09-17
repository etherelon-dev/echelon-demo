export type TerrainTypeId =
  | "land"
  | "plains"
  | "mountains"
  | "forest"
  | "swamp"
  | "tundra"
  | "sand"
  | "desert"
  | "lake"
  | "river";

export interface TerrainTypeDefinition {
  id: TerrainTypeId;
  name: string;
  /** Flat fill (or stroke, for "line") color — no gradients/shading. */
  color: string;
  /** How this terrain type is drawn: a filled region, a filled water body,
   * or a stroked line. */
  layer: "region" | "water" | "line";
}

/**
 * Centralized terrain classification — every color used on the map lives
 * here, nowhere else. Renderers (TerrainLayer, LakeLayer, RiverLayer) just
 * look up `TERRAIN_TYPES[id].color`; they never hardcode a terrain color
 * themselves. This is what lets terrain colors/definitions change later
 * (movement modifiers, resource generation, etc.) without touching any
 * renderer.
 *
 * Flat colors only, restrained grand-strategy palette — no neon, no
 * gradients, no glow, no realistic textures.
 */
export const TERRAIN_TYPES: Record<TerrainTypeId, TerrainTypeDefinition> = {
  land: { id: "land", name: "Land", color: "#3B4A34", layer: "region" },
  plains: { id: "plains", name: "Plains", color: "#6B7A45", layer: "region" },
  mountains: { id: "mountains", name: "Mountains", color: "#6B5643", layer: "region" },
  forest: { id: "forest", name: "Forest", color: "#223318", layer: "region" },
  swamp: { id: "swamp", name: "Swamp", color: "#4A4A2E", layer: "region" },
  tundra: { id: "tundra", name: "Tundra", color: "#8B9686", layer: "region" },
  sand: { id: "sand", name: "Sand", color: "#CBB177", layer: "region" },
  desert: { id: "desert", name: "Desert", color: "#B08048", layer: "region" },
  lake: { id: "lake", name: "Lake", color: "#1E3548", layer: "water" },
  river: { id: "river", name: "River", color: "#3E7C9A", layer: "line" }
};
