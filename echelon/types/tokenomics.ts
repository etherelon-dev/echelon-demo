export type AllocationId = "founder" | "liquidity" | "ecosystem" | "community";

export type Allocation = {
  id: AllocationId;
  name: string;
  shortName: string;
  percentage: number;
  amount: string;
  amountShort: string;
  vesting: string;
  purpose: string;
  description: string;
  colorVar: string;
};

export type UtilityCategory = {
  title: string;
  description: string;
};

export type FlowStep = {
  label: string;
  detail?: string;
};

export type TransparencyPoint = {
  label: string;
};
