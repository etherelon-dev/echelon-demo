type Settlement = {
  id: string;
  x: number;
  y: number;
};

type City = {
  id: string;
  x: number;
  y: number;
  delayMs: number;
};

const settlements: Settlement[] = [
  { id: "s-1", x: 110, y: 130 },
  { id: "s-2", x: 330, y: 120 },
  { id: "s-3", x: 620, y: 100 },
  { id: "s-4", x: 860, y: 200 },
  { id: "s-5", x: 180, y: 340 },
  { id: "s-6", x: 420, y: 400 },
  { id: "s-7", x: 640, y: 330 },
  { id: "s-8", x: 850, y: 520 },
  { id: "s-9", x: 330, y: 600 },
  { id: "s-10", x: 560, y: 620 },
  { id: "s-11", x: 100, y: 620 }
];

const cities: City[] = [
  { id: "c-capital", x: 366, y: 361, delayMs: 0 },
  { id: "c-kingdom", x: 591, y: 146, delayMs: 700 },
  { id: "c-rival", x: 806, y: 354, delayMs: 1400 },
  { id: "c-outpost", x: 144, y: 574, delayMs: 2100 }
];

export default function MapMarkers() {
  return (
    <g>
      {settlements.map((settlement) => (
        <circle
          key={settlement.id}
          cx={settlement.x}
          cy={settlement.y}
          r={2.5}
          fill="#9B9A97"
          fillOpacity={0.6}
        />
      ))}
      {cities.map((city) => (
        <g key={city.id}>
          <circle
            cx={city.x}
            cy={city.y}
            r={9}
            fill="none"
            stroke="#D0AD79"
            strokeWidth={1}
            className="animate-marker-pulse"
            style={{
              animationDelay: `${city.delayMs}ms`,
              transformBox: "fill-box",
              transformOrigin: "center"
            }}
          />
          <circle cx={city.x} cy={city.y} r={4} fill="#E1C594" />
        </g>
      ))}
    </g>
  );
}
