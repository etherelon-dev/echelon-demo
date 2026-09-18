import type { DocPage } from "@/types/docs";

export const technologyDocs: DocPage[] = [
  {
    slug: "architecture",
    group: "Technology",
    order: 29,
    navTitle: "Architecture",
    title: "Architecture",
    description: "Game-first. Blockchain-backed.",
    blocks: [
      {
        type: "lead",
        text: "Echelon separates the fast gameplay layer from the blockchain settlement layer. Players interact with the game normally; the backend processes actions; important state is periodically committed to blockchain infrastructure."
      },
      {
        type: "diagram",
        steps: [
          { label: "Player" },
          { label: "Game client" },
          { label: "Echelon game server" },
          { label: "Action execution engine" },
          { label: "State processing" },
          { label: "Batching" },
          { label: "Compression" },
          { label: "Blockchain settlement" }
        ]
      },
      {
        type: "paragraph",
        text: "This split is what lets Echelon keep gameplay fast and low-friction while still giving important state a verifiable, permanent home. Each layer does one job."
      },
      {
        type: "heading",
        level: 2,
        text: "What this architecture is designed to preserve"
      },
      {
        type: "list",
        items: [
          "Fast gameplay",
          "Low friction",
          "Persistent state",
          "Verifiable ownership",
          "Efficient blockchain usage"
        ]
      }
    ]
  },
  {
    slug: "game-engine",
    group: "Technology",
    order: 30,
    navTitle: "Game Engine",
    title: "Game Engine",
    description: "Where the actual gameplay runs.",
    blocks: [
      {
        type: "lead",
        text: "The Echelon game server and its action execution engine are where gameplay actually happens — territory changes, resource production, combat resolution, and everything else players do moment to moment."
      },
      {
        type: "paragraph",
        text: "This layer is built to run at normal game speed. A player claiming territory or issuing an order isn't waiting on a blockchain confirmation — they're interacting with the engine directly, the same way they would in any well-built strategy game."
      },
      {
        type: "paragraph",
        text: "The engine's output — state changes that matter — is what eventually flows downstream into batching and blockchain settlement, covered next."
      }
    ]
  },
  {
    slug: "blockchain-layer",
    group: "Technology",
    order: 31,
    navTitle: "Blockchain Layer",
    title: "Blockchain Layer",
    description: "Used selectively, not for every interaction.",
    blocks: [
      {
        type: "lead",
        text: "Blockchain in Echelon is responsible for the state that's actually worth making permanent and verifiable — not every gameplay interaction."
      },
      {
        type: "heading",
        level: 2,
        text: "What can live on-chain"
      },
      {
        type: "list",
        items: [
          "Territory ownership",
          "Important asset ownership",
          "Titles",
          "Kingdom ownership",
          "Historical state",
          "State commitments",
          "Critical economic state"
        ]
      },
      {
        type: "callout",
        variant: "guardrail",
        text: "Not every gameplay interaction goes directly on-chain. Blockchain is used selectively, for the state that benefits from permanence and independent verification."
      }
    ]
  },
  {
    slug: "why-arbitrum",
    group: "Technology",
    order: 32,
    navTitle: "Why Arbitrum",
    title: "Why Arbitrum?",
    description: "The initial blockchain choice, and why.",
    blocks: [
      {
        type: "lead",
        text: "Echelon plans to build on the Arbitrum ecosystem: an EVM-compatible environment with strong Ethereum compatibility and mature tooling."
      },
      {
        type: "cards",
        columns: 2,
        items: [
          {
            title: "EVM compatibility",
            text: "Developers can use familiar Ethereum tooling and Solidity-based infrastructure."
          },
          {
            title: "Ethereum ecosystem",
            text: "Arbitrum is connected to the broader Ethereum ecosystem and its network effects."
          },
          {
            title: "Low-cost execution",
            text: "Designed to provide meaningfully cheaper execution than Ethereum mainnet for typical application activity."
          },
          {
            title: "Scalability",
            text: "A rollup architecture built for applications that need more throughput than Ethereum L1 can economically handle directly."
          },
          {
            title: "Developer ecosystem",
            text: "Established EVM wallets, tooling, libraries, explorers, and developer knowledge to build on."
          },
          {
            title: "Future flexibility",
            text: "Room to grow from a shared environment into more dedicated infrastructure as Echelon scales."
          }
        ]
      },
      {
        type: "callout",
        variant: "guardrail",
        text: "Arbitrum does not guarantee infinite scalability or zero fees, and Echelon has not committed to launching its own Orbit chain."
      },
      {
        type: "heading",
        level: 2,
        text: "Arbitrum One vs. Echelon Orbit"
      },
      {
        type: "compare",
        columns: [
          {
            title: "Arbitrum One",
            points: [
              "A public Ethereum Layer-2 shared by many applications",
              "Suitable for early deployment and prototypes",
              "Home for Echelon's initial smart contracts",
              "Straightforward path into the broader ecosystem"
            ]
          },
          {
            title: "Arbitrum Orbit",
            tag: "Potential future direction",
            points: [
              "A framework for creating dedicated Arbitrum-based chains",
              "Greater control over infrastructure and configuration",
              "A dedicated execution environment for game activity",
              "More control over economics and technical parameters"
            ]
          }
        ]
      },
      {
        type: "diagram",
        orientation: "horizontal",
        caption: "A potential future architecture — not a finalized commitment.",
        steps: [
          { label: "Ethereum" },
          { label: "Arbitrum ecosystem" },
          { label: "Echelon dedicated chain" },
          { label: "Echelon game" }
        ]
      },
      {
        type: "callout",
        variant: "planned",
        text: "This is a potential long-term direction, not a finalized commitment."
      }
    ]
  },
  {
    slug: "transaction-model",
    group: "Technology",
    order: 33,
    navTitle: "Transaction Model",
    title: "Transaction Model",
    description: "A player action is not the same thing as a blockchain transaction.",
    blocks: [
      {
        type: "lead",
        text: "A player action does not necessarily equal one blockchain transaction. That distinction is the core of how Echelon stays playable at scale."
      },
      {
        type: "diagram",
        steps: [
          { label: "10,000 gameplay actions" },
          { label: "Processed by the backend" },
          { label: "State transitions calculated" },
          { label: "Compressed / batched" },
          { label: "A much smaller number of blockchain operations" }
        ]
      },
      {
        type: "paragraph",
        text: "This is critical to Echelon's scalability and its user experience. Players get immediate feedback from the game engine, while the blockchain layer settles the important parts of that activity on its own cadence."
      }
    ]
  },
  {
    slug: "batching-compression",
    group: "Technology",
    order: 34,
    navTitle: "Batching & Compression",
    title: "Batching & Compression",
    description: "How thousands of actions become a handful of transactions.",
    blocks: [
      {
        type: "lead",
        text: "Batching and compression are what make Echelon's transaction model work in practice — turning a high volume of gameplay activity into a small number of efficient blockchain operations."
      },
      {
        type: "paragraph",
        text: "Instead of writing every state change individually, the backend accumulates state transitions, calculates the net result, and commits that result in batches. Compression reduces the size of what actually needs to be written on-chain."
      },
      {
        type: "callout",
        variant: "info",
        text: "This is the same mechanism referenced in the Transaction Model diagram — batching and compression are the two steps that sit between raw gameplay activity and blockchain settlement."
      }
    ]
  },
  {
    slug: "blockchain-state",
    group: "Technology",
    order: 35,
    navTitle: "Blockchain State",
    title: "Blockchain State",
    description: "What's actually written, and why it's kept minimal.",
    blocks: [
      {
        type: "lead",
        text: "Blockchain state is the subset of Echelon's world that has been committed on-chain — the parts of the game deliberately chosen to be permanent and independently verifiable."
      },
      {
        type: "paragraph",
        text: "Keeping this subset deliberately minimal is a design choice, not a limitation. It's what allows Echelon to combine a fast, responsive game with a meaningful, verifiable ownership layer, instead of forcing a tradeoff between the two."
      }
    ]
  },
  {
    slug: "wallet-ux",
    group: "Technology",
    order: 36,
    navTitle: "Wallet & UX Philosophy",
    title: "Wallet & UX Philosophy",
    description: "Blockchain should be invisible when it doesn't need to be visible.",
    blocks: [
      {
        type: "lead",
        text: "Echelon's goal for wallet interaction is simple: blockchain should be invisible to the player when it does not need to be visible."
      },
      {
        type: "compare",
        columns: [
          {
            title: "Typical Web3 flow",
            points: [
              "Connect wallet",
              "Approve",
              "Sign",
              "Wait",
              "Confirm",
              "Continue"
            ]
          },
          {
            title: "Echelon's target flow",
            emphasis: true,
            points: ["Click action", "Action executed", "Game continues"]
          }
        ]
      },
      {
        type: "paragraph",
        text: "Getting there is expected to involve account abstraction, relayers, session-based authorization, batching, and sponsored transactions, depending on the final architecture."
      },
      {
        type: "callout",
        variant: "planned",
        text: "These systems are not already implemented. They represent target architecture — the direction Echelon is designed toward, not a description of what exists today."
      }
    ]
  }
];
