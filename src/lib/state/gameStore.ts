import { create } from "zustand";
import type { SimulationBundle } from "@/types/simulation";
import type { AIProviderId } from "@/types/ai";
import type { CharacterCreationInput } from "@/types/character";
import {
  advanceTimeQuick,
  applyAIActionResult,
  performMeal,
  performWorkShift,
  performApplyJob,
  performResignJob,
  performPurchase,
  performSale,
  performBuyAsset,
  performSellAsset,
  performRelocate,
  type StructuredActionOutcome,
} from "@/lib/simulation/engine";
import { saveGame, startNewGame, loadGame } from "@/lib/simulation/saveService";
import { runAgent } from "@/lib/ai/agent";
import { getActiveApiKey, getActiveSelection } from "@/lib/ai/apiKeyStore";
import { DEFAULT_PROVIDER_ID } from "@/lib/ai/providers";

/**
 * Store game aktif di memori (Fase 2). Tambahan dari Fase 1:
 * - `activeProviderId`: Agent AI yang sedang dipakai (Claude/Gemini/ChatGPT).
 *   Dibaca ulang dari lib/ai/apiKeyStore.ts setiap kali save dibuka, dan
 *   diperbarui langsung oleh AgentSettingsPanel — sehingga menukar Agent
 *   atau token di tengah permainan berlaku SEKETIKA untuk perintah
 *   berikutnya, tanpa perlu memulai ulang save.
 * - `submitCommand`: satu-satunya jalur dari kotak perintah bahasa natural
 *   ke AI Agent lalu ke simulation engine (lib/simulation/engine.ts).
 */
interface GameStoreState {
  bundle: SimulationBundle | null;
  isLoading: boolean;
  error: string | null;

  activeProviderId: AIProviderId;
  isSubmittingCommand: boolean;
  lastTurnError: string | null;

  newGame: (input: CharacterCreationInput) => Promise<void>;
  continueGame: (saveId: string) => Promise<void>;
  advance: (minutes: number, label?: string) => Promise<void>;
  submitCommand: (playerInput: string) => Promise<void>;
  eatMeal: () => Promise<void>;
  workShift: () => Promise<void>;
  applyForJob: (jobId: string) => Promise<void>;
  resignJob: () => Promise<void>;
  buyProduct: (productId: string, quantity: number) => Promise<void>;
  sellItem: (inventoryItemId: string) => Promise<void>;
  /** Fase 4 — Pasar. */
  buyAsset: (assetId: string, quantity: number) => Promise<void>;
  sellAsset: (holdingId: string, quantity: number) => Promise<void>;
  /** Fase 4 — Dunia (pindah kota). */
  relocate: (cityId: string) => Promise<void>;
  setActiveProviderId: (id: AIProviderId) => void;
  persist: () => Promise<void>;
}

