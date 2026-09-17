import type { AIGenerateInput } from "./types";
import type { AIProviderId } from "@/types/ai";

/**
 * PENTING: token API rahasia TIDAK PERNAH dipanggil langsung dari browser
 * ke api.anthropic.com / api.openai.com / generativelanguage.googleapis.com.
 * Setiap provider (anthropicProvider.ts, openaiProvider.ts, googleProvider.ts)
 * memanggil route Next.js kita sendiri (`/api/ai`), yang berjalan di server
 * dan yang menyimpan/meneruskan kunci:
 * - dari `process.env.<PROVIDER>_API_KEY` (lihat `.env.example`), ATAU
 * - kunci milik pemain sendiri, kalau mereka mengisinya di panel
 *   "Pengaturan Agent AI" — kunci itu disimpan di IndexedDB LOKAL milik
 *   pemain (lib/ai/apiKeyStore.ts), dikirim lewat header per-request, dan
 *   TIDAK PERNAH ikut ter-export bersama save game.
 *
 * Route ini TIDAK PERNAH mengembalikan token API ke client, hanya teks
 * hasil generate model.
 */
export async function callAIRoute(providerId: AIProviderId, input: AIGenerateInput): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(input.apiKey ? { "x-ai-api-key": input.apiKey } : {}),
    },
    body: JSON.stringify({
      providerId,
      systemPrompt: input.systemPrompt,
      userPrompt: input.userPrompt,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      typeof body === "object" && body && "error" in body
        ? String((body as { error: unknown }).error)
        : `Permintaan AI gagal (${res.status}).`;
    throw new Error(message);
  }

  const data = (await res.json()) as { text?: string };
  if (!data.text) {
    throw new Error("Respons AI kosong.");
  }
  return data.text;
}
