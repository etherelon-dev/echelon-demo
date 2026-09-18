"use client";

import { useEffect, useState } from "react";
import type { DocHeading } from "@/types/docs";

export default function DocsTableOfContents({
  headings
}: {
  headings: DocHeading[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block" aria-label="On this page">
      <div className="sticky top-28">
        <p className="text-xs font-medium tracking-wide text-bone-faint">
          On this page
        </p>
        <ul className="mt-3 flex flex-col gap-2 border-l border-ink-500">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block border-l-2 py-0.5 pl-3.5 text-[13px] leading-snug transition-colors duration-150 ${
                  heading.level === 3 ? "ml-3" : ""
                } ${
                  activeId === heading.id
                    ? "border-gold-400 text-gold-300"
                    : "border-transparent text-bone-faint hover:text-bone-dim"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
