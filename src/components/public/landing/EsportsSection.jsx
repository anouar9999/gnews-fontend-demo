import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MessageCircle, Clock, Crosshair } from 'lucide-react';
import api from '../../../api/axios';
import { normalizeMediaUrl, timeAgo } from '../../../utils/article';
import { useLandingSection } from '../../../context/LandingSectionsContext';

const C  = '#FF6B00';
const CR = '255,107,0';

function mapArticle(a) {
  return {
    slug:     a.slug,
    title:    a.title,
    image:    a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/600/400`,
    time:     timeAgo(a.published_at),
    comments: a.comments_count || 0,
  };
}

function NewsCard({ article }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group block relative overflow-hidden aspect-[4/3]"
      style={{
        borderRadius: 8,
        boxShadow: hovered
          ? `0 0 0 1px rgba(${CR},0.4), 0 8px 28px rgba(0,0,0,0.6)`
          : `0 0 0 1px rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.4)`,
        transition: 'box-shadow 0.25s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Full-bleed image */}
      <img
        src={article.image}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/600/450`; }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0" style={{
        height: 2, zIndex: 10,
        background: `linear-gradient(90deg, ${C} 0%, rgba(${CR},0.15) 60%, transparent 100%)`,
      }} />

      {/* Orange pill badge */}
      <span
        className="absolute top-2.5 left-2.5 text-[9px] font-black uppercase tracking-widest px-2 py-[3px]"
        style={{
          background: `rgba(${CR},0.18)`,
          border: `1px solid rgba(${CR},0.55)`,
          color: C,
          borderRadius: 20,
          backdropFilter: 'blur(6px)',
          zIndex: 10,
        }}
      >
        ESPORTS
      </span>

      {/* Bottom gradient — title + timestamp */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 pt-8 pb-3"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, transparent 100%)',
          zIndex: 8,
        }}
      >
        <h3
          className="text-white font-bold leading-snug line-clamp-2 transition-colors duration-200 mb-1.5"
          style={{ fontSize: 13 }}
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

export default function EsportsSection() {
  const config = useLandingSection('esports');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (config?.articles?.length > 0) {
      setArticles(config.articles.map(sa => mapArticle(sa.article)));
      return;
    }
    const slug  = config?.category_slug || 'esports';
    const count = config?.article_count  || 8;
    api.get('/articles/', {
      params: { status: 'publie', category__slug: slug, ordering: '-published_at', page_size: count },
    }).then(({ data }) => {
      setArticles((data.results || []).map(mapArticle));
    }).catch(() => {});
  }, [config]);

  if (config?.is_active === false) return null;
  if (articles.length === 0) return null;

  return (
    <section className="py-12 border-b border-[#1a1a28]">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: `1.5px solid rgba(${CR},0.38)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 8px rgba(${CR},0.2)`,
            }}>
              <Crosshair size={10} color={C} strokeWidth={2.5} />
            </div>
            <span style={{
              fontSize: 9, fontWeight: 900, letterSpacing: '0.22em',
              color: `rgba(${CR},0.55)`, textTransform: 'uppercase',
            }}>
              Tournament Coverage
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-[3px]">
              <div style={{ width: 3, height: 28, borderRadius: 2, background: C, boxShadow: `0 0 8px ${C}` }} />
              <div style={{ width: 3, height: 12, borderRadius: 2, background: C, opacity: 0.28 }} />
            </div>
            <h2 style={{
              fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 900, lineHeight: 1,
              color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.03em',
            }}>
              Esports
            </h2>
            <span style={{
              fontSize: 10, fontWeight: 900, letterSpacing: '0.1em',
              padding: '3px 9px', borderRadius: 2,
              background: `rgba(${CR},0.08)`, border: `1px solid rgba(${CR},0.25)`,
              color: C, textTransform: 'uppercase',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: C, boxShadow: `0 0 7px ${C}` }} />
              Scene
            </span>
          </div>
        </div>

        <Link
          to="/esports"
          className="flex items-center gap-1"
          style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase',
            padding: '6px 12px', borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.07)',
            marginTop: 8, transition: 'color .15s, border-color .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = C; e.currentTarget.style.borderColor = `rgba(${CR},0.38)`; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.22)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
        >
          See all <ChevronRight size={11} />
        </Link>
      </div>

      {/* Compact ticker bar */}
      <div
        className="flex items-center overflow-hidden border border-[#1a1a28] mb-4"
        style={{ height: 38 }}
      >
        <div
          className="shrink-0 h-full flex items-center px-4 border-r border-[#1a1a28]"
          style={{ background: `rgba(${CR},0.1)` }}
        >
          <span
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: C }}
          >
            ⚡ LIVE
          </span>
        </div>
        <div className="flex-1 flex items-center gap-5 px-4 overflow-hidden">
          {articles.slice(0, 4).map((a) => (
            <Link
              key={a.slug}
              to={`/articles/${a.slug}`}
              className="shrink-0 text-[12px] text-[#aaaabc] hover:text-white transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ maxWidth: 220 }}
            >
              {a.title}
            </Link>
          ))}
        </div>
      </div>

      {/* 3-col × 2-row grid — aspect-[4/3] cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        {articles.slice(0, 6).map(a => (
          <NewsCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  );
}
