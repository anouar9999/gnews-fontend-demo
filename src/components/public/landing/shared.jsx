import { Clock, Eye, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Inline font styles ───────────────────────────────────────────────────── */
export function FontImport() {
  return (
    <style>{`
      .ticker-inner { display: flex; gap: 48px; animation: ticker 28s linear infinite; white-space: nowrap; }
      @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      .hover-img img { transition: transform 0.35s ease; }
      .hover-img:hover img { transform: scale(1.04); }
    `}</style>
  );
}

/* ── Category tag pill ────────────────────────────────────────────────────── */
export function Tag({ label, color }) {
  return (
    <span
      className="text-[10px] font-bold uppercase  inline-block"
      style={{ color: color || '#e8001c' }}
    >
      {label}
    </span>
  );
}

/* ── Time + views meta row ────────────────────────────────────────────────── */
export function Meta({ time, views }) {
  return (
    <div className="flex items-center gap-3 text-[13px] text-[#666677]">
      {time  && <span className="flex items-center gap-1"><Clock size={11} />{time}</span>}
      {views && <span className="flex items-center gap-1"><Eye   size={11} />{views}</span>}
    </div>
  );
}

/* ── Section header with accent bar ──────────────────────────────────────── */
export function SectionHeader({ title, icon: Icon, href, color = '#e8001c' }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className="flex gap-[3px] items-center">
          <div className="w-[4px] h-[26px] rounded-full" style={{ background: color }} />
          <div className="w-[2px] h-[16px] rounded-full" style={{ background: color, opacity: 0.4 }} />
        </div>
        {Icon && <Icon size={18} style={{ color }} />}
        <h2 className="text-[24px] md:text-[35px] font-black uppercase tracking-tight text-white leading-none">{title}</h2>
      </div>
      {href && (
        <Link
          to={href}
          className="text-[11px] font-bold text-[#555566] hover:text-white flex items-center gap-1 transition-colors"
        >
          SEE ALL <ChevronRight size={11} />
        </Link>
      )}
    </div>
  );
}

/* ── Vertical article card (image top, meta bottom) ──────────────────────── */
export function ArticleCardV({ article, accentColor }) {
  return (
    <Link to={`/articles/${article.slug}`} className="block group hover-img">
      <div
        className="overflow-hidden bg-[#0d0d18]"
        style={{ borderTop: `2px solid ${accentColor || article.tagColor || '#e8001c'}` }}
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full aspect-[16/10] object-cover"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/800/500`; }}
        />
      </div>
      <div className="pt-3 pb-1">
        <Tag label={article.tag} color={article.tagColor} />
        <h3 className="text-[15px] font-bold text-[#ccccdd] leading-snug mt-2 line-clamp-2 group-hover:text-white transition-colors">
          {article.title}
        </h3>
        <div className="mt-2 flex items-center gap-3">
          {article.author && (
            <span className="text-[11px] font-bold text-[#666677]">{article.author}</span>
          )}
          <Meta time={article.time} views={article.views} />
        </div>
      </div>
    </Link>
  );
}
