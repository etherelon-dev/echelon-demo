import { describe, expect, it } from "vitest";
import { migrateBundle } from "../migrations";
import { createArtisio, SIMULATION_START_MINUTE } from "../characterFactory";
import { HOME_COUNTRY_ID, DEFAULT_CITY_ID } from "../worldCatalog";
import type { SimulationBundle } from "@/types/simulation";

/**
 * Simulasikan bundle hasil save Fase 3 (schemaVersion 4): `investments`
 * belum pernah ada, `location.countryId/cityId` masih null (bentuk field
 * ini sejak diperkenalkan di Fase 1, sebelum benar-benar dipakai di Fase 4).
 */
function makeLegacyV4Bundle(): SimulationBundle {
  const character = createArtisio(SIMULATION_START_MINUTE);
  const legacyCharacter = {
    ...character,
    location: { countryId: null, cityId: null },
  } as unknown as Record<string, unknown>;
  delete legacyCharacter.investments;

  return {
    state: {
      saveId: "legacy-save",
      nowMinute: SIMULATION_START_MINUTE,
      characterId: character.id,
      schemaVersion: 4,
      recentTurns: [],
    },
    character: legacyCharacter as unknown as SimulationBundle["character"],
  };
}

describe("migrateBundle — v4 -> v5 (Fase 4)", () => {
  it("menambahkan investments kosong kalau belum ada", () => {
    const migrated = migrateBundle(makeLegacyV4Bundle());
    expect(migrated.character.investments).toEqual([]);
  });

  it("men-default-kan lokasi ke Indonesia/Jakarta kalau masih null", () => {
    const migrated = migrateBundle(makeLegacyV4Bundle());
    expect(migrated.character.location.countryId).toBe(HOME_COUNTRY_ID);
    expect(migrated.character.location.cityId).toBe(DEFAULT_CITY_ID);
  });

  it("menaikkan schemaVersion ke CURRENT_SCHEMA_VERSION", () => {
    const migrated = migrateBundle(makeLegacyV4Bundle());
    expect(migrated.state.schemaVersion).toBe(5);
  });

  it("tidak mengubah lokasi yang sudah terisi", () => {
    const character = createArtisio(SIMULATION_START_MINUTE);
    const bundle: SimulationBundle = {
      state: {
        saveId: "s2",
        nowMinute: SIMULATION_START_MINUTE,
        characterId: character.id,
        schemaVersion: 5,
        recentTurns: [],
      },
      character,
    };
    const migrated = migrateBundle(bundle);
    expect(migrated.character.location).toEqual(character.location);
  });

  it("idempotent — memigrasi bundle yang sudah termutakhirkan tidak mengubah apa pun", () => {
    const character = createArtisio(SIMULATION_START_MINUTE);
    const bundle: SimulationBundle = {
      state: {
        saveId: "s3",
        nowMinute: SIMULATION_START_MINUTE,
        characterId: character.id,
        schemaVersion: 5,
        recentTurns: [],
      },
      character,
    };
    const once = migrateBundle(bundle);
    const twice = migrateBundle(once);
    expect(twice).toEqual(once);
  });
});
