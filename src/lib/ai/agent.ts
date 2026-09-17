import type { SimulationBundle } from "@/types/simulation";
import type { AgentRunResult } from "@/types/ai";
import { buildAIContext } from "./contextBuilder";
import { buildSystemPrompt, buildUserPrompt } from "./prompt";
import { parseAIActionResult } from "./schema";
import { extractJson } from "./extractJson";
import { getAIProvider } from "./providers";
import type { AIProviderId } from "@/types/ai";

/**
 * Satu-satunya pintu masuk lapisan AI (MASTER_PROMPT.md #8). Alurnya:
 * Context Builder -> Prompt -> Provider -> Ekstraksi JSON -> Validasi Skema.
 * Hasil di sini BELUM final — masih harus lewat
 * lib/simulation/engine.ts::applyAIActionResult() supaya effect-nya
 * diperiksa ulang secara SEMANTIK (path diizinkan, uang cukup, dst)
 * sebelum benar-benar diterapkan ke state.
 */
export async function runAgent(
  bundle: SimulationBundle,
  playerInput: string,
  options: { providerId?: AIProviderId; apiKey?: string } = {}
): Promise<AgentRunResult> {
  const trimmedInput = playerInput.trim();
  if (!trimmedInput) {
    return { ok: false, error: "Perintah tidak boleh kosong." };
  }
  if (trimmedInput.length > 500) {
    return { ok: false, error: "Perintah terlalu panjang (maks 500 karakter)." };
  }

  const provider = getAIProvider(options.providerId);
  const context = buildAIContext(bundle);
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(trimmedInput, context);

  let rawText: string;
  try {
    rawText = await provider.generateAction({
      systemPrompt,
      userPrompt,
      apiKey: options.apiKey,
    });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Provider AI gagal merespons." };
  }

  const extracted = extractJson(rawText);
  if (!extracted.ok) {
    return { ok: false, error: extracted.error };
  }

  const validated = parseAIActionResult(extracted.value);
  if (!validated.valid) {
    return { ok: false, error: validated.reason };
  }

  return { ok: true, result: validated.value };
}
