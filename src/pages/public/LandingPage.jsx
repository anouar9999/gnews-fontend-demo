import { Gamepad2 } from "lucide-react";
import HeroSection from "../../components/public/landing/HeroSection";
import PromoBanner from "../../components/public/landing/PromoBanner";
import LatestGrid from "../../components/public/landing/LatestGrid";
import CategorySection from "../../components/public/landing/CategorySection";
import TrendingNow from "../../components/public/landing/TrendingNow";
import GameNewsSection from "../../components/public/landing/GameNewsSection";
import AnticipatedGames from "../../components/public/landing/AnticipatedGames";
import PopularGames from "../../components/public/landing/PopularGames";
import HardwareSection from "../../components/public/landing/HardwareSection";
import EsportsSection from "../../components/public/landing/EsportsSection";
import NewsCultureGrid from "../../components/public/landing/NewsCultureGrid";
import { useLandingSection } from "../../context/LandingSectionsContext";
import { normalizeMediaUrl, timeAgo, formatViews } from "../../utils/article";

export default function LandingPage() {
  const categoryConfig = useLandingSection('category');
  const categorySlug   = categoryConfig?.category_slug || 'gaming';
  const showCategory   = categoryConfig?.is_active !== false;
  const categoryArticles = categoryConfig?.articles?.length > 0
    ? categoryConfig.articles.map(sa => {
        const a = sa.article;
        return {
          slug:     a.slug,
          title:    a.title,
          tag:      a.category?.name || '',
          image:    a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/400/300`,
          time:     timeAgo(a.published_at),
          views:    formatViews(a.view_count),
          comments: a.comments_count || 0,
        };
      })
    : undefined;

  return (
    <div className="gnewz-landing max-w-[1280px] mx-auto px-22">
      <HeroSection />
      <TrendingNow />
      <LatestGrid />
      <GameNewsSection />
      <AnticipatedGames />
      {showCategory && (
        <CategorySection
          title="Gaming News"
          icon={Gamepad2}
          href="/gaming"
          color="#e8001c"
          categorySlug={categorySlug}
          articles={categoryArticles}
        />
      )}
      <PopularGames />
      <HardwareSection />
      <EsportsSection />
      <NewsCultureGrid />
      <PromoBanner />
    </div>
  );
}
