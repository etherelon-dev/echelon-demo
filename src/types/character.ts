import type { EntityId, Money } from "./common";
import type { SimulationMinutes } from "./time";
import type { RecurringExpense } from "./finance";
import type { InventoryItem } from "./product";
import type { PortfolioHolding } from "./market";

/**
 * Gender karakter — dipilih pemain saat membuat hidup baru (lihat
 * components/character/CharacterCreationForm.tsx). Tidak memengaruhi tata
 * bahasa Indonesia (tidak ada kata ganti bergender), tapi tersedia untuk
 * konteks AI Agent (lib/ai/contextBuilder.ts) dan kemungkinan mekanisme
 * spesifik-gender di fase mendatang.
 */
export type Gender = "male" | "female";

export const GENDER_LABEL_ID: Record<Gender, string> = {
  male: "Laki-laki",
  female: "Perempuan",
};

/**
 * Input dari form pembuatan karakter (sampul -> "Mulai hidup baru"). Dipakai
 * oleh lib/simulation/characterFactory.ts::createCharacter() untuk merakit
 * `Character` yang sesungguhnya. Nama ini juga dipakai sebagai label save.
 */
export interface CharacterCreationInput {
  name: string;
  gender: Gender;
  /** Tanggal lahir dalam menit simulasi — lihat validateBirthMinute() di characterFactory.ts. */
  birthMinute: SimulationMinutes;
  /** id preset dari lib/simulation/appearance.ts */
  appearanceId: string;
  /** Fase 4: id kota awal (lib/simulation/worldCatalog.ts::CITY_CATALOG) — opsional, default DEFAULT_CITY_ID (Jakarta) kalau tidak diisi. Negara awal selalu HOME_COUNTRY_ID (Indonesia), lihat catatan cakupan di types/world.ts. */
  cityId?: EntityId;
}

export interface CharacterNeeds {
  /** 0-100 */
  health: number;
  energy: number;
  hunger: number;
  stress: number;
  happiness: number;
}

export interface CharacterFinance {
  cash: Money;
  bankBalance: Money;
  savings: Money;
  debt: Money;
  /** Komitmen berkelanjutan (sewa, listrik, dst) — lihat lib/simulation/finance.ts */
  recurringExpenses: RecurringExpense[];
}

export interface CharacterProgression {
  /** 0-100, seberapa jauh pendidikan formal */
  education: number;
  /** skillId -> level (0-100) */
  skills: Record<string, number>;
  experience: number;
  /** 0-100, reputasi umum di masyarakat/industri */
  reputation: number;
}

/**
 * Fase 4: diisi otomatis saat karakter dibuat (default Indonesia/Jakarta —
 * lihat lib/simulation/worldCatalog.ts::HOME_COUNTRY_ID/DEFAULT_CITY_ID)
 * dan bisa berubah lewat lib/simulation/engine.ts::performRelocate() (pindah
 * kota). Tetap nullable secara tipe untuk save Fase 1-3 sebelum migrasi
 * berjalan (lib/simulation/migrations.ts, schemaVersion 4 -> 5) — setelah
 * migrasi, keduanya tidak pernah null lagi.
 */
export interface CharacterLocation {
  countryId: EntityId | null;
  cityId: EntityId | null;
}

/**
 * Status vital (Fase 2, schemaVersion 2 — lihat lib/simulation/migrations.ts
 * & lib/simulation/death.ts). "alive" adalah satu-satunya status pada save
 * lama (schemaVersion 1); "deceased" murni ditentukan oleh engine dari
 * angka kesehatan, TIDAK PERNAH oleh narasi AI (permintaan pengguna:
 * dunia realistis, tanpa plot armor).
 */
export type VitalStatus = "alive" | "deceased";

export interface Character {
  id: EntityId;
  name: string;
  gender: Gender;
  /** Tanggal lahir dalam menit simulasi, dipakai untuk menghitung umur secara deterministik */
  birthMinute: SimulationMinutes;
  /** id preset penampilan/kostum awal — lihat lib/simulation/appearance.ts */
  appearanceId: string;
  needs: CharacterNeeds;
  finance: CharacterFinance;
  progression: CharacterProgression;
  location: CharacterLocation;
  /** Barang tahan lama/hunian yang dimiliki — lihat lib/simulation/inventory.ts */
  inventory: InventoryItem[];
  /** Fase 4: kepemilikan mata uang asing/saham/indeks/kripto — lihat lib/simulation/investments.ts. Array kosong = belum pernah berinvestasi. */
  investments: PortfolioHolding[];
  careerJobId: EntityId | null;
  vitalStatus: VitalStatus;
  /** Diisi engine (bukan AI) saat vitalStatus berubah jadi "deceased" — lihat lib/simulation/death.ts */
  causeOfDeath: string | null;
  deceasedAtMinute: SimulationMinutes | null;
  createdAtMinute: SimulationMinutes;
  updatedAtMinute: SimulationMinutes;
}

/**
 * Karakter kini dibuat pemain sendiri (nama, gender, tanggal lahir, kostum
 * awal) lewat form pembuatan karakter di sampul, bukan lagi tetap "Artisio
 * Libalo, 18 tahun". Satu prinsip lama tetap dipertahankan: mulai SANGAT
 * MISKIN, semua atribut finansial dari nol, apa pun usia/gender/penampilan
 * yang dipilih. Nilai persis & batas usia yang diizinkan didefinisikan di
 * lib/simulation/characterFactory.ts, bukan di sini — file ini hanya
 * mendefinisikan bentuk data.
 */
