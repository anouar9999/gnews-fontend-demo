import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
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
          <h2 className="text-[24px] md:text-[35px] font-black uppercase tracking-tight text-white leading-none">
            Les Jeux les plus attendus
          </h2>
        </div>
        <div className="flex gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shrink-0 w-[190px]">
              <div className="h-[260px] bg-[#1a1a28] animate-pulse rounded" />
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
            <div className="w-[4px] h-[22px] rounded-full bg-orange" />
            <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
          </div>
          <h2 className="text-[24px] md:text-[35px] font-black uppercase tracking-tight text-white leading-none">
            Les Jeux les plus attendus
          </h2>
        </div>
      </div>

      {/* Horizontal scroll carousel */}
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        <style>{`.anticipated-scroll::-webkit-scrollbar{display:none}`}</style>
        {games.map((game, i) => (
          <Link
            key={game.id}
            to={`/games/${game.slug}`}
            className="anticipated-scroll group shrink-0 block relative"
            style={{ width: 190, scrollSnapAlign: "start" }}
          >
            {/* Cover art */}
            <div
              className="relative overflow-hidden rounded"
              style={{ height: 260 }}
            >
              <img
                src={game.image_url || `https://picsum.photos/seed/${game.slug}/400/533`}
                alt={game.title}
                className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${game.slug}/400/533`; }}
              />
              {/* Rank overlay */}
              <div
                className="absolute top-2 left-2 w-7 h-7 flex items-center justify-center text-[11px] font-black text-white"
                style={{ background: i < 3 ? "#f97316" : "rgba(0,0,0,0.7)" }}
              >
                {game.rank || i + 1}
              </div>
            </div>
            {/* Info */}
            <div className="pt-2 pb-1">
              <p className="text-[15px] font-semibold uppercase tracking-tight text-white leading-snug line-clamp-1">
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
