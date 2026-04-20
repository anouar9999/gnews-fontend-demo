import { Link } from 'react-router-dom';
import { Play, Eye, ThumbsUp, Clock, ChevronRight, Tv2 } from 'lucide-react';
import { VIDEO_OF_MOMENT } from '../../../data/landingMockData';

function RelatedVideoRow({ video }) {
  return (
    <Link to="/videos"
      className="flex gap-3 group hover:bg-white/[0.03] p-2 transition-colors"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="shrink-0 relative overflow-hidden" style={{ width: 124, height: 76 }}>
        <img src={video.image} alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <Play size={16} fill="white" className="text-white" />
        </div>
        <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white px-1 py-0.5"
          style={{ background: 'rgba(0,0,0,0.75)' }}>
          {video.duration}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-bold text-[#c8c8d8] leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {video.title}
        </p>
        <span className="text-[10px] text-[#555566] flex items-center gap-1 mt-1">
          <Eye size={9} /> {video.views}
        </span>
      </div>
    </Link>
  );
}

export default function VideoOfMoment() {
  const v = VIDEO_OF_MOMENT;

  return (
    <section className="py-8 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-orange" />
            <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
          </div>
          <Tv2 size={16} className="text-orange" strokeWidth={2.5} />
          <h2 className="text-[35px] font-black uppercase tracking-tight text-white leading-none">La Vidéo du Moment</h2>
        </div>
        <Link to="/videos"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          Toutes les vidéos <ChevronRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-0">
        {/* Player / thumbnail */}
        <Link to="/videos" className="relative block overflow-hidden group"
          style={{ borderTop: '3px solid #e8001c' }}
        >
          <img src={v.image} alt={v.title}
            className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            style={{ aspectRatio: '16/9' }}
          />
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.35)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              style={{ background: 'rgba(232,0,28,0.9)', boxShadow: '0 0 0 6px rgba(232,0,28,0.25)' }}>
              <Play size={22} fill="white" className="text-white ml-1" />
            </div>
          </div>
          {/* Duration */}
          <span className="absolute bottom-3 right-3 text-[11px] font-black text-white px-2 py-1"
            style={{ background: 'rgba(0,0,0,0.75)' }}>
            {v.duration}
          </span>
        </Link>

        {/* Description + related */}
        <div className="flex flex-col" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Info panel */}
          <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-white"
                style={{ background: '#e8001c' }}>
                {v.channelAvatar}
              </div>
              <span className="text-[11px] font-bold text-[#888899]">{v.channel}</span>
            </div>
            <h3 className="text-[14px] font-black text-white leading-snug mb-2 line-clamp-2">{v.title}</h3>
            <p className="text-[11px] text-[#666677] leading-relaxed line-clamp-3 mb-3">{v.description}</p>
            <div className="flex items-center gap-3 text-[10px] text-[#555566]">
              <span className="flex items-center gap-1"><Eye size={9} />{v.views}</span>
              <span className="flex items-center gap-1"><ThumbsUp size={9} />{v.likes}</span>
              <span className="flex items-center gap-1"><Clock size={9} />{v.duration}</span>
            </div>
          </div>

          {/* Related videos */}
          <div className="p-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#555566]">À voir aussi</p>
          </div>
          {v.relatedVideos.map(rv => <RelatedVideoRow key={rv.id} video={rv} />)}
        </div>
      </div>
    </section>
  );
}
