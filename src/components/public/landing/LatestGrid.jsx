import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Tag, Meta } from './shared';
import api from '../../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../../utils/article';

function mapArticle(a) {
  return {
    slug:     a.slug,
    title:    a.title,
    tag:      a.category?.name || 'NEWS',
    tagColor: '#f59e0b',
    image:    a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/800/450`,
    time:     timeAgo(a.published_at),
    views:    formatViews(a.view_count),
    excerpt:  a.meta_description || '',
    author:   a.author?.full_name || a.author?.username || 'Gnewz Staff',
  };
}

const CATEGORIES = [
  { slug: 'gaming',   label: 'Gaming',   color: '#e8001c' },
  { slug: 'hardware', label: 'Hardware', color: '#3b82f6' },
  { slug: 'culture',  label: 'Culture',  color: '#a855f7' },
  { slug: 'esports',  label: 'Esports',  color: '#f59e0b' },
];

function CategoryBlock({ slug, label, color, featuredSlug }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get('/articles/', {
      params: { status: 'publie', category__slug: slug, ordering: '-published_at', page_size: 4 },
    }).then(({ data }) => {
      setArticles((data.results || []).filter(a => a.slug !== featuredSlug).slice(0, 2).map(mapArticle));
    }).catch(() => {});
  }, [slug, featuredSlug]);

  if (!articles.length) return null;

  return (
    <div className="border-b border-[#1a1a28] last:border-0">
      <div className="flex items-center gap-2 px-3 py-1.5" style={{ borderLeft: `3px solid ${color}` }}>
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>{label}</span>
      </div>
      {articles.map(a => (
        <Link
          key={a.slug}
          to={`/articles/${a.slug}`}
          className="flex items-start gap-2.5 px-3 py-2 hover:bg-[#12121e] transition-colors group border-t border-[#1a1a28]"
        >
          <div className="shrink-0 w-[68px] h-[44px] overflow-hidden bg-[#1a1a28]">
            <img
              src={a.image} alt={a.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${a.slug}/200/130`; }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold text-[#ccccdd] leading-snug line-clamp-2 group-hover:text-white transition-colors">{a.title}</p>
            <span className="text-[10px] text-[#555566] flex items-center gap-1 mt-0.5"><Clock size={8} />{a.time}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function LatestGrid() {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    api.get('/articles/', {
      params: { status: 'publie', ordering: '-published_at', page_size: 1 },
    }).then(({ data }) => {
      const articles = (data.results || []).map(mapArticle);
      if (articles[0]) setFeatured(articles[0]);
    }).catch(() => {});
  }, []);

  if (!featured) return null;

  return (
    <section className="py-12 border-b border-[#1a1a28]">

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex gap-[3px] items-center">
          <div className="w-[4px] h-[32px] rounded-full bg-orange" />
          <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
        </div>
        <h2 className="text-[22px] md:text-[30px] font-black uppercase tracking-tight text-white leading-none">Latest News</h2>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-3 items-start">

        {/* Featured article */}
        <Link
          to={`/articles/${featured.slug}`}
          className="relative block overflow-hidden group bg-[#0d0d18]"
        >
          <img
            src={featured.image}
            alt={featured.title}
            className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${featured.slug}/900/506`; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d18] via-[#0d0d18]/55 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
            <Tag label={featured.tag} color={featured.tagColor} />
            <h3 className="text-white font-black text-[18px] sm:text-[22px] leading-tight mt-2 mb-2 line-clamp-3">{featured.title}</h3>
            {featured.excerpt && (
              <p className="hidden sm:block text-[#aaaabc] text-[13px] leading-relaxed line-clamp-2 mb-2">{featured.excerpt}</p>
            )}
            <div className="flex items-center gap-4 text-[12px] text-[#666677]">
              <span className="text-orange font-bold">{featured.author}</span>
              <Meta time={featured.time} views={featured.views} />
            </div>
          </div>
        </Link>

        {/* Category sidebar */}
        <div className="bg-[#0d0d18] flex flex-col">
          {CATEGORIES.map(cat => (
            <CategoryBlock key={cat.slug} slug={cat.slug} label={cat.label} color={cat.color} featuredSlug={featured.slug} />
          ))}
        </div>

      </div>
    </section>
  );
}
