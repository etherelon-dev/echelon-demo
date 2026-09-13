import type { SocialLink } from "@/types/content";
import { DOCS_URL, TELEGRAM_URL } from "@/lib/content/links";

export const socialLinks: SocialLink[] = [
  { label: "X / Twitter", href: "https://x.com/echelon", comingSoon: true },
  { label: "Telegram", href: TELEGRAM_URL },
  { label: "Discord", href: "https://discord.gg/echelon", comingSoon: true },
  { label: "Docs", href: DOCS_URL }
];
