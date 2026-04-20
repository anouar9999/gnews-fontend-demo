import { Link } from 'react-router-dom';
import { Play, Eye } from 'lucide-react';
import { SectionHeader } from './shared';
import { VIDEOS } from '../../../data/landingMockData';

export default function VideoSection() {
  return (
    <section className="py-8 border-b border-[#1a1a28]">
      <SectionHeader title="Vidéos" icon={Play} href="/videos" color="#e8001c" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {VIDEOS.map(v => (
          <Link key={v.id} to="/videos" className="group block">
            <div className="relative overflow-hidden bg-[#0d0d18]" style={{ borderTop: '2px solid #e8001c' }}>
              <img
                src={v.image}
                alt={v.title}
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-lg">
                  <Play size={18} fill="white" className="text-white ml-1" />
                </div>
              </div>
              {/* Duration badge */}
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5">
                {v.duration}
              </span>
            </div>
            <div className="pt-2">
              <p className="text-[13px] font-semibold text-[#ccccdd] line-clamp-2 leading-snug group-hover:text-white transition-colors">
                {v.title}
              </p>
              <span className="text-[12px] text-[#555566] flex items-center gap-1 mt-1">
                <Eye size={9} /> {v.views} vues
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
