import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Eye } from 'lucide-react';
import api from '../../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../../utils/article';

const ACCENT     = '#a855f7';
const ACCENT_RGB = '168,85,247';

function mapArticle(a) {
  return {
    slug:     a.slug,
    title:    a.title,
    excerpt:  a.meta_description || '',
    tag:      a.category?.name || 'CULTURE',
    tagColor: ACCENT,
    image:    a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/600/400`,
    time:     timeAgo(a.published_at),
    views:    formatViews(a.view_count),
  };
}

function TagPill({ label, color }) {
  return (
    <span
      className="inline-block text-[10px] font-black uppercase tracking-widest px-2 py-[3px]"
      style={{
        background: 'rgba(0,0,0,0.75)',
        color: color || ACCENT,
        border: `1px solid ${color || ACCENT}`,
        borderRadius: 2,
      }}
    >
      {label}
    </span>
  );
}

function MetaRow({ time, views }) {
  return (
    <div className="flex items-center gap-3 text-[11px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
      {time  && <span className="flex items-center gap-1"><Clock size={10} />{time}</span>}
      {views && <span className="flex items-center gap-1"><Eye   size={10} />{views}</span>}
    </div>
  );
}

export default function CultureSection() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get('/articles/', {
      params: { status: 'publie', category__slug: 'culture', ordering: '-published_at', page_size: 9 },
    }).then(({ data }) => {
      setArticles((data.results || []).map(mapArticle));
    }).catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  const featured   = articles[0];          // Left: tall portrait
  const stackCards = articles.slice(1, 3); // Center: 2 stacked landscape
  const listItems  = articles.slice(3, 9); // Right: text-only list

  return (
    <section className="py-12 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[28px] rounded-full" style={{ background: ACCENT }} />
            <div className="w-[2px] h-[16px] rounded-full" style={{ background: ACCENT, opacity: 0.35 }} />
          </div>
          <h2 className="text-[24px] md:text-[35px] font-black uppercase tracking-tight text-white leading-none">
            Culture
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

      {/* 3-column layout: [1fr_1fr_300px] */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_300px] gap-2 items-start">

        {/* Left — Large feature, aspect-[3/4] tall portrait, text overlay at bottom */}
        <Link to={`/articles/${featured.slug}`} className="group relative block overflow-hidden" style={{ borderRadius: 4 }}>
          <img
            src={featured.image}
            alt={featured.title}
            className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-700"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${featured.slug}/600/800`; }}
          />
          <div className="absolute top-0 left-0 right-0" style={{ height: 2, background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,2,15,0.97) 0%, rgba(5,2,15,0.45) 45%, transparent 72%)' }} />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <TagPill label={featured.tag} color={featured.tagColor} />
            <h3 className="text-white font-black text-[20px] leading-snug mt-2 mb-2 line-clamp-3 group-hover:text-purple-300 transition-colors duration-200">
              {featured.title}
            </h3>
            {featured.excerpt && (
              <p className="text-[12px] leading-relaxed line-clamp-2 mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {featured.excerpt}
              </p>
            )}
            <MetaRow time={featured.time} views={featured.views} />
          </div>
        </Link>

        {/* Center — 2 stacked landscape cards, both fill column height equally */}
        <div className="flex flex-col gap-2">
          {stackCards.map(a => (
            <Link
              key={a.slug}
              to={`/articles/${a.slug}`}
              className="group relative block overflow-hidden"
              style={{ borderRadius: 4 }}
            >
              <img
                src={a.image}
                alt={a.title}
                className="w-full aspect-[4/3] object-cover group-hover:scale-[1.03] transition-transform duration-500"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${a.slug}/600/450`; }}
              />
              <div className="absolute top-0 left-0 right-0" style={{ height: 2, background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,2,15,0.9) 0%, rgba(5,2,15,0.3) 50%, transparent 80%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <TagPill label={a.tag} color={a.tagColor} />
                <h3 className="text-white font-bold text-[14px] leading-snug line-clamp-2 mt-1 group-hover:text-purple-200 transition-colors duration-200">
                  {a.title}
                </h3>
                <MetaRow time={a.time} views={a.views} />
              </div>
            </Link>
          ))}
        </div>

        {/* Right — Vertical text-only list, 5–6 items divided by borders */}
        <div className="flex flex-col">
          {listItems.map((a) => (
            <Link
              key={a.slug}
              to={`/articles/${a.slug}`}
              className="group py-3 px-1 border-b border-[#1a1a28] last:border-0 hover:bg-[#0f0f1c] transition-colors"
            >
              <TagPill label={a.tag} color={a.tagColor} />
              <p className="text-[13px] font-semibold text-[#ccccdd] leading-snug line-clamp-2 mt-1 group-hover:text-white transition-colors duration-150">
                {a.title}
              </p>
              <MetaRow time={a.time} views={a.views} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
