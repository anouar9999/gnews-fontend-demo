import { Gamepad2 } from "lucide-react";
import { FontImport } from "../../components/public/landing/shared";
import HeroSection from "../../components/public/landing/HeroSection";
import PromoBanner from "../../components/public/landing/PromoBanner";
import LatestGrid from "../../components/public/landing/LatestGrid";
import CategorySection from "../../components/public/landing/CategorySection";
import TrendingNow from "../../components/public/landing/TrendingNow";
import GameNewsSection from "../../components/public/landing/GameNewsSection";
import AnticipatedGames from "../../components/public/landing/AnticipatedGames";
import PopularGames from "../../components/public/landing/PopularGames";
import CultureSection from "../../components/public/landing/CultureSection";
import HardwareSection from "../../components/public/landing/HardwareSection";
import EsportsSection from "../../components/public/landing/EsportsSection";

export default function LandingPage() {
  return (
    <>
      <FontImport />

      <div className="max-w-[1280px] mx-auto px-3 sm:px-6">

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

        {/* 6. Gaming — 4-col category grid */}
        <CategorySection
          title="Gaming"
          icon={Gamepad2}
          href="/gaming"
          color="#e8001c"
          categorySlug="gaming"
        />

        {/* 7. Popular Games — horizontal scroll */}
        <PopularGames />
      </div>

      {/* Full-width newsletter / promo banner */}
      <PromoBanner />

      <div className="max-w-[1280px] mx-auto px-3 sm:px-6">
        {/* 8. Hardware & Tech */}
        <HardwareSection />

        {/* 9. Esports — live match ticker layout */}
        <EsportsSection />

        {/* 10. Culture — mixed layout */}
        <CultureSection />
      </div>
    </>
  );
}
