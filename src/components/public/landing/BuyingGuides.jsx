import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, ArrowRight } from 'lucide-react';
import { BUYING_GUIDES } from '../../../data/landingMockData';
import { Tag } from './shared';

function GuideRow({ guide }) {
  return (
    <Link to={`/guides/${guide.id}`}
      className="flex gap-3 group p-3 hover:bg-white/[0.03] transition-colors"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="shrink-0 w-[100px] h-[68px] overflow-hidden"
        style={{ borderTop: `2px solid ${guide.tagColor}` }}>
        <img src={guide.image} alt={guide.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5"
            style={{ background: `rgba(${guide.tagColor.replace(/[^\d,]/g, '')},0.12)`, color: guide.tagColor }}>
            {guide.subtitle}
          </span>
        </div>
        <p className="text-[12px] font-bold text-[#c8c8d8] leading-snug mt-0.5 line-clamp-2 group-hover:text-white transition-colors">
          {guide.title}
        </p>
      </div>
      <ArrowRight size={14} className="shrink-0 text-[#333] group-hover:text-[#f59e0b] transition-colors" />
    </Link>
  );
}

export default function BuyingGuides() {
  const [featured, ...rest] = BUYING_GUIDES;

  return (
    <section className="py-8 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-[#f59e0b]" />
            <div className="w-[2px] h-[14px] rounded-full bg-[#f59e0b] opacity-40" />
          </div>
          <BookOpen size={16} className="text-[#f59e0b]" strokeWidth={2.5} />
          <h2 className="text-[35px] font-black uppercase tracking-tight text-white leading-none">Guides Achat</h2>
        </div>
        <Link to="/guides"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          Voir tout <ChevronRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0">
        {/* Featured guide */}
        <Link to={`/guides/${featured.id}`}
          className="relative block overflow-hidden group"
          style={{ borderTop: '3px solid #f59e0b' }}
        >
          <img src={featured.image} alt={featured.title}
            className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            style={{ minHeight: 280 }}
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.5) 50%, transparent 100%)' }}
          />
          {/* Guide badge */}
          <div className="absolute top-4 left-4">
            <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1.5 text-white"
              style={{ background: '#f59e0b' }}>
              GUIDE ACHAT
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <Tag label={featured.subtitle} color={featured.tagColor} />
            <h3 className="text-white font-black text-[20px] leading-tight mt-2 mb-2 line-clamp-2">{featured.title}</h3>
            <p className="text-[#9999b0] text-[13px] line-clamp-2">{featured.excerpt}</p>
          </div>
        </Link>

        {/* Guide list */}
        <div className="flex flex-col" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          {rest.map(g => <GuideRow key={g.id} guide={g} />)}
          <Link to="/guides"
            className="flex items-center justify-center gap-2 p-4 text-[11px] font-black uppercase tracking-widest mt-auto transition-colors"
            style={{ color: '#f59e0b', borderTop: '1px solid rgba(255,255,255,0.05)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Tous les guides achat <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
