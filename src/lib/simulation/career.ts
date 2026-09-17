import type { Character } from "@/types/character";
import type { Job } from "@/types/job";
import type { Money } from "@/types/common";
import type { ValidationResult } from "@/types/common";
import { getJob, isJobAvailable } from "./jobCatalog";
import { getProduct } from "./productCatalog";

const INFORMAL_WAGE: Money = 30_000;

export function canApply(character: Character, job: Job, simYear: number): ValidationResult<true> {
  if (!isJobAvailable(job, simYear)) {
    const note = job.availableFromYearNote ? ` — ${job.availableFromYearNote}` : "";
    return { valid: false, reason: `Pekerjaan ini baru ada mulai tahun ${job.availableFromYear}${note}.` };
  }
  if (character.progression.education < job.minEducation) {
    return { valid: false, reason: `Butuh pendidikan minimal ${job.minEducation}/100.` };
  }
  if (character.progression.reputation < job.minReputation) {
    return { valid: false, reason: `Butuh reputasi minimal ${job.minReputation}/100.` };
  }
  if (job.requiredSkillId) {
    const level = character.progression.skills[job.requiredSkillId] ?? 0;
    if (level < (job.requiredSkillLevel ?? 0)) {
      return { valid: false, reason: `Butuh skill "${job.requiredSkillId}" minimal level ${job.requiredSkillLevel}.` };
    }
  }
  if (job.requiredItemProductId) {
    const owns = character.inventory.some((i) => i.productId === job.requiredItemProductId && i.quantity > 0);
    if (!owns) {
      const product = getProduct(job.requiredItemProductId);
      return { valid: false, reason: `Butuh memiliki ${product?.name ?? job.requiredItemProductId} lebih dulu.` };
    }
  }
  return { valid: true, value: true };
}

export function applyForJob(character: Character, jobId: string, simYear: number): ValidationResult<Character> {
  const job = getJob(jobId);
  if (!job) return { valid: false, reason: "Pekerjaan tidak ditemukan." };
  const check = canApply(character, job, simYear);
  if (!check.valid) return check;
  return { valid: true, value: { ...character, careerJobId: job.id } };
}

export function resignFromJob(character: Character): Character {
  return { ...character, careerJobId: null };
}

export interface WorkShiftResult {
  character: Character;
  wage: Money;
  jobTitle: string;
  shiftMinutes: number;
  skillGain?: { skillId: string; amount: number };
}

/** Karakter tanpa careerJobId tetap bisa "kerja serabutan" harian — upah kecil, tetap deterministik. */
export function workShift(character: Character): WorkShiftResult {
  const job = character.careerJobId ? getJob(character.careerJobId) : null;

  if (!job) {
    return {
      character: {
        ...character,
        finance: { ...character.finance, cash: character.finance.cash + INFORMAL_WAGE },
      },
      wage: INFORMAL_WAGE,
      jobTitle: "Kerja serabutan",
      shiftMinutes: 8 * 60,
    };
  }

  const wage = Math.round(job.wagePerHour * job.hoursPerShift);
  let next: Character = {
    ...character,
    finance: { ...character.finance, cash: character.finance.cash + wage },
    progression: {
      ...character.progression,
      experience: character.progression.experience + Math.round(job.hoursPerShift),
    },
  };

  let skillGain: WorkShiftResult["skillGain"];
  if (job.skillGained) {
    const current = next.progression.skills[job.skillGained.skillId] ?? 0;
    const nextLevel = Math.min(100, current + job.skillGained.amountPerShift);
    next = {
      ...next,
      progression: { ...next.progression, skills: { ...next.progression.skills, [job.skillGained.skillId]: nextLevel } },
    };
    skillGain = { skillId: job.skillGained.skillId, amount: nextLevel - current };
  }

  return { character: next, wage, jobTitle: job.title, shiftMinutes: Math.round(job.hoursPerShift * 60), skillGain };
}
