import { Link } from "react-router-dom";
import { Star, ChevronRight, TrendingUp } from "lucide-react";
import { ANTICIPATED_GAMES } from "../../../data/landingMockData";

function HypeBar({ score }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <div
        className="flex-1 h-1 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            background: "linear-gradient(90deg, #f97316, #e8001c)",
          }}
        />
      </div>
      <span className="text-[10px] font-black text-orange">{score}%</span>
    </div>
  );
}

export default function AnticipatedGames() {
  return (
    <section className="py-12 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-orange" />
            <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
          </div>
          {/* <Star size={16} className="text-orange" strokeWidth={2.5} /> */}
          <h2 className="text-[35px] font-black uppercase tracking-tight text-white leading-none">
            Les Jeux les plus attendus
          </h2>
          {/* <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded ml-1"
            style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.25)' }}>
            2025–2026
          </span> */}
        </div>
        {/* <Link to="/gaming"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          Voir tout <ChevronRight size={12} />
        </Link> */}
      </div>

      {/* Horizontal scroll carousel */}
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        <style>{`.anticipated-scroll::-webkit-scrollbar{display:none}`}</style>
        {ANTICIPATED_GAMES.map((game, i) => (
          <Link
            key={game.id}
            to={`/games/${game.id}`}
            className="anticipated-scroll  group shrink-0 block relative"
            style={{ width: 190, scrollSnapAlign: "start" }}
          >
            {/* Cover art */}
            <div
              className="relative overflow-hidden rounded"
              style={{
                height: 260,
                // borderTop: `2px solid ${i < 3 ? "#f97316" : "#333"}`,
              }}
            >
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover  transition-transform duration-400"
              />
              {/* Rank overlay */}
              <div
                className="absolute top-2 left-2 w-7 h-7 flex items-center justify-center text-[11px] font-black text-white"
                style={{ background: i < 3 ? "#f97316" : "rgba(0,0,0,0.7)" }}
              >
                {i + 1}
              </div>
            </div>
            {/* Info */}
            <div className="pt-2 pb-1">
              <p className="text-[15px] font-semibold uppercase tracking-tight text-white leading-none leading-snug line-clamp-1">
                {game.title}
              </p>
              <p className="text-[11px] text-[#666677] mt-0.5">
                {game.release}
              </p>
              {/* <HypeBar score={game.score} /> */}
            </div>  
          </Link>
        ))}
      </div>
    </section>
  );
}
