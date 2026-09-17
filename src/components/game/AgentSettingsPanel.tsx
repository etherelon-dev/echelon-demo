"use client";

import { useEffect, useState } from "react";
import type { AIProviderId } from "@/types/ai";
import { useGameStore } from "@/lib/state/gameStore";
import { listAvailableProviders } from "@/lib/ai/providers";
import {
  addApiKeyProfile,
  getActiveSelection,
  listApiKeyProfilesForProvider,
  removeApiKeyProfile,
  setActiveSelection,
  type ApiKeyProfile,
} from "@/lib/ai/apiKeyStore";

const PROVIDERS = listAvailableProviders();

function maskKey(key: string): string {
  if (key.length <= 4) return "••••";
  return `•••• ${key.slice(-4)}`;
}

export function AgentSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const activeProviderId = useGameStore((s) => s.activeProviderId);
  const setActiveProviderId = useGameStore((s) => s.setActiveProviderId);

  const [tab, setTab] = useState<AIProviderId>(activeProviderId);
  const [profiles, setProfiles] = useState<ApiKeyProfile[]>([]);
  const [activeProfileId, setActiveProfileIdState] = useState<string | null>(null);
  const [activeTabForSelection, setActiveTabForSelection] = useState<AIProviderId | null>(null);
  const [label, setLabel] = useState("");
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setTab(activeProviderId);
  }, [isOpen, activeProviderId]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      const [tabProfiles, active] = await Promise.all([
        listApiKeyProfilesForProvider(tab),
        getActiveSelection(),
      ]);
      if (cancelled) return;
      setProfiles(tabProfiles);
      setActiveTabForSelection(active?.providerId ?? null);
      setActiveProfileIdState(active?.providerId === tab ? active.profileId : null);
    })();
    return () => {
      cancelled = true;
    };
  }, [tab, isOpen]);

  async function refreshProfiles() {
    const tabProfiles = await listApiKeyProfilesForProvider(tab);
    setProfiles(tabProfiles);
  }

  async function handleUseSelection(profileId: string | null) {
    setBusy(true);
    setNotice(null);
    try {
      await setActiveSelection({ providerId: tab, profileId });
      setActiveProviderId(tab);
      setActiveTabForSelection(tab);
      setActiveProfileIdState(profileId);
      setNotice(
        profileId
          ? "Agent aktif ditukar. Perintah berikutnya langsung memakai token ini."
          : "Agent aktif ditukar ke kunci server (.env)."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleAddToken(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    setBusy(true);
    setNotice(null);
    try {
      const profile = await addApiKeyProfile(tab, label, key);
      setLabel("");
      setKey("");
      await refreshProfiles();
      // Token baru langsung dipakai supaya alurnya terasa satu langkah.
      await handleUseSelection(profile.id);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Gagal menyimpan token.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemoveToken(id: string) {
    setBusy(true);
    setNotice(null);
    try {
      await removeApiKeyProfile(id);
      await refreshProfiles();
      const active = await getActiveSelection();
      setActiveTabForSelection(active?.providerId ?? null);
      setActiveProfileIdState(active?.providerId === tab ? active.profileId : null);
    } finally {
      setBusy(false);
    }
  }

  const currentProvider = PROVIDERS.find((p) => p.id === tab);
  const activeLabel =
    activeTabForSelection === tab
      ? (activeProfileId
          ? profiles.find((p) => p.id === activeProfileId)?.label ?? "token tersimpan"
          : "kunci server (.env)")
      : null;

  return (
    <div className="border border-ink bg-paper-raised">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 font-ledger text-xs uppercase tracking-wide text-ink-muted"
      >
        <span>
          Pengaturan Agent AI ·{" "}
          <span className="text-ink">
            {PROVIDERS.find((p) => p.id === activeProviderId)?.label ?? activeProviderId}
          </span>
        </span>
        <span>{isOpen ? "Tutup ▲" : "Buka ▼"}</span>
      </button>

      {isOpen && (
        <div className="border-t border-paper-line px-4 py-4">
          <p className="mb-3 font-ledger text-xs text-ink-muted">
            Pilih salah satu dari tiga Agent AI. Token bisa diganti kapan saja — bahkan di tengah
            permainan yang sedang berjalan — dan kamu boleh menyimpan lebih dari satu token per
            Agent (mis. beberapa token Claude berbeda) lalu menukarnya sesuka hati.
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setTab(p.id)}
                className={`border px-3 py-1.5 font-ledger text-xs transition-colors ${
                  tab === p.id
                    ? "border-ink bg-ink text-paper"
                    : "border-ink-muted/40 text-ink-muted hover:border-ink"
                }`}
              >
                {p.label}
                {activeProviderId === p.id && tab !== p.id ? " · aktif" : ""}
              </button>
            ))}
          </div>

          <p className="mb-3 font-ledger text-xs text-ink-muted">
            Sedang dipakai untuk {currentProvider?.label ?? tab}:{" "}
            <span className="text-ink">
              {activeLabel ?? "belum ditentukan (pakai kunci server bila tersedia)"}
            </span>
          </p>

          <button
            type="button"
            disabled={busy}
            onClick={() => handleUseSelection(null)}
            className={`mb-3 w-full border px-3 py-2 text-left font-ledger text-xs transition-colors disabled:opacity-40 ${
              activeTabForSelection === tab && activeProfileId === null
                ? "border-brass text-brass"
                : "border-ink-muted/40 text-ink-muted hover:border-ink"
            }`}
          >
            Pakai kunci server (.env) — tanpa token pribadi
          </button>

          <ul className="mb-4 space-y-2">
            {profiles.length === 0 && (
              <li className="font-ledger text-xs text-ink-muted">
                Belum ada token tersimpan untuk {currentProvider?.label ?? tab}.
              </li>
            )}
            {profiles.map((p) => (
              <li
                key={p.id}
                className={`flex items-center justify-between gap-3 border px-3 py-2 font-ledger text-xs ${
                  activeTabForSelection === tab && activeProfileId === p.id
                    ? "border-brass text-brass"
                    : "border-ink-muted/40 text-ink"
                }`}
              >
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleUseSelection(p.id)}
                  className="flex-1 text-left disabled:opacity-40"
                >
                  {p.label} <span className="text-ink-muted">({maskKey(p.apiKey)})</span>
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleRemoveToken(p.id)}
                  className="shrink-0 text-stamp underline decoration-dotted disabled:opacity-40"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleAddToken} className="space-y-2 border-t border-dotted border-paper-line pt-3">
            <p className="font-ledger text-xs uppercase tracking-wide text-ink-muted">
              Tambah token {currentProvider?.label ?? tab}
            </p>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Label, mis. Token utama"
              className="w-full border-b border-ink bg-transparent px-1 py-1.5 font-ledger text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none"
            />
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              type="password"
              placeholder="Token API"
              className="w-full border-b border-ink bg-transparent px-1 py-1.5 font-ledger text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !key.trim()}
              className="border border-ink px-4 py-1.5 font-ledger text-xs text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
            >
              Simpan &amp; pakai token ini
            </button>
          </form>

          {notice && (
            <p className="mt-3 border-t border-dotted border-paper-line pt-2 font-ledger text-xs text-brass">
              {notice}
            </p>
          )}

          <p className="mt-3 font-ledger text-[11px] text-ink-muted">
            Token disimpan lokal di perangkatmu (IndexedDB) dan tidak pernah ikut ter-ekspor
            bersama file save.
          </p>
        </div>
      )}
    </div>
  );
}
