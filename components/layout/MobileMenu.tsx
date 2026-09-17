"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { NavLink } from "@/types/content";
import Button from "@/components/ui/Button";

type MobileMenuProps = {
  links: NavLink[];
  onClose: () => void;
};

export default function MobileMenu({ links, onClose }: MobileMenuProps) {
  return createPortal(
    <div className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink-900 px-6 py-6">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="p-2 text-bone hover:text-gold-300"
        >
          <X className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>
      <nav className="mt-10 flex flex-col gap-6">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-display text-2xl text-bone hover:text-gold-300"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-4 pt-10">
        <Button variant="secondary" comingSoon className="w-full">
          Try Demo
        </Button>
        <Button variant="primary" className="w-full">
          Join Waitlist
        </Button>
      </div>
    </div>,
    document.body
  );
}
