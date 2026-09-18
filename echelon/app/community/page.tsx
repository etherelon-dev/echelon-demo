import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CommunityHero from "@/components/community/CommunityHero";
import TelegramCommunityCard from "@/components/community/TelegramCommunityCard";
import MoreWaysToConnect from "@/components/community/MoreWaysToConnect";
import CommunityPillars from "@/components/community/CommunityPillars";
import DevelopmentJourney from "@/components/community/DevelopmentJourney";
import CommunityCTA from "@/components/community/CommunityCTA";

export const metadata: Metadata = {
  title: "Community — Echelon",
  description:
    "Join the Echelon community on Telegram and follow the development of a player-driven grand strategy world."
};

export default function CommunityPage() {
  return (
    <>
      <Navbar />
      <main>
        <CommunityHero />
        <TelegramCommunityCard />
        <MoreWaysToConnect />
        <CommunityPillars />
        <DevelopmentJourney />
        <CommunityCTA />
      </main>
      <Footer />
    </>
  );
}
