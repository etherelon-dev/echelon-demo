"use client";

import { useState } from "react";
import Link from "next/link";
import { useGameStore } from "@/lib/state/gameStore";
import { listAvailableAssets, ASSET_CLASS_LABEL_ID } from "@/lib/simulation/marketRegistry";
import { computeAssetPrice } from "@/lib/simulation/priceEngine";
import { buildPortfolioLines } from "@/lib/simulation/investments";
import { formatRupiah } from "@/lib/format";
import type { AssetClass } from "@/types/market";

const ASSET_CLASS_ORDER: AssetClass[] = ["currency", "stock", "index", "crypto"];
const DEFAULT_NOMINAL = 50_000;

export default function PasarPage() {
  const bundle = useGameStore((s) => s.bundle);
  const buyAsset = useGameStore((s) => s.buyAsset);
  const sellAsset = useGameStore((s) => s.sellAsset);
  const lastTurnError = useGameStore((s) => s.lastTurnError);
  const [nominals, setNominals] = useState<Record<string, number>>({});
  const [sellQuantities, setSellQuantities] = useState<Record<string, number>>({});

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
  const portfolioLines = buildPortfolioLines(character, state.saveId, nowMinute);
  const portfolioTotal = portfolioLines.reduce((sum, l) => sum + l.currentValue, 0);

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <header className="mb-6 flex items-baseline justify-between border-b-2 border-ink pb-4">
        <h1 className="font-heading text-3xl italic text-ink">Pasar</h1>
        <Link href="/game" className="font-ledger text-xs text-brass underline decoration-dotted">
          Kembali
        </Link>
      </header>

      <p className="mb-4 font-ledger text-sm text-ink-muted">
        Uang tunai: {formatRupiah(character.finance.cash)}
      </p>

      {lastTurnError && <p className="mb-4 font-ledger text-xs text-stamp">{lastTurnError}</p>}

      {portfolioLines.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
            Portofolio Saya
          </h2>
          <ul className="divide-y divide-paper-line border-t border-b border-paper-line">
            {portfolioLines.map((line) => {
              const sellQty = sellQuantities[line.holding.id] ?? line.holding.quantity;
              const untung = line.profitLoss >= 0;
              return (
                <li key={line.holding.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-ledger text-sm text-ink">
                      {line.asset.symbol} · {line.holding.quantity.toLocaleString("id-ID", { maximumFractionDigits: 6 })} unit
                    </p>
                    <p className="font-ledger text-xs text-ink-muted">
                      Nilai kini: {formatRupiah(line.currentValue)} ·{" "}
                      <span className={untung ? "text-ink" : "text-stamp"}>
                        {untung ? "+" : ""}
                        {formatRupiah(line.profitLoss)} ({line.profitLossPct.toFixed(1)}%)
                      </span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={line.holding.quantity}
                      step="any"
                      value={sellQty}
                      onChange={(e) =>
                        setSellQuantities((q) => ({ ...q, [line.holding.id]: Number(e.target.value) || 0 }))
                      }
                      className="w-20 border border-ink bg-transparent px-1 py-1 font-ledger text-xs text-ink"
                    />
                    <button
                      onClick={() => sellAsset(line.holding.id, sellQty)}
                      className="border border-ink px-3 py-1 font-ledger text-xs text-ink hover:bg-ink hover:text-paper"
                    >
                      Jual
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-2 flex items-baseline justify-between pt-1">
            <span className="font-ledger text-sm font-medium text-ink">Total nilai portofolio</span>
            <span className="font-ledger text-sm font-medium text-ink">{formatRupiah(portfolioTotal)}</span>
          </div>
        </section>
      )}

      {ASSET_CLASS_ORDER.map((assetClass) => {
        const assets = listAvailableAssets(nowMinute, assetClass);
        if (assets.length === 0) return null;
        return (
          <section key={assetClass} className="mb-8">
            <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
              {ASSET_CLASS_LABEL_ID[assetClass]}
            </h2>
            <ul className="divide-y divide-paper-line border-t border-b border-paper-line">
              {assets.map((asset) => {
                const price = computeAssetPrice(state.saveId, asset, nowMinute);
                const nominal = nominals[asset.id] ?? DEFAULT_NOMINAL;
                const quantity = price > 0 ? nominal / price : 0;
                return (
                  <li key={asset.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-ledger text-sm text-ink">
                        {asset.symbol} — {asset.name}
                      </p>
                      <p className="font-ledger text-xs text-ink-muted">
                        {formatRupiah(price)}/unit
                        {asset.sector ? ` · ${asset.sector}` : ""}
                      </p>
                      {asset.note && <p className="font-ledger text-xs text-ink-muted/70">{asset.note}</p>}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1000}
                          step={1000}
                          value={nominal}
                          onChange={(e) =>
                            setNominals((n) => ({ ...n, [asset.id]: Number(e.target.value) || 0 }))
                          }
                          className="w-24 border border-ink bg-transparent px-1 py-1 font-ledger text-xs text-ink"
                        />
                        <button
                          onClick={() => buyAsset(asset.id, quantity)}
                          className="border border-ink px-3 py-1 font-ledger text-xs text-ink hover:bg-ink hover:text-paper"
                        >
                          Beli
                        </button>
                      </div>
                      <p className="font-ledger text-xs text-ink-muted/70">
                        ≈ {quantity.toLocaleString("id-ID", { maximumFractionDigits: 6 })} unit
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <p className="font-ledger text-xs text-ink-muted">
        Harga di atas bergerak sendiri seiring waktu (naik-turun, mengikuti simulasi acak
        ber-seed) — perkiraan unit yang ditampilkan bisa sedikit berubah antara saat kamu
        melihat harga dan saat transaksi benar-benar selesai.
      </p>
    </main>
  );
}
