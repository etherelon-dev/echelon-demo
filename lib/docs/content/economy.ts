import type { DocPage } from "@/types/docs";

export const economyDocs: DocPage[] = [
  {
    slug: "economy",
    group: "Economy",
    order: 19,
    navTitle: "The Echelon Economy",
    title: "The Echelon Economy",
    description: "A player-driven economy, not a promise of returns.",
    blocks: [
      {
        type: "lead",
        text: "Echelon's economy is built and run by players — production, trade, taxation, and treasuries all flow from decisions made on the map, not from a fixed developer-controlled system."
      },
      {
        type: "heading",
        level: 2,
        text: "What the economy can include"
      },
      {
        type: "cards",
        columns: 3,
        items: [
          { title: "Resources & production", text: "What territories generate and process." },
          { title: "Trade & markets", text: "Supply, demand, and exchange between players." },
          { title: "National economies", text: "Treasury, taxation, and strategic reserves." }
        ]
      },
      {
        type: "callout",
        variant: "guardrail",
        title: "This is a game economy",
        text: "Echelon's economy is designed for gameplay. It is not presented as an investment opportunity, and nothing here should be read as a financial promise."
      }
    ]
  },
  {
    slug: "economy-resources",
    group: "Economy",
    order: 20,
    navTitle: "Resources",
    title: "Resources in the Economy",
    description: "How raw production turns into economic power.",
    blocks: [
      {
        type: "lead",
        text: "Resources are the raw input of the Echelon economy. What a territory produces becomes the starting point for trade, industry, and treasury strength."
      },
      {
        type: "paragraph",
        text: "This is the economic half of resources — for how resources tie into territory and geography itself, see Resources under The World."
      },
      {
        type: "list",
        items: [
          "Strategic resources tied to specific territories",
          "Production feeding infrastructure and industry",
          "Surplus flowing into trade and markets",
          "Reserves supporting a treasury during conflict or expansion"
        ]
      }
    ]
  },
  {
    slug: "trade",
    group: "Economy",
    order: 21,
    navTitle: "Trade",
    title: "Trade",
    description: "Exchange between players, territories, and kingdoms.",
    blocks: [
      {
        type: "lead",
        text: "Trade connects players who have what others need. It rewards specialization — a territory rich in one resource is more valuable when it can reliably move that surplus to someone who wants it."
      },
      {
        type: "paragraph",
        text: "Trade routes can become strategically important in their own right, which is part of why infrastructure and territory control matter beyond simple production numbers."
      }
    ]
  },
  {
    slug: "markets",
    group: "Economy",
    order: 22,
    navTitle: "Markets",
    title: "Markets",
    description: "Where supply and demand actually meet.",
    blocks: [
      {
        type: "lead",
        text: "Markets are where Echelon's supply and demand becomes visible and actionable — the mechanism players use to price, buy, and sell resources and goods."
      },
      {
        type: "paragraph",
        text: "A market's health reflects the state of the world around it. Conflict, blockades, and shifting borders can all move prices just as much as raw production numbers do."
      }
    ]
  },
  {
    slug: "national-economies",
    group: "Economy",
    order: 23,
    navTitle: "National Economies",
    title: "National Economies",
    description: "Treasury, taxation, and economic strength at the state level.",
    blocks: [
      {
        type: "lead",
        text: "Once territory consolidates into a kingdom or nation, its economy consolidates too. A national economy is the aggregate strength of everything its territories produce and trade, managed through treasury and taxation."
      },
      {
        type: "paragraph",
        text: "This is also where economic strength becomes political leverage — a kingdom with a deep treasury can fund wars, buy stability, or outlast rivals in a drawn-out conflict."
      },
      {
        type: "callout",
        variant: "info",
        text: "Economic strength is one of the stated conditions for forming a kingdom in the first place — see Kingdoms in Power & Politics."
      }
    ]
  },
  {
    slug: "player-currencies",
    group: "Economy",
    order: 24,
    navTitle: "Player-Created Currencies",
    title: "Player-Created Currencies",
    description: "A privilege earned by established political entities, not a starting feature.",
    blocks: [
      {
        type: "lead",
        text: "Established political entities may eventually gain the ability to create their own in-game currency. This is a capstone feature — something built up to, not something available from day one."
      },
      {
        type: "heading",
        level: 2,
        text: "Potential conditions"
      },
      {
        type: "list",
        items: [
          "Sufficient territory",
          "Population",
          "Economic power",
          "Stability",
          "Legitimacy",
          "Political development"
        ]
      },
      {
        type: "quote",
        text: "Build enough territory. Build enough power. Build enough legitimacy. Then build an economy of your own."
      },
      {
        type: "callout",
        variant: "planned",
        text: "Exact mechanics for player-created currencies are subject to development and governance, and may change as the system is designed and tested."
      }
    ]
  }
];
