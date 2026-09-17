import type { SimulationBundle } from "@/types/simulation";
import type { AIContext } from "@/types/ai";
import { ageInYears, minutesToCalendar } from "@/lib/simulation/time";
import { estimateMonthlyExpenseTotal } from "@/lib/simulation/finance";
import { getJob } from "@/lib/simulation/jobCatalog";
import { getCountry, getCity } from "@/lib/simulation/worldCatalog";
import { calculatePortfolioValue } from "@/lib/simulation/investments";

/**
 * Context builder (MASTER_PROMPT.md #9): kirim hanya yang relevan untuk
 * memutuskan aksi saat ini, bukan seluruh dunia. Fase 4 menambah
 * `location` & `portfolio` — HANYA INFORMASIONAL untuk narasi AI (mis.
 * "Andi baru saja melihat portofolio kriptonya"), BUKAN field yang bisa
 * diubah AI lewat effect bebas: pindah kota/beli-jual aset SELALU lewat
 * jalur terstruktur (lib/simulation/engine.ts::performRelocate/
 * performBuyAsset/performSellAsset), sama seperti jobTitle &
 * recurringExpensesMonthlyTotal di atas yang juga cuma informasional.
 */
const RECENT_TURNS_IN_CONTEXT = 5;

export function buildAIContext(bundle: SimulationBundle): AIContext {
  const { character, state } = bundle;
  const cal = minutesToCalendar(state.nowMinute);
  const age = ageInYears(character.birthMinute, state.nowMinute);
  const birthYear = minutesToCalendar(character.birthMinute).year;

  return {
    date: cal,
    ageYears: age,
    birthYear,
    character: {
      name: character.name,
      gender: character.gender,
      needs: { ...character.needs },
      finance: {
        cash: character.finance.cash,
        bankBalance: character.finance.bankBalance,
        savings: character.finance.savings,
        debt: character.finance.debt,
        recurringExpensesMonthlyTotal: Math.round(estimateMonthlyExpenseTotal(character)),
      },
      jobTitle: character.careerJobId ? (getJob(character.careerJobId)?.title ?? null) : null,
      inventoryItemCount: character.inventory.length,
      progression: {
        education: character.progression.education,
        experience: character.progression.experience,
        reputation: character.progression.reputation,
        skills: { ...character.progression.skills },
      },
      vitalStatus: character.vitalStatus,
      location: {
        countryName: character.location.countryId ? (getCountry(character.location.countryId)?.name ?? null) : null,
        cityName: character.location.cityId ? (getCity(character.location.cityId)?.name ?? null) : null,
      },
      portfolio: {
        holdingCount: character.investments.length,
        estimatedValue: Math.round(calculatePortfolioValue(character, state.saveId, state.nowMinute)),
      },
    },
    recentTurns: state.recentTurns.slice(-RECENT_TURNS_IN_CONTEXT).map((t) => ({
      playerInput: t.playerInput,
      narrativeTitle: t.narrativeTitle,
    })),
  };
}
