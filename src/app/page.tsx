"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SaveMetadata } from "@/types/save";
import type { CharacterCreationInput } from "@/types/character";
import {
  deleteGame,
  exportGame,
  importGame,
  listAllSaves,
} from "@/lib/simulation/saveService";
import { useGameStore } from "@/lib/state/gameStore";
import { CharacterCreationForm } from "@/components/character/CharacterCreationForm";

export default function CoverPage() {
  const router = useRouter();
  const [saves, setSaves] = useState<SaveMetadata[]>([]);
  const [loaded, setLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const newGame = useGameStore((s) => s.newGame);
  const continueGame = useGameStore((s) => s.continueGame);
  const isLoading = useGameStore((s) => s.isLoading);

  async function refresh() {
    const list = await listAllSaves();
    setSaves(list);
    setLoaded(true);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleStart(input: CharacterCreationInput) {
    await newGame(input);
    router.push("/game");
  }

  async function handleContinue(saveId: string) {
    await continueGame(saveId);
    router.push("/game");
  }

  async function handleDelete(saveId: string) {
    await deleteGame(saveId);
    await refresh();
  }

  async function handleExport(saveId: string) {
    const exported = await exportGame(saveId);
    const blob = new Blob([JSON.stringify(exported, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `estyalife-${saveId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(file: File) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    await importGame(parsed);
    await refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <header className="mb-10 border-b-2 border-ink pb-6">
        <p className="font-ledger text-xs tracking-wide text-ink-muted">
          Buku Catatan Hidup · sejak 1 Januari 2012
        </p>
        <h1 className="mt-2 font-heading text-5xl italic text-ink">Estyalife</h1>
      </header>

      <section className="mb-10 border border-ink bg-paper-raised p-5">
        <h2 className="mb-4 font-ledger text-sm uppercase tracking-wide text-ink-muted">
          Buat karakter baru
        </h2>
        <CharacterCreationForm onSubmit={handleStart} isSubmitting={isLoading} />
        <p className="mt-4 font-ledger text-xs text-ink-muted">
          Apa pun nama, gender, tanggal lahir, dan kostum yang kamu pilih, hidup ini mulai
          benar-benar dari nol di tahun 2012 — sangat miskin, tanpa keistimewaan.
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-ledger text-sm uppercase tracking-wide text-ink-muted">
            Buku tersimpan
          </h2>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="font-ledger text-xs text-brass underline decoration-dotted"
          >
            Impor buku
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportFile(file);
              e.target.value = "";
            }}
          />
        </div>

        {!loaded && <p className="font-ledger text-sm text-ink-muted">Memuat…</p>}
        {loaded && saves.length === 0 && (
          <p className="font-ledger text-sm text-ink-muted">
            Belum ada buku tersimpan. Buat karakter baru di atas.
          </p>
        )}

        <ul className="divide-y divide-paper-line border-t border-b border-paper-line">
          {saves.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-ledger text-sm text-ink">{s.name}</p>
                <p className="font-ledger text-xs text-ink-muted">
                  {s.summary.simulationMonth}/{s.summary.simulationYear} · kekayaan bersih Rp
                  {s.summary.netWorth.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex shrink-0 gap-3 font-ledger text-xs">
                <button
                  onClick={() => handleContinue(s.id)}
                  className="text-ink underline decoration-dotted"
                >
                  Lanjutkan
                </button>
                <button
                  onClick={() => handleExport(s.id)}
                  className="text-brass underline decoration-dotted"
                >
                  Ekspor
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-stamp underline decoration-dotted"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
