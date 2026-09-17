import { z } from "zod";
import type { AIActionResult } from "@/types/ai";
import type { ValidationResult } from "@/types/common";

/**
 * Skema keluaran AI (MASTER_PROMPT.md #11, #59). Ini adalah PINTU GERBANG
 * PERTAMA sebelum data AI menyentuh simulation engine — bentuk yang tidak
 * lolos di sini ditolak mentah-mentah, sebelum sempat diperiksa lebih
 * lanjut oleh lib/simulation/effects.ts (yang memvalidasi ISI-nya, mis.
 * apakah path diizinkan / uang cukup).
 */

const EffectOperationSchema = z.enum(["add", "subtract", "set", "multiply"]);

const SimulationEffectSchema = z.object({
  path: z.string().min(1).max(64),
  operation: EffectOperationSchema,
  value: z.number().finite(),
  reason: z.string().max(200).optional(),
});

const EventSeveritySchema = z.enum(["info", "minor", "major", "critical"]);

const SimulationEventOutcomeSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(600),
  severity: EventSeveritySchema,
  source: z.enum(["player_action", "world_random"]).optional(),
});

const AIActionSchema = z.object({
  intent: z.string().min(1).max(80),
  target: z.string().max(120).optional(),
  parameters: z.record(z.unknown()).optional(),
});

export const AIActionResultSchema = z.object({
  action: AIActionSchema,
  timeAdvanceMinutes: z
    .number()
    .finite()
    .min(0)
    .max(60 * 24 * 31),
  effects: z.array(SimulationEffectSchema).max(12),
  events: z.array(SimulationEventOutcomeSchema).max(6),
  narrative: z.object({
    title: z.string().min(1).max(120),
    text: z.string().min(1).max(2500),
  }),
  rejected: z.boolean().optional(),
  rejectionReason: z.string().max(400).optional(),
});

/**
 * Mem-parse & memvalidasi bentuk keluaran AI. TIDAK memeriksa apakah effect
 * secara SEMANTIK masuk akal (path di whitelist, uang cukup, dst) — itu
 * tugas lib/simulation/effects.ts::validateEffects(), yang dipanggil
 * setelah ini oleh lib/simulation/engine.ts.
 */
export function parseAIActionResult(raw: unknown): ValidationResult<AIActionResult> {
  const parsed = AIActionResultSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const location = firstIssue ? firstIssue.path.join(".") || "(root)" : "(root)";
    const message = firstIssue?.message ?? "Bentuk keluaran AI tidak sesuai skema.";
    return { valid: false, reason: `Keluaran AI tidak valid pada "${location}": ${message}` };
  }
  return { valid: true, value: parsed.data as AIActionResult };
}
