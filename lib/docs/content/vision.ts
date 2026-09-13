import type { DocPage } from "@/types/docs";

export const visionDocs: DocPage[] = [
  {
    slug: "the-problem",
    group: "Vision",
    order: 37,
    navTitle: "The Problem",
    title: "The Problem",
    description: "What Echelon is built to fix.",
    blocks: [
      {
        type: "lead",
        text: "Echelon exists because both traditional strategy games and Web3 games leave something on the table. Neither side fully solves the other's weaknesses."
      },
      {
        type: "heading",
        level: 2,
        text: "Web3 friction"
      },
      {
        type: "paragraph",
        text: "Many Web3 games require players to repeatedly connect wallets, approve transactions, sign transactions, pay gas, and wait for confirmation. This can destroy game flow — the exact opposite of what a fast-moving strategy game needs."
      },
      {
        type: "heading",
        level: 2,
        text: "Blockchain-first game design"
      },
      {
        type: "paragraph",
        text: "Some Web3 games make blockchain mechanics the center of the experience instead of gameplay. The token becomes the point, and the game becomes secondary."
      },
      {
        type: "heading",
        level: 2,
        text: "Limited player agency"
      },
      {
        type: "paragraph",
        text: "Traditional strategy games often provide a predefined world controlled primarily by the developer. Players make choices within a script, rather than writing the script themselves."
      },
      {
        type: "heading",
        level: 2,
        text: "Temporary digital worlds"
      },
      {
        type: "paragraph",
        text: "Player achievements and ownership can remain trapped inside centralized game databases — valuable inside the game, and worth nothing the moment the servers go dark."
      },
      {
        type: "heading",
        level: 2,
        text: "Fragmented ownership"
      },
      {
        type: "paragraph",
        text: "Many games lack a persistent, verifiable ownership layer for the things that matter most to a player — the territory, titles, and history they actually built."
      },
      {
        type: "callout",
        variant: "info",
        text: "For how Echelon's architecture responds to these problems, see Architecture and Transaction Model under Technology."
      }
    ]
  },
  {
    slug: "the-market",
    group: "Vision",
    order: 38,
    navTitle: "The Market",
    title: "The Market",
    description: "Where grand strategy and Web3 gaming overlap — and where they don't.",
    blocks: [
      {
        type: "lead",
        text: "Echelon sits at the intersection of grand strategy games, persistent multiplayer worlds, sandbox games, strategy and simulation players, Web3 gaming, and digital ownership."
      },
      {
        type: "paragraph",
        text: "Traditional strategy games provide deep gameplay but usually rely on centralized ownership and developer-controlled persistence. Web3 games provide digital ownership but often sacrifice gameplay quality and introduce significant transaction friction. Echelon is built to take the strength from each side."
      },
      {
        type: "compare",
        columns: [
          {
            title: "Traditional strategy",
            points: ["Deep gameplay", "Centralized ownership"]
          },
          {
            title: "Web3 games",
            points: ["Digital ownership", "Blockchain infrastructure", "Often high friction"]
          },
          {
            title: "Echelon",
            emphasis: true,
            points: [
              "Deep strategy",
              "Persistent world",
              "Player agency",
              "Digital ownership",
              "Low-friction Web3 infrastructure"
            ]
          }
        ]
      }
    ]
  },
  {
    slug: "target-audience",
    group: "Vision",
    order: 39,
    navTitle: "Target Audience",
    title: "Target Audience",
    description: "Built for strategy players first — Web3 fluency is optional.",
    blocks: [
      {
        type: "lead",
        text: "Echelon is designed for anyone drawn to building, ruling, and competing in a persistent world. It's not built exclusively for crypto users."
      },
      {
        type: "cards",
        columns: 2,
        items: [
          {
            title: "Grand strategy players",
            text: "People who enjoy civilization building, territory, warfare, diplomacy, and economics."
          },
          {
            title: "Sandbox / emergent gameplay players",
            text: "Players who enjoy creating their own stories rather than following a fixed narrative."
          },
          {
            title: "MMO / persistent world players",
            text: "Players who enjoy worlds that keep evolving even when they're offline."
          },
          {
            title: "Web3-native players",
            text: "Users already familiar with wallets, digital ownership, and blockchain ecosystems."
          },
          {
            title: "Crypto-curious gamers",
            text: "Traditional gamers interested in ownership who dislike complicated Web3 UX."
          }
        ]
      },
      {
        type: "callout",
        variant: "principle",
        text: "The long-term target is mainstream strategy gamers who don't need to understand blockchain to enjoy the game."
      }
    ]
  },
  {
    slug: "product-vision",
    group: "Vision",
    order: 40,
    navTitle: "Product Vision",
    title: "Product Vision",
    description: "Deep strategy, persistent world, invisible infrastructure.",
    blocks: [
      {
        type: "quote",
        text: "Echelon brings the depth and agency of grand strategy into a persistent player-driven world, while using blockchain as invisible infrastructure for ownership, verification, and history."
      },
      {
        type: "paragraph",
        text: "To create a persistent digital world where players can build civilizations, establish political powers, create economies, and leave behind a history that outlives individual sessions."
      },
      {
        type: "paragraph",
        text: "Long-term, Echelon should become more than a game — a living digital civilization. A player entering the world later should be able to find the visible results of everyone who came before them."
      },
      {
        type: "heading",
        level: 2,
        text: "What a player should be able to find"
      },
      {
        type: "list",
        items: [
          "Established kingdoms",
          "Ancient borders",
          "Historic wars",
          "Famous rulers",
          "Economic powers",
          "Political alliances",
          "Legendary territories",
          "Historic titles"
        ]
      },
      {
        type: "paragraph",
        text: "All of it created through player activity — none of it pre-written."
      }
    ]
  },
  {
    slug: "mission",
    group: "Vision",
    order: 41,
    navTitle: "Mission",
    title: "Mission",
    description: "Blockchain that enhances the game instead of interrupting it.",
    blocks: [
      {
        type: "quote",
        text: "Build a strategy game where blockchain enhances the experience instead of interrupting it."
      },
      {
        type: "cards",
        columns: 3,
        items: [
          { title: "Gameplay first", text: "Make the game fun even without explaining blockchain." },
          { title: "Player agency", text: "Give players meaningful control over the world." },
          { title: "Persistence", text: "Create a world that remembers." },
          { title: "Ownership", text: "Give important digital assets verifiable ownership." },
          { title: "Accessibility", text: "Make Web3 complexity invisible whenever possible." },
          { title: "Scale", text: "Design infrastructure capable of supporting a massive player-driven world." }
        ]
      }
    ]
  },
  {
    slug: "long-term-vision",
    group: "Vision",
    order: 42,
    navTitle: "Long-Term Vision",
    title: "Long-Term Vision",
    description: "How Echelon is meant to evolve over time.",
    blocks: [
      {
        type: "lead",
        text: "Echelon's long-term evolution is organized around phases of capability, not fixed dates. Each phase builds on what the last one proved out."
      },
      {
        type: "phases",
        items: [
          { label: "Phase 1", items: ["Prototype the core game"] },
          { label: "Phase 2", items: ["Persistent multiplayer world"] },
          { label: "Phase 3", items: ["Blockchain ownership and settlement"] },
          { label: "Phase 4", items: ["Large-scale player economy"] },
          { label: "Phase 5", items: ["Potential dedicated Echelon blockchain infrastructure"] }
        ]
      },
      {
        type: "callout",
        variant: "planned",
        text: "No specific dates are attached to these phases. They describe a direction, not a committed schedule."
      }
    ]
  },
  {
    slug: "roadmap",
    group: "Vision",
    order: 43,
    navTitle: "Roadmap",
    title: "Roadmap",
    description: "What's being built, organized by system rather than date.",
    blocks: [
      {
        type: "lead",
        text: "The roadmap below is organized by system. It's deliberately flexible — strategy games live or die on balance, and balance takes iteration."
      },
      {
        type: "phases",
        items: [
          {
            label: "Foundation",
            items: [
              "Core world",
              "Territory system",
              "Player accounts",
              "Map engine",
              "Basic economy"
            ]
          },
          {
            label: "World",
            items: [
              "Territory development",
              "Resources",
              "Population",
              "Infrastructure",
              "Diplomacy",
              "Warfare"
            ]
          },
          {
            label: "Economy",
            items: ["Trade", "Markets", "National economies", "Advanced resources"]
          },
          {
            label: "Ownership",
            items: [
              "Blockchain integration",
              "Territory ownership",
              "Titles",
              "Historical state"
            ]
          },
          {
            label: "Scale",
            items: [
              "High-volume action processing",
              "Advanced batching",
              "Optimization",
              "Potential dedicated infrastructure"
            ]
          }
        ]
      },
      {
        type: "callout",
        variant: "planned",
        text: "Roadmap items are subject to change as development progresses."
      },
      {
        type: "finalCta"
      }
    ]
  }
];
