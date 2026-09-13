type CommunityMapBackdropProps = {
  idPrefix: string;
};

export default function CommunityMapBackdrop({
  idPrefix
}: CommunityMapBackdropProps) {
  const gridId = `${idPrefix}-grid`;
  const vignetteId = `${idPrefix}-vignette`;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 720"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id={gridId}
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M48 0H0V48"
            fill="none"
            stroke="#2B2B30"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id={vignetteId} cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#08080A" stopOpacity="0" />
          <stop offset="70%" stopColor="#08080A" stopOpacity="0" />
          <stop offset="100%" stopColor="#08080A" stopOpacity="0.85" />
        </radialGradient>
      </defs>

      <rect width="1440" height="720" fill={`url(#${gridId})`} />

      <path
        d="M0 240 C 320 180, 620 300, 960 220 S 1320 250, 1440 235"
        fill="none"
        stroke="#3A3A40"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      <path
        d="M0 470 C 300 520, 700 420, 1040 480 S 1360 445, 1440 455"
        fill="none"
        stroke="#3A3A40"
        strokeOpacity="0.3"
        strokeWidth="1"
      />

      <rect width="1440" height="720" fill={`url(#${vignetteId})`} />
    </svg>
  );
}
