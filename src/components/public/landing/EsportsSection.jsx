import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Users, Crosshair } from 'lucide-react';
import api from '../../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../../utils/article';

const C  = '#FF6B00';
const CR = '255,107,0';

const CSS = `
  @keyframes radarRing {
    0%   { transform: scale(0.7); opacity: 0.9; }
    100% { transform: scale(3.2); opacity: 0;   }
  }
  @keyframes liveDot {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.15; }
  }
  @keyframes hudScan {
    0%   { top: -20%; opacity: 0; }
    8%   { opacity: 0.8; }
    92%  { opacity: 0.5; }
    100% { top: 110%; opacity: 0; }
  }
  @keyframes bgPulse {
    0%, 100% { opacity: 0.04; }
    50%      { opacity: 0.08; }
  }
`;

function mapArticle(a) {
  return {
    slug:   a.slug,
    title:  a.title,
    tag:    a.category?.name || 'ESPORTS',
    image:  a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/600/420`,
    time:   timeAgo(a.published_at),
    author: a.author?.username || '',
  };
}

function ArticleCard({ article, index }) {
  const shadow    = `0 0 0 1px rgba(${CR},0.12), 0 4px 20px rgba(0,0,0,0.5)`;
  const shadowHov = `0 0 0 1px rgba(${CR},0.45), 0 0 40px rgba(${CR},0.14), 0 12px 40px rgba(0,0,0,0.7)`;

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group relative flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(175deg,rgba(4,14,20,0.98) 0%,rgba(2,8,12,0.97) 100%)',
        boxShadow: shadow,
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = shadowHov)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = shadow)}
    >
      {/* Image area */}
      <div className="relative overflow-hidden shrink-0" style={{ height: 'clamp(140px, 20vw, 210px)' }}>
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/600/420`; }}
        />
        {/* Scanlines */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 3px)',
        }} />
        {/* Scan beam */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 70, zIndex: 3, pointerEvents: 'none',
          background: `linear-gradient(to bottom,transparent,rgba(${CR},0.04),transparent)`,
          animation: `hudScan ${4.5 + index * 0.7}s ease-in-out infinite`,
        }} />
        {/* Bottom gradient */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 4,
          background: 'linear-gradient(to bottom,rgba(2,8,12,0.05) 0%,rgba(2,8,12,0.55) 80%,rgba(2,8,12,0.9) 100%)',
        }} />
        {/* Index number */}
        <div className="absolute bottom-3 right-3" style={{
          zIndex: 10, fontSize: 11, fontWeight: 900,
          color: `rgba(${CR},0.45)`, letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>
        {/* Bottom rule */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, zIndex: 10,
          background: `linear-gradient(90deg, ${C} 0%, rgba(${CR},0.4) 40%, transparent 100%)`,
          boxShadow: `0 0 8px rgba(${CR},0.5)`,
        }} />
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-1 gap-3" style={{ padding: '16px 18px 18px' }}>
        <h3 style={{
          fontSize: 14, fontWeight: 800, lineHeight: 1.4,
          color: 'rgba(220,240,255,0.92)',
          textTransform: 'uppercase', letterSpacing: '-0.01em',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
          transition: 'color 0.2s',
        }}
          className="group-hover:text-white"
        >
          {article.title}
        </h3>

        <div style={{ height: 1, background: `linear-gradient(90deg, rgba(${CR},0.18) 0%, transparent 70%)` }} />

        <div className="flex items-center gap-4 mt-auto" style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
          {article.time   && <span className="flex items-center gap-1.5"><Clock size={8} />{article.time}</span>}
          {article.author && (
            <span className="flex items-center gap-1.5 font-bold" style={{ color: 'rgba(255,255,255,0.44)' }}>
              <Users size={8} />{article.author}
            </span>
          )}
        </div>
      </div>

      {/* Left accent bar on hover */}
      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{
        left: 0, top: '18%', bottom: '18%', width: 2, borderRadius: '0 2px 2px 0',
        background: C, boxShadow: `0 0 8px ${C}`,
      }} />
    </Link>
  );
}

export default function EsportsSection() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get('/articles/', {
      params: { status: 'publie', category__slug: 'esports', ordering: '-published_at', page_size: 4 },
    }).then(({ data }) => {
      setArticles((data.results || []).map(mapArticle));
    }).catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="py-12 border-b border-[#1a1a28] relative overflow-hidden">
      <style>{CSS}</style>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -80, left: '15%', width: 800, height: 400,
        background: `radial-gradient(ellipse,rgba(${CR},0.05) 0%,transparent 65%)`,
        pointerEvents: 'none', zIndex: 0,
        animation: 'bgPulse 5s ease-in-out infinite',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-7">
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
                textShadow: `0 0 50px rgba(${CR},0.3)`,
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
              marginTop: 8, transition: 'color .15s, border-color .15s, box-shadow .15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = C;
              e.currentTarget.style.borderColor = `rgba(${CR},0.38)`;
              e.currentTarget.style.boxShadow = `0 0 12px rgba(${CR},0.1)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.22)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            See all <ChevronRight size={11} />
          </Link>
        </div>

        {/* 4-col grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {articles.map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
