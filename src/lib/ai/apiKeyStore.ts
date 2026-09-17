import { getSetting, putSetting } from "@/lib/database/repositories/settingsRepository";
import type { AIProviderId } from "@/types/ai";

/**
 * Penyimpanan token API Agent AI milik pemain (Fase 2, desain fleksibel
 * sesuai permintaan): pemain bisa memilih salah satu dari 3 Agent
 * (Claude/Gemini/ChatGPT), menyimpan LEBIH DARI SATU token berlabel per
 * Agent (mis. beberapa token Claude berbeda), dan menukar Agent maupun
 * token aktif KAPAN SAJA — termasuk di tengah permainan yang sedang
 * berjalan — tanpa perlu memulai ulang.
 *
 * Disimpan di store "settings" (key -> unknown) yang generik, BUKAN
 * bagian dari save game: tidak pernah ikut ter-export lewat
 * `exportGame()` / `ExportedSave`, jadi token tidak bisa bocor saat save
 * dibagikan ke orang lain.
 */

const KEY_PROFILES_SETTING = "ai:keyProfiles";
const ACTIVE_SELECTION_SETTING = "ai:activeSelection";

export interface ApiKeyProfile {
  id: string;
  providerId: AIProviderId;
  /** Label bebas dari pemain, mis. "Token Claude kerja" — supaya mudah membedakan token yang mana saat menukar. */
  label: string;
  apiKey: string;
  createdAt: string;
}

export interface ActiveAgentSelection {
  providerId: AIProviderId;
  /** null = pakai token server (.env) untuk provider ini, bukan token pemain sendiri. */
  profileId: string | null;
}

function generateProfileId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `key_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export async function listApiKeyProfiles(): Promise<ApiKeyProfile[]> {
  return (await getSetting<ApiKeyProfile[]>(KEY_PROFILES_SETTING)) ?? [];
}

export async function listApiKeyProfilesForProvider(providerId: AIProviderId): Promise<ApiKeyProfile[]> {
  const all = await listApiKeyProfiles();
  return all.filter((p) => p.providerId === providerId);
}

/** Menambah token baru untuk sebuah provider. Tidak otomatis mengaktifkannya — panggil `setActiveSelection()` terpisah kalau ingin langsung dipakai. */
export async function addApiKeyProfile(
  providerId: AIProviderId,
  label: string,
  apiKey: string
): Promise<ApiKeyProfile> {
  const trimmedKey = apiKey.trim();
  if (!trimmedKey) {
    throw new Error("Token API tidak boleh kosong.");
  }
  const profile: ApiKeyProfile = {
    id: generateProfileId(),
    providerId,
    label: label.trim() || `Token ${providerId}`,
    apiKey: trimmedKey,
    createdAt: new Date().toISOString(),
  };
  const all = await listApiKeyProfiles();
  await putSetting(KEY_PROFILES_SETTING, [...all, profile]);
  return profile;
}

export async function renameApiKeyProfile(id: string, label: string): Promise<void> {
  const all = await listApiKeyProfiles();
  const next = all.map((p) => (p.id === id ? { ...p, label: label.trim() || p.label } : p));
  await putSetting(KEY_PROFILES_SETTING, next);
}

/** Menghapus satu token tersimpan. Kalau token itu sedang aktif, seleksi aktif untuk providernya dikembalikan ke "pakai kunci server". */
export async function removeApiKeyProfile(id: string): Promise<void> {
  const all = await listApiKeyProfiles();
  const removed = all.find((p) => p.id === id);
  await putSetting(
    KEY_PROFILES_SETTING,
    all.filter((p) => p.id !== id)
  );

  if (!removed) return;
  const active = await getActiveSelection();
  if (active?.profileId === id) {
    await setActiveSelection({ providerId: active.providerId, profileId: null });
  }
}

export async function getActiveSelection(): Promise<ActiveAgentSelection | undefined> {
  return getSetting<ActiveAgentSelection>(ACTIVE_SELECTION_SETTING);
}

/**
 * Mengatur Agent + token yang aktif. Dipanggil kapan pun pemain menukar
 * pilihan lewat panel Pengaturan Agent AI — termasuk saat sedang di
 * tengah permainan. Perintah berikutnya di kotak perintah langsung
 * memakai seleksi baru ini (lib/state/gameStore.ts membaca ulang seleksi
 * setiap kali giliran baru dikirim, bukan menyimpannya di memori).
 */
export async function setActiveSelection(selection: ActiveAgentSelection): Promise<void> {
  await putSetting(ACTIVE_SELECTION_SETTING, selection);
}

/** Mengambil token API aktif (kalau pemain memilih memakai token miliknya sendiri, bukan kunci server default). */
export async function getActiveApiKey(): Promise<string | undefined> {
  const active = await getActiveSelection();
  if (!active?.profileId) return undefined;
  const profiles = await listApiKeyProfiles();
  return profiles.find((p) => p.id === active.profileId)?.apiKey;
}
