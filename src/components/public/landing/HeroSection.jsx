import { Link } from 'react-router-dom';
import { ChevronRight, Flame } from 'lucide-react';
import { Tag, Meta } from './shared';
import { HERO, SIDE_ARTICLES } from '../../../data/landingMockData';

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-1 pt-8 pb-12 border-b border-[#1a1a28]">

      {/* ── Large featured article ── */}
      <Link to={`/articles/${HERO.id}`} className="relative block overflow-hidden group bg-[#0d0d18]">
        <img
          src={HERO.image}
          alt={HERO.title}
          className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d18] via-[#0d0d18]/60 to-transparent" />

        {/* Score badge */}
        <div className="absolute top-4 right-4 bg-orange text-white font-black text-[22px] w-14 h-14 flex items-center justify-center shadow-lg">
          {HERO.score}
        </div>

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <Tag label={HERO.tag} color={HERO.tagColor} />
          <h1 className="text-white font-black text-[26px] leading-tight mt-2 mb-2 line-clamp-3">
            {HERO.title}
          </h1>
          <p className="text-[#aaaabc] text-[15px] leading-relaxed line-clamp-2 mb-3">
            {HERO.excerpt}
          </p>
          <div className="flex items-center gap-4 text-[13px] text-[#666677]">
            <span className="text-orange font-bold">{HERO.author}</span>
            <Meta time={HERO.time} views={HERO.views} />
          </div>
        </div>
      </Link>

      {/* ── Side articles stack ── */}
      <div className="flex flex-col divide-y divide-[#1a1a28] bg-[#0d0d18]">
        {/* Header row */}
      

        {SIDE_ARTICLES.map(a => (
          <Link
            key={a.id}
            to={`/articles/${a.id}`}
            className="flex items-start gap-3 p-3 hover:bg-[#12121e] transition-colors group"
          >
            <div className="shrink-0 w-[100px] h-[65px] overflow-hidden">
              <img
                src={a.image}
                alt={a.title}
                className="w-full h-full object-cover  transition-transform duration-300"
              />
            </div>
            <div className="min-w-0 flex-1">
              <Tag label={a.tag} color={a.tagColor} />
              <p className="text-[14px] text-[#ccccdd] font-semibold leading-snug mt-1 line-clamp-2 group-hover:text-white transition-colors">
                {a.title}
              </p>
              <Meta time={a.time} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
