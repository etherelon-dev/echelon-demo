import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TokenomicsHero from "@/components/tokenomics/TokenomicsHero";
import AllocationExplorer from "@/components/tokenomics/AllocationExplorer";
import DistributionTable from "@/components/tokenomics/DistributionTable";
import TokenUtility from "@/components/tokenomics/TokenUtility";
import EconomicGranularity from "@/components/tokenomics/EconomicGranularity";
import BlockchainUxSection from "@/components/tokenomics/BlockchainUxSection";
import ArbitrumSection from "@/components/tokenomics/ArbitrumSection";
import TokenFlow from "@/components/tokenomics/TokenFlow";
import Transparency from "@/components/tokenomics/Transparency";
import TokenomicsSummary from "@/components/tokenomics/TokenomicsSummary";

export const metadata: Metadata = {
  title: "Tokenomics — Echelon",
  description:
    "A fixed 1 trillion ECH supply designed to support the scale, granularity, and long-term evolution of Echelon's player-driven economy."
};

export default function TokenomicsPage() {
  return (
    <>
      <Navbar />
      <main>
        <TokenomicsHero />
        <AllocationExplorer />
        <DistributionTable />
        <TokenUtility />
        <EconomicGranularity />
        <BlockchainUxSection />
        <ArbitrumSection />
        <TokenFlow />
        <Transparency />
        <TokenomicsSummary />
      </main>
      <Footer />
    </>
  );
}
