import { APP_VERSION } from "@/lib/version";

type VersionBarProps = {
  maxWidthClassName?: string;
};

export default function VersionBar({
  maxWidthClassName = "max-w-content"
}: VersionBarProps) {
  return (
    <div className="border-t border-ink-600/60">
      <p
        className={`mx-auto px-6 py-4 text-center text-xs tracking-[0.14em] text-bone-faint sm:text-left ${maxWidthClassName}`}
      >
        ECHELON v{APP_VERSION}
      </p>
    </div>
  );
}
