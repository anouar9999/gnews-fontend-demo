import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";

export default function AnticipatedGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/games/", { params: { game_type: "anticipated", page_size: 10, ordering: "rank" } })
      .then(({ data }) => setGames(data.results || data))
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-12 border-b border-[#1a1a28]">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-orange" />
            <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
          </div>
          <h2 className="text-[24px] md:text-[45px] font-black uppercase tracking-tight text-white leading-none">
            Les Jeux les plus attendus
          </h2>
        </div>
        <div className="flex gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shrink-0 w-[160px]">
              <div className="aspect-[2/3] bg-[#1a1a28] animate-pulse rounded" />
              <div className="mt-2 h-4 w-3/4 bg-[#1a1a28] animate-pulse rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!games.length) return null;

  return (
    <section className="py-12 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-orange" />
            <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
          </div>
          <h2 className="text-[24px] md:text-[45px] font-black uppercase tracking-tight text-white leading-none">
            Les Jeux les plus attendus
          </h2>
        </div>
      </div>

      {/* Horizontal scroll carousel — aspect-[2/3] tall portrait cards */}
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        <style>{`.anticipated-scroll::-webkit-scrollbar{display:none}`}</style>
        {games.map((game, i) => (
          <Link
            key={game.id}
            to={`/games/${game.slug}`}
            className="anticipated-scroll group shrink-0 block "
            style={{ width: 160, scrollSnapAlign: "start" }}
          >
            {/* Cover art — aspect-[2/3] portrait */}
            <div className="relative overflow-hidden aspect-[2/3] rounded">
              <img
                src={game.cover_image || `https://picsum.photos/seed/${game.slug}/320/480`}
                alt={game.title}
                className="w-full h-full object-cover  transition-transform duration-400"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${game.slug}/320/480`; }}
              />
              {/* Bottom gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)' }} />
              {/* Rank badge */}
              <div className="absolute bottom-0 left-0.5 text-[92px] font-black text-orange leading-none" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
                {i + 1}
              </div>
            </div>
            {/* Text below image */}
            <div className="pt-2 pb-1">
              <p className="text-[16px] font-bold uppercase tracking-tight text-white leading-snug line-clamp-1">
                {game.title}
              </p>
              <p className="text-[11px] text-[#666677] mt-0.5">
                {game.release_display || 'TBA'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
