import type { Money } from "./common";
import type { SimulationMinutes } from "./time";

/**
 * Kategori pengeluaran rutin (Fase 3 — "Kehidupan"). "makan" SENGAJA tidak
 * dimodelkan sebagai RecurringExpense — biaya makan ditangani per-aksi oleh
 * lib/simulation/finance.ts::eatMeal() (biaya bervariasi tergantung uang
 * yang dimiliki saat itu), bukan tagihan terjadwal seperti sewa/listrik.
 */
export type ExpenseCategory = "sewa" | "listrik" | "lainnya";

export type ExpenseFrequency = "daily" | "weekly" | "monthly";

/**
 * Komitmen finansial berkelanjutan (mis. sewa kontrakan, langganan
 * listrik) — biasanya muncul karena pemain membeli produk berkategori
 * hunian/utilitas di Toko (lihat lib/simulation/productCatalog.ts,
 * Product.recurringExpense). Diproses otomatis oleh
 * lib/simulation/finance.ts::processRecurringExpenses() setiap kali waktu
 * berjalan, TERLEPAS dari sumbernya (perintah AI, pintasan cepat, atau
 * lompatan waktu polos) — sama seperti peluruhan kebutuhan & bencana acak
 * di lib/simulation/engine.ts.
 */
export interface RecurringExpense {
  id: string;
  label: string;
  category: ExpenseCategory;
  frequency: ExpenseFrequency;
  amount: Money;
  /** Menit simulasi saat tagihan berikutnya jatuh tempo. */
  nextDueMinute: SimulationMinutes;
}
