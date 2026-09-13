import type { Allocation } from "@/types/tokenomics";

export const TOKEN_NAME = "ECHELON";
export const TOKEN_TICKER = "ECH";
export const TOTAL_SUPPLY = "1,000,000,000,000 ECH";
export const TOTAL_SUPPLY_SHORT = "1T ECH";

export const allocations: Allocation[] = [
  {
    id: "founder",
    name: "Founder",
    shortName: "Founder",
    percentage: 10,
    amount: "100,000,000,000 ECH",
    amountShort: "100B ECH",
    vesting: "3-year vesting",
    purpose: "Long-term alignment with development and growth",
    description:
      "Subject to a three-year vesting schedule designed to align long-term incentives with the development and growth of Echelon. Detailed vesting mechanics to be finalized.",
    colorVar: "--chart-founder"
  },
  {
    id: "liquidity",
    name: "Liquidity & Pools",
    shortName: "Liquidity",
    percentage: 40,
    amount: "400,000,000,000 ECH",
    amountShort: "400B ECH",
    vesting: "Deployment-based",
    purpose: "Initial and ongoing ecosystem liquidity",
    description:
      "Provides the infrastructure required for a functional token economy, supporting initial markets, liquidity pools, ecosystem liquidity, and future market infrastructure. Deployment happens progressively based on ecosystem requirements.",
    colorVar: "--chart-liquidity"
  },
  {
    id: "ecosystem",
    name: "Ecosystem, Investors & Presale",
    shortName: "Ecosystem",
    percentage: 30,
    amount: "300,000,000,000 ECH",
    amountShort: "300B ECH",
    vesting: "To be disclosed",
    purpose: "Strategic participants, presale, and growth initiatives",
    description:
      "Reserved for ecosystem development, strategic participants, investors, presale participants, partnerships, and related growth initiatives. Detailed sub-allocation and vesting schedules will be disclosed before the relevant distribution events.",
    colorVar: "--chart-ecosystem"
  },
  {
    id: "community",
    name: "Community & Airdrop",
    shortName: "Community",
    percentage: 20,
    amount: "200,000,000,000 ECH",
    amountShort: "200B ECH",
    vesting: "No vesting",
    purpose: "Rewards for the people who grow the Echelon ecosystem",
    description:
      "Designed to distribute ECH directly to the people who contribute to the growth and adoption of the Echelon ecosystem, through community rewards, early-adopter recognition, and ongoing campaigns.",
    colorVar: "--chart-community"
  }
];
