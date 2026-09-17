import type { AIProviderId } from "@/types/ai";
import type { AIProvider } from "./types";
import { anthropicProvider } from "./anthropicProvider";
import { googleProvider } from "./googleProvider";
import { openaiProvider } from "./openaiProvider";

/**
 * Registry provider. Pemain memilih salah satu dari TIGA Agent AI —
 * Claude, Gemini, atau ChatGPT — lewat panel "Pengaturan Agent AI"
 * (components/game/AgentSettingsPanel.tsx), dan bisa menukarnya kapan
 * pun termasuk di tengah permainan (lib/ai/apiKeyStore.ts). Menambah
 * provider baru (model lokal/custom endpoint) di fase berikutnya
 * tinggal menambah satu implementasi baru + entri di sini — tidak
 * perlu mengubah lib/ai/agent.ts atau UI.
 */
const PROVIDERS: Partial<Record<AIProviderId, AIProvider>> = {
  anthropic: anthropicProvider,
  google: googleProvider,
  openai: openaiProvider,
  // local: localModelProvider,    // TODO Fase 2 lanjutan
  // custom: customProvider,       // TODO Fase 2 lanjutan
};

export const DEFAULT_PROVIDER_ID: AIProviderId = "anthropic";

export function getAIProvider(id: AIProviderId = DEFAULT_PROVIDER_ID): AIProvider {
  const provider = PROVIDERS[id];
  if (!provider) {
    throw new Error(`Agent AI "${id}" belum tersedia di build ini.`);
  }
  return provider;
}

export function listAvailableProviders(): AIProvider[] {
  return Object.values(PROVIDERS).filter((p): p is AIProvider => Boolean(p));
}
