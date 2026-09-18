"use client";

import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "@/lib/docs/registry";

export default function DocsSidebar({
  onNavigate
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation">
      <div className="flex flex-col gap-7">
        {NAV_GROUPS.map((group) => (
          <div key={group.name}>
            <p className="px-3 text-xs font-medium tracking-wide text-bone-faint">
              {group.name}
            </p>
            <ul className="mt-2 flex flex-col gap-0.5">
              {group.docs.map((doc) => {
                const href = doc.slug === "introduction" ? "/docs" : `/docs/${doc.slug}`;
                const isActive =
                  pathname === href ||
                  (doc.slug === "introduction" && pathname === "/docs/");

                return (
                  <li key={doc.slug}>
                    <a
                      href={href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={`block rounded-sm px-3 py-1.5 text-[13.5px] leading-snug transition-colors duration-150 ${
                        isActive
                          ? "bg-ink-700 text-gold-300"
                          : "text-bone-dim hover:bg-ink-800 hover:text-bone"
                      }`}
                    >
                      {doc.navTitle}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
