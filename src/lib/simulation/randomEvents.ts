import type { Character } from "@/types/character";
import type { SimulationEffect, SimulationEventOutcome } from "@/types/ai";
import type { RandomFn } from "./rng";
import { applyEffects } from "./effects";

/**
 * Sistem peristiwa acak & konsekuensi kelalaian (permintaan pengguna:
 * "realistis, bisa menghadapi bencana, tanpa plot armor").
 *
 * Dua sumber konsekuensi di sini, KEDUANYA di luar kendali AI:
 * 1. `neglectEffects()` — kerusakan kesehatan deterministik akibat
 *    kebutuhan yang dibiarkan kritis (kelaparan, kelelahan, stres kronis).
 * 2. `rollDisasterEvents()` — peristiwa acak dunia (sakit mendadak,
 *    kecelakaan, kecopetan, sesekali rezeki baik) yang bisa terjadi
 *    kapan saja waktu berjalan, terlepas dari perintah pemain.
 *
 * Engine (lib/simulation/engine.ts) memanggil keduanya setiap kali waktu
 * maju — bukan hanya saat giliran yang dipicu AI.
 */

const NEGLECT_HUNGER_THRESHOLD = 5;
const NEGLECT_ENERGY_THRESHOLD = 5;
const NEGLECT_STRESS_THRESHOLD = 90;

const STARVATION_HEALTH_LOSS_PER_HOUR = 1.5;
const EXHAUSTION_HEALTH_LOSS_PER_HOUR = 1.0;
const CHRONIC_STRESS_HEALTH_LOSS_PER_HOUR = 0.4;

/**
 * Kerusakan kesehatan deterministik akibat kebutuhan kritis yang
 * dibiarkan. Dihitung dari kondisi character SEBELUM waktu berlalu
 * (pendekatan konservatif — cukup akurat untuk rentang waktu pendek
 * per aksi, dan menghindari perlunya integrasi bertahap).
 */
export function neglectEffects(
  needsBefore: Character["needs"],
  hoursElapsed: number,
  characterName: string
): { effects: SimulationEffect[]; events: SimulationEventOutcome[] } {
  let healthLoss = 0;
  const causes: string[] = [];

  if (needsBefore.hunger <= NEGLECT_HUNGER_THRESHOLD) {
    healthLoss += STARVATION_HEALTH_LOSS_PER_HOUR * hoursElapsed;
    causes.push("kelaparan berkepanjangan");
  }
  if (needsBefore.energy <= NEGLECT_ENERGY_THRESHOLD) {
    healthLoss += EXHAUSTION_HEALTH_LOSS_PER_HOUR * hoursElapsed;
    causes.push("kelelahan ekstrem");
  }
  if (needsBefore.stress >= NEGLECT_STRESS_THRESHOLD) {
    healthLoss += CHRONIC_STRESS_HEALTH_LOSS_PER_HOUR * hoursElapsed;
    causes.push("stres kronis");
  }

  if (healthLoss <= 0) return { effects: [], events: [] };

  return {
    effects: [
      {
        path: "needs.health",
        operation: "subtract",
        value: Math.round(healthLoss * 10) / 10,
        reason: causes.join(", "),
      },
    ],
    events: [
      {
        title: "Tubuh mulai jebol",
        description: `Kondisi tubuh ${characterName} memburuk akibat ${causes.join(
          " dan "
        )}. Ini bukan pilihan — ini akibat langsung dari kebutuhan dasar yang dibiarkan kritis.`,
        severity: "major",
        source: "world_random",
      },
    ],
  };
}

interface DisasterDefinition {
  id: string;
  title: string;
  /** Boleh memuat placeholder literal "{nama}" — diganti nama karakter saat event dibuat. */
  description: string;
  severity: SimulationEventOutcome["severity"];
  /** Peluang kejadian per jam yang berlalu (independen, dicek per jam bulat). */
  probabilityPerHour: number;
  /** Menentukan apakah peristiwa ini mungkin terjadi pada kondisi karakter saat ini. */
  eligible: (character: Character) => boolean;
  /** Menghasilkan effect nyata — boleh memakai rng untuk variasi besaran. */
  rollEffects: (character: Character, rng: RandomFn) => SimulationEffect[];
}

