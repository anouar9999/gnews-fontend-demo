import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';

export default function NewsCard({ article, size = 'md', showExcerpt = false, rank }) {
  const { title, category, tag, image, time, views, slug, excerpt } = article;

  if (size === 'hero') {
    return (
      <Link
        to={`/article/${slug}`}
        className="group relative block w-full rounded-[10px] overflow-hidden border border-[#2a2a2a] hover:border-orange transition-colors"
        style={{ height: 'clamp(260px, 45vw, 480px)' }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 sm:p-6">
          <span className="gnewz-tag mb-2 sm:mb-3 inline-block">{tag || category}</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-900 text-white leading-tight mb-2 sm:mb-3 group-hover:text-orange transition-colors line-clamp-3">
            {title}
          </h2>
          {excerpt && (
            <p className="hidden sm:block text-gray-300 text-sm line-clamp-2 mb-4">{excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <span className="flex items-center gap-1"><Clock size={12} />{time}</span>
            <span className="flex items-center gap-1"><Eye size={12} />{views}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (size === 'lg') {
    return (
      <Link
        to={`/article/${slug}`}
        className="gnewz-card group block overflow-hidden"
      >
        <div className="relative overflow-hidden" style={{ height: 200 }}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <span className="gnewz-tag absolute bottom-3 left-3">{tag || category}</span>
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-800 text-sm sm:text-base text-white leading-snug mb-2 group-hover:text-orange transition-colors line-clamp-2">
            {title}
          </h3>
          {showExcerpt && excerpt && (
            <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-3">{excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <span className="flex items-center gap-1"><Clock size={11} />{time}</span>
            <span className="flex items-center gap-1"><Eye size={11} />{views}</span>
          </div>
        </div>
      </Link>
    );
  }

  // size = 'strip' — compact card for horizontal scrolling strip
  if (size === 'strip') {
    return (
      <Link
        to={`/article/${slug}`}
        className="gnewz-card group block overflow-hidden flex-shrink-0"
        style={{ width: 200 }}
      >
        <div className="relative overflow-hidden" style={{ height: 118 }}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="gnewz-tag absolute bottom-2 left-2">{tag || category}</span>
        </div>
        <div className="p-2.5">
          <h4 className="font-700 text-[12px] text-white leading-snug mb-1.5 group-hover:text-orange transition-colors line-clamp-2">
            {title}
          </h4>
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <Clock size={9} />{time}
          </span>
        </div>
      </Link>
    );
  }

  // size = 'sm' — horizontal compact card (sidebar/trending list)
  return (
    <Link
      to={`/article/${slug}`}
      className="group flex gap-3 py-3 overflow-hidden"
      style={{ borderBottom: '1px solid #1a1a1a' }}
    >
      {rank && (
        <div
          className="flex-shrink-0 w-5 text-[18px] font-black leading-none pt-0.5 tabular-nums"
          style={{ color: rank === 1 ? '#FF6B00' : 'rgba(255,255,255,0.18)' }}
        >
          {rank}
        </div>
      )}
      <div className="relative shrink-0 rounded-lg overflow-hidden" style={{ width: 72, height: 56 }}>
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-700 text-orange uppercase tracking-wider">{tag || category}</span>
        <h4 className="font-700 text-[12px] text-white leading-snug mt-0.5 group-hover:text-orange transition-colors line-clamp-2">
          {title}
        </h4>
        <div className="flex items-center gap-2 text-gray-500 text-[10px] mt-1">
          <span className="flex items-center gap-0.5"><Clock size={9} />{time}</span>
        </div>
      </div>
    </Link>
  );
}
