export type DocGroupName =
  | "Getting Started"
  | "The World"
  | "Power & Politics"
  | "Economy"
  | "History & Ownership"
  | "Technology"
  | "Vision";

export type DiagramStep = {
  label: string;
  detail?: string;
};

export type CompareColumn = {
  title: string;
  tag?: string;
  points: string[];
  emphasis?: boolean;
};

export type DocBlock =
  | { type: "lead"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | {
      type: "callout";
      variant: "info" | "planned" | "principle" | "guardrail";
      title?: string;
      text: string;
    }
  | {
      type: "diagram";
      caption?: string;
      orientation?: "vertical" | "horizontal";
      steps: DiagramStep[];
    }
  | {
      type: "cards";
      columns?: 2 | 3 | 4;
      items: { title: string; text: string }[];
    }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "compare"; columns: CompareColumn[] }
  | {
      type: "phases";
      items: { label: string; items: string[] }[];
    }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "divider" }
  | { type: "finalCta" };

export type DocPage = {
  slug: string;
  group: DocGroupName;
  order: number;
  navTitle: string;
  title: string;
  description: string;
  blocks: DocBlock[];
};

export type DocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};
