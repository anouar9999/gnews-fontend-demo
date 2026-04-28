import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MessageCircle, Clock } from 'lucide-react';
import api from '../../../api/axios';
import { normalizeMediaUrl, timeAgo } from '../../../utils/article';
import { useLandingSection } from '../../../context/LandingSectionsContext';

const ACCENT     = '#4e9eff';
const ACCENT_RGB = '78,158,255';

function mapArticle(a) {
  return {
    slug:     a.slug,
    title:    a.title,
    image:    a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/600/450`,
    time:     timeAgo(a.published_at),
    comments: a.comments_count || 0,
  };
}

function NewsCard({ article }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group block relative overflow-hidden aspect-[4/3] rounded"
      style={{
        boxShadow: hovered
          ? `0 0 0 1px rgba(${ACCENT_RGB},0.4), 0 8px 28px rgba(0,0,0,0.6)`
          : `0 0 0 1px rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.4)`,
        transition: 'box-shadow 0.25s ease',
      }}

    >
      {/* Full-bleed image */}
      <img
        src={article.image}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 "
        onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/600/450`; }}
      />

    

      {/* Pill badge */}
      {/* <span
        className="absolute top-2.5 left-2.5 text-[9px] font-black uppercase tracking-widest px-2 py-[3px]"
        style={{
          background: `rgba(${ACCENT_RGB},0.18)`,
          border: `1px solid rgba(${ACCENT_RGB},0.55)`,
          color: ACCENT,
          borderRadius: 20,
          backdropFilter: 'blur(6px)',
          zIndex: 10,
        }}
      >
        NEWS CULTURE
      </span> */}

      {/* Bottom gradient — title + timestamp */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 pt-8 pb-3"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, transparent 100%)',
          zIndex: 8,
        }}
      >
        <h3
          className="text-white font-bold leading-snug line-clamp-2 transition-colors duration-200  mb-1.5"
          style={{ fontSize: 16  }}
        >
          {article.title}
        </h3>
        <div className="flex items-center gap-1.5" style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>
          <Clock size={9} />
          <span>{article.time || '—'}</span>
        </div>
      </div>

      {article.comments > 0 && (
        <div
          className="absolute bottom-3 right-3 flex items-center gap-1"
          style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', zIndex: 10 }}
        >
          <MessageCircle size={10} />
          <span>{article.comments}</span>
        </div>
      )}
    </Link>
  );
}

export default function NewsCultureGrid() {
  const config = useLandingSection('culture');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (config?.articles?.length > 0) {
      setArticles(config.articles.map(sa => mapArticle(sa.article)));
      return;
    }
    const params = { status: 'publie', ordering: '-published_at', page_size: config?.article_count || 8 };
    if (config?.category_slug) params.category__slug = config.category_slug;
    api.get('/articles/', { params })
      .then(({ data }) => setArticles((data.results || []).map(mapArticle)))
      .catch(() => {});
  }, [config]);

  if (config?.is_active === false) return null;
  if (articles.length === 0) return null;

  return (
    <section className="py-12 border-b border-[#1a1a28]">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[26px] rounded-full bg-orange"  />
            <div className="w-[2px] h-[16px] rounded-full bg-orange" style={{  opacity: 0.35 }} />
          </div>
          <h2 className="text-[24px] md:text-[45px] font-black uppercase tracking-tight text-white leading-none">
            News &amp; Culture
          </h2>
        </div>

        <Link
          to="/culture"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-colors duration-150"
          style={{ color: 'rgba(255,255,255,0.28)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
        >
          See all <ChevronRight size={12} />
        </Link>
      </div>

      {/* 4×2 dark grid — exactly 8 cards, each aspect-[4/3] */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 ">
        {articles.slice(0, 8).map(a => (
          <NewsCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  );
}
