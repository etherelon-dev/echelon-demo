import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RoadmapHero from "@/components/roadmap/RoadmapHero";
import RoadmapProgress from "@/components/roadmap/RoadmapProgress";
import RoadmapExplorer from "@/components/roadmap/RoadmapExplorer";
import RoadmapCTA from "@/components/roadmap/RoadmapCTA";

export const metadata: Metadata = {
  title: "Roadmap — Echelon",
  description:
    "A milestone-based look at how Echelon is being built — from the first interactive demo to a persistent, player-driven world."
};

export default function RoadmapPage() {
  return (
    <>
      <Navbar />
      <main>
        <RoadmapHero />

        <section className="border-t border-ink-600 py-16 sm:py-20">
          <div className="mx-auto max-w-content px-6">
            <RoadmapProgress />
          </div>
        </section>

        <section className="border-t border-ink-600 py-16 sm:py-24">
          <div className="mx-auto max-w-content px-6">
            <RoadmapExplorer />
          </div>
        </section>

        <RoadmapCTA />
      </main>
      <Footer />
    </>
  );
}
