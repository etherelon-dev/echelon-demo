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

  const reachedIndex = phases.reduce((lastIndex, phase, index) => {
    return phase.status === "completed" || phase.status === "current"
      ? index
      : lastIndex;
  }, -1);

  const fillPercent =
    phases.length > 1 && reachedIndex >= 0
      ? (reachedIndex / (phases.length - 1)) * 100
      : reachedIndex === 0
        ? 100
        : 0;

  return (
    <ol className="relative flex flex-col gap-1">
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-[34px] top-6 w-px overflow-hidden rounded-full bg-ink-500"
      >
        <div
          className="w-full rounded-full bg-gradient-to-b from-gold-300 via-gold-400 to-gold-600 transition-[height] duration-700 ease-out"
          style={{ height: `${fillPercent}%` }}
        />
      </div>

      {phases.map((phase) => {
        const isSelected = selectedId === phase.id;
        return (
          <li
            key={phase.id}
            id={`phase-node-${phase.id}`}
            className="relative z-10 scroll-mt-28"
          >
            <PhaseNode
              phase={phase}
              isSelected={isSelected}
              onSelect={onSelect}
            />
            {isSelected ? (
              <div className="pb-2 pl-[72px] pt-2 lg:hidden">
                <PhaseDetail key={phase.id} phase={phase} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
