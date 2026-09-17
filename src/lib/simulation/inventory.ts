import type { Character } from "@/types/character";
import type { InventoryItem, Product } from "@/types/product";
import type { ValidationResult } from "@/types/common";
import type { Money } from "@/types/common";
import type { SimulationMinutes } from "@/types/time";
import { generateId } from "@/types/common";
import { getProduct, isProductAvailable } from "./productCatalog";
import { addOrReplaceRecurringExpense } from "./finance";

const MAX_QUANTITY_PER_TRANSACTION = 20;
const RESALE_FACTOR = 0.4;

export interface PurchaseCheck {
  product: Product;
  totalPrice: Money;
}

export function validatePurchase(
  character: Character,
  productId: string,
  quantity: number,
  nowMinute: SimulationMinutes
): ValidationResult<PurchaseCheck> {
  const product = getProduct(productId);
  if (!product) return { valid: false, reason: "Produk tidak ditemukan." };
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_TRANSACTION) {
    return { valid: false, reason: `Jumlah harus 1-${MAX_QUANTITY_PER_TRANSACTION}.` };
  }
  if (!isProductAvailable(product, nowMinute)) {
    const reason =
      product.releaseYear != null
        ? `${product.name} baru ada mulai tahun ${product.releaseYear}.`
        : `${product.name} sudah tidak dijual lagi.`;
    return { valid: false, reason };
  }
  const totalPrice = product.price * quantity;
  if (character.finance.cash < totalPrice) {
    return { valid: false, reason: `Uang tunai tidak cukup (butuh Rp${totalPrice.toLocaleString("id-ID")}).` };
  }
  return { valid: true, value: { product, totalPrice } };
}

/** Menerapkan pembelian yang SUDAH lolos validatePurchase(). Produk hunian/utilitas menambah RecurringExpense, bukan masuk inventori. */
export function applyPurchase(
  character: Character,
  product: Product,
  quantity: number,
  totalPrice: Money,
  nowMinute: SimulationMinutes
): Character {
  let next: Character = {
    ...character,
    finance: { ...character.finance, cash: character.finance.cash - totalPrice },
  };

  if (product.recurringExpense) {
    next = addOrReplaceRecurringExpense(next, {
      id: generateId("expense"),
      label: product.name,
      category: product.recurringExpense.category,
      frequency: product.recurringExpense.frequency,
      amount: product.recurringExpense.amount,
      nextDueMinute:
        product.recurringExpense.frequency === "monthly" ? nowMinute : nowMinute + 60 * 24,
    });
    return next;
  }

  if (product.durable) {
    const newItems: InventoryItem[] = Array.from({ length: quantity }, () => ({
      id: generateId("item"),
      productId: product.id,
      quantity: 1,
      condition: 100,
      acquiredAtMinute: nowMinute,
    }));
    return { ...next, inventory: [...next.inventory, ...newItems] };
  }

  const existing = next.inventory.find((i) => i.productId === product.id && i.condition === null);
  if (existing) {
    return {
      ...next,
      inventory: next.inventory.map((i) =>
        i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
      ),
    };
  }
  return {
    ...next,
    inventory: [
      ...next.inventory,
      { id: generateId("item"), productId: product.id, quantity, condition: null, acquiredAtMinute: nowMinute },
    ],
  };
}

export interface SaleCheck {
  item: InventoryItem;
  product: Product;
  saleValue: Money;
}

export function validateSale(character: Character, inventoryItemId: string): ValidationResult<SaleCheck> {
  const item = character.inventory.find((i) => i.id === inventoryItemId);
  if (!item) return { valid: false, reason: "Barang tidak ditemukan di inventori." };
  const product = getProduct(item.productId);
  if (!product) return { valid: false, reason: "Produk tidak dikenali." };
  if (!product.durable) return { valid: false, reason: "Barang habis pakai tidak bisa dijual kembali." };
  const conditionFraction = (item.condition ?? 100) / 100;
  const saleValue = Math.round(product.price * conditionFraction * RESALE_FACTOR);
  return { valid: true, value: { item, product, saleValue } };
}

export function applySale(character: Character, itemId: string, saleValue: Money): Character {
  return {
    ...character,
    finance: { ...character.finance, cash: character.finance.cash + saleValue },
    inventory: character.inventory.filter((i) => i.id !== itemId),
  };
}

/** Barang durable menyusut kondisinya seiring waktu — dipanggil dari engine.ts di setiap lompatan waktu, sama seperti peluruhan kebutuhan. */
export function depreciateInventory(character: Character, hoursElapsed: number): Character {
  if (hoursElapsed <= 0 || character.inventory.length === 0) return character;

  const nextInventory = character.inventory.map((item) => {
    if (item.condition === null) return item;
    const product = getProduct(item.productId);
    const perHour = (product?.depreciationPerMonth ?? 0) / (30 * 24);
    const nextCondition = Math.max(0, item.condition - perHour * hoursElapsed);
    return { ...item, condition: Math.round(nextCondition * 100) / 100 };
  });

  return { ...character, inventory: nextInventory };
}
