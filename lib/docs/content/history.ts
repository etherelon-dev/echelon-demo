import type { DocPage } from "@/types/docs";

export const historyDocs: DocPage[] = [
  {
    slug: "digital-ownership",
    group: "History & Ownership",
    order: 25,
    navTitle: "Digital Ownership",
    title: "Digital Ownership",
    description: "Verifiable ownership for the things that matter.",
    blocks: [
      {
        type: "lead",
        text: "Important digital assets and territory states in Echelon can have verifiable ownership — not just a record in a database Echelon controls, but something the player themselves holds."
      },
      {
        type: "paragraph",
        text: "This doesn't mean every gameplay action is a blockchain transaction. It means the things worth remembering — who holds a territory, who carries a title, what a kingdom owns — can be verified independently of Echelon's own servers."
      },
      {
        type: "callout",
        variant: "info",
        text: "For how this is actually implemented without slowing gameplay down, see Blockchain Layer and Transaction Model under Technology."
      }
    ]
  },
  {
    slug: "provenance",
    group: "History & Ownership",
    order: 26,
    navTitle: "Provenance",
    title: "Provenance",
    description: "Where something came from is part of what it is.",
    blocks: [
      {
        type: "lead",
        text: "Provenance is the traceable history behind a territory, title, or asset — who has held it, how it changed hands, and what happened along the way."
      },
      {
        type: "paragraph",
        text: "A territory that changed hands three times in a major war carries a different weight than one that's been quietly held since the world began. Provenance is what makes that difference visible and verifiable, rather than just a story someone tells."
      }
    ]
  },
  {
    slug: "historical-state",
    group: "History & Ownership",
    order: 27,
    navTitle: "Historical State",
    title: "Historical State",
    description: "The world remembers what happened.",
    blocks: [
      {
        type: "lead",
        text: "Historical state is the record of significant events and changes in the world — the wars, the successions, the shifting borders — committed in a way that persists."
      },
      {
        type: "paragraph",
        text: "Not every action needs to be preserved forever. Historical state focuses on the events that actually shape the world: territory changing hands, kingdoms forming or falling, titles being earned."
      },
      {
        type: "callout",
        variant: "info",
        text: "What actually gets written on-chain versus handled off-chain is covered in Blockchain Layer under Technology."
      }
    ]
  },
  {
    slug: "player-driven-history",
    group: "History & Ownership",
    order: 28,
    navTitle: "Player-Driven History",
    title: "Player-Driven History",
    description: "The world's story is written by the people playing it.",
    blocks: [
      {
        type: "lead",
        text: "Echelon doesn't script its own history. The wars that get fought, the kingdoms that rise, the alliances that hold or break — all of it comes from what players actually choose to do."
      },
      {
        type: "paragraph",
        text: "This is the payoff of persistence, ownership, and historical state working together: a world where the map you find today carries the visible result of everyone who's played it before you."
      },
      {
        type: "paragraph",
        text: "Over time, this is meant to produce the things every persistent world eventually needs to feel alive — legendary rulers, famous wars, territories with a reputation. None of it is pre-written. It has to be earned."
      }
    ]
  }
];
