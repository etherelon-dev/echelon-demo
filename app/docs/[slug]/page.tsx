import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { DocPage } from "@/types/docs";
import { getAllSlugs, getDoc } from "@/lib/docs/registry";
import DocsPageBody from "@/components/docs/DocsPageBody";

export function generateStaticParams() {
  return getAllSlugs()
    .filter((slug) => slug !== "introduction")
    .map((slug) => ({ slug }));
}

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const doc = getDoc(params.slug);
  if (!doc) return {};

  return {
    title: doc.title,
    description: doc.description
  };
}

export default function DocsSlugPage({
  params
}: {
  params: { slug: string };
}) {
  const doc = getDoc(params.slug);

  if (!doc || params.slug === "introduction") {
    notFound();
  }

  return <DocsPageBody doc={doc as DocPage} />;
}
