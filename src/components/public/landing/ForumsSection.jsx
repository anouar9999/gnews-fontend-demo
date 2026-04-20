import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ChevronRight, Flame, Eye, Users } from 'lucide-react';
import { FORUMS } from '../../../data/landingMockData';

const CAT_COLORS = {
  Gaming: '#e8001c',
  Hardware: '#3b82f6',
  Esports: '#f59e0b',
  Culture: '#a855f7',
  Aide: '#10b981',
};

function ThreadRow({ thread }) {
  const color = CAT_COLORS[thread.category] || '#666';
  return (
    <Link to="/forums"
      className="flex items-center gap-4 group hover:bg-white/[0.03] px-4 py-3 transition-colors"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      {/* Avatar */}
      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black text-white"
        style={{ background: color }}>
        {thread.avatar}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          {thread.hot && (
            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 flex items-center gap-0.5"
              style={{ background: 'rgba(232,0,28,0.15)', color: '#e8001c', border: '1px solid rgba(232,0,28,0.2)' }}>
              <Flame size={8} /> HOT
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
            {thread.category}
          </span>
        </div>
        <p className="text-[14px] font-bold text-[#c8c8d8] leading-snug line-clamp-1 group-hover:text-white transition-colors">
          {thread.title}
        </p>
        <div className="flex items-center gap-3 mt-0.5 text-[10px] text-[#555566]">
          <span className="font-bold text-[#666677]">{thread.author}</span>
          <span>{thread.time}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="shrink-0 flex items-center gap-4 text-[11px] text-[#555566]">
        <span className="flex items-center gap-1.5 flex-col items-center">
          <MessageSquare size={12} />
          <span className="font-bold text-[#888899]">{thread.replies}</span>
        </span>
        <span className="flex items-center gap-1.5 flex-col items-center hidden lg:flex">
          <Eye size={12} />
          <span className="font-bold text-[#888899]">{thread.views}</span>
        </span>
      </div>
    </Link>
  );
}

export default function ForumsSection() {
  const [activeTab, setActiveTab] = useState('Gaming');
  const filtered = FORUMS.threads.filter(t => t.category === activeTab);
  const display = filtered.length ? filtered : FORUMS.threads.slice(0, 4);

  return (
    <section className="py-8 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-orange" />
            <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
          </div>
          <Users size={16} className="text-orange" strokeWidth={2.5} />
          <h2 className="text-[35px] font-black uppercase tracking-tight text-white leading-none">Forums</h2>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded ml-1"
            style={{ background: 'rgba(232,0,28,0.12)', color: '#e8001c', border: '1px solid rgba(232,0,28,0.25)' }}>
            Communauté
          </span>
        </div>
        <Link to="/forums"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          Voir les forums <ChevronRight size={12} />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {FORUMS.tabs.map(tab => {
          const isActive = tab === activeTab;
          const color = CAT_COLORS[tab] || '#666';
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="shrink-0 px-4 py-3 text-[13px] font-bold uppercase tracking-wider transition-all duration-150 relative"
              style={{
                color: isActive ? color : 'rgba(255,255,255,0.35)',
                borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Thread list */}
      <div style={{ background: 'linear-gradient(160deg, #0f0f17, #0d0d18)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4 }}>
        {/* Column headers */}
        <div className="grid px-4 py-2 text-[10px] font-black uppercase tracking-widest"
          style={{ gridTemplateColumns: '1fr auto', color: 'rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span>Discussion</span>
          <span className="flex items-center gap-8">
            <span>Réponses</span>
            <span className="hidden lg:block">Vues</span>
          </span>
        </div>
        {display.map(t => <ThreadRow key={t.id} thread={t} />)}
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between mt-4">
        <Link to="/forums/new"
          className="px-5 py-2.5 text-[12px] font-black uppercase tracking-wider text-white transition-all"
          style={{ background: '#e8001c' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#c8001a')}
          onMouseLeave={e => (e.currentTarget.style.background = '#e8001c')}
        >
          + Créer un sujet
        </Link>
        <Link to="/forums"
          className="flex items-center gap-1 text-[12px] font-bold text-[#555566] hover:text-white transition-colors">
          Voir tous les sujets <ChevronRight size={12} />
        </Link>
      </div>
    </section>
  );
}
