"use client";

import Link from "next/link";
import { useGameStore } from "@/lib/state/gameStore";
import {
  getCountry,
  getCity,
  listHomeCities,
  listForeignCountries,
  HOME_COUNTRY_ID,
} from "@/lib/simulation/worldCatalog";
import { getMacroEconomySnapshot } from "@/lib/simulation/macroEconomy";

function MacroStatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1">
      <span className="font-ledger text-xs text-ink-muted">{label}</span>
      <span className="font-ledger text-xs text-ink">{value}</span>
    </div>
  );
}

export default function DuniaPage() {
  const bundle = useGameStore((s) => s.bundle);
  const relocate = useGameStore((s) => s.relocate);
  const lastTurnError = useGameStore((s) => s.lastTurnError);

  if (!bundle) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center px-6">
        <p className="font-ledger text-sm text-ink-muted">Tidak ada buku hidup yang sedang dibuka.</p>
        <Link href="/" className="mt-3 font-ledger text-sm text-brass underline decoration-dotted">
          Kembali ke sampul
        </Link>
      </main>
    );
  }

  const { character, state } = bundle;
  const nowMinute = state.nowMinute;
  const currentCity = character.location.cityId ? getCity(character.location.cityId) : null;
  const currentCountry = character.location.countryId ? getCountry(character.location.countryId) : null;
  const homeSnapshot = getMacroEconomySnapshot(state.saveId, HOME_COUNTRY_ID, nowMinute);
  const homeCities = listHomeCities();
  const foreignCountries = listForeignCountries();

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <header className="mb-6 flex items-baseline justify-between border-b-2 border-ink pb-4">
        <h1 className="font-heading text-3xl italic text-ink">Dunia</h1>
        <Link href="/game" className="font-ledger text-xs text-brass underline decoration-dotted">
          Kembali
        </Link>
      </header>

      {lastTurnError && <p className="mb-4 font-ledger text-xs text-stamp">{lastTurnError}</p>}

      <section className="mb-8">
        <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
          Domisili saat ini
        </h2>
        <p className="font-ledger text-sm text-ink">
          {currentCity?.name ?? "-"}, {currentCountry?.name ?? "-"}
        </p>
        {currentCity && (
          <p className="font-ledger text-xs text-ink-muted">
            Indeks biaya hidup: {currentCity.costOfLivingIndex.toFixed(2)}×
            {currentCity.isCapital ? " · Ibu kota" : ""}
          </p>
        )}
      </section>

      {homeSnapshot && currentCountry && (
        <section className="mb-8">
          <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
            Ekonomi makro {currentCountry.name} ({homeSnapshot.year})
          </h2>
          <div className="divide-y divide-paper-line border-t border-b border-paper-line">
            <MacroStatRow label="Inflasi tahunan" value={`${homeSnapshot.inflationPct.toFixed(2)}%`} />
            <MacroStatRow label="Tingkat pengangguran" value={`${homeSnapshot.unemploymentPct.toFixed(2)}%`} />
            <MacroStatRow label="Pertumbuhan PDB" value={`${homeSnapshot.gdpGrowthPct.toFixed(2)}%`} />
            <MacroStatRow label="Suku bunga acuan" value={`${homeSnapshot.interestRatePct.toFixed(2)}%`} />
          </div>
          <p className="mt-2 font-ledger text-xs text-ink-muted/70">
            Angka ini titik awal ilustratif yang bergerak sendiri tiap tahun secara simulasi —
            bukan data resmi lembaga statistik mana pun.
          </p>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
          Pindah kota
        </h2>
        <ul className="divide-y divide-paper-line border-t border-b border-paper-line">
          {homeCities.map((city) => {
            const isCurrent = city.id === character.location.cityId;
            return (
              <li key={city.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-ledger text-sm text-ink">
                    {city.name}
                    {city.isCapital ? " (Ibu kota)" : ""}
                  </p>
                  <p className="font-ledger text-xs text-ink-muted">
                    Indeks biaya hidup: {city.costOfLivingIndex.toFixed(2)}×
                  </p>
                </div>
                <button
                  disabled={isCurrent}
                  onClick={() => relocate(city.id)}
                  className="shrink-0 border border-ink px-3 py-1 font-ledger text-xs text-ink hover:bg-ink hover:text-paper disabled:opacity-40"
                >
                  {isCurrent ? "Domisili saat ini" : "Pindah ke sini"}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 font-ledger text-xs text-ink-muted/70">
          Pindah kota makan waktu beberapa hari, dan dunia tetap berjalan selama itu (kelalaian/
          peristiwa acak tetap bisa terjadi).
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
          Dunia luar
        </h2>
        <ul className="divide-y divide-paper-line border-t border-b border-paper-line">
          {foreignCountries.map((country) => {
            const snapshot = getMacroEconomySnapshot(state.saveId, country.id, nowMinute);
            return (
              <li key={country.id} className="py-3">
                <p className="font-ledger text-sm text-ink">
                  {country.name} <span className="text-ink-muted">({country.currencyCode})</span>
                </p>
                {snapshot && (
                  <p className="font-ledger text-xs text-ink-muted">
                    Inflasi {snapshot.inflationPct.toFixed(1)}% · Pengangguran{" "}
                    {snapshot.unemploymentPct.toFixed(1)}% · PDB {snapshot.gdpGrowthPct.toFixed(1)}%
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-2 font-ledger text-xs text-ink-muted/70">
          Mata uang & indeks saham negara-negara ini bisa diperdagangkan lewat halaman{" "}
          <Link href="/game/pasar" className="text-brass underline decoration-dotted">
            Pasar
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
