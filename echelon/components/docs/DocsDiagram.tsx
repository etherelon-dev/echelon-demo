import { ArrowDown, ArrowRight } from "lucide-react";
import type { DiagramStep } from "@/types/docs";

export default function DocsDiagram({
  steps,
  orientation = "vertical",
  caption
}: {
  steps: DiagramStep[];
  orientation?: "vertical" | "horizontal";
  caption?: string;
}) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div className="my-6 rounded-sm border border-ink-500 bg-ink-800/30 p-6">
      <div
        className={
          isHorizontal
            ? "flex flex-wrap items-center gap-x-3 gap-y-4"
            : "flex flex-col items-start gap-1"
        }
      >
        {steps.map((step, index) => (
          <div
            key={step.label}
            className={isHorizontal ? "flex items-center gap-3" : "flex flex-col"}
          >
            {isHorizontal ? (
              <StepNode step={step} />
            ) : (
              <>
                <StepNode step={step} />
                {index < steps.length - 1 ? (
                  <div className="py-1 pl-4 text-bone-faint">
                    <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                ) : null}
              </>
            )}
            {isHorizontal && index < steps.length - 1 ? (
              <ArrowRight
                className="h-4 w-4 shrink-0 text-bone-faint"
                strokeWidth={1.5}
              />
            ) : null}
          </div>
        ))}
      </div>
      {caption ? (
        <p className="mt-5 border-t border-ink-600 pt-4 text-xs text-bone-faint">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

function StepNode({ step }: { step: DiagramStep }) {
  return (
    <div className="inline-flex flex-col rounded-sm border border-ink-500 bg-ink-900 px-4 py-2.5">
      <span className="font-display text-sm font-medium tracking-wide text-bone">
        {step.label}
      </span>
      {step.detail ? (
        <span className="mt-0.5 text-xs text-bone-dim">{step.detail}</span>
      ) : null}
    </div>
  );
}
