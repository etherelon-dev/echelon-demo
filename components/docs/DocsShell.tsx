"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import DocsHeader from "@/components/docs/DocsHeader";
import DocsSidebar from "@/components/docs/DocsSidebar";
import DocsFooter from "@/components/docs/DocsFooter";

export default function DocsShell({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isMenuOpen ? "hidden" : previousOverflow;
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-ink-900">
      <DocsHeader
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen((open) => !open)}
      />

      <div className="mx-auto max-w-[1600px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-[228px_1fr]">
          <aside className="hidden md:block">
            <div className="sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto py-10 pr-6">
              <DocsSidebar />
            </div>
          </aside>

          <main className="min-w-0 py-10 md:pl-10">{children}</main>
        </div>
      </div>

      <DocsFooter />

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-0 bg-ink-900/85 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-[82%] max-w-sm overflow-y-auto border-r border-ink-600 bg-ink-900 p-6">
            <DocsSidebar onNavigate={() => setIsMenuOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
