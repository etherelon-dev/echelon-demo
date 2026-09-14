import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EchelonWorldMap from "@/components/worldmap/EchelonWorldMap";

export const metadata: Metadata = {
  title: "Demo — Echelon",
  description: "The raw geographic foundation of the Echelon world."
};

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-t border-ink-600 bg-ink-900 py-10 sm:py-14">
          <div className="mx-auto max-w-content px-6">
            <p className="mb-6 font-display text-xs uppercase tracking-[0.3em] text-bone-dim">
              Echelon Demo
            </p>
            <EchelonWorldMap />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
