export default function MapBackground() {
  return (
    <>
      <defs>
        <pattern
          id="map-grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0H0V40"
            fill="none"
            stroke="#2B2B30"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id="map-vignette" cx="50%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#08080A" stopOpacity="0" />
          <stop offset="75%" stopColor="#08080A" stopOpacity="0" />
          <stop offset="100%" stopColor="#08080A" stopOpacity="0.65" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="960" height="720" fill="#0B0B0D" />
      <rect x="0" y="0" width="960" height="720" fill="url(#map-grid)" />
    </>
  );
}
