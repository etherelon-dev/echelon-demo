"use client";

import Link from "next/link";
import { useGameStore } from "@/lib/state/gameStore";
import { JOB_CATALOG, getJob } from "@/lib/simulation/jobCatalog";
import { canApply } from "@/lib/simulation/career";
import { minutesToCalendar } from "@/lib/simulation/time";
import { formatRupiah } from "@/lib/format";

export default function KarierPage() {
  const bundle = useGameStore((s) => s.bundle);
  const applyForJob = useGameStore((s) => s.applyForJob);
  const resignJob = useGameStore((s) => s.resignJob);
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
  const simYear = minutesToCalendar(state.nowMinute).year;
  const currentJob = character.careerJobId ? getJob(character.careerJobId) : null;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <header className="mb-6 flex items-baseline justify-between border-b-2 border-ink pb-4">
        <h1 className="font-heading text-3xl italic text-ink">Karier</h1>
        <Link href="/game" className="font-ledger text-xs text-brass underline decoration-dotted">
          Kembali
        </Link>
      </header>

      {lastTurnError && <p className="mb-4 font-ledger text-xs text-stamp">{lastTurnError}</p>}

      <section className="mb-8">
        <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
          Pekerjaan saat ini
        </h2>
        {currentJob ? (
          <div className="flex items-center justify-between border border-ink p-3">
            <div>
              <p className="font-ledger text-sm text-ink">{currentJob.title}</p>
              <p className="font-ledger text-xs text-ink-muted">
                {formatRupiah(currentJob.wagePerHour)}/jam · {currentJob.hoursPerShift} jam per shift
              </p>
            </div>
            <button
              onClick={() => resignJob()}
              className="border border-ink px-3 py-1 font-ledger text-xs text-stamp hover:bg-stamp hover:text-paper"
            >
              Berhenti
            </button>
          </div>
        ) : (
          <p className="font-ledger text-sm text-ink-muted">
            Belum bekerja tetap — tombol &ldquo;Kerja&rdquo; di dashboard menghasilkan upah kerja serabutan harian.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
          Lowongan
        </h2>
        <ul className="divide-y divide-paper-line border-t border-b border-paper-line">
          {JOB_CATALOG.map((job) => {
            const check = canApply(character, job, simYear);
            const isCurrent = character.careerJobId === job.id;
            return (
              <li key={job.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-ledger text-sm text-ink">{job.title}</p>
                  <p className="font-ledger text-xs text-ink-muted">
                    {formatRupiah(job.wagePerHour)}/jam · {job.hoursPerShift} jam · butuh pendidikan{" "}
                    {job.minEducation}/100
                  </p>
                  {!check.valid && (
                    <p className="mt-1 font-ledger text-xs text-stamp">{check.reason}</p>
                  )}
                </div>
                <button
                  disabled={!check.valid || isCurrent}
                  onClick={() => applyForJob(job.id)}
                  className="shrink-0 border border-ink px-3 py-1 font-ledger text-xs text-ink hover:bg-ink hover:text-paper disabled:opacity-30"
                >
                  {isCurrent ? "Aktif" : "Lamar"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
