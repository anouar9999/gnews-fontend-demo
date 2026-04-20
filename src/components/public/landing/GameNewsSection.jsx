import { Link } from "react-router-dom";
import { Gamepad2, ChevronRight, Eye, Clock } from "lucide-react";
import { GAME_NEWS } from "../../../data/landingMockData";
import { Tag, Meta } from "./shared";

export default function GameNewsSection() {
  const [featured, ...rest] = GAME_NEWS;

  return (
    <section className="py-12 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[32px] rounded-full bg-orange" />
            <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
          </div>
          {/* <Gamepad2 size={16} className="text-orange" strokeWidth={2.5} /> */}
          <h2 className="text-[35px] font-black uppercase tracking-tighter text-white leading-none">
            Dernières News Jeux
          </h2>
        </div>
        {/* <Link
          to="/gaming"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
          }
        >
          Voir tout <ChevronRight size={12} />
        </Link> */}
      </div>

      {/* Featured banner */}
      <Link
        to={`/articles/${featured.id}`}
        className="relative block overflow-hidden group mb-4 rounded"
        // style={{ borderTop: '3px solid #e8001c' }}
      >
        <img
          src={featured.image}
          alt={featured.title}
          className="w-full object-cover  transition-transform duration-500"
          style={{ height: 320 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(5,5,15,0.95) 0%, rgba(5,5,15,0.5) 50%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 flex flex-col justify-end p-6"
          style={{ maxWidth: 600 }}
        >
          <Tag label={featured.tag} color={featured.tagColor} />
          <h3 className="text-white font-black text-[28px] leading-tighter mt-2 mb-2 line-clamp-2">
            {featured.title}
          </h3>
          {/* <p className="text-[#9999b0] text-[14px] line-clamp-2 mb-3">
            {featured.excerpt}
          </p> */}
          <Meta time={featured.time} views={featured.views} />
        </div>
      </Link>

      {/* 4-column 2-row grid */}
      <div>
        <div className="grid grid-cols-4 gap-3">
          {rest.map((a) => (
            <Link
              key={a.id}
              to={`/articles/${a.id}`}
              className="group block"
            >
              <div className="overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full object-cover transition-transform duration-300"
                  style={{ height: 140 }}
                />
              </div>
              <div className="pt-2">
                <Tag label={a.tag} color={a.tagColor} />
                <p className="text-[15px] font-bold text-[#c8c8d8] leading-snug mt-1 line-clamp-2 group-hover:text-white transition-colors">
                  {a.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-[#555566]">
                  <span className="flex items-center gap-1">
                    <Clock size={9} />
                    {a.time}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
