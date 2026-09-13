import LogoMark from "@/components/ui/LogoMark";
import VersionBar from "@/components/ui/VersionBar";

export default function DocsFooter() {
  return (
    <footer className="border-t border-ink-600">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-bone-faint">
          <LogoMark />
          <span className="text-sm">Echelon Documentation</span>
        </div>
        <a
          href="/"
          className="text-sm text-bone-dim transition-colors duration-200 hover:text-gold-300"
        >
          Back to echelon.game
        </a>
      </div>

      <VersionBar maxWidthClassName="max-w-[1600px]" />
    </footer>
  );
}