const DISASTER_CATALOG: DisasterDefinition[] = [
  {
    id: "sakit_mendadak",
    title: "Sakit mendadak",
    description:
      "{nama} jatuh sakit tanpa peringatan — demam tinggi memaksanya berhenti dari apa pun yang sedang dikerjakan.",
    severity: "major",
    probabilityPerHour: 0.0006,
    eligible: (c) => c.needs.health > 0,
    rollEffects: (_c, rng) => [
      {
        path: "needs.health",
        operation: "subtract",
        value: Math.round(8 + rng() * 14),
        reason: "sakit mendadak",
      },
      {
        path: "needs.energy",
        operation: "subtract",
        value: Math.round(5 + rng() * 10),
        reason: "sakit mendadak",
      },
    ],
  },
  {
    id: "kecelakaan_kecil",
    title: "Kecelakaan kecil",
    description:
      "Sebuah kecelakaan kecil terjadi di jalan — cukup untuk melukai badan dan menguras sedikit tabungan untuk berobat.",
    severity: "major",
    probabilityPerHour: 0.0003,
    eligible: (c) => c.needs.health > 0,
    rollEffects: (c, rng) => {
      const medicalCost = Math.min(c.finance.cash, Math.round(15_000 + rng() * 120_000));
      const effects: SimulationEffect[] = [
        {
          path: "needs.health",
          operation: "subtract",
          value: Math.round(5 + rng() * 12),
          reason: "kecelakaan kecil",
        },
      ];
      if (medicalCost > 0) {
        effects.push({
          path: "finance.cash",
          operation: "subtract",
          value: medicalCost,
          reason: "biaya berobat setelah kecelakaan",
        });
      }
      return effects;
    },
  },
  {
    id: "kecopetan",
    title: "Kecopetan",
    description: "Dompet {nama} dicopet di tengah keramaian sebelum sempat disadari.",
    severity: "minor",
    probabilityPerHour: 0.0004,
    eligible: (c) => c.finance.cash >= 20_000,
    rollEffects: (c, rng) => {
      const loss = Math.round(c.finance.cash * (0.1 + rng() * 0.25));
      return [
        {
          path: "finance.cash",
          operation: "subtract",
          value: Math.min(c.finance.cash, loss),
          reason: "kecopetan",
        },
      ];
    },
  },
  {
    id: "rezeki_tak_terduga",
    title: "Rezeki tak terduga",
    description: "Sesuatu yang kecil tapi menyenangkan terjadi — bukti bahwa dunia ini tidak selalu kejam.",
    severity: "info",
    probabilityPerHour: 0.0003,
    eligible: () => true,
    rollEffects: (_c, rng) => [
      {
        path: "finance.cash",
        operation: "add",
        value: Math.round(5_000 + rng() * 45_000),
        reason: "rezeki tak terduga",
      },
      {
        path: "needs.happiness",
        operation: "add",
        value: Math.round(2 + rng() * 4),
        reason: "rezeki tak terduga",
      },
    ],
  },
];

/** Batas iterasi per-jam untuk lompatan waktu yang sangat panjang (mis. uji "30 hari") — menjaga performa. */
const MAX_HOURLY_ROLLS = 24 * 45;

/**
 * Menggulirkan kemungkinan bencana/keberuntungan acak untuk rentang waktu
 * yang baru berlalu. Deterministik terhadap `rng` yang diberikan
 * (lib/simulation/rng.ts) — pemanggil bertanggung jawab menyediakan RNG
 * yang sudah di-seed dari saveId + nowMinute supaya hasilnya reproducible.
 */
export function rollDisasterEvents(
  character: Character,
  hoursElapsed: number,
  rng: RandomFn
): { effects: SimulationEffect[]; events: SimulationEventOutcome[] } {
  if (hoursElapsed <= 0 || character.vitalStatus !== "alive") {
    return { effects: [], events: [] };
  }

  const wholeHours = Math.min(Math.round(hoursElapsed), MAX_HOURLY_ROLLS);
  const effects: SimulationEffect[] = [];
  const events: SimulationEventOutcome[] = [];
  // `draft` dibawa maju per jam supaya kelayakan (mis. cukup uang untuk
  // dicopet) dan besaran effect memakai kondisi terkini, bukan snapshot basi.
  let draft = character;

  for (let hour = 0; hour < wholeHours; hour += 1) {
    if (draft.vitalStatus !== "alive") break;
    for (const disaster of DISASTER_CATALOG) {
      if (!disaster.eligible(draft)) continue;
      if (rng() < disaster.probabilityPerHour) {
        const rolled = disaster.rollEffects(draft, rng);
        effects.push(...rolled);
        events.push({
          title: disaster.title,
          description: disaster.description.replace(/\{nama\}/g, draft.name),
          severity: disaster.severity,
          source: "world_random",
        });
        draft = applyEffects(draft, rolled);
        // Satu bencana besar per jam sudah cukup dramatis — lanjut ke jam berikutnya.
        break;
      }
    }
  }

  return { effects, events };
}
