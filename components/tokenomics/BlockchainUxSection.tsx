import { ArrowDown, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import {
  behindTheScenesFlow,
  echelonTargetFlow,
  traditionalWeb3Flow
} from "@/lib/content/blockchainUx";

export default function BlockchainUxSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto flex max-w-content flex-col gap-16 px-6">
        <RevealOnScroll>
          <SectionHeading
            title="BLOCKCHAIN WITHOUT THE FRICTION."
            description="Echelon is designed so players should not need to manually approve a blockchain transaction for every gameplay action."
          />
        </RevealOnScroll>

        <div className="grid gap-10 sm:grid-cols-2">
          <RevealOnScroll>
            <div className="flex flex-col gap-4">
              <p className="text-xs tracking-[0.18em] text-bone-faint">
                TRADITIONAL WEB3 UX
              </p>
              <FlowColumn steps={traditionalWeb3Flow} muted />
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={100}>
            <div className="flex flex-col gap-4">
              <p className="text-xs tracking-[0.18em] text-gold-300">
                ECHELON TARGET UX
              </p>
              <FlowColumn steps={echelonTargetFlow} />
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delayMs={150}>
          <div className="flex flex-col gap-6 border-t border-ink-600 pt-12">
            <p className="text-xs tracking-[0.18em] text-bone-faint">
              BEHIND THE SCENES
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {behindTheScenesFlow.map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="rounded-sm border border-ink-500 bg-ink-800/60 px-4 py-2.5 text-sm text-bone-dim">
                    {step}
                  </span>
                  {index !== behindTheScenesFlow.length - 1 ? (
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-gold-400"
                      strokeWidth={1.5}
                    />
                  ) : null}
                </div>
              ))}
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-bone-dim">
              This architecture is designed to make blockchain infrastructure
              largely invisible during gameplay.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function FlowColumn({ steps, muted = false }: { steps: string[]; muted?: boolean }) {
  return (
    <div className="flex flex-col items-stretch">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-full border px-5 py-3 text-center text-sm ${
              muted
                ? "border-ink-600 bg-transparent text-bone-faint"
                : "border-gold-500/40 bg-ink-800/60 text-bone"
            }`}
          >
            {step}
          </div>
          {index !== steps.length - 1 ? (
            <ArrowDown
              className={`my-1.5 h-3.5 w-3.5 ${
                muted ? "text-ink-400" : "text-gold-400"
              }`}
              strokeWidth={1.5}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
