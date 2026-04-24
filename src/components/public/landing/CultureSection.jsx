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

function Meta({ time, views }) {
  return (
    <div className="flex items-center gap-3 text-[11px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
      {time  && <span className="flex items-center gap-1"><Clock size={10} />{time}</span>}
      {views && <span className="flex items-center gap-1"><Eye   size={10} />{views}</span>}
    </div>
  );
}

function FeaturedCard({ article }) {
  return (
    <Link to={`/articles/${article.slug}`} className="group relative block overflow-hidden" style={{ borderRadius: 4 }}>
      <img
        src={article.image}
        alt={article.title}
        className="w-full aspect-[16/9] object-cover group-hover:scale-[1.04] transition-transform duration-700"
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/800/533`; }}
      />
      <div className="absolute top-0 left-0 right-0" style={{ height: 2, background: `linear-gradient(90deg, ${ACCENT}, rgba(168,85,247,0.15) 70%, transparent)` }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,2,15,0.97) 0%, rgba(5,2,15,0.5) 45%, transparent 72%)' }} />
      <div className="absolute top-3 left-3">
        <TagPill label={article.tag} color={article.tagColor} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-white font-black text-[21px] leading-snug mb-2 line-clamp-3 group-hover:text-purple-300 transition-colors duration-200">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-[13px] leading-relaxed line-clamp-2 mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {article.excerpt}
          </p>
        )}
        <Meta time={article.time} views={article.views} />
      </div>
    </Link>
  );
}

function CompactRow({ article, index }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group flex overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, rgba(15,8,25,0.85), rgba(10,6,18,0.85))',
        border: '1px solid rgba(168,85,247,0.1)',
        borderRadius: 4,
        flex: 1,
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(168,85,247,0.35)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(168,85,247,0.1)')}
    >
      <div className="absolute left-0 top-0 bottom-0 shrink-0" style={{ width: 3, background: article.tagColor || ACCENT, opacity: 0.7 }} />
      <div className="shrink-0 overflow-hidden ml-[3px]" style={{ width: 86, height: 64 }}>
        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/200/140`; }} />
      </div>
      <div className="flex flex-col justify-between min-w-0 px-3 py-2">
        <div>
          <TagPill label={article.tag} color={article.tagColor} />
          <p className="text-[12px] font-bold leading-snug mt-1 line-clamp-2 text-[#c0b0d8] group-hover:text-white transition-colors duration-150">
            {article.title}
          </p>
        </div>
        <Meta time={article.time} views={article.views} />
      </div>
      <div className="absolute top-1.5 right-2 text-[9px] font-black" style={{ color: `rgba(${ACCENT_RGB},0.22)`, letterSpacing: 2 }}>
        {String(index + 2).padStart(2, '0')}
      </div>
    </Link>
  );
}

function MiniCard({ article }) {
  return (
    <Link to={`/articles/${article.slug}`} className="group block">
      <div className="relative overflow-hidden mb-2" style={{ borderRadius: 3 }}>
        <img
          src={article.image}
          alt={article.title}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
          style={{ height: 100 }}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/400/200`; }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,2,15,0.6) 0%, transparent 55%)' }} />
        <div className="absolute top-1.5 left-1.5">
          <TagPill label={article.tag} color={article.tagColor} />
        </div>
      </div>
      <p className="text-[12px] font-bold leading-snug line-clamp-2 mb-1 text-[#b0a0c8] group-hover:text-white transition-colors duration-150">
        {article.title}
      </p>
      <Meta time={article.time} views={article.views} />
    </Link>
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

  const featured  = articles[0];
  const listItems = articles.slice(1, 5);
  const gridItems = articles.slice(5, 9);

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

      {/* Top: featured left + compact list right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5 mb-5 items-start">
        <FeaturedCard article={featured} />
        <div className="flex flex-col gap-3">
          <div style={{ height: 1, background: `linear-gradient(90deg, rgba(${ACCENT_RGB},0.5) 0%, transparent 100%)`, marginBottom: 2 }} />
          {listItems.map((a, i) => (
            <CompactRow key={a.slug} article={a} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom: 4-col mini grid */}
      {gridItems.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {gridItems.map(a => (
            <MiniCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </section>
  );
}
