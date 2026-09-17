import { Send, MessageSquare, X as XIcon, MessagesSquare } from "lucide-react";
import type { CommunityPlatform } from "@/types/content";
import { TELEGRAM_URL } from "@/lib/content/links";

export const telegramPlatform: CommunityPlatform = {
  key: "telegram",
  label: "Telegram",
  description:
    "Follow Echelon's latest updates, development progress, announcements, and community discussions.",
  status: "available",
  icon: Send,
  href: TELEGRAM_URL
};

export const upcomingPlatforms: CommunityPlatform[] = [
  {
    key: "discord",
    label: "Discord",
    description:
      "Real-time community discussions, development conversations, and future player coordination.",
    status: "coming-soon",
    icon: MessageSquare
  },
  {
    key: "x",
    label: "X / Twitter",
    description: "Development updates, announcements, and public milestones.",
    status: "coming-soon",
    icon: XIcon
  },
  {
    key: "forum",
    label: "Community Forum",
    description:
      "A dedicated space for deeper discussions, ideas, feedback, and world-building.",
    status: "coming-soon",
    icon: MessagesSquare
  }
];

export const communityPlatforms: CommunityPlatform[] = [
  telegramPlatform,
  ...upcomingPlatforms
];
