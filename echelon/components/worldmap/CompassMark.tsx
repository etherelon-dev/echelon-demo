interface CompassMarkProps {
  size?: number;
  className?: string;
}

/**
 * 8-point compass-rose badge for the map HUD — a small original mark
 * (computed star geometry, not a traced/copied icon) in the site's
 * existing gold/bronze palette.
 */
export default function CompassMark({ size = 20, className }: CompassMarkProps) {
  const r = size / 2;
  const outerR = r - 1;
  const innerR = outerR * 0.4;

  const points: string[] = [];
  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI / 8) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? outerR : innerR;
    const x = r + radius * Math.cos(angle);
    const y = r + radius * Math.sin(angle);
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  const starPath = `${points.join(" ")}Z`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className={className}>
      <circle cx={r} cy={r} r={outerR} fill="none" stroke="#D0AD79" strokeOpacity={0.45} strokeWidth={1} />
      <path d={starPath} fill="#D0AD79" />
      <circle cx={r} cy={r} r={1.3} fill="#08080A" />
    </svg>
  );
}
