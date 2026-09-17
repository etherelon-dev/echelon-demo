"use client";

import { useEffect, useMemo, useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import RoadmapFilters from "@/components/roadmap/RoadmapFilters";
import RoadmapPath from "@/components/roadmap/RoadmapPath";
import PhaseDetail from "@/components/roadmap/PhaseDetail";
import { currentRoadmapPhase, roadmapPhases } from "@/lib/content/roadmap";
import type { RoadmapFilterValue } from "@/types/roadmap";

export default function RoadmapExplorer() {
  const [activeFilter, setActiveFilter] = useState<RoadmapFilterValue>("all");
  const [selectedId, setSelectedId] = useState<string>(
    currentRoadmapPhase.id
  );

  const filteredPhases = useMemo(() => {
    if (activeFilter === "all") return roadmapPhases;
    return roadmapPhases.filter((phase) => phase.status === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    if (filteredPhases.length === 0) return;
    const stillVisible = filteredPhases.some(
      (phase) => phase.id === selectedId
    );
    if (!stillVisible) {
      setSelectedId(filteredPhases[0].id);
    }
  }, [filteredPhases, selectedId]);

  const selectedPhase =
    filteredPhases.find((phase) => phase.id === selectedId) ??
    filteredPhases[0] ??
    null;

  return (
    <div className="flex flex-col gap-10">
      <RevealOnScroll>
        <RoadmapFilters activeFilter={activeFilter} onChange={setActiveFilter} />
      </RevealOnScroll>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-14">
        <RevealOnScroll>
          <RoadmapPath
            phases={filteredPhases}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </RevealOnScroll>

        {selectedPhase ? (
          <div className="hidden lg:sticky lg:top-28 lg:block">
            <PhaseDetail key={selectedPhase.id} phase={selectedPhase} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
