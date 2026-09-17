import type { Money } from "./common";

export interface Job {
  id: string;
  title: string;
  category: string;
  minEducation: number;
  minReputation: number;
  requiredSkillId?: string;
  requiredSkillLevel?: number;
  /** id Product yang wajib dimiliki di inventori, mis. motor untuk ojek online. */
  requiredItemProductId?: string;
  wagePerHour: Money;
  hoursPerShift: number;
  skillGained?: { skillId: string; amountPerShift: number };
  /** Anti-anakronisme profesi: pekerjaan ini baru ada mulai tahun ini. */
  availableFromYear?: number;
  availableFromYearNote?: string;
}
