"use client";

import { useMemo, useState } from "react";
import type { CharacterCreationInput, Gender } from "@/types/character";
import { GENDER_LABEL_ID } from "@/types/character";
import {
  MAX_BIRTH_MINUTE,
  MIN_BIRTH_MINUTE,
  SIMULATION_START_MINUTE,
  validateBirthMinute,
} from "@/lib/simulation/characterFactory";
import {
  ageInYears,
  calendarToISODateString,
  formatCalendarDateID,
  isoDateStringToMinutes,
  minutesToCalendar,
} from "@/lib/simulation/time";
import { APPEARANCE_PRESETS, DEFAULT_APPEARANCE_ID } from "@/lib/simulation/appearance";
import { listHomeCities, DEFAULT_CITY_ID } from "@/lib/simulation/worldCatalog";

interface CharacterCreationFormProps {
  onSubmit: (input: CharacterCreationInput) => void | Promise<void>;
  isSubmitting?: boolean;
}

const MIN_DATE_STR = calendarToISODateString(minutesToCalendar(MIN_BIRTH_MINUTE));
const MAX_DATE_STR = calendarToISODateString(minutesToCalendar(MAX_BIRTH_MINUTE));
const MIN_DATE_LABEL = formatCalendarDateID(minutesToCalendar(MIN_BIRTH_MINUTE));
const MAX_DATE_LABEL = formatCalendarDateID(minutesToCalendar(MAX_BIRTH_MINUTE));
const GENDER_OPTIONS: Gender[] = ["male", "female"];
const HOME_CITIES = listHomeCities();

export function CharacterCreationForm({ onSubmit, isSubmitting = false }: CharacterCreationFormProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [birthDateStr, setBirthDateStr] = useState("1994-01-01");
  const [appearanceId, setAppearanceId] = useState(DEFAULT_APPEARANCE_ID);
  const [cityId, setCityId] = useState(DEFAULT_CITY_ID);
  const [touched, setTouched] = useState(false);

  const birthMinute = useMemo(() => isoDateStringToMinutes(birthDateStr), [birthDateStr]);

  const birthValidation = useMemo(() => {
    if (birthMinute === null) {
      return { valid: false as const, reason: "Tanggal lahir belum diisi." };
    }
    return validateBirthMinute(birthMinute, SIMULATION_START_MINUTE);
  }, [birthMinute]);

  const age = birthMinute !== null ? ageInYears(birthMinute, SIMULATION_START_MINUTE) : null;
  const trimmedName = name.trim();
  const canSubmit = trimmedName.length > 0 && birthValidation.valid && !isSubmitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit || birthMinute === null) return;
    await onSubmit({ name: trimmedName, gender, birthMinute, appearanceId, cityId });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block font-ledger text-sm text-ink-muted" htmlFor="charName">
          Nama karakter
        </label>
        <input
          id="charName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Artisio Libalo"
          maxLength={60}
          className="w-full border-b border-ink bg-transparent px-1 py-2 font-ledger text-ink placeholder:text-ink-muted/60 focus:outline-none"
        />
        {touched && trimmedName.length === 0 && (
          <p className="mt-1 font-ledger text-xs text-stamp">Nama tidak boleh kosong.</p>
        )}
      </div>

      <div>
        <p className="mb-2 font-ledger text-sm text-ink-muted">Gender</p>
        <div className="flex gap-3">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 border px-4 py-2 font-ledger text-sm transition-colors ${
                gender === g
                  ? "border-ink bg-ink text-paper"
                  : "border-ink text-ink hover:bg-paper-raised"
              }`}
              aria-pressed={gender === g}
            >
              {GENDER_LABEL_ID[g]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block font-ledger text-sm text-ink-muted" htmlFor="birthDate">
          Tanggal lahir
        </label>
        <input
          id="birthDate"
          type="date"
          value={birthDateStr}
          min={MIN_DATE_STR}
          max={MAX_DATE_STR}
          onChange={(e) => setBirthDateStr(e.target.value)}
          className="w-full border-b border-ink bg-transparent px-1 py-2 font-ledger text-ink focus:outline-none"
        />
        <p className="mt-1 font-ledger text-xs text-ink-muted">
          {age !== null && birthValidation.valid
            ? `Usia saat hidup dimulai (1 Januari 2012): ${age} tahun.`
            : `Pilih tanggal antara ${MIN_DATE_LABEL} dan ${MAX_DATE_LABEL}.`}
        </p>
        {touched && !birthValidation.valid && (
          <p className="mt-1 font-ledger text-xs text-stamp">{birthValidation.reason}</p>
        )}
      </div>

      <div>
        <p className="mb-2 font-ledger text-sm text-ink-muted">Kostum awal</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {APPEARANCE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setAppearanceId(preset.id)}
              title={preset.description}
              className={`flex flex-col items-center gap-1 border px-2 py-3 font-ledger text-xs transition-colors ${
                appearanceId === preset.id
                  ? "border-ink bg-ink text-paper"
                  : "border-ink text-ink hover:bg-paper-raised"
              }`}
              aria-pressed={appearanceId === preset.id}
            >
              <span className="text-xl" aria-hidden>
                {preset.emoji}
              </span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block font-ledger text-sm text-ink-muted" htmlFor="cityId">
          Kota awal
        </label>
        <select
          id="cityId"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          className="w-full border-b border-ink bg-transparent px-1 py-2 font-ledger text-ink focus:outline-none"
        >
          {HOME_CITIES.map((city) => (
            <option key={city.id} value={city.id} className="bg-paper text-ink">
              {city.name}
              {city.isCapital ? " (Ibu kota)" : ""}
            </option>
          ))}
        </select>
        <p className="mt-1 font-ledger text-xs text-ink-muted">
          Hidup dimulai di Indonesia — kota lain di luar negeri baru bisa dikunjungi lewat pasar
          finansial (Fase 4), belum sebagai domisili.
        </p>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full border border-ink px-5 py-2 font-ledger text-sm text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
      >
        {isSubmitting ? "Menyiapkan hidup baru…" : "Mulai hidup baru"}
      </button>
    </form>
  );
}
