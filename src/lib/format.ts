export function formatRupiah(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  return `${sign}Rp${Math.abs(Math.round(amount)).toLocaleString("id-ID")}`;
}
