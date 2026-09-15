/**
 * Layer — Rivers & lakes.
 *
 * Intentionally left unimplemented rather than faked. Real rivers need a
 * hydrography dataset (e.g. Natural Earth rivers/lakes, 50m or 10m) that
 * isn't part of this project's assets, and this build has no network
 * access to fetch one (see lib/geo/README.md). Drawing invented river
 * lines would misrepresent them as real geography, which the project
 * brief explicitly rules out — so this stays a stub until real
 * hydrography data is available, at which point it slots into
 * EchelonWorldMap's layer stack with no restructuring.
 */
export default function RiverLayer() {
  return null;
}
