import type { DocPage } from "@/types/docs";

export const powerDocs: DocPage[] = [
  {
    slug: "kingdoms",
    group: "Power & Politics",
    order: 11,
    navTitle: "Kingdoms",
    title: "Kingdoms",
    description: "How territory becomes a political entity with a name.",
    blocks: [
      {
        type: "lead",
        text: "Kingdoms are how Echelon turns individual territorial strength into political entities other players have to reckon with."
      },
      {
        type: "paragraph",
        text: "Progression from a single holding to a kingdom follows a conceptual path. The exact thresholds may evolve during development, but the shape of the progression is consistent."
      },
      {
        type: "diagram",
        steps: [
          { label: "Territory" },
          { label: "Settlement" },
          { label: "City" },
          { label: "Regional power" },
          { label: "Kingdom" },
          { label: "Nation / empire" }
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "What forming a kingdom requires"
      },
      {
        type: "list",
        items: [
          "Territory",
          "Population",
          "Economic strength",
          "Stability",
          "Resources",
          "Prestige",
          "Legitimacy"
        ]
      },
      {
        type: "callout",
        variant: "planned",
        text: "These are conceptual progression systems and may evolve during development. The exact requirements are subject to balancing and governance."
      }
    ]
  },
  {
    slug: "nations",
    group: "Power & Politics",
    order: 12,
    navTitle: "Nations",
    title: "Nations",
    description: "What comes after a kingdom holds.",
    blocks: [
      {
        type: "lead",
        text: "A nation, or empire, is what a kingdom can grow into once it demonstrates sustained strength across territory, economy, and politics rather than a single strong season."
      },
      {
        type: "paragraph",
        text: "Where a kingdom can form around one committed group with enough territory and legitimacy, a nation represents a longer track record — surviving conflict, maintaining stability, and holding influence over a wider area."
      },
      {
        type: "callout",
        variant: "info",
        text: "Nations are the top of the political progression ladder described in Kingdoms — the same underlying conditions apply, at greater scale."
      }
    ]
  },
  {
    slug: "sovereignty",
    group: "Power & Politics",
    order: 13,
    navTitle: "Sovereignty",
    title: "Sovereignty",
    description: "What it means for a political entity to actually hold power.",
    blocks: [
      {
        type: "lead",
        text: "Sovereignty is the practical test of a kingdom or nation: can it defend its own borders, govern its own territory, and act with independent authority in the world?"
      },
      {
        type: "paragraph",
        text: "It's earned rather than declared. A political entity can claim a name and a flag, but sovereignty is demonstrated through stability, defense, and recognition from the rest of the world — including rivals."
      },
      {
        type: "paragraph",
        text: "Sovereignty is also what's at stake in warfare and conquest. Losing enough territory, or failing to hold a contested border, can erode it just as surely as building it up strengthens a political entity's standing."
      }
    ]
  },
  {
    slug: "titles-prestige",
    group: "Power & Politics",
    order: 14,
    navTitle: "Titles & Prestige",
    title: "Titles & Prestige",
    description: "Recognition earned through history, not handed out at signup.",
    blocks: [
      {
        type: "lead",
        text: "Titles represent achievement, political power, and historical significance. They're markers of what a player has actually done in the world."
      },
      {
        type: "heading",
        level: 2,
        text: "Example titles"
      },
      {
        type: "cards",
        columns: 4,
        items: [
          { title: "Governor", text: "Administers a territory or settlement." },
          { title: "Duke", text: "Holds authority over a significant region." },
          { title: "King", text: "Rules a recognized kingdom." },
          { title: "Emperor", text: "Rules over a nation spanning multiple kingdoms." },
          { title: "Warlord", text: "Power built and held through military force." },
          { title: "Chancellor", text: "Political authority within a kingdom's leadership." }
        ]
      },
      {
        type: "paragraph",
        text: "Titles aren't static. They can gain history and prestige based on what the player holding them does — a King who successfully defends their kingdom through a major war carries a different weight than one who has never been tested."
      }
    ]
  },
  {
    slug: "diplomacy",
    group: "Power & Politics",
    order: 15,
    navTitle: "Diplomacy",
    title: "Diplomacy",
    description: "An alternative to pure military expansion.",
    blocks: [
      {
        type: "lead",
        text: "Not every path to power runs through an army. Diplomacy is a full alternative track — negotiation, treaties, and political relationships that shape the map without a single battle."
      },
      {
        type: "list",
        items: [
          "Alliances",
          "Treaties",
          "Trade agreements",
          "Political relationships",
          "Rivalries",
          "Negotiation",
          "Diplomatic influence"
        ]
      },
      {
        type: "paragraph",
        text: "A skilled diplomat can out-maneuver a stronger military power by making conquest more costly than it's worth — through alliances that would retaliate, or trade relationships an aggressor doesn't want to lose."
      }
    ]
  },
  {
    slug: "alliances",
    group: "Power & Politics",
    order: 16,
    navTitle: "Alliances",
    title: "Alliances",
    description: "Shared strength between political entities.",
    blocks: [
      {
        type: "lead",
        text: "Alliances let separate kingdoms or nations act together — for defense, trade, or coordinated expansion — without merging into a single political entity."
      },
      {
        type: "paragraph",
        text: "An alliance is a commitment, not just a badge. It shapes how other players read the map: attacking one member of a strong alliance can mean answering to all of them."
      },
      {
        type: "paragraph",
        text: "Alliances also interact directly with warfare and conquest — a well-placed alliance can deter a war that would otherwise be won on paper by whoever has the bigger army."
      }
    ]
  },
  {
    slug: "warfare",
    group: "Power & Politics",
    order: 17,
    navTitle: "Warfare",
    title: "Warfare",
    description: "Territory can be taken and defended by force.",
    blocks: [
      {
        type: "lead",
        text: "Players can attack and defend territories. Warfare is one of the clearest ways power in Echelon becomes visible on the map, and one of the ways history gets written."
      },
      {
        type: "heading",
        level: 2,
        text: "What warfare can affect"
      },
      {
        type: "list",
        items: [
          "Borders",
          "Ownership",
          "Resources",
          "Economy",
          "Political power",
          "Prestige",
          "Historical records"
        ]
      },
      {
        type: "callout",
        variant: "planned",
        title: "Combat mechanics",
        text: "Detailed combat formulas are still being designed and aren't final. Treat specific mechanics as planned and subject to development."
      }
    ]
  },
  {
    slug: "conquest-borders",
    group: "Power & Politics",
    order: 18,
    navTitle: "Conquest & Borders",
    title: "Conquest & Borders",
    description: "How the map's lines actually move.",
    blocks: [
      {
        type: "lead",
        text: "Borders in Echelon aren't fixed by the developers — they're drawn and redrawn by what players hold, lose, and defend."
      },
      {
        type: "paragraph",
        text: "Conquest is the mechanism behind that movement. A successful campaign can shift a border permanently, folding new territory into a kingdom's holdings and changing the political shape of the region."
      },
      {
        type: "paragraph",
        text: "Because territory carries history, ownership, and population, a conquered territory doesn't reset when it changes hands — its past stays part of the record, even under new rule."
      }
    ]
  }
];
