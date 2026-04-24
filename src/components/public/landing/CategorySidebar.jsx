import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import api from '../../../api/axios';
import { normalizeMediaUrl, timeAgo } from '../../../utils/article';

const ALL_CATEGORIES = [
  { label: 'Gaming',   slug: 'gaming',   href: '/gaming',   color: '#e8001c' },
  { label: 'Hardware', slug: 'hardware', href: '/hardware', color: '#3b82f6' },
  { label: 'Culture',  slug: 'culture',  href: '/culture',  color: '#a855f7' },
  { label: 'Esports',  slug: 'esports',  href: '/esports',  color: '#f59e0b' },
];

function SidebarArticle({ article, color }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="flex gap-3 group py-2.5 border-b border-[#1a1a28] last:border-0"
    >
      <div className="flex-shrink-0 w-20 h-14 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[9px] font-black uppercase tracking-widest mb-1"
          style={{ color }}
        >
          {article.tag}
        </p>
        <p className="text-white text-[12px] font-bold leading-snug line-clamp-2 group-hover:opacity-80 transition-opacity">
          {article.title}
        </p>
        <p className="text-[#555566] text-[10px] mt-1">{article.time}</p>
      </div>
    </Link>
  );
}

function CategoryBlock({ cat }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api
      .get('/articles/', {
        params: {
          status: 'publie',
          category__slug: cat.slug,
          ordering: '-published_at',
          page_size: 4,
        },
      })
      .then(({ data }) => {
        const mapped = (data.results || []).slice(0, 4).map(a => ({
          slug:  a.slug,
          title: a.title,
          image: a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/400/250`,
          tag:   a.category?.name || a.tags?.[0]?.name || cat.label.toUpperCase(),
          time:  timeAgo(a.published_at),
        }));
        setArticles(mapped);
      })
      .catch(() => {});
  }, [cat.slug]);

  if (articles.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-1 h-4"
            style={{ background: cat.color }}
          />
          <span
            className="text-[11px] font-black uppercase tracking-widest"
            style={{ color: cat.color }}
          >
            {cat.label}
          </span>
        </div>
        <Link
          to={cat.href}
          className="flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-widest text-[#555566] hover:text-white transition-colors"
        >
          See All <ChevronRight size={11} strokeWidth={3} />
        </Link>
      </div>

      {/* Article list */}
      <div>
        {articles.map(a => (
          <SidebarArticle key={a.slug} article={a} color={cat.color} />
        ))}
      </div>
    </div>
  );
}

/**
 * CategorySidebar
 * @param {string} currentSlug – slug of the currently active category; those articles are excluded
 */
export default function CategorySidebar({ currentSlug }) {
  const cats = ALL_CATEGORIES.filter(c => c.slug !== currentSlug);

  return (
    <aside className="w-full">
      {cats.map(cat => (
        <CategoryBlock key={cat.slug} cat={cat} />
      ))}
    </aside>
  );
}
