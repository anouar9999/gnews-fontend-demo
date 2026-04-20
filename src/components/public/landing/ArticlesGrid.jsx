import { Link } from 'react-router-dom';
import { LayoutGrid, ChevronRight } from 'lucide-react';
import { GENERAL_ARTICLES } from '../../../data/landingMockData';
import { Tag, Meta } from './shared';

function ArticleCard({ article }) {
  return (
    <Link to={`/articles/${article.id}`}
      className="group block hover:bg-white/[0.02] transition-colors rounded-sm overflow-hidden"
    >
      <div className="overflow-hidden" style={{ borderTop: `2px solid ${article.tagColor}` }}>
        <img src={article.image} alt={article.title}
          className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="pt-2.5 pb-2">
        <Tag label={article.tag} color={article.tagColor} />
        <h3 className="text-[15px] font-bold text-[#c8c8d8] leading-snug mt-2 line-clamp-2 group-hover:text-white transition-colors">
          {article.title}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          {article.author && (
            <span className="text-[11px] font-bold text-[#555566]">{article.author}</span>
          )}
          <Meta time={article.time} views={article.views} />
        </div>
      </div>
    </Link>
  );
}

export default function ArticlesGrid() {
  return (
    <section className="py-8 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-orange" />
            <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
          </div>
          <LayoutGrid size={16} className="text-orange" strokeWidth={2.5} />
          <h2 className="text-[35px] font-black uppercase tracking-tight text-white leading-none">Derniers Articles</h2>
        </div>
        <Link to="/articles"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          Voir tout <ChevronRight size={12} />
        </Link>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {GENERAL_ARTICLES.map(a => <ArticleCard key={a.id} article={a} />)}
      </div>

      {/* Load more */}
      <div className="flex justify-center mt-6">
        <Link to="/articles"
          className="px-6 py-3 text-[12px] font-black uppercase tracking-widest text-white transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(232,0,28,0.08)';
            e.currentTarget.style.borderColor = 'rgba(232,0,28,0.3)';
            e.currentTarget.style.color = '#e8001c';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = 'white';
          }}
        >
          Charger plus d'articles
        </Link>
      </div>
    </section>
  );
}
