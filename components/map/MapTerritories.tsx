type Territory = {
  id: string;
  points: string;
  fill: string;
  stroke: string;
  strokeWidth?: number;
  glow?: boolean;
};

const territories: Territory[] = [
  {
    id: "nw",
    points: "40,40 245,40 230,230 40,240",
    fill: "#151519",
    stroke: "#2B2B30"
  },
  {
    id: "n1",
    points: "245,40 470,55 500,270 230,230",
    fill: "#17171B",
    stroke: "#2B2B30"
  },
  {
    id: "n2",
    points: "470,55 715,35 680,225 500,270",
    fill: "rgba(181,138,84,0.14)",
    stroke: "#D0AD79",
    strokeWidth: 1.75,
    glow: true
  },
  {
    id: "ne",
    points: "715,35 920,40 920,265 680,225",
    fill: "rgba(91,107,121,0.12)",
    stroke: "rgba(140,153,166,0.55)"
  },
  {
    id: "w",
    points: "40,240 230,230 245,455 40,480",
    fill: "#151519",
    stroke: "#2B2B30"
  },
  {
    id: "c1",
    points: "230,230 500,270 490,490 245,455",
    fill: "rgba(181,138,84,0.08)",
    stroke: "rgba(181,138,84,0.4)"
  },
  {
    id: "c2",
    points: "500,270 680,225 705,470 490,490",
    fill: "#17171B",
    stroke: "#2B2B30"
  },
  {
    id: "e",
    points: "680,225 920,265 920,455 705,470",
    fill: "rgba(91,107,121,0.14)",
    stroke: "rgba(140,153,166,0.55)"
  },
  {
    id: "sw",
    points: "40,480 245,455 250,680 40,680",
    fill: "rgba(91,107,121,0.1)",
    stroke: "rgba(140,153,166,0.45)"
  },
  {
    id: "s1",
    points: "245,455 490,490 465,680 250,680",
    fill: "#151519",
    stroke: "#2B2B30"
  },
  {
    id: "s2",
    points: "490,490 705,470 690,680 465,680",
    fill: "#17171B",
    stroke: "#2B2B30"
  },
  {
    id: "se",
    points: "705,470 920,455 920,680 690,680",
    fill: "#151519",
    stroke: "#2B2B30"
  }
];

export default function MapTerritories() {
  return (
    <g>
      {territories.map((territory) => (
        <polygon
          key={territory.id}
          points={territory.points}
          fill={territory.fill}
          stroke={territory.stroke}
          strokeWidth={territory.strokeWidth ?? 1}
          className={territory.glow ? "animate-border-glow" : ""}
        />
      ))}
    </g>
  );
}
