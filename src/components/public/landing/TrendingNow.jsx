import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import api from '../../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../../utils/article';
import { useLandingSection } from '../../../context/LandingSectionsContext';

const CARD_W  = 280;
const GAP     = 12;
const SCROLL_BY = (CARD_W + GAP) * 2;

function mapArticle(a) {
  return {
    slug:     a.slug,
    title:    a.title,
    tag:      a.category?.name || 'NEWS',
    tagColor: '#f59e0b',
    image:    a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/600/338`,
    time:     timeAgo(a.published_at),
    views:    formatViews(a.view_count),
  };
}

export default function TrendingNow() {
  const config = useLandingSection('trending');
  const scrollRef              = useRef(null);
  const [atStart, setAtStart]  = useState(true);
  const [atEnd,   setAtEnd]    = useState(false);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Pinned articles take priority
    if (config?.articles?.length > 0) {
      setArticles(config.articles.map(sa => mapArticle(sa.article)));
      return;
    }
    const params = { status: 'publie', ordering: '-view_count,-published_at', page_size: config?.article_count || 8 };
    if (config?.category_slug) params.category__slug = config.category_slug;
    api.get('/articles/', { params })
      .then(({ data }) => setArticles((data.results || []).map(mapArticle)))
      .catch(() => {});
  }, [config]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }

  function scrollLeft()  { scrollRef.current?.scrollBy({ left: -SCROLL_BY, behavior: "smooth" }); }
  function scrollRight() { scrollRef.current?.scrollBy({ left:  SCROLL_BY, behavior: "smooth" }); }

  if (config?.is_active === false) return null;
  if (articles.length === 0) return null;

  return (
    <section className="py-12 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[32px] rounded-full bg-orange" />
            <div className="w-[2px] h-[16px] rounded-full bg-orange opacity-60" />
          </div>
          <h2 className="text-[24px] md:text-[45px] font-black uppercase tracking-tight text-white leading-none">
            Trending
          </h2>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <button
          onClick={scrollLeft}
          disabled={atStart}
          className="absolute left-0 top-[45%] rounded -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 flex items-center justify-center mx-2 disabled:opacity-0 disabled:pointer-events-none transition-all duration-150"
          style={{
            background: "linear-gradient(135deg, #FF6B00 0%, #e05500 100%)",
            boxShadow: "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)",
            transform: "translateY(-50%) translateX(-50%) translateY(-3px)",
            color: "#fff",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-50%) translateX(-50%) translateY(-5px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(-50%) translateX(-50%) translateY(-3px)"; }}
          onMouseDown={e  => { e.currentTarget.style.transform = "translateY(-50%) translateX(-50%) translateY(0px)"; }}
          onMouseUp={e    => { e.currentTarget.style.transform = "translateY(-50%) translateX(-50%) translateY(-3px)"; }}
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>

        <button
          onClick={scrollRight}
          disabled={atEnd}
          className="absolute right-0 top-[45%] rounded -translate-y-1/2 mx-2 translate-x-1/2 z-10 w-10 h-10 flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none transition-all duration-150"
          style={{
            background: "linear-gradient(135deg, #FF6B00 0%, #e05500 100%)",
            boxShadow: "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)",
            transform: "translateY(-50%) translateX(50%) translateY(-3px)",
            color: "#fff",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-50%) translateX(50%) translateY(-5px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(-50%) translateX(50%) translateY(-3px)"; }}
          onMouseDown={e  => { e.currentTarget.style.transform = "translateY(-50%) translateX(50%) translateY(0px)"; }}
          onMouseUp={e    => { e.currentTarget.style.transform = "translateY(-50%) translateX(50%) translateY(-3px)"; }}
        >
          <ChevronRight size={20} strokeWidth={3} />
        </button>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto pb-2 "
          style={{ scrollSnapType: "x mandatory", msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          <style>{`.trending-scroll::-webkit-scrollbar { display: none; }`}</style>
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/articles/${article.slug}`}
              className="trending-scroll group shrink-0 block rounded"
              style={{ width: CARD_W, scrollSnapAlign: "start" }}
            >
              {/* Image — 16:9 landscape */}
              <div className="relative overflow-hidden aspect-[16/9]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/560/315`; }}
                />
                <span
                  className="absolute top-2 right-2 rounded text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5"
                  style={{ background: article.tagColor, color: "#fff" }}
                >
                  {article.tag}
                </span>
              </div>
              {/* Text below image */}
              <div className="pt-2 pb-1">
                <p className="text-[14px] font-bold text-[#ccccdd] leading-snug line-clamp-2 mb-1.5 group-hover:text-white transition-colors">
                  {article.title}
                </p>
                <div className="flex items-center gap-2.5 text-[10px] text-[#666677]">
                  <span className="flex items-center gap-1"><Clock size={9} />{article.time}</span>
                  {article.views && <span className="flex items-center gap-1"><Eye size={9} />{article.views}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
