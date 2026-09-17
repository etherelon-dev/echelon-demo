import type { Job } from "@/types/job";

/**
 * "Pengemudi ojek online" diberi availableFromYear 2015 — aplikasi Gojek
 * baru meluncur Januari 2015 (sebelumnya sejak 2010 baru layanan
 * call-center konvensional, belum ada aplikasi ojek daring).
 */
export const JOB_CATALOG: Job[] = [
  { id: "buruh_cuci", title: "Buruh cuci", category: "jasa", minEducation: 0, minReputation: 0, wagePerHour: 8_000, hoursPerShift: 6 },
  { id: "pedagang_kaki_lima", title: "Pedagang kaki lima", category: "dagang", minEducation: 0, minReputation: 0, wagePerHour: 10_000, hoursPerShift: 8 },
  { id: "kasir_minimarket", title: "Kasir minimarket", category: "ritel", minEducation: 25, minReputation: 5, wagePerHour: 12_000, hoursPerShift: 8 },
  { id: "satpam", title: "Satpam", category: "keamanan", minEducation: 20, minReputation: 10, wagePerHour: 13_000, hoursPerShift: 12 },
  { id: "sopir_angkot", title: "Sopir angkot", category: "transportasi", minEducation: 10, minReputation: 5, wagePerHour: 11_000, hoursPerShift: 10 },
  {
    id: "ojek_online",
    title: "Pengemudi ojek online",
    category: "transportasi",
    minEducation: 15,
    minReputation: 5,
    requiredItemProductId: "motor_bekas",
    wagePerHour: 15_000,
    hoursPerShift: 8,
    availableFromYear: 2015,
    availableFromYearNote: "aplikasi ojek online (Gojek) baru meluncur Januari 2015",
  },
  {
    id: "admin_toko",
    title: "Admin toko",
    category: "administrasi",
    minEducation: 35,
    minReputation: 10,
    requiredSkillId: "komputer",
    requiredSkillLevel: 15,
    wagePerHour: 14_000,
    hoursPerShift: 8,
    skillGained: { skillId: "komputer", amountPerShift: 1 },
  },
  {
    id: "guru_les",
    title: "Guru les privat",
    category: "pendidikan",
    minEducation: 45,
    minReputation: 15,
    wagePerHour: 25_000,
    hoursPerShift: 3,
    skillGained: { skillId: "mengajar", amountPerShift: 1 },
  },
  {
    id: "programmer_junior",
    title: "Programmer junior",
    category: "teknologi",
    minEducation: 55,
    minReputation: 15,
    requiredSkillId: "pemrograman",
    requiredSkillLevel: 30,
    wagePerHour: 35_000,
    hoursPerShift: 8,
    skillGained: { skillId: "pemrograman", amountPerShift: 0.5 },
  },
];

export function getJob(id: string): Job | null {
  return JOB_CATALOG.find((j) => j.id === id) ?? null;
}

export function isJobAvailable(job: Job, simYear: number): boolean {
  return job.availableFromYear == null || simYear >= job.availableFromYear;
}

export function listAvailableJobs(simYear: number): Job[] {
  return JOB_CATALOG.filter((j) => isJobAvailable(j, simYear));
}
