import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Tag, Meta } from "./shared";
import api from '../../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../../utils/article';

function mapArticle(a) {
  return {
    slug:     a.slug,
    title:    a.title,
    tag:      a.category?.name || 'GAMING',
    tagColor: '#e8001c',
    image:    a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/600/400`,
    time:     timeAgo(a.published_at),
    views:    formatViews(a.view_count),
    excerpt:  a.meta_description || '',
  };
}

export default function GameNewsSection() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get('/articles/', {
      params: { status: 'publie', category__slug: 'gaming', ordering: '-published_at', page_size: 9 },
    }).then(({ data }) => {
      setArticles((data.results || []).map(mapArticle));
    }).catch(() => {
      // Fallback: fetch any articles if no gaming category
      api.get('/articles/', {
        params: { status: 'publie', ordering: '-published_at', page_size: 9 },
      }).then(({ data }) => {
        setArticles((data.results || []).map(mapArticle));
      }).catch(() => {});
    });
  }, []);

  if (articles.length === 0) return null;

  const [featured, ...rest] = articles;

  return (
    <section className="py-12 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[32px] rounded-full bg-orange" />
            <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
          </div>
          <h2 className="text-[24px] md:text-[35px] font-black uppercase tracking-tighter text-white leading-none">
            Gaming News
          </h2>
        </div>
      </div>

      {/* Featured banner */}
      <Link
        to={`/articles/${featured.slug}`}
        className="relative block overflow-hidden group mb-4 rounded"
      >
        <img
          src={featured.image}
          alt={featured.title}
          className="w-full object-cover transition-transform duration-500"
          style={{ height: 'clamp(200px, 35vw, 320px)' }}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${featured.slug}/1200/640`; }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(5,5,15,0.95) 0%, rgba(5,5,15,0.5) 50%, transparent 100%)" }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-6" style={{ maxWidth: 600 }}>
          <Tag label={featured.tag} color={featured.tagColor} />
          <h3 className="text-white font-black text-[18px] sm:text-[22px] md:text-[28px] leading-tighter mt-2 mb-2 line-clamp-2">
            {featured.title}
          </h3>
          <Meta time={featured.time} views={featured.views} />
        </div>
      </Link>

      {/* 4-column grid */}
      <div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {rest.map((a) => (
            <Link
              key={a.slug}
              to={`/articles/${a.slug}`}
              className="group block"
            >
              <div className="overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full object-cover transition-transform duration-300"
                  style={{ height: 140 }}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${a.slug}/400/280`; }}
                />
              </div>
              <div className="pt-2">
                <Tag label={a.tag} color={a.tagColor} />
                <p className="text-[15px] font-bold text-[#c8c8d8] leading-snug mt-1 line-clamp-2 group-hover:text-white transition-colors">
                  {a.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-[#555566]">
                  <span className="flex items-center gap-1"><Clock size={9} />{a.time}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
