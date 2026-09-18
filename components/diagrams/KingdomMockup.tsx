import { Check, Lock } from "lucide-react";
import { kingdomRequirements } from "@/lib/content/kingdomRequirements";

const metThreshold = 4;

export default function KingdomMockup() {
  return (
    <div className="relative border border-ink-500 bg-ink-900/70 p-8">
      <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-gold-400" />
      <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-gold-400" />
      <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-gold-400" />
      <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-gold-400" />

      <div className="flex flex-col gap-1.5 border-b border-ink-600 pb-6">
        <span className="text-xs text-bone-faint">New kingdom</span>
        <span className="font-display text-xl text-bone">Meridian Accord</span>
      </div>

      <ul className="flex flex-col gap-4 py-6">
        {kingdomRequirements.map((requirement, index) => {
          const isMet = index < metThreshold;
          return (
            <li key={requirement.label} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  isMet
                    ? "border-gold-400 bg-gold-500/10 text-gold-300"
                    : "border-ink-500 text-bone-faint"
                }`}
              >
                <Check className="h-3 w-3" strokeWidth={2} />
              </span>
              <div className="flex flex-col">
                <span className={`text-sm ${isMet ? "text-bone" : "text-bone-dim"}`}>
                  {requirement.label}
                </span>
                <span className="text-xs text-bone-faint">{requirement.detail}</span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between gap-4 border-t border-ink-600 pt-6">
        <span className="text-xs text-bone-faint">4 of 6 requirements met</span>
        <div className="flex items-center gap-2 border border-ink-500 px-4 py-2.5 text-sm text-bone-dim">
          <Lock className="h-3.5 w-3.5" strokeWidth={1.75} />
          Establish Kingdom
        </div>
      </div>
    </div>
  );
}
