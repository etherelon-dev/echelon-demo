type Route = {
  id: string;
  d: string;
  delayMs: number;
};

const routes: Route[] = [
  { id: "route-w-c1", d: "M139,351 Q252,320 366,361", delayMs: 0 },
  { id: "route-c1-n2", d: "M366,361 Q500,205 591,146", delayMs: 400 },
  { id: "route-n2-ne", d: "M591,146 Q700,180 809,141", delayMs: 800 },
  { id: "route-sw-s2", d: "M144,574 Q366,630 588,580", delayMs: 200 },
  { id: "route-s2-e", d: "M588,580 Q760,500 806,354", delayMs: 600 }
];

export default function MapTradeRoutes() {
  return (
    <g fill="none" stroke="#D0AD79" strokeOpacity="0.55" strokeWidth="1.5">
      {routes.map((route) => (
        <path
          key={route.id}
          d={route.d}
          strokeDasharray="10 14"
          className="animate-trade-flow"
          style={{ animationDelay: `${route.delayMs}ms` }}
        />
      ))}
    </g>
  );
}
