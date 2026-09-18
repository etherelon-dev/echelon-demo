import type { DocBlock, DocHeading } from "@/types/docs";
import { slugify } from "@/lib/docs/slugify";

export function getHeadings(blocks: DocBlock[]): DocHeading[] {
  const seen = new Map<string, number>();
  const headings: DocHeading[] = [];

  for (const block of blocks) {
    if (block.type !== "heading") continue;

    const base = slugify(block.text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;

    headings.push({ id, text: block.text, level: block.level });
  }

  return headings;
}
