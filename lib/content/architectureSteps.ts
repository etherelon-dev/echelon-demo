import type { ArchitectureStep } from "@/types/content";

export const architectureSteps: ArchitectureStep[] = [
  { label: "Player", detail: "Territory, trade, and diplomacy actions" },
  { label: "Echelon game engine", detail: "Real-time execution, no wallet prompts" },
  { label: "Action processing", detail: "Thousands of actions resolved per cycle" },
  { label: "Batching + compression", detail: "State compressed into efficient batches" },
  { label: "Blockchain settlement", detail: "Ownership and history committed on-chain" }
];
