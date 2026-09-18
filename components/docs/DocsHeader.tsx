"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import LogoMark from "@/components/ui/LogoMark";
import Button from "@/components/ui/Button";

const TOP_LINKS = [
  { label: "World", href: "/#world" },
  { label: "Game", href: "/#gameplay" },
  { label: "Technology", href: "/#technology" },
  { label: "Docs", href: "/docs", active: true }
];

export default function DocsHeader({
  isMenuOpen,
  onToggleMenu
}: {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        isScrolled
          ? "border-b border-ink-500 bg-ink-900/90 backdrop-blur"
          : "border-b border-ink-700 bg-ink-900"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-base font-semibold tracking-[0.08em] text-bone">
              ECHELON
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {TOP_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm transition-colors duration-200 ${
                  link.active
                    ? "text-gold-300"
                    : "text-bone-dim hover:text-gold-300"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" comingSoon className="hidden md:inline-flex">
            Try Demo
          </Button>

          <button
            type="button"
            onClick={onToggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="p-1.5 text-bone md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
