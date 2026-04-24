import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Tag, Meta } from './shared';
import api from '../../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../../utils/article';

function mapArticle(a) {
  return {
    slug:     a.slug,
    title:    a.title,
    tag:      a.category?.name || '',
    tagColor: '#e8001c',
    image:    a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/400/300`,
    time:     timeAgo(a.published_at),
    views:    formatViews(a.view_count),
  };
}

function ArticleCard({ article, imgHeight = 140 }) {
  return (
    <Link to={`/articles/${article.slug}`} className="group block">
      <div className="overflow-hidden rounded mb-2">
        <img
          src={article.image}
          alt={article.title}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
          style={{ height: imgHeight }}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/400/300`; }}
        />
      </div>
      <p className="text-[13px] font-bold text-[#c8c8d8] leading-snug mt-1 line-clamp-2 group-hover:text-white transition-colors">
        {article.title}
      </p>
      <Meta time={article.time} views={article.views} />
    </Link>
  );
}

function Header({ title, icon: Icon, href, color }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className="flex gap-[3px] items-center">
          <div className="w-[4px] h-[26px] rounded-full" style={{ background: color }} />
          <div className="w-[2px] h-[16px] rounded-full" style={{ background: color, opacity: 0.4 }} />
        </div>
        <h2 className="text-[24px] md:text-[35px] font-black uppercase tracking-tight text-white leading-none">{title}</h2>
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

/**
 * CategorySection
 * Pass either `articles` (pre-fetched) OR `categorySlug` to self-fetch.
 */
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
    // Only self-fetch when no articles prop AND a categorySlug is given
    if (propArticles?.length || !categorySlug) return;
    api.get('/articles/', {
      params: { status: 'publie', category__slug: categorySlug, ordering: '-published_at', page_size: 8 },
    }).then(({ data }) => {
      setArticles((data.results || []).map(mapArticle));
    }).catch(() => {});
  }, [categorySlug, propArticles]);

  if (!articles.length) return null;

  return (
    <section className="py-12 border-b border-[#1a1a28]">
      <Header title={title} icon={icon} href={href} color={color} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {articles.slice(0, 4).map((a) => (
          <ArticleCard key={a.slug} article={a} imgHeight={190} />
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.slice(4, 8).map((a) => (
          <ArticleCard key={a.slug} article={a} imgHeight={120} />
        ))}
      </div>
    </section>
  );
}
