"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/state/gameStore";

const EXAMPLES = [
  "Aku mau cari kerja.",
  "Aku mau makan siang murah.",
  "Aku mau belajar pemrograman.",
  "Aku mau menabung sisa uangku.",
];

export function CommandBox() {
  const [input, setInput] = useState("");
  const isSubmittingCommand = useGameStore((s) => s.isSubmittingCommand);
  const lastTurnError = useGameStore((s) => s.lastTurnError);
  const submitCommand = useGameStore((s) => s.submitCommand);
  const vitalStatus = useGameStore((s) => s.bundle?.character.vitalStatus);
  const characterName = useGameStore((s) => s.bundle?.character.name) ?? "kamu";

  const disabled = isSubmittingCommand || vitalStatus !== "alive";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    setInput("");
    await submitCommand(trimmed);
  }

  return (
    <div className="border border-ink bg-paper-raised p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder={`Ketik apa yang ${characterName} mau lakukan… mis. "Aku mau cari kerja."`}
          className="flex-1 border-b border-ink bg-transparent px-1 py-2 font-ledger text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="shrink-0 border border-ink px-5 py-2 font-ledger text-xs text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
        >
          {isSubmittingCommand ? "Memproses…" : "Lakukan"}
        </button>
      </form>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            disabled={disabled}
            onClick={() => setInput(ex)}
            className="font-ledger text-[11px] text-ink-muted underline decoration-dotted hover:text-brass disabled:opacity-40"
          >
            {ex}
          </button>
        ))}
      </div>

      {lastTurnError && (
        <p className="mt-3 border-t border-dotted border-paper-line pt-2 font-ledger text-xs text-stamp">
          {lastTurnError}
        </p>
      )}
    </div>
  );
}
