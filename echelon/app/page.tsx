import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import WorldSection from "@/components/sections/WorldSection";
import TerritorySection from "@/components/sections/TerritorySection";
import GameplaySection from "@/components/sections/GameplaySection";
import KingdomSection from "@/components/sections/KingdomSection";
import EconomySection from "@/components/sections/EconomySection";
import CurrencySection from "@/components/sections/CurrencySection";
import HistorySection from "@/components/sections/HistorySection";
import BlockchainSection from "@/components/sections/BlockchainSection";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WorldSection />
        <TerritorySection />
        <GameplaySection />
        <KingdomSection />
        <EconomySection />
        <CurrencySection />
        <HistorySection />
        <BlockchainSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
