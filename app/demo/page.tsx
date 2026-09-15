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
        <section className="relative h-[68vh] min-h-[420px] w-full sm:h-[74vh]">
          <EchelonWorldMap />
        </section>
        <DemoStatus />
      </main>
      <Footer />
    </>
  );
}
