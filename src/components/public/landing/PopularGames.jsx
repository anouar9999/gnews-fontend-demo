import { Link } from "react-router-dom";
import { TrendingUp, ChevronRight, Users } from "lucide-react";
import { POPULAR_GAMES } from "../../../data/landingMockData";

function TrendArrow({ trend }) {
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
  return (
    <section className="py-12 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-[#10b981]" />
            <div className="w-[2px] h-[14px] rounded-full bg-[#10b981] opacity-40" />
          </div>
          {/* <TrendingUp size={16} className="text-[#10b981]" strokeWidth={2.5} /> */}
          <h2 className="text-[35px] font-black uppercase tracking-tight text-white leading-none">
            Jeux les plus populaires
          </h2>
        </div>
        <Link
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
        </Link>
      </div>

      {/* Horizontal scroll */}
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        <style>{`.popular-scroll::-webkit-scrollbar{display:none}`}</style>
        {POPULAR_GAMES.map((game, i) => (
          <Link
            key={game.id}
            to={`/games/${game.id}`}
            className="popular-scroll group shrink-0 block"
            style={{ width: 185, scrollSnapAlign: "start" }}
          >
            {/* Cover */}
            <div
              className="relative overflow-hidden"
              style={{
                height: 248,
              }}
            >
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover  transition-transform duration-400"
              />
              {/* Rank */}
              <div
                className="font-machina absolute top-2 left-2 w-7 h-7 flex items-center justify-center text-[12px] font-black text-white"
                style={{ background: i < 3 ? "#10b981" : "rgba(0,0,0,0.7)" }}
              >
                {i + 1}
              </div>
              {/* Gradient bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 p-2.5"
                style={{
                  background:
                    "linear-gradient(to top, rgba(5,5,15,0.9), transparent)",
                }}
              >
                <TrendArrow trend={game.trend} />
              </div>
            </div>
            {/* Info */}
            <div className="pt-2">
              <p className="text-[15px] font-bold uppercase tracking-tight text-white leading-none line-clamp-1">
                {game.title}
              </p>
              <div className="flex items-center gap-1 mt-0.5 text-[11px] text-[#555566]">
                <Users size={10} /> {game.players}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
