import MapBackground from "@/components/map/MapBackground";
import MapTerritories from "@/components/map/MapTerritories";
import MapTradeRoutes from "@/components/map/MapTradeRoutes";
import MapMarkers from "@/components/map/MapMarkers";

export default function StrategicMap() {
  return (
    <div className="relative w-full overflow-hidden rounded-sm border border-ink-500 bg-ink-900">
      <svg
        viewBox="0 0 960 720"
        role="img"
        aria-label="Abstract strategic map of the Echelon world showing territories, trade routes, and settlements"
        className="h-full w-full"
      >
        <MapBackground />
        <MapTerritories />
        <MapTradeRoutes />
        <MapMarkers />
        <rect x="0" y="0" width="960" height="720" fill="url(#map-vignette)" />
      </svg>
    </div>
  );
}
