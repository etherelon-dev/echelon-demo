import { Link as LinkIcon } from "lucide-react";
import type { DocBlock, DocHeading } from "@/types/docs";
import DocsCard from "@/components/docs/DocsCard";
import DocsCallout from "@/components/docs/DocsCallout";
import DocsDiagram from "@/components/docs/DocsDiagram";
import Button from "@/components/ui/Button";

export default function DocsArticle({
  blocks,
  headings
}: {
  blocks: DocBlock[];
  headings: DocHeading[];
}) {
  let headingCursor = 0;

  return (
    <div className="min-w-0 max-w-[68ch]">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const heading = headings[headingCursor];
          headingCursor += 1;
          return <Heading key={index} id={heading?.id} level={block.level} text={block.text} />;
        }
        return <Block key={index} block={block} />;
      })}
    </div>
  );
}

function Heading({
  id,
  level,
  text
}: {
  id?: string;
  level: 2 | 3;
  text: string;
}) {
  const className =
    level === 2
      ? "group mt-12 mb-4 scroll-mt-28 font-display text-2xl font-semibold text-bone first:mt-0"
      : "group mt-8 mb-3 scroll-mt-28 font-display text-lg font-semibold text-bone";

  const Tag = level === 2 ? "h2" : "h3";

  return (
    <Tag id={id} className={className}>
      <a href={id ? `#${id}` : undefined} className="inline-flex items-center gap-2">
        {text}
        <LinkIcon
          className="h-3.5 w-3.5 shrink-0 text-bone-faint opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          strokeWidth={1.75}
        />
      </a>
    </Tag>
  );
}

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="mb-6 text-lg leading-relaxed text-bone">{block.text}</p>
      );

    case "paragraph":
      return (
        <p className="mb-5 text-[15px] leading-relaxed text-bone-dim">
          {block.text}
        </p>
      );

    case "list":
      return (
        <ul className="mb-6 flex flex-col gap-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-bone-dim">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "callout":
      return (
        <DocsCallout variant={block.variant} title={block.title} text={block.text} />
      );

    case "diagram":
      return (
        <DocsDiagram
          steps={block.steps}
          orientation={block.orientation}
          caption={block.caption}
        />
      );

    case "cards": {
      const gridClass =
        block.columns === 4
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : block.columns === 3
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "sm:grid-cols-2";

      return (
        <div className={`my-6 grid gap-3 ${gridClass}`}>
          {block.items.map((item) => (
            <DocsCard key={item.title} title={item.title} text={item.text} />
          ))}
        </div>
      );
    }

    case "table":
      return (
        <div className="my-6 overflow-x-auto rounded-sm border border-ink-500">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink-500 bg-ink-800/60">
                {block.headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 font-display font-medium text-bone"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-ink-600 last:border-0">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 text-bone-dim">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "quote":
      return (
        <blockquote className="my-7 border-l-2 border-gold-500 pl-5">
          <p className="font-display text-xl leading-snug text-bone">
            {block.text}
          </p>
          {block.attribution ? (
            <cite className="mt-2 block text-sm not-italic text-bone-faint">
              {block.attribution}
            </cite>
          ) : null}
        </blockquote>
      );

    case "compare":
      return (
        <div className="my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {block.columns.map((column) => (
            <div
              key={column.title}
              className={`rounded-sm border p-5 ${
                column.emphasis
                  ? "border-gold-500/50 bg-ink-800/60"
                  : "border-ink-500 bg-ink-800/20"
              }`}
            >
              {column.tag ? (
                <p className="mb-2 text-xs tracking-wide text-gold-400">
                  {column.tag}
                </p>
              ) : null}
              <p className="font-display text-[15px] font-medium text-bone">
                {column.title}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {column.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 text-sm leading-relaxed text-bone-dim"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-bone-faint" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "phases":
      return (
        <div className="my-6 flex flex-col gap-4">
          {block.items.map((phase) => (
            <div
              key={phase.label}
              className="rounded-sm border border-ink-500 bg-ink-800/30 p-5"
            >
              <p className="font-display text-sm font-semibold tracking-wide text-gold-400">
                {phase.label}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {phase.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-[15px] leading-relaxed text-bone-dim"
                  >
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "faq":
      return (
        <div className="my-6 flex flex-col gap-2">
          {block.items.map((item) => (
            <details
              key={item.q}
              className="group rounded-sm border border-ink-500 bg-ink-800/20 px-5 py-4 open:bg-ink-800/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[15px] font-medium text-bone">
                {item.q}
                <span className="shrink-0 text-bone-faint transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-bone-dim">{item.a}</p>
            </details>
          ))}
        </div>
      );

    case "divider":
      return <hr className="my-10 border-ink-600" />;

    case "finalCta":
      return (
        <div className="my-10 flex flex-col items-center gap-7 rounded-sm border border-ink-500 bg-ink-800/30 px-8 py-14 text-center">
          <span className="h-px w-16 bg-gold-500" />
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight text-bone">
            The world is waiting.
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-bone-dim">
            Echelon is built around a simple idea: give players a world worth
            shaping.
          </p>
          <div className="flex flex-col gap-1 text-base text-bone">
            <p>Build.</p>
            <p>Rule.</p>
            <p>Shape History.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button variant="primary" href="/demo">
              Try Demo
            </Button>
            <Button variant="secondary">Join Waitlist</Button>
          </div>
        </div>
      );

    default:
      return null;
  }
}
