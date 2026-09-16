import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import DemoHero from "@/components/worldmap/DemoHero";
import DemoStatus from "@/components/worldmap/DemoStatus";
import EchelonWorldMap from "@/components/worldmap/EchelonWorldMap";

export const metadata: Metadata = {
  title: "Demo — Echelon",
  description:
    "The raw geographic foundation of the Echelon world, centered on Turkey and the surrounding region."
};

// This page intentionally skips the global marketing <Navbar/> — the map's
// own in-component <MapHud/> takes its place, matching the reference's
// slim strategy-game top bar instead of the site's full nav+CTA header.
export default function DemoPage() {
  return (
    <>
      <main className="flex min-h-screen flex-col">
        <DemoHero />
        {/* preserveAspectRatio="slice" (see EchelonWorldMap) fills this panel
            edge to edge by cropping some width off both sides on a
            portrait/narrow viewport — a shorter panel here means less of
            that crop, so this is trimmed down from the old 68/74vh (sized
            back when the map used "meet" and needed a tall box to avoid
            looking cramped) to keep more of the initial Turkey/Anatolia
            framing on screen on phones. */}
        <section className="relative h-[48vh] min-h-[360px] w-full sm:h-[62vh]">
          <EchelonWorldMap />
        </section>
        <DemoStatus />
      </main>
      <Footer />
    </>
  );
}
