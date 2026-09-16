import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import DemoHero from "@/components/worldmap/DemoHero";
import DemoStatus from "@/components/worldmap/DemoStatus";
import EchelonWorldMap3D from "@/components/worldmap3d/EchelonWorldMap3D";

export const metadata: Metadata = {
  title: "3D Map Preview — Echelon",
  description: "Early WebGL terrain-relief preview of the Echelon world map, centered on Turkey and the surrounding region."
};

// Separate route from /demo (the existing 2D map) rather than a
// replacement — see components/worldmap3d/README.md. Keeps the working
// flat map intact while this is reviewed/iterated on.
export default function Demo3DPage() {
  return (
    <>
      <main className="flex min-h-screen flex-col">
        <DemoHero />
        <section className="relative h-[48vh] min-h-[360px] w-full sm:h-[62vh]">
          <EchelonWorldMap3D />
        </section>
        <DemoStatus />
      </main>
      <Footer />
    </>
  );
}
