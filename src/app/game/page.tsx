"use client";

import Link from "next/link";
import { useGameStore } from "@/lib/state/gameStore";
import {
  ageInYears,
  formatCalendarDateTimeID,
  minutesToCalendar,
} from "@/lib/simulation/time";
import { calculateNetWorth } from "@/lib/simulation/characterFactory";
import { getAppearancePreset } from "@/lib/simulation/appearance";
import { estimateMonthlyExpenseTotal } from "@/lib/simulation/finance";
import { getProduct } from "@/lib/simulation/productCatalog";
import { getJob } from "@/lib/simulation/jobCatalog";
import { getCity, getCountry } from "@/lib/simulation/worldCatalog";
import { calculatePortfolioValue } from "@/lib/simulation/investments";
import { GENDER_LABEL_ID } from "@/types/character";
import { formatRupiah } from "@/lib/format";
import { NeedBar } from "@/components/character/NeedBar";
import { LedgerRow } from "@/components/character/LedgerRow";
import { CommandBox } from "@/components/game/CommandBox";
import { NarrativeFeed } from "@/components/game/NarrativeFeed";
import { DeathScreen } from "@/components/game/DeathScreen";
import { AgentSettingsPanel } from "@/components/game/AgentSettingsPanel";

export default function GamePage() {
  const bundle = useGameStore((s) => s.bundle);
  const isLoading = useGameStore((s) => s.isLoading);
  const eatMeal = useGameStore((s) => s.eatMeal);
  const workShift = useGameStore((s) => s.workShift);
  const advance = useGameStore((s) => s.advance);
  const lastTurnError = useGameStore((s) => s.lastTurnError);

  if (!bundle) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center px-6">
        <p className="font-ledger text-sm text-ink-muted">
          Tidak ada buku hidup yang sedang dibuka.
        </p>
        <Link href="/" className="mt-3 font-ledger text-sm text-brass underline decoration-dotted">
          Kembali ke sampul
        </Link>
      </main>
    );
  }

  const { character, state } = bundle;

  // Dunia ini tidak memberi keringanan pada siapa pun (permintaan pengguna:
  // realistis, tanpa plot armor) — begitu kesehatan menyentuh 0, halaman
  // hidup ini berhenti di sini, ditentukan murni oleh engine
  // (lib/simulation/death.ts), bukan oleh narasi AI.
  if (character.vitalStatus === "deceased") {
    return <DeathScreen character={character} />;
  }

  const cal = minutesToCalendar(state.nowMinute);
  const age = ageInYears(character.birthMinute, state.nowMinute);
  const portfolioValue = calculatePortfolioValue(character, state.saveId, state.nowMinute);
  const netWorth = calculateNetWorth(character) + portfolioValue;
  const appearance = getAppearancePreset(character.appearanceId);
  const currentCity = character.location.cityId ? getCity(character.location.cityId) : null;
  const currentCountry = character.location.countryId ? getCountry(character.location.countryId) : null;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <header className="mb-8 flex items-baseline justify-between border-b-2 border-ink pb-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl" aria-hidden>
            {appearance.emoji}
          </span>
          <div>
            <h1 className="font-heading text-3xl italic text-ink">{character.name}</h1>
            <p className="font-ledger text-xs text-ink-muted">
              {GENDER_LABEL_ID[character.gender]} · {age} tahun · {formatCalendarDateTimeID(cal)}
            </p>
            {currentCity && (
              <p className="font-ledger text-xs text-ink-muted">
                {currentCity.name}, {currentCountry?.name ?? "-"}
              </p>
            )}
          </div>
        </div>
        <Link href="/" className="font-ledger text-xs text-brass underline decoration-dotted">
          Sampul
        </Link>
      </header>

      <nav className="mb-8 flex gap-4 border-b border-paper-line pb-3 font-ledger text-xs">
        <Link href="/game/toko" className="text-ink underline decoration-dotted">
          Toko
        </Link>
        <Link href="/game/karier" className="text-ink underline decoration-dotted">
          Karier
        </Link>
        <Link href="/game/pasar" className="text-ink underline decoration-dotted">
          Pasar
        </Link>
        <Link href="/game/dunia" className="text-ink underline decoration-dotted">
          Dunia
        </Link>
      </nav>

      <section className="mb-8">
        <AgentSettingsPanel />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-ledger text-sm uppercase tracking-wide text-ink-muted">
          Apa yang {character.name} lakukan?
        </h2>
        <CommandBox />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-ledger text-sm uppercase tracking-wide text-ink-muted">
          Kondisi
        </h2>
        <div className="space-y-2">
          <NeedBar label="Kesehatan" value={character.needs.health} />
          <NeedBar label="Energi" value={character.needs.energy} />
          <NeedBar label="Lapar" value={character.needs.hunger} />
          <NeedBar label="Stres" value={character.needs.stress} />
          <NeedBar label="Bahagia" value={character.needs.happiness} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
          Keuangan
        </h2>
        <LedgerRow label="Tunai" value={formatRupiah(character.finance.cash)} />
        <LedgerRow label="Bank" value={formatRupiah(character.finance.bankBalance)} />
        <LedgerRow label="Tabungan" value={formatRupiah(character.finance.savings)} />
        <LedgerRow label="Utang" value={formatRupiah(character.finance.debt)} emphasis="debt" />
        {character.finance.recurringExpenses.length > 0 && (
          <LedgerRow
            label="Tagihan rutin/bulan"
            value={formatRupiah(Math.round(estimateMonthlyExpenseTotal(character)))}
            emphasis="debt"
          />
        )}
        {character.investments.length > 0 && (
          <LedgerRow label="Investasi (Pasar)" value={formatRupiah(portfolioValue)} />
        )}
        <div className="mt-2 flex items-baseline justify-between pt-1">
          <span className="font-ledger text-sm font-medium text-ink">Kekayaan bersih</span>
          <span className="font-ledger text-sm font-medium text-ink">
            {formatRupiah(netWorth)}
          </span>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
          Perkembangan
        </h2>
        <LedgerRow
          label="Pekerjaan"
          value={character.careerJobId ? (getJob(character.careerJobId)?.title ?? "-") : "Belum bekerja"}
        />
        <LedgerRow label="Pendidikan" value={`${character.progression.education}/100`} />
        <LedgerRow label="Pengalaman" value={`${character.progression.experience}`} />
        <LedgerRow label="Reputasi" value={`${character.progression.reputation}/100`} />
      </section>

      {character.inventory.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
            Inventori
          </h2>
          {character.inventory.map((item) => {
            const product = getProduct(item.productId);
            return (
              <div key={item.id}>
                <LedgerRow
                  label={`${product?.name ?? item.productId}${item.quantity > 1 ? ` x${item.quantity}` : ""}`}
                  value={item.condition !== null ? `${Math.round(item.condition)}%` : "-"}
                />
              </div>
            );
          })}
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
          Pintasan cepat <span className="text-ink-muted/70">(tanpa mengetik perintah)</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            disabled={isLoading}
            onClick={() => eatMeal()}
            className="border border-ink px-4 py-2 font-ledger text-xs text-ink hover:bg-ink hover:text-paper disabled:opacity-40"
          >
            Makan
          </button>
          <button
            disabled={isLoading}
            onClick={() => workShift()}
            className="border border-ink px-4 py-2 font-ledger text-xs text-ink hover:bg-ink hover:text-paper disabled:opacity-40"
          >
            Kerja
          </button>
          <button
            disabled={isLoading}
            onClick={() => advance(8 * 60, "Tidur")}
            className="border border-ink px-4 py-2 font-ledger text-xs text-ink hover:bg-ink hover:text-paper disabled:opacity-40"
          >
            Tidur (8 jam)
          </button>
        </div>
        {lastTurnError && (
          <p className="mt-3 font-ledger text-xs text-stamp">{lastTurnError}</p>
        )}
        <p className="mt-3 font-ledger text-xs text-ink-muted">
          Dunia tetap berjalan lewat pintasan ini juga — kelalaian dan peristiwa acak (lihat
          bagian &ldquo;Catatan hidup&rdquo; di bawah) bisa saja terjadi meski tanpa mengetik
          perintah.
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-ledger text-sm uppercase tracking-wide text-ink-muted">
          Catatan hidup
        </h2>
        <NarrativeFeed turns={state.recentTurns} />
      </section>
    </main>
  );
}
