import type { LucideIcon } from "lucide-react";

export type RoadmapStatus =
  | "completed"
  | "current"
  | "confirmed"
  | "planned"
  | "coming-soon";

export type RoadmapFilterValue = "all" | RoadmapStatus;

export type MilestoneVariant = "milestone" | "category";

export type RoadmapMilestone = {
  label: string;
  /** Subtle "KEY MILESTONE" treatment. Use sparingly. */
  highlight?: boolean;
  /** Reserved for the single explicitly confirmed token-related milestone. */
  confirmed?: boolean;
  /** True once this milestone is actually live on the site/product today. */
  done?: boolean;
};

export type PhaseProgress = {
  done: number;
  total: number;
  percent: number;
};

export type RoadmapSpotlight = {
  label: string;
  note: string;
};

export type RoadmapPhase = {
  id: string;
  number: number;
  title: string;
  status: RoadmapStatus;
  /** One-line visual-storytelling beat shown next to the title. */
  narrative: string;
  description: string;
  icon: LucideIcon;
  milestones: RoadmapMilestone[];
  /** What to call the milestone count, e.g. "FOUNDATIONAL FEATURES". */
  countLabel: string;
  /** How individual milestone entries should be rendered. */
  milestoneVariant?: MilestoneVariant;
  /** A single prominently-displayed confirmed item, e.g. the tester airdrop. */
  spotlight?: RoadmapSpotlight;
  /** Platform badges, used for the Mobile phase. */
  platforms?: string[];
  /** Cautionary / clarifying disclaimer shown at the bottom of the detail panel. */
  note?: string;
  /** Standout closing line, used for the final "Beyond the Roadmap" phase. */
  closingMessage?: string;
};

export type RoadmapFilterOption = {
  label: string;
  value: RoadmapFilterValue;
};
