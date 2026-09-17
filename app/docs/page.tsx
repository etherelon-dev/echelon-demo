import type { Metadata } from "next";
import { getDoc } from "@/lib/docs/registry";
import DocsPageBody from "@/components/docs/DocsPageBody";

const doc = getDoc("introduction")!;

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description
};

export default function DocsHomePage() {
  return <DocsPageBody doc={doc} />;
}
