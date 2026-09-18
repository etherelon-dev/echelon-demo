import type { DocPage } from "@/types/docs";

export const worldDocs: DocPage[] = [
  {
    slug: "living-world",
    group: "The World",
    order: 5,
    navTitle: "The Living World",
    title: "The Living World",
    description: "One shared, persistent map — not an instance.",
    blocks: [
      {
        type: "lead",
        text: "Echelon's map is shared and persistent. There is no private instance, no personal copy of the world — everyone plays on the same map, and everyone's actions leave a mark on it."
      },
      {
        type: "paragraph",
        text: "Player holdings range from a single small territory to sprawling political entities comparable to districts, cities, regions, provinces, and eventually larger powers. Where you sit on that range is a result of play, not a starting choice."
      },
      {
        type: "heading",
        level: 2,
        text: "What can happen to a territory"
      },
      {
        type: "list",
        items: [
          "Change ownership",
          "Be developed",
          "Produce resources",
          "Become strategically important",
          "Become part of a kingdom",
          "Become a capital",
          "Become contested"
        ]
      },
      {
        type: "callout",
        variant: "info",
        text: "The world is designed to keep evolving. A quiet, undeveloped corner of the map today can become a contested trade hub once it's next to something valuable."
      }
    ]
  },
  {
    slug: "territories",
    group: "The World",
    order: 6,
    navTitle: "Territories",
    title: "Territories",
    description: "The fundamental building block of the Echelon map.",
    blocks: [
      {
        type: "lead",
        text: "Territory is not a cosmetic collectible. It's a functional component of the game world, and everything else — kingdoms, economies, titles — is ultimately built on top of it."
      },
      {
        type: "paragraph",
        text: "A single territory can carry a lot of information about itself, and that information is what makes it useful, defensible, or valuable to someone else."
      },
      {
        type: "heading",
        level: 2,
        text: "What a territory can contain"
      },
      {
        type: "cards",
        columns: 4,
        items: [
          { title: "Ownership", text: "Who holds it, and under what political affiliation." },
          { title: "Population", text: "The people living and working within it." },
          { title: "Resources", text: "What the land actually produces." },
          { title: "Infrastructure", text: "What's been built to develop it." },
          { title: "Economic activity", text: "Trade and production tied to the territory." },
          { title: "Political affiliation", text: "Which kingdom or nation it belongs to, if any." },
          { title: "Strategic value", text: "Its importance for defense, trade, or expansion." },
          { title: "Historical information", text: "What has happened there, and who it happened to." }
        ]
      }
    ]
  },
  {
    slug: "resources",
    group: "The World",
    order: 7,
    navTitle: "Resources",
    title: "Resources",
    description: "Geography matters — different land means different strength.",
    blocks: [
      {
        type: "lead",
        text: "Different territories hold different natural and strategic resources. Where you hold ground shapes what kind of power you can build from it."
      },
      {
        type: "paragraph",
        text: "Resources aren't just a number that goes up. They flow into the systems that make a territory, and eventually a kingdom, actually matter."
      },
      {
        type: "heading",
        level: 2,
        text: "What resources influence"
      },
      {
        type: "list",
        items: [
          "Development",
          "Industry",
          "Trade",
          "Military capability",
          "Economic strength",
          "Political influence"
        ]
      },
      {
        type: "callout",
        variant: "principle",
        text: "Geography should matter. A resource-rich but poorly defended territory is a very different prospect than a barren but strategically placed one."
      }
    ]
  },
  {
    slug: "infrastructure",
    group: "The World",
    order: 8,
    navTitle: "Infrastructure",
    title: "Infrastructure",
    description: "What turns raw land into a functioning territory.",
    blocks: [
      {
        type: "lead",
        text: "Infrastructure is what a player or a political entity builds on top of a territory to turn its raw potential into something that actually functions."
      },
      {
        type: "paragraph",
        text: "It sits between resources and economy in the gameplay loop: resources are what a territory has, infrastructure is what lets that territory use them, and economy is what happens once it can."
      },
      {
        type: "paragraph",
        text: "Infrastructure is one of the clearest signals of investment. A developed territory is harder to casually take, harder to ignore strategically, and worth more to whoever controls it."
      }
    ]
  },
  {
    slug: "population",
    group: "The World",
    order: 9,
    navTitle: "Population",
    title: "Population",
    description: "The people behind a territory's strength.",
    blocks: [
      {
        type: "lead",
        text: "A territory is more than land — it's the people in it. Population is part of what makes a settlement capable of sustaining a state, and eventually, a kingdom."
      },
      {
        type: "paragraph",
        text: "Population ties directly into political progression: a territory can be strong in resources or infrastructure and still lack the population needed to support a stable, legitimate political entity."
      },
      {
        type: "callout",
        variant: "info",
        text: "Population is one of several conditions behind kingdom formation — see Kingdoms in Power & Politics for how it fits into the bigger picture."
      }
    ]
  },
  {
    slug: "territory-development",
    group: "The World",
    order: 10,
    navTitle: "Territory Development",
    title: "Territory Development",
    description: "How a territory grows from claimed land into real strength.",
    blocks: [
      {
        type: "lead",
        text: "Claiming a territory is the starting point, not the achievement. Development is the process of turning that claim into something valuable — and something worth defending."
      },
      {
        type: "paragraph",
        text: "Development draws on population, resources, and infrastructure together. A developed territory produces more, supports more people, and carries more strategic weight than an equivalent undeveloped one."
      },
      {
        type: "paragraph",
        text: "This is also where the game rewards patience. A wide but undeveloped empire can be more fragile than a smaller, deeply developed one — quantity of land and quality of land are different kinds of strength."
      }
    ]
  }
];
