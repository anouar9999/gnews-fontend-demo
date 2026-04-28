import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Clock, Eye } from "lucide-react";
import api from "../../../api/axios";
import { normalizeMediaUrl, timeAgo, formatViews } from "../../../utils/article";
import { Meta, Tag } from "./shared";
import { useLandingSection } from "../../../context/LandingSectionsContext";

const COLOR = "#3b82f6";
const COLOR_RGB = "59,130,246";

function mapArticle(a) {
  return {
    slug: a.slug,
    title: a.title,
    tag: a.category?.name || "HARDWARE",
    tagColor: COLOR,
    image:
      a.featured_image_b64 ||
      normalizeMediaUrl(a.featured_image) ||
      `https://picsum.photos/seed/${a.slug}/400/300`,
    time: timeAgo(a.published_at),
    views: formatViews(a.view_count),
    author: a.author?.username || "",
  };
}

export default function HardwareSection() {
  const config = useLandingSection('hardware');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (config?.articles?.length > 0) {
      setArticles(config.articles.map(sa => mapArticle(sa.article)));
      return;
    }
    const slug  = config?.category_slug || 'hardware';
    const count = config?.article_count  || 5;
    api.get("/articles/", {
      params: { status: "publie", category__slug: slug, ordering: "-published_at", page_size: count },
    }).then(({ data }) => {
      setArticles((data.results || []).map(mapArticle));
    }).catch(() => {});
  }, [config]);

  if (config?.is_active === false) return null;
  if (articles.length === 0) return null;

  const [featured, ...sidebar] = articles;

  return (
    <section className="py-12 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex gap-[3px] items-center">
            <div
              className="w-[4px] h-[28px] rounded-full bg-orange"
            
            />
            <div
              className="w-[2px] h-[16px] rounded-full bg-orange"
              style={{  opacity: 0.35 }}
            />
          </div>
          <h2 className="text-[24px] md:text-[45px] font-black uppercase tracking-tight text-white leading-none">
            Hardware <span className="text-orange">&</span> Tech
          </h2>
        </div>
        <Link
          to="/hardware"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-colors duration-150"
          style={{ color: "rgba(255,255,255,0.28)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.75)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.28)")
          }
        >
          See all <ChevronRight size={12} />
        </Link>
      </div>

      {/* Layout: 2fr/3fr — featured left smaller, 2-col grid right */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 items-start">
        {/* Left — Featured card with content overlaid inside the image */}
        <Link
          to={`/articles/${featured.slug}`}
          className="group block "
        >
          <div
            className="relative overflow-hidden rounded bg-[#0a0a14]"
            style={{ aspectRatio: "4/3" }}
          >
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://picsum.photos/seed/${featured.slug}/800/600`;
              }}
            />
            {/* Bottom gradient overlay — taller to hold text */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 45%, transparent 100%)",
              }}
            />
            {/* Tag badge — top left */}
            <span
              className="absolute bg-orange top-3 left-3 text-[10px] font-black uppercase tracking-widest px-2 py-[3px]"
              style={{
                
              
                borderRadius: 2,
                letterSpacing: "0.08em",
              }}
            >
              {featured.tag}
            </span>
            {/* Text overlaid at bottom */}
            <div className="absolute inset-x-0 top-12 px-4 pb-4">
              <h3 className="text-[24px] font-bold text-white leading-snug line-clamp-2  transition-colors duration-150">
                {featured.title}
              </h3>
              <div
                className="flex items-center gap-3 text-[11px]"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {featured.time && (
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {featured.time}
                  </span>
                )}
                {featured.views && (
                  <span className="flex items-center gap-1">
                    <Eye size={10} />
                    {featured.views}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* Right — 2-column grid of cards */}
        <div className="grid grid-cols-2 gap-2">
          {sidebar.slice(0, 8).map((a) => (
          <Link
                  key={a.slug}
                  to={`/articles/${a.slug}`}
                  className="flex it gap-2 p-2.5 hover:bg-[#12121e] transition-colors group "
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
                    <Tag label={a.tag}  />
                    <p className="text-[13px] text-[#ccccdd] font-semibold leading-snug mt-1 line-clamp-3 group-hover:text-white transition-colors">
                      {a.title}
                    </p>
                     <p className="text-[13px] text-[#ccccdd] font-semibold leading-snug mt-1 line-clamp-3 group-hover:text-white transition-colors">
                      {a.meta_description}
                    </p>
                      <Meta time={a.time} />
                  </div>
                </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
