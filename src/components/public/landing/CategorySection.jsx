import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock } from 'lucide-react';
import api from '../../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../../utils/article';

function mapArticle(a) {
  return {
    slug:     a.slug,
    title:    a.title,
    tag:      a.category?.name || '',
    image:    a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/400/300`,
    time:     timeAgo(a.published_at),
    views:    formatViews(a.view_count),
    comments: a.comments_count || 0,
  };
}

const COL_LABELS = ['Actualités', 'Tests', 'Vidéos', 'Dossiers'];

function Header({ title, icon: Icon, href, color }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className="flex gap-[3px] items-center">
          <div className="w-[4px] h-[26px] rounded-full" style={{ background: color }} />
          <div className="w-[2px] h-[16px] rounded-full" style={{ background: color, opacity: 0.4 }} />
        </div>
        {/* {Icon && <Icon size={18} style={{ color }} />} */}
        <h2 className="text-[24px] md:text-[45px] font-black uppercase tracking-tight text-white leading-none">{title}</h2>
      </div>
      {href && (
        <Link
          to={href}
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-colors duration-150"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          See all <ChevronRight size={12} />
        </Link>
      )}
    </div>
  );
}

export default function CategorySection({
  title,
  icon,
  href,
  color = '#e8001c',
  articles: propArticles,
  categorySlug,
}) {
  const [articles, setArticles] = useState(propArticles || []);

  useEffect(() => {
    if (propArticles?.length) {
      setArticles(propArticles);
      return;
    }
    if (!categorySlug) return;
    api.get('/articles/', {
      params: { status: 'publie', category__slug: categorySlug, ordering: '-published_at', page_size: 8 },
    }).then(({ data }) => {
      setArticles((data.results || []).map(mapArticle));
    }).catch(() => {});
  }, [categorySlug, propArticles]);

  if (!articles.length) return null;

  // Split into 4 columns of 2
  const columns = [
    { label: COL_LABELS[0], items: articles.slice(0, 2) },
    { label: COL_LABELS[1], items: articles.slice(2, 4) },
    { label: COL_LABELS[2], items: articles.slice(4, 6) },
    { label: COL_LABELS[3], items: articles.slice(6, 8) },
  ].filter(col => col.items.length > 0);

  return (
    <section className="py-12 ">
      <Header title={title} icon={icon} href={href} color={color} />

      {/* 4-column layout — each column has its own header + stacked flex-row cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {columns.map((col) => (
          <div key={col.label} className="flex flex-col">
            {/* Column header */}
            <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-[#1a1a28]">
              <div
                className="w-[2px] h-[12px] rounded-full"
                style={{ background: color }}
              />
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color }}
              >
                {col.label}
              </span>
            </div>

            {/* Stacked flex-row cards */}
            {col.items.map((a, cardIdx) => (
              <Link
                key={a.slug}
                to={`/articles/${a.slug}`}
                className={`group flex gap-2 py-2.5 hover:bg-[#0f0f1c] transition-colors${cardIdx < col.items.length - 1 ? ' border-b border-[#1a1a28]' : ''}`}
              >
                {/* Thumbnail — aspect-[3/2] short landscape */}
                <div
                  className="shrink-0 w-[80px] overflow-hidden bg-[#1a1a28]"
                  style={{ aspectRatio: "3/2" }}
                >
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${a.slug}/300/200`; }}
                  />
                </div>
                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#ccccdd] leading-snug line-clamp-3 group-hover:text-white transition-colors">
                    {a.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-[#555566]">
                    <Clock size={9} />
                    <span>{a.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
      
    </section>
  );
}
