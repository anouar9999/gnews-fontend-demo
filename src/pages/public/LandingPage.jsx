import { Gamepad2 } from "lucide-react";
import { FontImport } from "../../components/public/landing/shared";
import Navbar from "../../components/public/landing/Navbar";
import BreakingTicker from "../../components/public/landing/BreakingTicker";
import HeroSection from "../../components/public/landing/HeroSection";
import PromoBanner from "../../components/public/landing/PromoBanner";
import LatestGrid from "../../components/public/landing/LatestGrid";
import CategorySection from "../../components/public/landing/CategorySection";
import TrendingNow from "../../components/public/landing/TrendingNow";
import GameNewsSection from "../../components/public/landing/GameNewsSection";
import AnticipatedGames from "../../components/public/landing/AnticipatedGames";
import PopularGames from "../../components/public/landing/PopularGames";
import DealsSection from "../../components/public/landing/DealsSection";
import CultureSection from "../../components/public/landing/CultureSection";
import HardwareSection from "../../components/public/landing/HardwareSection";
import EsportsSection from "../../components/public/landing/EsportsSection";
import { GAMING_ARTICLES } from "../../data/landingMockData";

export default function LandingPage() {
  return (
    <>
      <FontImport />
      <BreakingTicker />

      <div className="min-h-screen bg-[#0d0d18] text-white px-16">
        <Navbar />

        <main>
          {/* ── Content container ── */}
          <div className="max-w-[1280px] mx-auto px-6">

            {/* 1. Hero — big featured + side stack */}
            <HeroSection />

            {/* 2. Trending — horizontal carousel */}
            <TrendingNow />

            {/* 3. Latest News — featured + list grid */}
            <LatestGrid />

            {/* 4. Game News — banner + horizontal scroll */}
            <GameNewsSection />

            {/* 5. Anticipated Games — horizontal carousel */}
            <AnticipatedGames />

            {/* 6. Jeux Vidéo — 4-col category grid */}
            <CategorySection
              title="Jeux Vidéo"
              icon={Gamepad2}
              href="/gaming"
              color="#e8001c"
              articles={GAMING_ARTICLES}
            />

            {/* 7. Popular Games — horizontal scroll */}
            <PopularGames />
          </div>

          {/* ── Full-width newsletter / promo banner ── */}
          <PromoBanner />

          {/* ── Content container (continued) ── */}
          <div className="max-w-[1280px] mx-auto px-6">

            {/* 8. Deals — featured deal + list */}
            {/* <DealsSection /> */}

            {/* 9. Hardware & Tech — review spotlight layout */}
            <HardwareSection />

            {/* 10. Esports — live match ticker layout */}
            <EsportsSection />

            {/* 11. Culture Geek — mixed layout */}
            <CultureSection />

          </div>
        </main>

      </div>
    </>
  );
}
