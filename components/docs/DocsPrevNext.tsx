import { ArrowLeft, ArrowRight } from "lucide-react";
import type { DocPage } from "@/types/docs";

function hrefFor(doc: DocPage): string {
  return doc.slug === "introduction" ? "/docs" : `/docs/${doc.slug}`;
}

export default function DocsPrevNext({
  prev,
  next
}: {
  prev: DocPage | null;
  next: DocPage | null;
}) {
  if (!prev && !next) return null;

  return (
    <div className="mt-12 grid gap-3 border-t border-ink-600 pt-8 sm:grid-cols-2">
      {prev ? (
        <a
          href={hrefFor(prev)}
          className="group flex flex-col gap-1.5 rounded-sm border border-ink-500 p-4 transition-colors duration-200 hover:border-gold-500/40"
        >
          <span className="flex items-center gap-1.5 text-xs text-bone-faint">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            Previous
          </span>
          <span className="font-display text-sm font-medium text-bone group-hover:text-gold-300">
            {prev.navTitle}
          </span>
        </a>
      ) : (
        <div />
      )}

      {next ? (
        <a
          href={hrefFor(next)}
          className="group flex flex-col items-end gap-1.5 rounded-sm border border-ink-500 p-4 text-right transition-colors duration-200 hover:border-gold-500/40"
        >
          <span className="flex items-center gap-1.5 text-xs text-bone-faint">
            Next
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
          <span className="font-display text-sm font-medium text-bone group-hover:text-gold-300">
            {next.navTitle}
          </span>
        </a>
      ) : (
        <div />
      )}
    </div>
  );
}
