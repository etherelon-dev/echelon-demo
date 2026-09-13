import type { Metadata } from "next";
import type { ReactNode } from "react";
import DocsShell from "@/components/docs/DocsShell";

export const metadata: Metadata = {
  title: {
    template: "%s — Echelon Docs",
    default: "Echelon Docs"
  },
  description:
    "The complete reference for Echelon — a player-driven grand strategy game where territory, economy, and politics are built by players inside a persistent world."
};

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
