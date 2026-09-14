import PhaseNode from "@/components/roadmap/PhaseNode";
import PhaseDetail from "@/components/roadmap/PhaseDetail";
import type { RoadmapPhase } from "@/types/roadmap";

type RoadmapPathProps = {
  phases: RoadmapPhase[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function RoadmapPath({
  phases,
  selectedId,
  onSelect
}: RoadmapPathProps) {
  if (phases.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-ink-500 px-6 py-12 text-center">
        <p className="text-sm text-bone-faint">
          No phases match this view yet. Try a different filter.
        </p>
      </div>
    );
  }

  return (
    <ol className="relative flex flex-col gap-1">
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-[34px] top-6 w-px bg-ink-500"
      />
      {phases.map((phase) => {
        const isSelected = selectedId === phase.id;
        return (
          <li key={phase.id} className="relative z-10">
            <PhaseNode
              phase={phase}
              isSelected={isSelected}
              onSelect={onSelect}
            />
            {isSelected ? (
              <div className="pb-2 pl-0 pt-2 sm:pl-[72px] lg:hidden">
                <PhaseDetail key={phase.id} phase={phase} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
