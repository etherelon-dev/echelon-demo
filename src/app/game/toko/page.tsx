"use client";

import { useState } from "react";
import Link from "next/link";
import { useGameStore } from "@/lib/state/gameStore";
import { listAvailableProducts, getProduct } from "@/lib/simulation/productCatalog";
import { formatRupiah } from "@/lib/format";
import type { ProductCategory } from "@/types/product";

const CATEGORY_LABEL: Record<ProductCategory, string> = {
  pakaian: "Pakaian",
  elektronik: "Elektronik",
  kendaraan: "Kendaraan",
  perabotan: "Perabotan",
  hunian: "Hunian",
  utilitas: "Utilitas",
  lainnya: "Lainnya",
};

export default function TokoPage() {
  const bundle = useGameStore((s) => s.bundle);
  const buyProduct = useGameStore((s) => s.buyProduct);
  const sellItem = useGameStore((s) => s.sellItem);
  const lastTurnError = useGameStore((s) => s.lastTurnError);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

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
  const products = listAvailableProducts(state.nowMinute);
  const byCategory = products.reduce<Record<string, typeof products>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <header className="mb-6 flex items-baseline justify-between border-b-2 border-ink pb-4">
        <h1 className="font-heading text-3xl italic text-ink">Toko</h1>
        <Link href="/game" className="font-ledger text-xs text-brass underline decoration-dotted">
          Kembali
        </Link>
      </header>

      <p className="mb-4 font-ledger text-sm text-ink-muted">
        Uang tunai: {formatRupiah(character.finance.cash)}
      </p>

      {lastTurnError && <p className="mb-4 font-ledger text-xs text-stamp">{lastTurnError}</p>}

      {Object.entries(byCategory).map(([category, items]) => (
        <section key={category} className="mb-8">
          <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
            {CATEGORY_LABEL[category as ProductCategory]}
          </h2>
          <ul className="divide-y divide-paper-line border-t border-b border-paper-line">
            {items.map((product) => {
              const qty = quantities[product.id] ?? 1;
              return (
                <li key={product.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-ledger text-sm text-ink">{product.name}</p>
                    <p className="font-ledger text-xs text-ink-muted">
                      {formatRupiah(product.price)}
                      {product.recurringExpense &&
                        ` + ${formatRupiah(product.recurringExpense.amount)}/bulan`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {product.durable && !product.recurringExpense && (
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={qty}
                        onChange={(e) =>
                          setQuantities((q) => ({ ...q, [product.id]: Number(e.target.value) || 1 }))
                        }
                        className="w-14 border border-ink bg-transparent px-1 py-1 font-ledger text-xs text-ink"
                      />
                    )}
                    <button
                      onClick={() => buyProduct(product.id, product.durable && !product.recurringExpense ? qty : 1)}
                      className="border border-ink px-3 py-1 font-ledger text-xs text-ink hover:bg-ink hover:text-paper"
                    >
                      Beli
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {character.inventory.filter((i) => i.condition !== null).length > 0 && (
        <section>
          <h2 className="mb-2 font-ledger text-sm uppercase tracking-wide text-ink-muted">
            Jual barang
          </h2>
          <ul className="divide-y divide-paper-line border-t border-b border-paper-line">
            {character.inventory
              .filter((i) => i.condition !== null)
              .map((item) => {
                const product = getProduct(item.productId);
                return (
                  <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-ledger text-sm text-ink">{product?.name ?? item.productId}</p>
                      <p className="font-ledger text-xs text-ink-muted">Kondisi: {Math.round(item.condition ?? 0)}%</p>
                    </div>
                    <button
                      onClick={() => sellItem(item.id)}
                      className="border border-ink px-3 py-1 font-ledger text-xs text-ink hover:bg-ink hover:text-paper"
                    >
                      Jual
                    </button>
                  </li>
                );
              })}
          </ul>
        </section>
      )}
    </main>
  );
}
