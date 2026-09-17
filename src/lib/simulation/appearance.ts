/**
 * Katalog "kostum"/penampilan awal karakter, dipilih pemain saat membuat
 * hidup baru (components/character/CharacterCreationForm.tsx). Estyalife
 * bertema buku catatan (ledger), bukan game bersprite, jadi penampilan
 * direpresentasikan sebagai emoji + label + deskripsi singkat — dipakai di
 * UI (header dashboard) dan bisa dijadikan warna naratif oleh AI Agent di
 * kemudian hari. Sengaja unisex (tidak dipasangkan ke gender tertentu)
 * karena ini soal gaya berpakaian, bukan identitas gender.
 */

export interface AppearancePreset {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export const APPEARANCE_PRESETS: AppearancePreset[] = [
  {
    id: "sederhana",
    label: "Sederhana",
    emoji: "🧑",
    description: "Pakaian sehari-hari yang sederhana dan tidak mencolok.",
  },
  {
    id: "rapi",
    label: "Rapi & necis",
    emoji: "🧑\u200d💼",
    description: "Kemeja rapi dan necis, meski isi dompet pas-pasan.",
  },
  {
    id: "kasual",
    label: "Kasual",
    emoji: "🧑\u200d🦱",
    description: "Kaos dan celana kasual — santai, praktis, tanpa banyak pikir.",
  },
  {
    id: "olahraga",
    label: "Gaya olahraga",
    emoji: "🏃",
    description: "Jaket olahraga dan sepatu kets, selalu siap bergerak.",
  },
  {
    id: "tradisional",
    label: "Batik/tradisional",
    emoji: "🧕",
    description: "Kain atau batik dengan sentuhan tradisional.",
  },
  {
    id: "jalanan",
    label: "Gaya jalanan",
    emoji: "🧢",
    description: "Topi dan jaket lecek — gaya anak jalanan yang keras dan lugas.",
  },
  {
    id: "vintage",
    label: "Vintage",
    emoji: "🎩",
    description: "Gaya lawas yang klasik, sedikit ketinggalan zaman tapi berkarakter.",
  },
  {
    id: "minimalis",
    label: "Minimalis",
    emoji: "🖤",
    description: "Serba polos dan minim aksesori — hemat tapi tetap terlihat rapi.",
  },
];

const FALLBACK_PRESET: AppearancePreset = APPEARANCE_PRESETS[0] ?? {
  id: "sederhana",
  label: "Sederhana",
  emoji: "🧑",
  description: "Pakaian sehari-hari yang sederhana dan tidak mencolok.",
};

export const DEFAULT_APPEARANCE_ID = FALLBACK_PRESET.id;

export function getAppearancePreset(id: string): AppearancePreset {
  return APPEARANCE_PRESETS.find((p) => p.id === id) ?? FALLBACK_PRESET;
}
