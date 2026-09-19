import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import FlatMap from "@/components/demo/FlatMap";

export const metadata: Metadata = {
  title: "Demo — Echelon",
  description: "A flat map of France, the Mediterranean and North Africa."
};

export default function DemoPage() {
  return (
    <main className="fixed inset-0 overflow-hidden bg-[#090d12]">
      <FlatMap />
      <a
        href="/"
        className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-sm border border-bone/15 bg-ink-800/80 px-3 py-2.5 text-sm text-bone-dim backdrop-blur transition-colors hover:border-gold-400 hover:text-gold-300"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Echelon
      </a>
    </main>
  );
}
