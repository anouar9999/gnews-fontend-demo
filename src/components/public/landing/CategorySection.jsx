import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Tag, Meta } from './shared';

function ArticleCard({ article, imgHeight = 140 }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group block"
    >
      <div className="overflow-hidden rounded  mb-2">
        <img
          src={article.image}
          alt={article.title}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
          style={{ height: imgHeight }}
        />
      </div>
      <div className="gap-3"/>  
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
        <h2 className="text-[35px] font-black uppercase tracking-tight text-white leading-none">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          to={href}
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-colors duration-150"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          Voir tout <ChevronRight size={12} />
        </Link>
      )}
    </div>
  );
}

export default function CategorySection({ title, icon, href, color = '#e8001c', articles = [] }) {
  if (!articles.length) return null;

  return (
    <section className="py-12 border-b border-[#1a1a28]">
      <Header title={title} icon={icon} href={href} color={color} />

      <div className="grid grid-cols-4 gap-4 mb-4">
        {articles.slice(0, 4).map((a) => (
          <ArticleCard key={a.id} article={a} imgHeight={190} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {articles.slice(4, 8).map((a) => (
          <ArticleCard key={a.id} article={a} imgHeight={120} />
        ))}
      </div>
    </section>
  );
}
