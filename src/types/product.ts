import type { EntityId, Money } from "./common";
import type { SimulationMinutes } from "./time";
import type { ExpenseCategory, ExpenseFrequency } from "./finance";

export type ProductCategory =
  | "pakaian"
  | "elektronik"
  | "kendaraan"
  | "perabotan"
  | "hunian"
  | "utilitas"
  | "lainnya";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  /** Harga beli sekali bayar (untuk hunian/utilitas: deposit/biaya pasang). */
  price: Money;
  /** Barang tahan lama (punya kondisi 0-100, menyusut seiring waktu) vs habis pakai. */
  durable: boolean;
  /** Hanya untuk durable: poin kondisi (skala 0-100) yang hilang per bulan kepemilikan. */
  depreciationPerMonth?: number;
  /** Tahun produk ini mulai ada di dunia nyata. null = generik, selalu tersedia. */
  releaseYear: number | null;
  /** Tahun produk berhenti dijual baru (opsional). */
  discontinuedYear?: number | null;
  /** Untuk kategori hunian/utilitas: membeli produk ini menambah/mengganti
   * RecurringExpense alih-alih masuk inventori. */
  recurringExpense?: {
    category: ExpenseCategory;
    frequency: ExpenseFrequency;
    amount: Money;
  };
}

export interface InventoryItem {
  id: EntityId;
  productId: string;
  quantity: number;
  /** null untuk barang non-durable. */
  condition: number | null;
  acquiredAtMinute: SimulationMinutes;
}
