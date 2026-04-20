import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Eye } from 'lucide-react';
import { HARDWARE_ARTICLES } from '../../../data/landingMockData';

const COLOR     = '#3b82f6';
const COLOR_RGB = '59,130,246';

function ArticleCard({ article }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group flex flex-col overflow-hidden relative"
      style={{
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(4,8,22,0.5)',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `rgba(${COLOR_RGB},0.25)`;
        e.currentTarget.style.background  = `rgba(${COLOR_RGB},0.04)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.background  = 'rgba(4,8,22,0.5)';
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ height: 2, background: `linear-gradient(90deg, ${COLOR}, rgba(${COLOR_RGB},0.2))` }}
      />

      {/* Image */}
      <div className="relative overflow-hidden shrink-0" style={{ height: 150 }}>
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
        />
        {article.score && (
          <div
            className="absolute bottom-2 right-2 flex flex-col items-center justify-center"
            style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
              border: '1.5px solid rgba(96,165,250,0.5)',
              boxShadow: '0 0 12px rgba(59,130,246,0.4)',
              borderRadius: 3,
            }}
          >
            <span className="text-white font-black leading-none" style={{ fontSize: 11 }}>{article.score}</span>
            <span className="font-bold uppercase tracking-widest" style={{ fontSize: 6, color: 'rgba(255,255,255,0.4)' }}>note</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <span
          className="inline-block self-start text-[10px] font-black uppercase tracking-widest px-2 py-[3px]"
          style={{
            background: 'rgba(0,0,0,0.6)',
            color: article.tagColor || COLOR,
            border: `1px solid ${article.tagColor || COLOR}`,
            borderRadius: 2,
          }}
        >
          {article.tag}
        </span>

        <p
          className="text-[13px] font-bold leading-snug line-clamp-3 group-hover:text-white transition-colors duration-150 flex-1"
          style={{ color: '#9aa5be' }}
        >
          {article.title}
        </p>

        <div className="flex items-center gap-3 text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {article.time   && <span className="flex items-center gap-1"><Clock size={10} />{article.time}</span>}
          {article.views  && <span className="flex items-center gap-1"><Eye  size={10} />{article.views}</span>}
          {article.author && <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>{article.author}</span>}
        </div>
      </div>
    </Link>
  );
}

export default function HardwareSection() {
  return (
    <section className="py-12 border-b border-[#1a1a28]">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[28px] rounded-full" style={{ background: COLOR }} />
            <div className="w-[2px] h-[16px] rounded-full" style={{ background: COLOR, opacity: 0.35 }} />
          </div>
          <h2 className="text-[35px] font-black uppercase tracking-tight text-white leading-none">
            Hardware <span style={{ color: COLOR }}>&</span> Tech
          </h2>
        </div>
        <Link
          to="/hardware"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-colors duration-150"
          style={{ color: 'rgba(255,255,255,0.28)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
        >
          Voir tout <ChevronRight size={12} />
        </Link>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-4 gap-3">
        {HARDWARE_ARTICLES.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

    </section>
  );
}
