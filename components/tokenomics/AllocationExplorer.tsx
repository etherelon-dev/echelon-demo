"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import TokenomicsChart from "@/components/tokenomics/TokenomicsChart";
import AllocationCard from "@/components/tokenomics/AllocationCard";
import { allocations } from "@/lib/content/tokenomics";
import type { AllocationId } from "@/types/tokenomics";

export default function AllocationExplorer() {
  const [hoveredId, setHoveredId] = useState<AllocationId | null>(null);
  const [selectedId, setSelectedId] = useState<AllocationId | null>(null);

  const activeId = hoveredId ?? selectedId;

  const handleSelect = (id: AllocationId) => {
    setSelectedId((current) => (current === id ? null : id));
  };

  return (
    <section id="allocation" className="border-t border-ink-600 py-24 sm:py-32">
      <div className="mx-auto flex max-w-content flex-col gap-14 px-6">
        <RevealOnScroll>
          <SectionHeading
            title="WHERE EVERY TOKEN GOES."
            description="Four allocations make up the full 1 trillion ECH supply. Hover or tap a segment to see the detail behind it."
          />
        </RevealOnScroll>

        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <RevealOnScroll>
            <TokenomicsChart
              allocations={allocations}
              activeId={activeId}
              onHover={setHoveredId}
              onSelect={handleSelect}
            />
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <div className="grid gap-4 sm:grid-cols-2">
              {allocations.map((allocation) => (
                <AllocationCard
                  key={allocation.id}
                  allocation={allocation}
                  isActive={activeId === allocation.id}
                  onHover={setHoveredId}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
