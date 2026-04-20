import { Link } from 'react-router-dom';
import { Mic2, ChevronRight, Play, Clock } from 'lucide-react';
import { SHOWS } from '../../../data/landingMockData';

function EpisodeCard({ show }) {
  return (
    <Link to="/shows"
      className="flex gap-3 group hover:bg-white/[0.03] p-3 transition-colors"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="shrink-0 relative overflow-hidden" style={{ width: 134, height: 86, borderTop: '2px solid #8b5cf6' }}>
        <img src={show.image} alt={show.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(139,92,246,0.5)' }}>
          <Play size={16} fill="white" className="text-white" />
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#8b5cf6' }}>
            {show.title}
          </span>
          <span className="text-[10px] text-[#555566]">{show.episode}</span>
        </div>
        <p className="text-[12px] font-bold text-[#c8c8d8] leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {show.description}
        </p>
        <div className="flex items-center gap-3 mt-1 text-[10px] text-[#555566]">
          <span className="flex items-center gap-1"><Clock size={9} />{show.duration}</span>
          <span>{show.date}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ShowsSection() {
  const [featured, ...rest] = SHOWS;

  return (
    <section className="py-8 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-[#8b5cf6]" />
            <div className="w-[2px] h-[14px] rounded-full bg-[#8b5cf6] opacity-40" />
          </div>
          <Mic2 size={16} className="text-[#8b5cf6]" strokeWidth={2.5} />
          <h2 className="text-[35px] font-black uppercase tracking-tight text-white leading-none">Nos Émissions</h2>
        </div>
        <Link to="/shows"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          Toutes les émissions <ChevronRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0">
        {/* Featured show */}
        <Link to="/shows"
          className="relative block overflow-hidden group"
          style={{ borderTop: '3px solid #8b5cf6' }}
        >
          <img src={featured.image} alt={featured.title}
            className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            style={{ minHeight: 260 }}
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.5) 50%, transparent 100%)' }}
          />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.85)', boxShadow: '0 0 0 6px rgba(139,92,246,0.2)' }}>
              <Play size={20} fill="white" className="text-white ml-1" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-widest px-2 py-0.5"
                style={{ background: '#8b5cf6', color: '#fff' }}>
                {featured.title}
              </span>
              <span className="text-[10px] text-[#888899]">{featured.episode}</span>
            </div>
            <p className="text-white font-bold text-[16px] leading-snug mb-2 line-clamp-2">{featured.description}</p>
            <div className="flex items-center gap-3 text-[11px] text-[#666677]">
              <span className="flex items-center gap-1"><Clock size={9} />{featured.duration}</span>
              <span>{featured.date}</span>
              {featured.host && <span className="text-[#888899]">avec {featured.host}</span>}
            </div>
          </div>
        </Link>

        {/* Episode list */}
        <div className="flex flex-col" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          {rest.map(s => <EpisodeCard key={s.id} show={s} />)}
          <Link to="/shows"
            className="flex items-center justify-center gap-2 p-4 text-[11px] font-black uppercase tracking-widest mt-auto transition-colors"
            style={{ color: '#8b5cf6', borderTop: '1px solid rgba(255,255,255,0.05)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Toutes les émissions <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
