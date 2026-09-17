import Link from "next/link";
import type { Character } from "@/types/character";
import { formatCalendarDateID, minutesToCalendar, ageInYears } from "@/lib/simulation/time";

interface DeathScreenProps {
  character: Character;
}

export function DeathScreen({ character }: DeathScreenProps) {
  const cal = character.deceasedAtMinute !== null ? minutesToCalendar(character.deceasedAtMinute) : null;
  const age =
    character.deceasedAtMinute !== null
      ? ageInYears(character.birthMinute, character.deceasedAtMinute)
      : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center px-6 py-16">
      <p className="font-ledger text-xs uppercase tracking-wide text-stamp">Halaman terakhir</p>
      <h1 className="mt-2 font-heading text-4xl italic text-ink">{character.name}</h1>
      <p className="mt-3 font-ledger text-sm text-ink">
        {cal ? `Meninggal pada ${formatCalendarDateID(cal)}` : "Meninggal dunia"}
        {age !== null ? `, di usia ${age} tahun.` : "."}
      </p>
      <p className="mt-1 font-ledger text-sm text-stamp">
        Penyebab: {character.causeOfDeath ?? "tidak diketahui"}
      </p>

      <p className="mt-6 font-ledger text-xs text-ink-muted">
        Dunia ini tidak memberi keringanan pada siapa pun — termasuk tokoh utama. Buku hidup ini
        sudah selesai, tapi buku baru selalu bisa dibuka.
      </p>

      <Link
        href="/"
        className="mt-8 border border-ink px-5 py-2 font-ledger text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        Kembali ke sampul
      </Link>
    </main>
  );
}
