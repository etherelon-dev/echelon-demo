import type { Money } from "@/types/common";
import type { SimulationMinutes } from "@/types/time";
import type { TradableAsset } from "@/types/market";
import { rngForTick, type RandomFn } from "./rng";

/**
 * Fase 4 — mesin harga aset finansial (mata uang, saham, indeks, kripto).
 *
 * PRINSIP SAMA SEPERTI lib/simulation/randomEvents.ts + lib/simulation/rng.ts:
 * harga TIDAK PERNAH disimpan sebagai time-series di save (itu akan
 * membuat save membengkak tanpa batas seiring waktu simulasi berjalan).
 * Sebaliknya, harga DIHITUNG ULANG deterministik setiap dibutuhkan dari
 * `saveId + assetId + waktu simulasi` lewat random walk log-normal
 * ber-seed (geometric Brownian motion harian) — save+waktu yang sama
 * SELALU menghasilkan harga yang sama, jadi tetap bisa diuji & tidak
 * bergantung `Math.random()` global.
 *
 * CATATAN JUJUR: annualDriftPct/annualVolatilityPct di katalog aset
 * (lib/simulation/currencyCatalog.ts, stockCatalog.ts, indexCatalog.ts,
 * cryptoCatalog.ts) adalah PARAMETER GAYA BERMAIN yang dipilih supaya
 * terasa masuk akal (mis. kripto jauh lebih liar dari mata uang), BUKAN
 * hasil riset/klaim bahwa harga yang muncul mereplikasi harga historis
 * nyata di dunia nyata. Ini simulasi fiksi.
 */

const MINUTES_PER_DAY = 60 * 24;
const DAYS_PER_YEAR = 365;

/** Box-Muller: mengubah dua angka acak uniform [0,1) jadi satu angka acak normal-standar (mean 0, stdev 1). */
function nextGaussian(rng: RandomFn): number {
  const u1 = Math.max(rng(), 1e-9); // hindari log(0)
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/** RNG deterministik untuk satu HARI perdagangan suatu aset pada suatu save — namespace terpisah dari rngForTick peristiwa dunia (lib/simulation/randomEvents.ts) supaya tidak saling memengaruhi meski dipanggil pada menit yang sama. */
function rngForAssetDay(saveId: string, assetId: string, dayIndex: number): RandomFn {
  return rngForTick(`asset:${saveId}:${assetId}`, dayIndex);
}

/** true jika aset ini sudah "ada"/bisa diperdagangkan pada waktu simulasi tsb — anti-anakronisme, sama seperti isProductAvailable()/isJobAvailable() di Fase 3. */
export function isAssetAvailable(asset: TradableAsset, atMinute: SimulationMinutes): boolean {
  return atMinute >= asset.genesisMinute;
}

/**
 * Harga aset (dalam Rupiah per unit) pada waktu simulasi tertentu.
 * Sebelum genesisMinute selalu mengembalikan basePrice (aset belum
 * "diperdagangkan", tidak masuk akal punya harga bergerak).
 */
export function computeAssetPrice(
  saveId: string,
  asset: TradableAsset,
  atMinute: SimulationMinutes
): Money {
  if (atMinute <= asset.genesisMinute) return asset.basePrice;

  const totalDays = Math.floor((atMinute - asset.genesisMinute) / MINUTES_PER_DAY);
  const dailyDrift = asset.annualDriftPct / DAYS_PER_YEAR;
  const dailyVolatility = asset.annualVolatilityPct / Math.sqrt(DAYS_PER_YEAR);

  let logPrice = Math.log(Math.max(asset.basePrice, 0.01));
  for (let day = 0; day < totalDays; day += 1) {
    const rng = rngForAssetDay(saveId, asset.id, day);
    const shock = nextGaussian(rng);
    // Geometric Brownian motion harian: drift - setengah varians (koreksi Itô) + kejutan acak.
    logPrice += dailyDrift - 0.5 * dailyVolatility * dailyVolatility + dailyVolatility * shock;
  }

  // Money (types/common.ts) selalu integer Rupiah — dibulatkan, lantai Rp1
  // supaya harga tidak pernah nol (mencegah pembagian dengan nol di
  // lib/simulation/investments.ts saat menghitung kuantitas dari nominal).
  return Math.max(1, Math.round(Math.exp(logPrice)));
}

export interface AssetPricePoint {
  atMinute: SimulationMinutes;
  price: Money;
}

/**
 * Deret harga tersampel dari genesis (atau `fromMinute` jika lebih baru)
 * sampai `atMinute`, maksimal `maxPoints` titik — dipakai UI untuk grafik
 * ringkas (app/game/pasar). Membangun log-harga dalam SATU pass (bukan
 * memanggil computeAssetPrice() berulang per titik) supaya tetap O(hari),
 * bukan O(hari × titik).
 */
export function computeAssetPriceSeries(
  saveId: string,
  asset: TradableAsset,
  atMinute: SimulationMinutes,
  maxPoints = 24,
  fromMinute?: SimulationMinutes
): AssetPricePoint[] {
  const start = Math.max(asset.genesisMinute, fromMinute ?? asset.genesisMinute);
  if (atMinute <= start) {
    return [{ atMinute, price: computeAssetPrice(saveId, asset, atMinute) }];
  }

  const totalDays = Math.floor((atMinute - asset.genesisMinute) / MINUTES_PER_DAY);
  const startDay = Math.floor((start - asset.genesisMinute) / MINUTES_PER_DAY);
  const dailyDrift = asset.annualDriftPct / DAYS_PER_YEAR;
  const dailyVolatility = asset.annualVolatilityPct / Math.sqrt(DAYS_PER_YEAR);
  const step = Math.max(1, Math.ceil((totalDays - startDay) / maxPoints));

  let logPrice = Math.log(Math.max(asset.basePrice, 0.01));
  const points: AssetPricePoint[] = [];

  for (let day = 0; day <= totalDays; day += 1) {
    if (day > 0) {
      const rng = rngForAssetDay(saveId, asset.id, day - 1);
      const shock = nextGaussian(rng);
      logPrice += dailyDrift - 0.5 * dailyVolatility * dailyVolatility + dailyVolatility * shock;
    }
    if (day >= startDay && (day - startDay) % step === 0) {
      points.push({
        atMinute: asset.genesisMinute + day * MINUTES_PER_DAY,
        price: Math.max(1, Math.round(Math.exp(logPrice))),
      });
    }
  }

  const last = points[points.length - 1];
  if (!last || last.atMinute !== atMinute) {
    points.push({ atMinute, price: Math.max(1, Math.round(Math.exp(logPrice))) });
  }

  return points;
}
