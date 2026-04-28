import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Tag, Meta } from './shared';
import api from '../../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../../utils/article';
import { useLandingSection } from '../../../context/LandingSectionsContext';

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
  const [article, setArticle] = useState(null);

  useEffect(() => {
    api
      .get("/articles/", {
        params: {
          status: "publie",
          category__slug: slug,
          ordering: "-published_at",
          page_size: 2,
        },
      })
      .then(({ data }) => {
        const filtered = (data.results || [])
          .filter((a) => a.slug !== featuredSlug)
          .map(mapArticle);
        if (filtered[0]) setArticle(filtered[0]);
      })
      .catch(() => {});
  }, [slug, featuredSlug]);

  if (!article) return null;

  return (
    <Link to={`/articles/${article.slug}`} className="group block rounded">
      {/* fixed 120px image on top */}
      <div className="overflow-hidden h-[120px] rounded">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/400/300`; }}
        />
      </div>
      {/* Text below */}
      <div className="pt-2">
        <Tag label={article.tag} color={color} />
        <p className="text-[14px] font-bold text-[#ccccdd] leading-snug line-clamp-2 mt-1 group-hover:text-white transition-colors">
          {article.title}
        </p>
        <div className="flex items-center gap-1 mt-1 text-[10px] text-[#555566]">
          <Clock size={9} />
          <span>{article.time}</span>
        </div>
      </div>
    </Link>
  );
}

export default function LatestGrid() {
  const config = useLandingSection('latest');
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    // Use first pinned article as the featured card
    if (config?.articles?.length > 0) {
      setFeatured(mapArticle(config.articles[0].article));
      return;
    }
    const params = { status: 'publie', ordering: '-published_at', page_size: 1 };
    if (config?.category_slug) params.category__slug = config.category_slug;
    api.get('/articles/', { params })
      .then(({ data }) => {
        const articles = (data.results || []).map(mapArticle);
        if (articles[0]) setFeatured(articles[0]);
      }).catch(() => {});
  }, [config]);

  if (config?.is_active === false) return null;
  if (!featured) return null;

  return (
    <section className="py-12 ">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex gap-[3px] items-center">
          <div className="w-[4px] h-[32px] rounded-full bg-orange" />
          <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
        </div>
        <h2 className="text-[24px] md:text-[45px] font-black uppercase tracking-tight text-white leading-none">Latest News</h2>
      </div>
<div className='px-4'>
   {/* Featured — full width, fixed 220px height, content overlaid */}
      <Link to={`/articles/${featured.slug}`} className="group block mb-4 relative overflow-hidden h-[220px] rounded">
        <img
          src={featured.image}
          alt={featured.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${featured.slug}/900/506`; }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)' }} />
        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Tag label={featured.tag} color={featured.tagColor} />
          <h3 className="text-white font-black text-[22px] leading-tight mt-1 mb-1 line-clamp-2">
            {featured.title}
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-orange font-bold text-[11px]">{featured.author}</span>
            <Meta time={featured.time} views={featured.views} />
          </div>
        </div>
      </Link>

      {/* 4-column grid — aspect-[16/9] cards, image on top, text below */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        {CATEGORIES.map(cat => (
          <CategoryBlock
            key={cat.slug}
            slug={cat.slug}
            label={cat.label}
            color={cat.color}
            featuredSlug={featured.slug}
          />
        ))}
      </div>
</div>
   
      
    </section>
  );
}
