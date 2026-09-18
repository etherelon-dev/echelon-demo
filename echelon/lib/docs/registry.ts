import type { DocGroupName, DocPage } from "@/types/docs";
import { gettingStartedDocs } from "@/lib/docs/content/gettingStarted";
import { worldDocs } from "@/lib/docs/content/world";
import { powerDocs } from "@/lib/docs/content/power";
import { economyDocs } from "@/lib/docs/content/economy";
import { historyDocs } from "@/lib/docs/content/history";
import { technologyDocs } from "@/lib/docs/content/technology";
import { visionDocs } from "@/lib/docs/content/vision";

export const ALL_DOCS: DocPage[] = [
  ...gettingStartedDocs,
  ...worldDocs,
  ...powerDocs,
  ...economyDocs,
  ...historyDocs,
  ...technologyDocs,
  ...visionDocs
].sort((a, b) => a.order - b.order);

const DOCS_BY_SLUG = new Map<string, DocPage>(
  ALL_DOCS.map((doc) => [doc.slug, doc])
);

export function getDoc(slug: string): DocPage | undefined {
  return DOCS_BY_SLUG.get(slug);
}

export function getAllSlugs(): string[] {
  return ALL_DOCS.map((doc) => doc.slug);
}

export type NavGroup = {
  name: DocGroupName;
  docs: DocPage[];
};

export const NAV_GROUPS: NavGroup[] = (() => {
  const groups: NavGroup[] = [];
  const index = new Map<DocGroupName, NavGroup>();

  for (const doc of ALL_DOCS) {
    let group = index.get(doc.group);
    if (!group) {
      group = { name: doc.group, docs: [] };
      index.set(doc.group, group);
      groups.push(group);
    }
    group.docs.push(doc);
  }

  return groups;
})();

export function getAdjacentDocs(slug: string): {
  prev: DocPage | null;
  next: DocPage | null;
} {
  const currentIndex = ALL_DOCS.findIndex((doc) => doc.slug === slug);
  if (currentIndex === -1) return { prev: null, next: null };

  return {
    prev: currentIndex > 0 ? ALL_DOCS[currentIndex - 1] : null,
    next: currentIndex < ALL_DOCS.length - 1 ? ALL_DOCS[currentIndex + 1] : null
  };
}
