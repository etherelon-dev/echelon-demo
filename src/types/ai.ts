import type { CalendarDateTime } from "./time";
import type { Gender } from "./character";

/**
 * Tipe-tipe untuk lapisan AI (Fase 2).
 *
 * PRINSIP UTAMA: AI TIDAK OTORITATIF. Provider AI hanya mengembalikan
 * `AIActionResult` mentah — simulation engine (lib/simulation/effects.ts,
 * lib/simulation/engine.ts) yang memvalidasi dan menerapkannya. Field di
 * sini sengaja dibuat SEMPIT (whitelist), bukan generik, supaya validasi
 * bisa ketat.
 */

/** Whitelist path state yang boleh diubah lewat effect. Skill dinamis
 * divalidasi terpisah lewat pola `progression.skills.<id>` — lihat
 * lib/simulation/effects.ts::isAllowedPath(). */
export const FIXED_EFFECT_PATHS = [
  "needs.health",
  "needs.energy",
  "needs.hunger",
  "needs.stress",
  "needs.happiness",
  "finance.cash",
  "finance.bankBalance",
  "finance.savings",
  "finance.debt",
  "progression.education",
  "progression.experience",
  "progression.reputation",
] as const;

export type FixedEffectPath = (typeof FIXED_EFFECT_PATHS)[number];

/** `path` divalidasi ulang oleh engine — ini bukan sumber kebenaran keamanan,
 * hanya bentuk data. Lihat lib/simulation/effects.ts untuk validasi nyata. */
export type EffectPath = FixedEffectPath | `progression.skills.${string}`;

export type EffectOperation = "add" | "subtract" | "set" | "multiply";

export interface SimulationEffect {
  path: EffectPath | string;
  operation: EffectOperation;
  value: number;
  /** Alasan singkat, ditampilkan di debug panel & log — bukan sumber kebenaran. */
  reason?: string;
}

export type EventSeverity = "info" | "minor" | "major" | "critical";

export interface SimulationEventOutcome {
  title: string;
  description: string;
  severity: EventSeverity;
  /** Apakah event ini murni dunia acak (mis. bencana) vs akibat langsung aksi pemain. */
  source?: "player_action" | "world_random";
}

export interface AIAction {
  intent: string;
  target?: string;
  parameters?: Record<string, unknown>;
}

/**
 * Bentuk keluaran wajib dari AI Agent. Divalidasi ketat oleh
 * lib/ai/schema.ts sebelum menyentuh engine.
 */
export interface AIActionResult {
  action: AIAction;
  timeAdvanceMinutes: number;
  effects: SimulationEffect[];
  events: SimulationEventOutcome[];
  narrative: {
    title: string;
    text: string;
  };
  /** AI boleh menolak aksi pemain sendiri (mis. anakronistik, tidak masuk akal secara ekonomi). */
  rejected?: boolean;
  rejectionReason?: string;
}

/** Konteks yang dikirim ke AI — hanya yang relevan, bukan seluruh dunia. */
export interface AIContext {
  date: CalendarDateTime;
  ageYears: number;
  /** Tahun lahir karakter — supaya AI bisa menilai kewajaran historis relatif
   * terhadap generasi karakter, bukan cuma terhadap tahun simulasi saat ini. */
  birthYear: number;
  character: {
    name: string;
    gender: Gender;
    needs: Record<string, number>;
    finance: {
      cash: number;
      bankBalance: number;
      savings: number;
      debt: number;
      /** Total tagihan rutin per bulan (sewa/listrik dinormalisasi ke setara bulanan). */
      recurringExpensesMonthlyTotal: number;
    };
    /** Judul pekerjaan aktif, atau null kalau belum bekerja (kerja serabutan). */
    jobTitle: string | null;
    inventoryItemCount: number;
    progression: {
      education: number;
      experience: number;
      reputation: number;
      skills: Record<string, number>;
    };
    vitalStatus: string;
    /** Fase 4 — hanya informasional (AI tidak pernah mengubah lokasi lewat effect bebas; lihat lib/simulation/engine.ts::performRelocate). */
    location: {
      countryName: string | null;
      cityName: string | null;
    };
    /** Fase 4 — ringkasan portofolio investasi, hanya informasional (AI tidak pernah mengubah investasi lewat effect bebas; lihat lib/simulation/engine.ts::performBuyAsset/performSellAsset). */
    portfolio: {
      holdingCount: number;
      estimatedValue: number;
    };
  };
  /** Beberapa giliran terakhir, supaya AI punya kesinambungan tanpa mengirim seluruh riwayat. */
  recentTurns: { playerInput: string; narrativeTitle: string }[];
}

/**
 * Tiga pilihan Agent AI yang bisa dipakai pemain (bisa diganti kapan saja,
 * termasuk di tengah permainan — lihat lib/ai/apiKeyStore.ts). "local" dan
 * "custom" disiapkan sebagai slot provider tambahan di fase berikutnya.
 */
export type AIProviderId = "anthropic" | "openai" | "google" | "local" | "custom";

/** Hasil satu pemanggilan AI Agent, dipakai lapisan UI/state. */
export type AgentRunResult = { ok: true; result: AIActionResult } | { ok: false; error: string };
