import { Link } from "react-router-dom";
import { Tag, Meta } from "./shared";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { normalizeMediaUrl, timeAgo, formatViews } from "../../../utils/article";
import { useLandingSection } from "../../../context/LandingSectionsContext";

function mapArticle(a) {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.meta_description || "",
    tag: a.category?.name || "NEWS",
    tagColor: "#f59e0b",
    image:
      a.featured_image_b64 ||
      normalizeMediaUrl(a.featured_image) ||
      `https://picsum.photos/seed/${a.slug}/800/450`,
    time: timeAgo(a.published_at),
    views: formatViews(a.view_count),
    author: a.author?.full_name || a.author?.username || "Gnewz Staff",
  };
}

function CategoryBlock({ slug, color, heroSlug }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api
      .get("/articles/", {
        params: {
          status: "publie",
          category__slug: slug,
          ordering: "-published_at",
          page_size: 4,
        },
      })
      .then(({ data }) => {
        setArticles(
          (data.results || [])
            .filter((a) => a.slug !== heroSlug)
            .slice(0, 2)
            .map(mapArticle),
        );
      })
      .catch(() => {});
  }, [slug, heroSlug]);

  if (!articles.length) return null;

  return (
    <div>
      {articles.map((a) => (
        <Link
          key={a.slug}
          to={`/articles/${a.slug}`}
          className="flex it gap-2 p-2.5 hover:bg-[#12121e] transition-colors group border-b border-[#1a1a28]"
        >
          <div
            className="shrink-0 w-[72px] overflow-hidden bg-[#1a1a28]"
            // style={{ aspectRatio: "3/4" }}
          >
            <img
              src={a.image}
              alt={a.title}
              className="w-full h-full object-cover  transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://picsum.photos/seed/${a.slug}/200/267`;
              }}
            />
          </div>
          <div className="min-w-0 flex-1 py-0.5">
            <Tag label={a.tag} color={color} />
            <p className="text-[13px] text-[#ccccdd] font-semibold leading-snug mt-1 line-clamp-3 group-hover:text-white transition-colors">
              {a.title}
            </p>
            <Meta time={a.time} />
          </div>
        </Link>
      ))}
    </div>
  );
}

const CATEGORY_COLORS = [
  "#e8001c",
  "#f59e0b",
  "#8b5cf6",
  "#10b981",
  "#3b82f6",
  "#f97316",
];

export default function HeroSection() {
  const config = useLandingSection('hero');
  const [hero, setHero] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // If admin pinned articles, use the first one as hero
    if (config?.articles?.length > 0) {
      setHero(mapArticle(config.articles[0].article));
      return;
    }
    // Otherwise fetch latest published, optionally filtered by configured category
    const params = { status: "publie", ordering: "-published_at", page_size: 1 };
    if (config?.category_slug) params.category__slug = config.category_slug;
    api.get("/articles/", { params })
      .then(({ data }) => {
        const articles = (data.results || []).map(mapArticle);
        if (articles[0]) setHero(articles[0]);
      })
      .catch(() => {});
  }, [config]);

  useEffect(() => {
    api
      .get("/categories/", { params: { page_size: 4 } })
      .then(({ data }) => setCategories(data.results || []))
      .catch(() => {});
  }, []);

  if (config?.is_active === false) return null;
  if (!hero) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-2 pt-8 ">
      {/* Left — Large featured card, aspect-[16/9], text overlay anchored to bottom */}
      <Link
        to={`/articles/${hero.slug}`}
        className="relative block overflow-hidden group bg-[#0d0d18] rounded"
      >
        <img
          src={hero.image}
          alt={hero.title}
          className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://picsum.photos/seed/${hero.slug}/800/450`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d18] via-[#0d0d18]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <Tag label={hero.tag} color={hero.tagColor} />
          <h1 className="text-white font-black text-[26px] leading-tight mt-2 mb-2 line-clamp-3">
            {hero.title}
          </h1>
          <p className="text-[#aaaabc] text-[15px] leading-relaxed line-clamp-2 mb-3">
            {hero.excerpt}
          </p>
          <div className="flex items-center gap-4 text-[13px] text-[#666677]">
            <span className="text-orange font-bold">{hero.author}</span>
            <Meta time={hero.time} views={hero.views} />
          </div>
        </div>
      </Link>

      {/* Right — Side stack: flex-row cards, portrait thumbnails, divided by borders */}
      <div className="flex flex-col bg-[#0d0d18]">
        {categories.slice(0, 5).map((cat, i) => (
          <CategoryBlock
            key={cat.slug}
            slug={cat.slug}
            color={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
            heroSlug={hero.slug}
          />
        ))}
      </div>
    </section>
  );
}
