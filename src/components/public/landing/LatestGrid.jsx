import { Link } from "react-router-dom";
import { Zap, ChevronRight } from "lucide-react";
import { Tag, Meta } from "./shared";
import { LATEST_ARTICLES } from "../../../data/landingMockData";

function LatestCard({ article, featured }) {
  if (featured) {
    return (
      <Link
        to={`/articles/${article.id}`}
        className="relative block overflow-hidden rounded group col-span-2 row-span-2"
        // style={{ borderTop: '3px solid #e8001c' }}
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover rounded group-hover:scale-[1.03] transition-transform duration-500"
          style={{ minHeight: 280 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,8,18,0.96) 0%, rgba(8,8,18,0.5) 50%, transparent 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <Tag label={article.tag} color={article.tagColor} />
          <h3 className="text-white font-black text-[24px] leading-tight mt-2 mb-2 line-clamp-3">
            {article.title}
          </h3>
          <Meta time={article.time} />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/articles/${article.id}`}
      className="flex gap-3 group hover:bg-white/[0.02] rounded  p-2 transition-colors duration-150"
    >
      <div
        className="shrink-0 overflow-hidden"
        style={{
          width: 88,
          height: 56,
          // borderTop: `2px solid ${article.tagColor}`,
        }}
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="min-w-0 flex flex-col justify-center gap-1">
        <Tag label={article.tag} color={article.tagColor} />
        <p className="text-[12px] font-bold text-[#c0c0d0] leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {article.title}
        </p>
        <Meta time={article.time} />
      </div>
    </Link>
  );
}

export default function LatestGrid() {
  const [first, ...rest] = LATEST_ARTICLES;

  return (
    <section className="py-12 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[32px] rounded-full bg-orange" />
            <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
          </div>
          {/* <Zap size={16} className="text-orange" strokeWidth={2.5} /> */}
          <h2 className="text-[30px] font-black uppercase tracking-tight text-white leading-none">
            Dernières News
          </h2>
          {/* live pulse dot */}
          {/* <span className="flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
            style={{ background: 'rgba(232,0,28,0.12)', color: '#e8001c', border: '1px solid rgba(232,0,28,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse inline-block" />
            Live
          </span> */}
        </div>
        {/* <Link
          to="/news"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-colors duration-150"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
          }
        >
          Tout voir <ChevronRight size={12} />
        </Link> */}
      </div>

      {/* Grid: featured left (2 cols, 2 rows) + 4 small cards right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_440px] gap-px bg-[#1a1a28]">
        {/* Featured card */}
        <div className="bg-[#0d0d18] lg:col-span-2">
          <LatestCard article={first} featured />
        </div>

        {/* Right column: 4 stacked */}
        <div className="flex flex-col divide-y divide-[#1a1a28] bg-[#0d0d18]">
          {rest.slice(0, 4).map((a) => (
            <div key={a.id} className="p-1">
              <LatestCard article={a} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
