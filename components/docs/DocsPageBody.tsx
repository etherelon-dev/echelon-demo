import type { DocPage } from "@/types/docs";
import { getHeadings } from "@/lib/docs/headings";
import { getAdjacentDocs } from "@/lib/docs/registry";
import DocsArticle from "@/components/docs/DocsArticle";
import DocsTableOfContents from "@/components/docs/DocsTableOfContents";
import DocsPrevNext from "@/components/docs/DocsPrevNext";

export default function DocsPageBody({ doc }: { doc: DocPage }) {
  const headings = getHeadings(doc.blocks);
  const { prev, next } = getAdjacentDocs(doc.slug);

  return (
    <article>
      <p className="text-xs font-medium tracking-wide text-gold-400">
        {doc.group}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-bone sm:text-4xl">
        {doc.title}
      </h1>
      <p className="mt-3 max-w-[60ch] text-base text-bone-dim">
        {doc.description}
      </p>

      <div className="mt-10 grid gap-10 xl:grid-cols-[1fr_200px]">
        <DocsArticle blocks={doc.blocks} headings={headings} />
        <DocsTableOfContents headings={headings} />
      </div>

      <div className="max-w-[68ch]">
        <DocsPrevNext prev={prev} next={next} />
      </div>
    </article>
  );
}
