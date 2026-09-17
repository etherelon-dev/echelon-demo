import { Map, Pickaxe, Landmark, Crown } from "lucide-react";
import type { DomainCard } from "@/types/content";

export const domainCards: DomainCard[] = [
  {
    title: "Territory",
    description: "Claim, develop, defend, and expand your domain.",
    icon: Map
  },
  {
    title: "Resources",
    description:
      "Control natural resources and turn geography into economic power.",
    icon: Pickaxe
  },
  {
    title: "Infrastructure",
    description:
      "Build the systems that transform land into a thriving civilization.",
    icon: Landmark
  },
  {
    title: "Sovereignty",
    description: "Turn influence into political power and establish your own realm.",
    icon: Crown
  }
];
