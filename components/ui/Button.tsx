"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  comingSoon?: boolean;
  className?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gold-500 text-ink-900 hover:bg-gold-400 border border-gold-500 hover:border-gold-400",
  secondary:
    "bg-transparent text-bone border border-bone/25 hover:border-gold-400 hover:text-gold-300",
  ghost:
    "bg-transparent text-bone-dim hover:text-gold-300 border border-transparent px-0"
};

export default function Button({
  children,
  variant = "primary",
  href,
  comingSoon = false,
  className = ""
}: ButtonProps) {
  const [showNotice, setShowNotice] = useState(false);

  const baseClasses =
    "relative inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-300";

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  const handleComingSoonClick = () => {
    setShowNotice(true);
    window.setTimeout(() => setShowNotice(false), 2200);
  };

  if (comingSoon) {
    return (
      <button
        type="button"
        onClick={handleComingSoonClick}
        className={combinedClasses}
        aria-describedby={showNotice ? "coming-soon-notice" : undefined}
      >
        {children}
        <span
          id="coming-soon-notice"
          role="status"
          className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-gold-500/40 bg-ink-800 px-3 py-1 text-xs text-gold-300 transition-opacity duration-300 ${
            showNotice ? "opacity-100" : "opacity-0"
          }`}
        >
          Coming soon
        </span>
      </button>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={combinedClasses}>
      {children}
    </button>
  );
}
