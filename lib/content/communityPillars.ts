import { Compass, Lightbulb, Flag } from "lucide-react";
import type { CommunityPillar } from "@/types/content";

export const communityPillars: CommunityPillar[] = [
  {
    number: "01",
    title: "DISCOVER",
    description:
      "Follow the development of a new kind of persistent strategy world.",
    icon: Compass
  },
  {
    number: "02",
    title: "CONTRIBUTE",
    description:
      "Share ideas, feedback, strategies, and perspectives as Echelon evolves.",
    icon: Lightbulb
  },
  {
    number: "03",
    title: "SHAPE",
    description:
      "Help influence the direction of a world built around player-driven history.",
    icon: Flag
  }
];
