import type { Product } from "@/types/product";
import type { SimulationMinutes } from "@/types/time";
import { minutesToCalendar } from "./time";

/**
 * Barang bermerek/berteknologi tertentu diberi releaseYear NYATA (fakta
 * publik yang cukup pasti). Barang sehari-hari generik diberi
 * releaseYear: null (selalu tersedia) — daripada menebak tanggal yang
 * tidak benar-benar bisa dipastikan.
 */
export const PRODUCT_CATALOG: Product[] = [
  { id: "kaos_polos", name: "Kaos polos", category: "pakaian", price: 35_000, durable: true, depreciationPerMonth: 4, releaseYear: null },
  { id: "sepatu_lokal", name: "Sepatu lokal", category: "pakaian", price: 150_000, durable: true, depreciationPerMonth: 3, releaseYear: null },
  { id: "jaket_kulit", name: "Jaket kulit sintetis", category: "pakaian", price: 250_000, durable: true, depreciationPerMonth: 2, releaseYear: null },

  { id: "ponsel_fitur", name: "Ponsel fitur (candybar)", category: "elektronik", price: 250_000, durable: true, depreciationPerMonth: 2, releaseYear: null },
  { id: "nokia_3310", name: "Nokia 3310", category: "elektronik", price: 450_000, durable: true, depreciationPerMonth: 1, releaseYear: 2000 },
  { id: "iphone_4", name: "iPhone 4", category: "elektronik", price: 4_500_000, durable: true, depreciationPerMonth: 3, releaseYear: 2010 },
  { id: "iphone_5", name: "iPhone 5", category: "elektronik", price: 6_000_000, durable: true, depreciationPerMonth: 3, releaseYear: 2012 },
  { id: "ipad", name: "iPad", category: "elektronik", price: 5_500_000, durable: true, depreciationPerMonth: 2.5, releaseYear: 2010 },
  { id: "ps2", name: "PlayStation 2", category: "elektronik", price: 800_000, durable: true, depreciationPerMonth: 1, releaseYear: 2000 },
  { id: "ps3", name: "PlayStation 3", category: "elektronik", price: 2_500_000, durable: true, depreciationPerMonth: 1.5, releaseYear: 2006 },
  { id: "televisi_tabung", name: "Televisi tabung", category: "elektronik", price: 700_000, durable: true, depreciationPerMonth: 1, releaseYear: null },
  { id: "laptop_entry", name: "Laptop entry-level", category: "elektronik", price: 3_500_000, durable: true, depreciationPerMonth: 3, releaseYear: null },

  { id: "sepeda", name: "Sepeda bekas", category: "kendaraan", price: 400_000, durable: true, depreciationPerMonth: 1, releaseYear: null },
  { id: "motor_bekas", name: "Sepeda motor bekas 110cc", category: "kendaraan", price: 6_000_000, durable: true, depreciationPerMonth: 1.5, releaseYear: null },

  { id: "kasur_lipat", name: "Kasur lipat", category: "perabotan", price: 300_000, durable: true, depreciationPerMonth: 1.5, releaseYear: null },
  { id: "kompor_gas_1tungku", name: "Kompor gas 1 tungku", category: "perabotan", price: 150_000, durable: true, depreciationPerMonth: 1, releaseYear: null },
  { id: "kipas_angin", name: "Kipas angin berdiri", category: "perabotan", price: 200_000, durable: true, depreciationPerMonth: 1, releaseYear: null },

  {
    id: "kontrakan_petak",
    name: "Kontrakan petak sederhana",
    category: "hunian",
    price: 300_000,
    durable: false,
    releaseYear: null,
    recurringExpense: { category: "sewa", frequency: "monthly", amount: 350_000 },
  },
  {
    id: "listrik_prabayar",
    name: "Langganan listrik token prabayar",
    category: "utilitas",
    price: 50_000,
    durable: false,
    releaseYear: null,
    recurringExpense: { category: "listrik", frequency: "monthly", amount: 100_000 },
  },
];

export function getProduct(id: string): Product | null {
  return PRODUCT_CATALOG.find((p) => p.id === id) ?? null;
}

/** Anti-anakronisme: produk hanya bisa dibeli jika sudah pernah rilis dan belum ditarik dari pasar. */
export function isProductAvailable(product: Product, nowMinute: SimulationMinutes): boolean {
  const year = minutesToCalendar(nowMinute).year;
  if (product.releaseYear !== null && year < product.releaseYear) return false;
  if (product.discontinuedYear != null && year > product.discontinuedYear) return false;
  return true;
}

export function listAvailableProducts(nowMinute: SimulationMinutes): Product[] {
  return PRODUCT_CATALOG.filter((p) => isProductAvailable(p, nowMinute));
}
