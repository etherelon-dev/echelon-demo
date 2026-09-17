import type { AIProviderId } from "@/types/ai";

/**
 * Abstraksi provider AI. Engine/agent TIDAK PERNAH bergantung pada
 * provider tertentu — hanya pada interface ini. Ini yang memungkinkan
 * pemain memilih Agent Claude / Gemini / ChatGPT secara bebas, dan
 * menukarnya kapan pun (termasuk di tengah permainan) tanpa mengubah
 * lib/ai/agent.ts sama sekali.
 */
export interface AIGenerateInput {
  systemPrompt: string;
  userPrompt: string;
  /** Token API milik pemain sendiri (disimpan lokal di IndexedDB lewat lib/ai/apiKeyStore.ts, tidak pernah ikut export save). */
  apiKey?: string;
}

export interface AIProvider {
  id: AIProviderId;
  /** Nama tampilan di pemilih Agent AI, mis. "Claude (Anthropic)". */
  label: string;
  /** Mengembalikan teks mentah dari model — parsing/validasi JSON terjadi di lib/ai/agent.ts. */
  generateAction(input: AIGenerateInput): Promise<string>;
}
