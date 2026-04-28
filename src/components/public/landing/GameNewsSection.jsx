import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Eye, ArrowRight } from "lucide-react";
import { Tag } from "./shared";
import api from '../../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../../utils/article';
import { useLandingSection } from '../../../context/LandingSectionsContext';

function mapArticle(a) {
  return {
    slug:     a.slug,
    title:    a.title,
    tag:      a.category?.name || 'GAMING',
    tagColor: '#e8001c',
    image:    a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/600/400`,
    time:     timeAgo(a.published_at),
    views:    formatViews(a.view_count),
    excerpt:  a.meta_description || '',
  };
}

export default function GameNewsSection() {
  const config = useLandingSection('game_news');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (config?.articles?.length > 0) {
      setArticles(config.articles.map(sa => mapArticle(sa.article)));
      return;
    }
    const slug  = config?.category_slug || 'gaming';
    const count = config?.article_count || 6;
    api.get('/articles/', {
      params: { status: 'publie', category__slug: slug, ordering: '-published_at', page_size: count },
    }).then(({ data }) => {
      setArticles((data.results || []).map(mapArticle));
    }).catch(() => {
      api.get('/articles/', {
        params: { status: 'publie', ordering: '-published_at', page_size: count },
      }).then(({ data }) => {
        setArticles((data.results || []).map(mapArticle));
      }).catch(() => {});
    });
  }, [config]);

  if (config?.is_active === false) return null;
  if (articles.length === 0) return null;

  const [featured, ...rest] = articles;
  const sideList = rest.slice(0, 4);

  return (
    <section className="py-12 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[32px] rounded-full bg-[#e8001c]" />
            <div className="w-[2px] h-[14px] rounded-full bg-[#e8001c] opacity-40" />
          </div>
          <h2 className="text-[24px] md:text-[35px] font-black uppercase tracking-tighter text-white leading-none">
            Gaming News
          </h2>
        </div>
        <Link
          to="/gaming"
          className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#e8001c] hover:text-white transition-colors"
        >
          Voir tout <ArrowRight size={13} strokeWidth={3} />
        </Link>
      </div>

      {/* Magazine layout — dark panel */}
      <div
        className="overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0e0e1a 0%, #0a0a14 100%)',
          border: '1px solid #1e1e2e',
          borderLeft: '3px solid #e8001c',
          borderRadius: 4,
        }}
      >
        <div className="flex flex-col lg:flex-row">

          {/* Left — featured article with image overlay */}
          <Link
            to={`/articles/${featured.slug}`}
            className="group relative overflow-hidden lg:w-[52%] shrink-0"
            style={{ minHeight: 320 }}
          >
            <img
              src={featured.image}
              alt={featured.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${featured.slug}/700/400`; }}
            />
            {/* Gradient */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)' }}
            />
            {/* FEATURED badge */}
            <div
              className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest text-white px-2 py-1"
              style={{ background: '#e8001c' }}
            >
              Featured
            </div>
            {/* Text */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <Tag label={featured.tag} color="#e8001c" />
              <h3 className="text-white font-black text-[20px] leading-tight mt-2 mb-2 line-clamp-3">
                {featured.title}
              </h3>
              {featured.excerpt && (
                <p className="text-[#aaaabc] text-[12px] leading-relaxed line-clamp-2 mb-3">
                  {featured.excerpt}
                </p>
              )}
              <div className="flex items-center gap-3 text-[11px] text-[#666677]">
                <span className="flex items-center gap-1"><Clock size={10} />{featured.time}</span>
                <span className="flex items-center gap-1"><Eye size={10} />{featured.views}</span>
              </div>
            </div>
          </Link>

          {/* Right — vertical article list */}
          <div className="flex-1 flex flex-col divide-y" style={{ borderLeft: '1px solid #1e1e2e', divideColor: '#1e1e2e' }}>
            {sideList.map((a, i) => (
              <Link
                key={a.slug}
                to={`/articles/${a.slug}`}
                className="group flex items-start gap-3 p-4 hover:bg-[#111120] transition-colors"
              >
                {/* Rank number */}
                <span
                  className="shrink-0 text-[22px] font-black leading-none mt-1"
                  style={{ color: i === 0 ? '#e8001c' : 'rgba(255,255,255,0.12)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* Thumbnail */}
                <div className="shrink-0 w-[80px] h-[56px] overflow-hidden" style={{ borderRadius: 3 }}>
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${a.slug}/160/112`; }}
                  />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#ccccdd] leading-snug line-clamp-2 group-hover:text-white transition-colors">
                    {a.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#555566]">
                    <span className="flex items-center gap-1"><Clock size={9} />{a.time}</span>
                    <span className="flex items-center gap-1"><Eye size={9} />{a.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
