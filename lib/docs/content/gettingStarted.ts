import type { DocPage } from "@/types/docs";

export const gettingStartedDocs: DocPage[] = [
  {
    slug: "introduction",
    group: "Getting Started",
    order: 1,
    navTitle: "Introduction",
    title: "Welcome to Echelon",
    description:
      "A living world where players build, rule, and shape history.",
    blocks: [
      {
        type: "lead",
        text: "Echelon is a player-driven grand strategy game where players control territory, build economies, establish kingdoms, wage wars, form alliances, and create political powers inside a persistent shared world."
      },
      {
        type: "paragraph",
        text: "Unlike traditional strategy games, Echelon is built around persistent player ownership. Nothing resets when you log off. The map, the borders, the economies, and the politics you helped create are still there when you come back — and so is everyone else's."
      },
      {
        type: "paragraph",
        text: "This documentation is the reference for how Echelon works: the world, the systems of power, the economy, the technology underneath it, and where the project is headed. It's written for players and builders alike, and it doesn't assume you already understand blockchain."
      },
      {
        type: "quote",
        text: "Every empire begins with territory. Every kingdom begins with a decision. Every history begins with a player."
      },
      {
        type: "heading",
        level: 2,
        text: "Where to start"
      },
      {
        type: "cards",
        columns: 3,
        items: [
          {
            title: "What is Echelon?",
            text: "The short version of the product, and what it deliberately is not."
          },
          {
            title: "The World",
            text: "Territory, resources, and how the map actually works."
          },
          {
            title: "Technology",
            text: "How gameplay stays fast while ownership settles on-chain."
          }
        ]
      }
    ]
  },
  {
    slug: "what-is-echelon",
    group: "Getting Started",
    order: 2,
    navTitle: "What is Echelon?",
    title: "What is Echelon?",
    description: "A grand strategy world, not a token game.",
    blocks: [
      {
        type: "lead",
        text: "Echelon is a persistent grand strategy world where blockchain technology is used selectively — for ownership, verification, settlement, and historical permanence."
      },
      {
        type: "paragraph",
        text: "It helps to say plainly what Echelon is not. It is not an NFT game built around collecting art. It is not a token game dressed up with a map. It is not a blockchain simulator, and it is not a traditional strategy game with NFTs bolted onto the side."
      },
      {
        type: "paragraph",
        text: "It is a strategy game first. Territory, economy, diplomacy, and warfare are the actual gameplay. Blockchain is the layer underneath that makes meaningful ownership and permanent history possible — and it stays out of the way while you play."
      },
      {
        type: "callout",
        variant: "principle",
        title: "The rule of thumb",
        text: "The player experience should feel like a high-quality strategy game. The complexity of blockchain should stay behind the scenes."
      },
      {
        type: "heading",
        level: 2,
        text: "What players actually do"
      },
      {
        type: "list",
        items: [
          "Claim and develop territory",
          "Extract and trade resources",
          "Build settlements into cities, kingdoms, and nations",
          "Negotiate treaties and form alliances",
          "Wage war and defend borders",
          "Build economies — including, eventually, their own currencies"
        ]
      }
    ]
  },
  {
    slug: "core-philosophy",
    group: "Getting Started",
    order: 3,
    navTitle: "Core Philosophy",
    title: "Core Philosophy",
    description: "Six principles that shape every design decision in Echelon.",
    blocks: [
      {
        type: "lead",
        text: "Everything in Echelon — from how territory works to why a transaction is batched instead of sent immediately — traces back to a small set of principles."
      },
      {
        type: "cards",
        columns: 2,
        items: [
          {
            title: "Player agency",
            text: "Players should have meaningful influence over the world, not just cosmetic choices inside a fixed script."
          },
          {
            title: "Persistence",
            text: "The world continues to exist beyond individual play sessions. It doesn't wait for you, and it doesn't reset."
          },
          {
            title: "Ownership",
            text: "Important digital assets and territory states can have verifiable ownership, not just a database row on Echelon's servers."
          },
          {
            title: "Consequence",
            text: "Actions can have lasting consequences. A war, a treaty, or a collapse leaves a mark on the world."
          },
          {
            title: "Emergent history",
            text: "The history of Echelon should emerge from player actions rather than being entirely scripted by developers."
          },
          {
            title: "Invisible Web3",
            text: "Blockchain should reduce friction, not create it. If a player notices it, something has gone wrong."
          }
        ]
      },
      {
        type: "diagram",
        orientation: "horizontal",
        steps: [
          { label: "Players", detail: "interact with the game" },
          { label: "The game", detail: "interacts with the blockchain" }
        ]
      }
    ]
  },
  {
    slug: "how-it-works",
    group: "Getting Started",
    order: 4,
    navTitle: "How Echelon Works",
    title: "How Echelon Works",
    description: "The complete gameplay loop, from player to historical legacy.",
    blocks: [
      {
        type: "lead",
        text: "Echelon's gameplay loop connects individual decisions to world-scale outcomes. There's no single path through it — and no single path to power."
      },
      {
        type: "diagram",
        steps: [
          { label: "Player" },
          { label: "Territory" },
          { label: "Development" },
          { label: "Resources" },
          { label: "Economy" },
          { label: "Power" },
          { label: "Politics" },
          { label: "Conflict / diplomacy" },
          { label: "Expansion" },
          { label: "Kingdom / nation" },
          { label: "Historical legacy" }
        ]
      },
      {
        type: "paragraph",
        text: "A player can move through this loop in almost any order, and can lean into whichever part of it suits their playstyle. Power in Echelon isn't a single meter — it's the sum of several different kinds of strength."
      },
      {
        type: "heading",
        level: 2,
        text: "Paths to power"
      },
      {
        type: "list",
        items: [
          "Military dominance",
          "Economic strength",
          "Territory",
          "Resources",
          "Diplomacy",
          "Political influence",
          "Strategic positioning"
        ]
      },
      {
        type: "callout",
        variant: "info",
        text: "A player with no army can still become a regional power through trade, resource control, and alliances. A player with no allies can still hold ground through force and fortification."
      }
    ]
  }
];
