import { Link } from 'react-router-dom';
import { Cpu, ChevronRight } from 'lucide-react';
import { JVTECH_ARTICLES } from '../../../data/landingMockData';
import { Tag, Meta } from './shared';

function FeaturedTech({ article }) {
  return (
    <Link to={`/articles/${article.id}`}
      className="relative block overflow-hidden group lg:col-span-2"
      style={{ borderTop: '3px solid #3b82f6' }}
    >
      <img src={article.image} alt={article.title}
        className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        style={{ height: 300 }}
      />
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.5) 50%, transparent 100%)' }}
      />
      {article.score && (
        <div className="absolute top-4 right-4 text-white font-black text-[16px] w-12 h-12 flex items-center justify-center"
          style={{ background: '#3b82f6' }}>
          {article.score}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <Tag label={article.tag} color={article.tagColor} />
        <h3 className="text-white font-black text-[20px] leading-tight mt-2 mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-[#9999b0] text-[13px] line-clamp-2 mb-2">{article.excerpt}</p>
        <Meta time={article.time} views={article.views} />
      </div>
    </Link>
  );
}

function TechCard({ article }) {
  return (
    <Link to={`/articles/${article.id}`} className="group block">
      <div className="overflow-hidden" style={{ borderTop: `2px solid ${article.tagColor}` }}>
        <img src={article.image} alt={article.title}
          className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="pt-2">
        <Tag label={article.tag} color={article.tagColor} />
        <h3 className="text-[13px] font-bold text-[#c8c8d8] leading-snug mt-1.5 line-clamp-2 group-hover:text-white transition-colors">
          {article.title}
        </h3>
        <Meta time={article.time} views={article.views} />
      </div>
    </Link>
  );
}

export default function JVTechSection() {
  const [featured, ...rest] = JVTECH_ARTICLES;

  return (
    <section className="py-8 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-[#3b82f6]" />
            <div className="w-[2px] h-[14px] rounded-full bg-[#3b82f6] opacity-40" />
          </div>
          <Cpu size={16} className="text-[#3b82f6]" strokeWidth={2.5} />
          <h2 className="text-[35px] font-black uppercase tracking-tight text-white leading-none">JVTech</h2>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded ml-1"
            style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.25)' }}>
            Tests & Guides
          </span>
        </div>
        <Link to="/hardware"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          Voir tout <ChevronRight size={12} />
        </Link>
      </div>

      {/* Mixed grid: 1 large (2 cols) + 2 smaller */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FeaturedTech article={featured} />
        {rest.slice(0, 2).map(a => <TechCard key={a.id} article={a} />)}
      </div>
    </section>
  );
}
