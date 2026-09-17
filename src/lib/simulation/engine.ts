import type { SimulationBundle, SimulationState, TurnLogEntry } from "@/types/simulation";
import { MAX_STORED_TURNS } from "@/types/simulation";
import type { Character, CharacterNeeds } from "@/types/character";
import type { AIActionResult, SimulationEffect, SimulationEventOutcome } from "@/types/ai";
import { generateId } from "@/types/common";
import { applyEffects, summarizeEffect, validateEffects } from "./effects";
import { checkVitalStatus, isAlive } from "./death";
import { neglectEffects, rollDisasterEvents } from "./randomEvents";
import { rngForTick } from "./rng";
import { eatMeal, processRecurringExpenses } from "./finance";
import { depreciateInventory, validatePurchase, applyPurchase, validateSale, applySale } from "./inventory";
import { workShift, applyForJob, resignFromJob } from "./career";
import { getJob } from "./jobCatalog";
import { validateBuyAsset, applyBuyAsset, validateSellAsset, applySellAsset } from "./investments";
import { getCity, HOME_COUNTRY_ID } from "./worldCatalog";
import { ACTION_DURATIONS_MINUTES, minutesToCalendar } from "./time";

/**
 * Engine simulasi ini OTORITATIF (MASTER_PROMPT.md #10, #12): semua
 * perubahan state melewati fungsi-fungsi di sini, bukan ditentukan
 * langsung oleh AI. AI Agent (lib/ai/agent.ts) hanya MENGUSULKAN
 * `AIActionResult` — fungsi `applyAIActionResult()` di bawah adalah
 * satu-satunya tempat usulan itu divalidasi ulang secara semantik
 * (lib/simulation/effects.ts) dan benar-benar diterapkan.
 *
 * FASE 2 menambah tiga sumber perubahan yang SEMUANYA di luar kendali
 * AI (permintaan pengguna: dunia realistis, bisa menghadapi bencana,
 * TANPA plot armor):
 * 1. Peluruhan kebutuhan per jam (sejak Fase 1, tidak berubah).
 * 2. Konsekuensi kelalaian — `neglectEffects()` (lib/simulation/randomEvents.ts).
 * 3. Peristiwa dunia acak — `rollDisasterEvents()`, RNG deterministik
 *    per save+waktu (lib/simulation/rng.ts) supaya tetap bisa diuji.
 * Kematian (`checkVitalStatus`) dihitung murni dari angka kesehatan,
 * tidak pernah oleh narasi AI.
 */

const NEEDS_DECAY_PER_HOUR: Partial<Record<keyof CharacterNeeds, number>> = {
  energy: -2,
  hunger: -3,
  stress: 1,
  happiness: -0.5,
};

