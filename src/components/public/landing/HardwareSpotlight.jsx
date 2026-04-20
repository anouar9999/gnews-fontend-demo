import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import { Tag, Meta, SectionHeader } from './shared';
import { HARDWARE_ARTICLES } from '../../../data/landingMockData';

export default function HardwareSpotlight() {
  const [large, ...rest] = HARDWARE_ARTICLES;

  return (
    <section className="py-8 border-b border-[#1a1a28]">
      <SectionHeader title="Hardware & Tech" icon={Cpu} href="/hardware" color="#3b82f6" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

        {/* Large overlay card */}
        <Link
          to={`/articles/${large.id}`}
          className="relative block overflow-hidden group bg-[#0d0d18]"
          style={{ borderTop: '3px solid #3b82f6' }}
        >
          <img
            src={large.image}
            alt={large.title}
            className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d18] via-[#0d0d18]/40 to-transparent" />

          {large.score && (
            <div className="absolute top-4 right-4 bg-[#3b82f6] text-white font-black text-[18px] w-12 h-12 flex items-center justify-center">
              {large.score}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <Tag label={large.tag} color={large.tagColor} />
            <h3 className="text-white font-black text-[22px] leading-tight mt-2 mb-1 line-clamp-2">
              {large.title}
            </h3>
            <p className="text-[#9999aa] text-[14px] line-clamp-2 mb-2">{large.excerpt}</p>
            <Meta time={large.time} views={large.views} />
          </div>
        </Link>

        {/* Stacked smaller cards */}
        <div className="flex flex-col gap-px bg-[#1a1a28]">
          {rest.map(a => (
            <Link
              key={a.id}
              to={`/articles/${a.id}`}
              className="flex gap-3 p-3 bg-[#0d0d18] hover:bg-[#12121e] group transition-colors"
            >
              <div className="shrink-0 w-[110px] h-[70px] overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="min-w-0">
                <Tag label={a.tag} color={a.tagColor} />
                <p className="text-[14px] font-semibold text-[#ccccdd] leading-snug mt-1 line-clamp-2 group-hover:text-white transition-colors">
                  {a.title}
                </p>
                <Meta time={a.time} views={a.views} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