async function resolveActiveProviderId(): Promise<AIProviderId> {
  const selection = await getActiveSelection();
  return selection?.providerId ?? DEFAULT_PROVIDER_ID;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  bundle: null,
  isLoading: false,
  error: null,

  activeProviderId: DEFAULT_PROVIDER_ID,
  isSubmittingCommand: false,
  lastTurnError: null,

  newGame: async (input: CharacterCreationInput) => {
    set({ isLoading: true, error: null });
    try {
      const bundle = await startNewGame(input);
      const activeProviderId = await resolveActiveProviderId();
      set({ bundle, isLoading: false, activeProviderId, lastTurnError: null });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  continueGame: async (saveId: string) => {
    set({ isLoading: true, error: null });
    try {
      const bundle = await loadGame(saveId);
      if (!bundle) throw new Error("Save tidak ditemukan");
      const activeProviderId = await resolveActiveProviderId();
      set({ bundle, isLoading: false, activeProviderId, lastTurnError: null });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  /** Lompatan waktu tanpa perintah (mis. pintasan "Makan/Kerja/Tidur").
   * Tetap lewat `advanceTimeQuick`, jadi bencana/kelalaian tetap berlaku. */
  advance: async (minutes: number, label = "Waktu berlalu") => {
    const current = get().bundle;
    if (!current) return;
    const { bundle } = advanceTimeQuick(current, minutes, label);
    set({ bundle });
    await saveGame(bundle); // autosave setiap aksi (MASTER_PROMPT.md #6)
  },

  /**
   * Alur utama Fase 2: kotak perintah -> AI Agent -> simulation engine.
   * Token & Agent aktif dibaca ULANG dari apiKeyStore setiap kali giliran
   * dikirim (bukan disimpan di memori) — supaya penukaran token/Agent di
   * tengah permainan langsung berlaku untuk perintah berikutnya.
   */
  submitCommand: async (playerInput: string) => {
    const current = get().bundle;
    if (!current) return;

    set({ isSubmittingCommand: true, lastTurnError: null });
    try {
      const [selection, apiKey] = await Promise.all([getActiveSelection(), getActiveApiKey()]);
      const providerId = selection?.providerId ?? get().activeProviderId;

      const agentRun = await runAgent(current, playerInput, { providerId, apiKey });
      if (!agentRun.ok) {
        set({ isSubmittingCommand: false, lastTurnError: agentRun.error });
        return;
      }

      const outcome = applyAIActionResult(current, playerInput, agentRun.result);
      if (!outcome.ok) {
        set({ isSubmittingCommand: false, lastTurnError: outcome.error });
        return;
      }

      set({
        bundle: outcome.bundle,
        isSubmittingCommand: false,
        lastTurnError: null,
        activeProviderId: providerId,
      });
      await saveGame(outcome.bundle); // autosave setiap aksi (MASTER_PROMPT.md #6)
    } catch (err) {
      set({
        isSubmittingCommand: false,
        lastTurnError: err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.",
      });
    }
  },

  /** Dipanggil AgentSettingsPanel setelah menukar Agent/token aktif. */
  setActiveProviderId: (id: AIProviderId) => set({ activeProviderId: id }),

  eatMeal: async () => runStructuredAction(set, get, (b) => performMeal(b)),
  workShift: async () => runStructuredAction(set, get, (b) => performWorkShift(b)),
  applyForJob: async (jobId: string) => runStructuredAction(set, get, (b) => performApplyJob(b, jobId)),
  resignJob: async () => runStructuredAction(set, get, (b) => performResignJob(b)),
  buyProduct: async (productId: string, quantity: number) =>
    runStructuredAction(set, get, (b) => performPurchase(b, productId, quantity)),
  sellItem: async (inventoryItemId: string) =>
    runStructuredAction(set, get, (b) => performSale(b, inventoryItemId)),
  buyAsset: async (assetId: string, quantity: number) =>
    runStructuredAction(set, get, (b) => performBuyAsset(b, assetId, quantity)),
  sellAsset: async (holdingId: string, quantity: number) =>
    runStructuredAction(set, get, (b) => performSellAsset(b, holdingId, quantity)),
  relocate: async (cityId: string) => runStructuredAction(set, get, (b) => performRelocate(b, cityId)),

  persist: async () => {
    const current = get().bundle;
    if (!current) return;
    await saveGame(current);
  },
}));

/**
 * Fase 3: pola bersama untuk aksi terstruktur di luar AI Agent (Makan,
 * Kerja, Toko, Karier) — semuanya memanggil satu fungsi engine.ts yang
 * mengembalikan `StructuredActionOutcome`, lalu di sini cukup: set bundle
 * kalau berhasil, atau lastTurnError kalau gagal, dan autosave.
 */
async function runStructuredAction(
  set: (partial: Partial<GameStoreState>) => void,
  get: () => GameStoreState,
  action: (bundle: SimulationBundle) => StructuredActionOutcome
): Promise<void> {
  const current = get().bundle;
  if (!current) return;
  set({ lastTurnError: null });
  const outcome = action(current);
  if (!outcome.ok) {
    set({ lastTurnError: outcome.error });
    return;
  }
  set({ bundle: outcome.bundle });
  await saveGame(outcome.bundle);
}
