import { ArrowDown } from "lucide-react";
import { architectureSteps } from "@/lib/content/architectureSteps";

export default function ArchitectureDiagram() {
  return (
    <div className="flex flex-col items-stretch">
      {architectureSteps.map((step, index) => (
        <div key={step.label} className="flex flex-col items-center">
          <div className="w-full border border-ink-500 bg-ink-900/70 px-6 py-4">
            <p className="font-display text-base font-medium text-bone">
              {step.label}
            </p>
            <p className="text-sm text-bone-dim">{step.detail}</p>
          </div>
          {index !== architectureSteps.length - 1 ? (
            <ArrowDown className="my-2 h-4 w-4 text-gold-400" strokeWidth={1.5} />
          ) : null}
        </div>
      ))}
    </div>
  );
}
