import type { LucideIcon } from "lucide-react";

export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  comingSoon?: boolean;
};

export type DomainCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type PowerPath = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type Requirement = {
  label: string;
  detail: string;
};

export type ProgressionStep = {
  step: string;
};

export type HistoryEvent = {
  year: string;
  title: string;
};

export type ArchitectureStep = {
  label: string;
  detail: string;
};
