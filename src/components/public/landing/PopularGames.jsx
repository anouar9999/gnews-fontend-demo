import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ChevronRight, Users } from "lucide-react";
import api from "../../../api/axios";

function TrendArrow({ trend }) {
  if (!trend) return null;
  const isUp = trend.startsWith("+");
  return (
    <span
      className="text-[10px] font-black flex items-center gap-0.5"
      style={{ color: isUp ? "#10b981" : "#ef4444" }}
    >
      {isUp ? "▲" : "▼"} {trend}
    </span>
  );
}

export default function PopularGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/games/", { params: { game_type: "popular", page_size: 10, ordering: "rank" } })
      .then(({ data }) => setGames(data.results || data))
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-12 border-b border-[#1a1a28]">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-[#10b981]" />
            <div className="w-[2px] h-[14px] rounded-full bg-[#10b981] opacity-40" />
          </div>
          <h2 className="text-[24px] md:text-[35px] font-black uppercase tracking-tight text-white leading-none">
            Jeux les plus populaires
          </h2>
        </div>
        <div className="flex gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shrink-0 w-[160px]">
              <div className="aspect-[2/3] bg-[#1a1a28] animate-pulse" />
              <div className="mt-2 h-4 w-3/4 bg-[#1a1a28] animate-pulse rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!games.length) return null;

  return (
    <section className="py-12 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-[#10b981]" />
            <div className="w-[2px] h-[14px] rounded-full bg-[#10b981] opacity-40" />
          </div>
          <h2 className="text-[24px] md:text-[45px] font-black uppercase tracking-tight text-white leading-none">
            Jeux les plus populaires
          </h2>
        </div>
        <Link
          to="/gaming"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
        >
          Voir tout <ChevronRight size={12} />
        </Link>
      </div>

      {/* Horizontal scroll — aspect-[2/3] tall portrait cards */}
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        <style>{`.popular-scroll::-webkit-scrollbar{display:none}`}</style>
        {games.map((game, i) => (
          <Link
            key={game.id}
            to={`/games/${game.slug}`}
            className="popular-scroll group shrink-0 block"
            style={{ width: 160, scrollSnapAlign: "start" }}
          >
            {/* Cover — aspect-[2/3] portrait */}
            <div className="relative overflow-hidden aspect-[2/3] rounded">
              <img
                src={game.cover_image || `https://picsum.photos/seed/${game.slug}/320/480`}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${game.slug}/320/480`; }}
              />
              {/* Rank */}
              <div
                className="absolute top-1 left-0.5 w-7 h-7 flex items-center justify-center text-[92px] font-black text-orange "
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
                // style={{ background: i < 3 ? "#10b981" : "rgba(0,0,0,0.7)" }}
              >
                {i + 1}
              </div>
            </div>
            {/* Info below */}
            <div className="pt-2">
              <p className="text-[16px] font-bold uppercase tracking-tight text-white leading-none line-clamp-1">
                {game.title}
              </p>
              {game.players && (
                <div className="flex items-center gap-1 mt-0.5 text-[11px] text-[#555566]">
                  <Users size={10} /> {game.players}
                </div>
              )}
              <TrendArrow trend={game.trend} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