function clampNeed(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function applyHourlyNeedsDecay(needs: CharacterNeeds, hoursElapsed: number): CharacterNeeds {
  const next: CharacterNeeds = { ...needs };
  for (const [key, perHour] of Object.entries(NEEDS_DECAY_PER_HOUR) as [
    keyof CharacterNeeds,
    number,
  ][]) {
    next[key] = clampNeed(next[key] + perHour * hoursElapsed);
  }
  return next;
}

export interface AdvanceTimeResult {
  bundle: SimulationBundle;
  hoursElapsed: number;
}

/**
 * Memajukan waktu simulasi sebanyak `minutes` menit dan menerapkan efek
 * yang bergantung waktu murni (peluruhan kebutuhan karakter). Deterministik:
 * input yang sama selalu menghasilkan output yang sama. Ini adalah blok
 * bangunan tingkat rendah — TIDAK memeriksa kelalaian/bencana/kematian;
 * untuk itu pakai `advanceTimeRealistic()` di bawah. Dipertahankan apa
 * adanya dari Fase 1 supaya perilakunya tetap identik & tetap diuji oleh
 * `__tests__/engine.test.ts`.
 */
export function advanceTime(bundle: SimulationBundle, minutes: number): AdvanceTimeResult {
  if (minutes < 0) {
    throw new Error("advanceTime: minutes tidak boleh negatif");
  }

  const hoursElapsed = minutes / 60;
  const character: Character = {
    ...bundle.character,
    needs: applyHourlyNeedsDecay(bundle.character.needs, hoursElapsed),
    updatedAtMinute: bundle.state.nowMinute + minutes,
  };

  const nextBundle: SimulationBundle = {
    state: {
      ...bundle.state,
      nowMinute: bundle.state.nowMinute + minutes,
    },
    character,
  };

  return { bundle: nextBundle, hoursElapsed };
}

export interface AdvanceRealisticResult {
  bundle: SimulationBundle;
  hoursElapsed: number;
  worldEffects: SimulationEffect[];
  worldEvents: SimulationEventOutcome[];
}

/**
 * Fase 2: peluruhan waktu "realistis" — decay dasar + konsekuensi
 * kelalaian + kemungkinan bencana/dunia acak, lalu menghitung ulang
 * status vital. Dipakai OLEH KEDUA jalur permainan (giliran AI Agent
 * lewat `applyAIActionResult()`, maupun lompatan waktu cepat tanpa
 * perintah lewat `advanceTimeQuick()`) supaya risiko dunia berlaku sama
 * terlepas dari cara pemain melewati waktu.
 */
export function advanceTimeRealistic(
  bundle: SimulationBundle,
  minutes: number
): AdvanceRealisticResult {
  if (!isAlive(bundle.character)) {
    return { bundle, hoursElapsed: 0, worldEffects: [], worldEvents: [] };
  }

  const needsBeforeDecay = bundle.character.needs;
  const { bundle: decayed, hoursElapsed } = advanceTime(bundle, minutes);

  const neglect = neglectEffects(needsBeforeDecay, hoursElapsed, bundle.character.name);
  const rng = rngForTick(bundle.state.saveId, bundle.state.nowMinute);
  const disasters = rollDisasterEvents(decayed.character, hoursElapsed, rng);

  const worldEffects = [...neglect.effects, ...disasters.effects];
  const worldEvents = [...neglect.events, ...disasters.events];

  let character =
    worldEffects.length > 0 ? applyEffects(decayed.character, worldEffects) : decayed.character;

  character = depreciateInventory(character, hoursElapsed);
  const expenses = processRecurringExpenses(character, decayed.state.nowMinute);
  character = expenses.character;
  worldEffects.push(...expenses.effectLog);
  worldEvents.push(...expenses.events);

  const lastWorldEvent = worldEvents[worldEvents.length - 1];
  character = checkVitalStatus(character, decayed.state.nowMinute, lastWorldEvent?.title);

  return {
    bundle: { state: decayed.state, character },
    hoursElapsed,
    worldEffects,
    worldEvents,
  };
}

function pushTurn(state: SimulationState, turn: TurnLogEntry): SimulationState {
  return {
    ...state,
    recentTurns: [...state.recentTurns, turn].slice(-MAX_STORED_TURNS),
  };
}

export interface QuickAdvanceResult {
  bundle: SimulationBundle;
  turn: TurnLogEntry | null;
}

/**
 * Melewati waktu tanpa perintah bahasa natural (mis. pintasan
 * "Makan"/"Kerja"/"Tidur" di dashboard). Tetap memakai
 * `advanceTimeRealistic()` yang sama seperti giliran AI Agent, supaya
 * bencana/dunia acak dan konsekuensi kelalaian TETAP berlaku di jalur
 * ini juga. Hanya menulis satu entri riwayat kalau memang ada peristiwa
 * dunia yang terjadi — supaya catatan tidak penuh entri kosong untuk
 * aksi rutin yang berjalan lancar.
 */
export function advanceTimeQuick(
  bundle: SimulationBundle,
  minutes: number,
  label: string
): QuickAdvanceResult {
  const realistic = advanceTimeRealistic(bundle, minutes);

  if (realistic.worldEvents.length === 0) {
    return { bundle: realistic.bundle, turn: null };
  }

  const turn: TurnLogEntry = {
    id: generateId("turn"),
    atMinute: realistic.bundle.state.nowMinute,
    playerInput: "",
    narrativeTitle: label,
    narrativeText: realistic.worldEvents.map((e) => e.description).join("\n\n"),
    effectSummaries: realistic.worldEffects.map(summarizeEffect),
    events: realistic.worldEvents,
    rejected: false,
  };

  return {
    bundle: { state: pushTurn(realistic.bundle.state, turn), character: realistic.bundle.character },
    turn,
  };
}

export type ApplyAIActionOutcome =
  | { ok: true; bundle: SimulationBundle; turn: TurnLogEntry }
  | { ok: false; error: string };

/**
 * Satu-satunya tempat `AIActionResult` yang sudah lolos validasi BENTUK
 * (lib/ai/schema.ts) diperiksa ulang secara SEMANTIK lalu benar-benar
 * diterapkan. Alurnya:
 * 1. Tolak seluruhnya kalau karakter sudah meninggal.
 * 2. Validasi effect yang diusulkan AI (`validateEffects` — path
 *    whitelist, uang tidak boleh negatif, dst). Effect dari AI yang
 *    menandai `rejected: true` diabaikan sepenuhnya (AI menolak aksi
 *    pemain sendiri, jadi tidak boleh tetap membawa effect).
 *    Jika validasi GAGAL, SELURUH giliran ditolak di level engine —
 *    ini beda dari `result.rejected` (itu AI yang menolak aksi pemain).
 * 3. Majukan waktu secara realistis (decay + kelalaian + bencana acak),
 *    baru KEMUDIAN terapkan effect usulan AI di atasnya — supaya bencana
 *    dunia yang muncul selama durasi aksi tidak pernah diabaikan hanya
 *    karena aksinya sendiri "berhasil".
 * 4. Hitung ulang status vital sekali lagi (tidak berefek apa-apa jika
 *    sudah dinyatakan meninggal pada langkah 3).
 * 5. Catat satu `TurnLogEntry` gabungan (dunia + aksi) ke riwayat.
 */
export function applyAIActionResult(
  bundle: SimulationBundle,
  playerInput: string,
  result: AIActionResult
): ApplyAIActionOutcome {
  if (!isAlive(bundle.character)) {
    return { ok: false, error: `${bundle.character.name} sudah meninggal. Buku hidup ini sudah selesai.` };
  }

  const proposedEffects = result.rejected ? [] : result.effects;
  const validated = validateEffects(bundle.character, proposedEffects);
  if (!validated.valid) {
    return { ok: false, error: validated.reason };
  }

  const minutes = Math.max(0, Math.round(result.timeAdvanceMinutes));
  const realistic = advanceTimeRealistic(bundle, minutes);

  let character = realistic.bundle.character;
  if (isAlive(character) && validated.value.length > 0) {
    character = applyEffects(character, validated.value);
    character = checkVitalStatus(character, realistic.bundle.state.nowMinute, result.narrative.title);
  }

  const combinedEffects = [...realistic.worldEffects, ...validated.value];
  const combinedEvents = [...realistic.worldEvents, ...result.events];

  const narrativeText =
    result.rejected && result.rejectionReason
      ? `${result.narrative.text}\n\n(Ditolak: ${result.rejectionReason})`
      : result.narrative.text;

  const turn: TurnLogEntry = {
    id: generateId("turn"),
    atMinute: realistic.bundle.state.nowMinute,
    playerInput,
    narrativeTitle: result.narrative.title,
    narrativeText,
    effectSummaries: combinedEffects.map(summarizeEffect),
    events: combinedEvents,
    rejected: Boolean(result.rejected),
  };

  const nextBundle: SimulationBundle = {
    state: pushTurn(realistic.bundle.state, turn),
    character,
  };

  return { ok: true, bundle: nextBundle, turn };
}

/**
 * Fase 3 — Kehidupan: aksi terstruktur yang TIDAK lewat AI Agent (mirip
 * pintasan cepat lama), supaya sistem keuangan/inventori/karier tetap
 * deterministik & tidak bisa "dihalusinasi" AI. Semuanya tetap memajukan
 * waktu lewat `advanceTimeRealistic()` yang sama, supaya dunia acak tetap
 * berlaku selama durasi aksi tersebut.
 */

function buildSimpleTurn(
  state: SimulationState,
  atMinute: number,
  title: string,
  narrativeParts: string[],
  effects: SimulationEffect[],
  events: SimulationEventOutcome[]
): TurnLogEntry {
  return {
    id: generateId("turn"),
    atMinute,
    playerInput: "",
    narrativeTitle: title,
    narrativeText: narrativeParts.filter(Boolean).join("\n\n"),
    effectSummaries: effects.map(summarizeEffect),
    events,
    rejected: false,
  };
}

export type StructuredActionOutcome =
  | { ok: true; bundle: SimulationBundle; turn: TurnLogEntry }
  | { ok: false; error: string };

/** Makan — mengisi celah lama: dulu tombol "Makan" cuma memajukan waktu tanpa efek nyata. */
export function performMeal(bundle: SimulationBundle): StructuredActionOutcome {
  if (!isAlive(bundle.character)) {
    return { ok: false, error: `${bundle.character.name} sudah meninggal.` };
  }
  const realistic = advanceTimeRealistic(bundle, ACTION_DURATIONS_MINUTES.eat);
  let character = realistic.bundle.character;
  let mealNarrative = "";
  const mealEffects: SimulationEffect[] = [];

  if (isAlive(character)) {
    const meal = eatMeal(character);
    character = meal.character;
    mealNarrative = meal.narrative;
    if (meal.cost > 0) {
      mealEffects.push({ path: "finance.cash", operation: "subtract", value: meal.cost, reason: "Makan" });
    }
    mealEffects.push({ path: "needs.hunger", operation: "add", value: meal.hungerRestored, reason: "Makan" });
    character = checkVitalStatus(character, realistic.bundle.state.nowMinute, "Makan");
  }

  const turn = buildSimpleTurn(
    realistic.bundle.state,
    realistic.bundle.state.nowMinute,
    "Makan",
    [mealNarrative, ...realistic.worldEvents.map((e) => e.description)],
    [...realistic.worldEffects, ...mealEffects],
    realistic.worldEvents
  );

  return { ok: true, bundle: { state: pushTurn(realistic.bundle.state, turn), character }, turn };
}

/** Kerja — memakai pekerjaan aktif (careerJobId) kalau ada, kalau tidak jadi "kerja serabutan". */
export function performWorkShift(bundle: SimulationBundle): StructuredActionOutcome {
  if (!isAlive(bundle.character)) {
    return { ok: false, error: `${bundle.character.name} sudah meninggal.` };
  }
  const shiftMinutes = workShift(bundle.character).shiftMinutes;
  const realistic = advanceTimeRealistic(bundle, shiftMinutes);
  let character = realistic.bundle.character;
  let workNarrative = "";
  const workEffects: SimulationEffect[] = [];

  if (isAlive(character)) {
    const result = workShift(character);
    character = result.character;
    workNarrative = `${character.name} bekerja sebagai ${result.jobTitle}, mendapat Rp${result.wage.toLocaleString("id-ID")}.`;
    workEffects.push({ path: "finance.cash", operation: "add", value: result.wage, reason: result.jobTitle });
    if (result.skillGain && result.skillGain.amount > 0) {
      workEffects.push({
        path: `progression.skills.${result.skillGain.skillId}`,
        operation: "add",
        value: result.skillGain.amount,
        reason: result.jobTitle,
      });
    }
    character = checkVitalStatus(character, realistic.bundle.state.nowMinute, "Kerja");
  }

  const turn = buildSimpleTurn(
    realistic.bundle.state,
    realistic.bundle.state.nowMinute,
    "Kerja",
    [workNarrative, ...realistic.worldEvents.map((e) => e.description)],
    [...realistic.worldEffects, ...workEffects],
    realistic.worldEvents
  );

  return { ok: true, bundle: { state: pushTurn(realistic.bundle.state, turn), character }, turn };
}

/** Melamar pekerjaan — instan (tanpa memajukan waktu berjam-jam), tapi tetap divalidasi ulang di sini, bukan hanya di UI. */
export function performApplyJob(bundle: SimulationBundle, jobId: string): StructuredActionOutcome {
  if (!isAlive(bundle.character)) {
    return { ok: false, error: `${bundle.character.name} sudah meninggal.` };
  }
  const simYear = minutesToCalendar(bundle.state.nowMinute).year;
  const result = applyForJob(bundle.character, jobId, simYear);
  if (!result.valid) return { ok: false, error: result.reason };
  const jobTitle = getJob(jobId)?.title ?? jobId;

  const turn = buildSimpleTurn(
    bundle.state,
    bundle.state.nowMinute,
    "Melamar kerja",
    [`${result.value.name} diterima bekerja sebagai ${jobTitle}.`],
    [],
    []
  );
  return { ok: true, bundle: { state: pushTurn(bundle.state, turn), character: result.value }, turn };
}

export function performResignJob(bundle: SimulationBundle): StructuredActionOutcome {
  if (!isAlive(bundle.character)) {
    return { ok: false, error: `${bundle.character.name} sudah meninggal.` };
  }
  const character = resignFromJob(bundle.character);
  const turn = buildSimpleTurn(
    bundle.state,
    bundle.state.nowMinute,
    "Berhenti kerja",
    [`${character.name} berhenti dari pekerjaannya.`],
    [],
    []
  );
  return { ok: true, bundle: { state: pushTurn(bundle.state, turn), character }, turn };
}

/** Belanja di Toko — memajukan waktu (durasi belanja singkat) SEBELUM transaksi selesai, supaya bencana/kelalaian yang muncul selama itu tetap berlaku dan bisa saja membatalkan pembelian (mis. uang kepakai lebih dulu). */
export function performPurchase(
  bundle: SimulationBundle,
  productId: string,
  quantity: number
): StructuredActionOutcome {
  if (!isAlive(bundle.character)) {
    return { ok: false, error: `${bundle.character.name} sudah meninggal.` };
  }
  const preCheck = validatePurchase(bundle.character, productId, quantity, bundle.state.nowMinute);
  if (!preCheck.valid) return { ok: false, error: preCheck.reason };

  const realistic = advanceTimeRealistic(bundle, ACTION_DURATIONS_MINUTES.shopShort);
  let character = realistic.bundle.character;
  let narrative: string;
  const purchaseEffects: SimulationEffect[] = [];

  if (!isAlive(character)) {
    narrative = "Belum sempat membeli apa pun — kejadian di atas terjadi lebih dulu.";
  } else {
    const finalCheck = validatePurchase(character, productId, quantity, realistic.bundle.state.nowMinute);
    if (!finalCheck.valid) {
      narrative = `Gagal membeli ${preCheck.value.product.name}: ${finalCheck.reason}`;
    } else {
      character = applyPurchase(
        character,
        finalCheck.value.product,
        quantity,
        finalCheck.value.totalPrice,
        realistic.bundle.state.nowMinute
      );
      narrative = `Membeli ${finalCheck.value.product.name} x${quantity} seharga Rp${finalCheck.value.totalPrice.toLocaleString("id-ID")}.`;
      purchaseEffects.push({
        path: "finance.cash",
        operation: "subtract",
        value: finalCheck.value.totalPrice,
        reason: `Beli ${finalCheck.value.product.name}`,
      });
    }
  }

  const turn = buildSimpleTurn(
    realistic.bundle.state,
    realistic.bundle.state.nowMinute,
    "Belanja",
    [narrative, ...realistic.worldEvents.map((e) => e.description)],
    [...realistic.worldEffects, ...purchaseEffects],
    realistic.worldEvents
  );

  return { ok: true, bundle: { state: pushTurn(realistic.bundle.state, turn), character }, turn };
}

export function performSale(bundle: SimulationBundle, inventoryItemId: string): StructuredActionOutcome {
  if (!isAlive(bundle.character)) {
    return { ok: false, error: `${bundle.character.name} sudah meninggal.` };
  }
  const check = validateSale(bundle.character, inventoryItemId);
  if (!check.valid) return { ok: false, error: check.reason };

  const character = applySale(bundle.character, inventoryItemId, check.value.saleValue);
  const turn = buildSimpleTurn(
    bundle.state,
    bundle.state.nowMinute,
    "Jual barang",
    [`Menjual ${check.value.product.name} seharga Rp${check.value.saleValue.toLocaleString("id-ID")}.`],
    [{ path: "finance.cash", operation: "add", value: check.value.saleValue, reason: `Jual ${check.value.product.name}` }],
    []
  );
  return { ok: true, bundle: { state: pushTurn(bundle.state, turn), character }, turn };
}

/**
 * Fase 4 — Pasar: beli aset finansial (mata uang/saham/indeks/kripto).
 * Pola sama persis seperti performPurchase(): waktu dimajukan (durasi
 * transaksi singkat) SEBELUM transaksi selesai, harga & validitas
 * divalidasi ULANG di waktu setelahnya — bukan cuma sekali saat form
 * dibuka — karena harga aset terus bergerak tiap menit
 * (lib/simulation/priceEngine.ts), jadi preview yang dilihat pemain di UI
 * belum tentu sama dengan harga eksekusi final.
 */
export function performBuyAsset(
  bundle: SimulationBundle,
  assetId: string,
  quantity: number
): StructuredActionOutcome {
  if (!isAlive(bundle.character)) {
    return { ok: false, error: `${bundle.character.name} sudah meninggal.` };
  }
  const preCheck = validateBuyAsset(bundle.character, bundle.state.saveId, assetId, quantity, bundle.state.nowMinute);
  if (!preCheck.valid) return { ok: false, error: preCheck.reason };

  const realistic = advanceTimeRealistic(bundle, ACTION_DURATIONS_MINUTES.tradeMarket);
  let character = realistic.bundle.character;
  let narrative: string;
  const tradeEffects: SimulationEffect[] = [];

  if (!isAlive(character)) {
    narrative = "Belum sempat bertransaksi — kejadian di atas terjadi lebih dulu.";
  } else {
    const finalCheck = validateBuyAsset(
      character,
      realistic.bundle.state.saveId,
      assetId,
      quantity,
      realistic.bundle.state.nowMinute
    );
    if (!finalCheck.valid) {
      narrative = `Gagal membeli ${preCheck.value.asset.name}: ${finalCheck.reason}`;
    } else {
      character = applyBuyAsset(character, finalCheck.value, realistic.bundle.state.nowMinute);
      narrative = `Membeli ${finalCheck.value.quantity.toLocaleString("id-ID")} unit ${finalCheck.value.asset.symbol} seharga Rp${finalCheck.value.totalCost.toLocaleString("id-ID")}.`;
      tradeEffects.push({
        path: "finance.cash",
        operation: "subtract",
        value: finalCheck.value.totalCost,
        reason: `Beli ${finalCheck.value.asset.symbol}`,
      });
    }
  }

  const turn = buildSimpleTurn(
    realistic.bundle.state,
    realistic.bundle.state.nowMinute,
    "Pasar — Beli",
    [narrative, ...realistic.worldEvents.map((e) => e.description)],
    [...realistic.worldEffects, ...tradeEffects],
    realistic.worldEvents
  );

  return { ok: true, bundle: { state: pushTurn(realistic.bundle.state, turn), character }, turn };
}

/**
 * Fase 4 — Pasar: jual aset finansial. INSTAN (tanpa memajukan waktu),
 * konsisten dengan performSale() di atas (jual barang inventaris di Toko
 * juga instan) — asimetri beli-lambat/jual-instan ini pola lama yang
 * sudah ada sejak Fase 3, dipertahankan di sini supaya konsisten.
 */
export function performSellAsset(
  bundle: SimulationBundle,
  holdingId: string,
  quantity: number
): StructuredActionOutcome {
  if (!isAlive(bundle.character)) {
    return { ok: false, error: `${bundle.character.name} sudah meninggal.` };
  }
  const check = validateSellAsset(bundle.character, bundle.state.saveId, holdingId, quantity, bundle.state.nowMinute);
  if (!check.valid) return { ok: false, error: check.reason };

  const character = applySellAsset(bundle.character, check.value);
  const turn = buildSimpleTurn(
    bundle.state,
    bundle.state.nowMinute,
    "Pasar — Jual",
    [
      `Menjual ${check.value.quantity.toLocaleString("id-ID")} unit ${check.value.asset.symbol} seharga Rp${check.value.proceeds.toLocaleString("id-ID")}.`,
    ],
    [{ path: "finance.cash", operation: "add", value: check.value.proceeds, reason: `Jual ${check.value.asset.symbol}` }],
    []
  );
  return { ok: true, bundle: { state: pushTurn(bundle.state, turn), character }, turn };
}

/**
 * Fase 4 — Dunia: pindah kota (hanya di dalam HOME_COUNTRY_ID/Indonesia —
 * lihat catatan cakupan di types/world.ts). Memakan waktu beberapa hari
 * (ACTION_DURATIONS_MINUTES.relocate), jadi tetap lewat
 * advanceTimeRealistic() supaya risiko dunia (kelalaian/bencana) selama
 * masa pindahan itu tetap berlaku, sama seperti aksi berdurasi lain.
 */
export function performRelocate(bundle: SimulationBundle, cityId: string): StructuredActionOutcome {
  if (!isAlive(bundle.character)) {
    return { ok: false, error: `${bundle.character.name} sudah meninggal.` };
  }
  const city = getCity(cityId);
  if (!city || city.countryId !== HOME_COUNTRY_ID) {
    return { ok: false, error: "Kota tujuan tidak dikenal — pindah ke luar negeri belum didukung di Fase 4." };
  }
  if (bundle.character.location.cityId === cityId) {
    return { ok: false, error: `${bundle.character.name} sudah tinggal di ${city.name}.` };
  }

  const realistic = advanceTimeRealistic(bundle, ACTION_DURATIONS_MINUTES.relocate);
  let character = realistic.bundle.character;
  let narrative: string;

  if (!isAlive(character)) {
    narrative = "Belum sempat pindah — kejadian di atas terjadi lebih dulu.";
  } else {
    character = { ...character, location: { ...character.location, cityId } };
    narrative = `${character.name} pindah ke ${city.name}.`;
  }

  const turn = buildSimpleTurn(
    realistic.bundle.state,
    realistic.bundle.state.nowMinute,
    "Pindah kota",
    [narrative, ...realistic.worldEvents.map((e) => e.description)],
    realistic.worldEffects,
    realistic.worldEvents
  );

  return { ok: true, bundle: { state: pushTurn(realistic.bundle.state, turn), character }, turn };
}
