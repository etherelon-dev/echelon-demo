import type { NavLink } from "@/types/content";
import { DOCS_URL } from "@/lib/content/links";

export const navLinks: NavLink[] = [
  { label: "World", href: "#world" },
  { label: "Gameplay", href: "#gameplay" },
  { label: "Economy", href: "#economy" },
  { label: "Technology", href: "#technology" },
  { label: "Docs", href: DOCS_URL }
];
