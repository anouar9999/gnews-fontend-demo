import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import api from '../../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../../utils/article';

const CARD_W  = 300;
const GAP     = 12;
const SCROLL_BY = (CARD_W + GAP) * 2;

function mapArticle(a) {
  return {
    slug:     a.slug,
    title:    a.title,
    tag:      a.category?.name || 'NEWS',
    tagColor: '#f59e0b',
    image:    a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/600/400`,
    time:     timeAgo(a.published_at),
    views:    formatViews(a.view_count),
  };
}

export default function TrendingNow() {
  const scrollRef              = useRef(null);
  const [atStart, setAtStart]  = useState(true);
  const [atEnd,   setAtEnd]    = useState(false);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get('/articles/', {
      params: { status: 'publie', ordering: '-view_count,-published_at', page_size: 8 },
    }).then(({ data }) => {
      setArticles((data.results || []).map(mapArticle));
    }).catch(() => {});
  }, []);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }

  function scrollLeft()  { scrollRef.current?.scrollBy({ left: -SCROLL_BY, behavior: "smooth" }); }
  function scrollRight() { scrollRef.current?.scrollBy({ left:  SCROLL_BY, behavior: "smooth" }); }

  if (articles.length === 0) return null;

  return (
    <section className="py-12 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[32px] rounded-full bg-orange" />
            <div className="w-[2px] h-[16px] rounded-full bg-orange opacity-60" />
          </div>
          <h2 className="text-[24px] md:text-[35px] font-black uppercase tracking-tight text-white leading-none">
            Trending
          </h2>
        </div>
      </div>

      {/* Carousel wrapper */}
      <div className="relative">
        {/* LEFT arrow */}
        <button
          onClick={scrollLeft}
          disabled={atStart}
          className="absolute left-0 top-1/2 rounded -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 flex items-center justify-center mx-2 disabled:opacity-0 disabled:pointer-events-none transition-all duration-150"
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

        {/* RIGHT arrow */}
        <button
          onClick={scrollRight}
          disabled={atEnd}
          className="absolute right-0 top-1/2 rounded -translate-y-1/2 mx-2 translate-x-1/2 z-10 w-10 h-10 flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none transition-all duration-150"
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

        {/* Scroll track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollSnapType: "x mandatory", msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          <style>{`.trending-scroll::-webkit-scrollbar { display: none; }`}</style>
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/articles/${article.slug}`}
              className="trending-scroll group rounded relative shrink-0 overflow-hidden block"
              style={{ width: CARD_W, height: 210, scrollSnapAlign: "start" }}
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/600/400`; }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(5,5,15,0.95) 0%, rgba(5,5,15,0.4) 55%, transparent 100%)" }}
              />
              <span
                className="absolute rounded top-3 right-3 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5"
                style={{ background: article.tagColor, color: "#fff" }}
              >
                {article.tag}
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-[16px] font-bold text-white leading-snug line-clamp-2 mb-1.5">
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

      {/* Scroll dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {articles.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: i === 0 ? "#FF6B00" : "rgba(255,255,255,0.15)" }}
          />
        ))}
      </div>
    </section>
  );
}
