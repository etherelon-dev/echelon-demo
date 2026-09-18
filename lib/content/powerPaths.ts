import { Swords, ShieldHalf, Handshake, Coins, Mountain, Scale } from "lucide-react";
import type { PowerPath } from "@/types/content";

export const powerPaths: PowerPath[] = [
  {
    title: "Military strength",
    description: "Wage war, defend borders, and take ground by force.",
    icon: Swords
  },
  {
    title: "Economic dominance",
    description: "Command trade and resources until rivals depend on you.",
    icon: Coins
  },
  {
    title: "Territory",
    description: "Expand your holdings and control the map at scale.",
    icon: Mountain
  },
  {
    title: "Diplomacy",
    description: "Form alliances, negotiate terms, and shape the balance of power.",
    icon: Handshake
  },
  {
    title: "Resources",
    description: "Compete for strategic resources that others cannot do without.",
    icon: ShieldHalf
  },
  {
    title: "Political influence",
    description: "Establish hierarchies and set the rules others play by.",
    icon: Scale
  }
];
