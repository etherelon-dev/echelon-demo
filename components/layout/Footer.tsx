"use client";

import { useState } from "react";
import LogoMark from "@/components/ui/LogoMark";
import { socialLinks } from "@/lib/content/social";

export default function Footer() {
  return (
    <footer className="border-t border-ink-600 bg-ink-900">
      <div className="mx-auto flex max-w-content flex-col gap-10 px-6 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-lg font-semibold tracking-[0.08em] text-bone">
              ECHELON
            </span>
          </div>
          <p className="text-sm text-bone-dim">Build. Rule. Shape History.</p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {socialLinks.map((link) =>
            link.comingSoon ? (
              <ComingSoonLink key={link.label} label={link.label} />
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-bone-dim transition-colors duration-200 hover:text-gold-300"
              >
                {link.label}
              </a>
            )
          )}
        </nav>
      </div>
    </footer>
  );
}

function ComingSoonLink({ label }: { label: string }) {
  const [showNotice, setShowNotice] = useState(false);
  const noticeId = `coming-soon-${label.replace(/[^a-zA-Z0-9]/g, "")}`;

  const handleClick = () => {
    setShowNotice(true);
    window.setTimeout(() => setShowNotice(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-describedby={showNotice ? noticeId : undefined}
      className="relative text-sm text-bone-dim transition-colors duration-200 hover:text-gold-300"
    >
      {label}
      <span
        id={noticeId}
        role="status"
        className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-gold-500/40 bg-ink-800 px-3 py-1 text-xs text-gold-300 transition-opacity duration-300 ${
          showNotice ? "opacity-100" : "opacity-0"
        }`}
      >
        Coming soon — akan hadir dalam beberapa waktu
      </span>
    </button>
  );
}
