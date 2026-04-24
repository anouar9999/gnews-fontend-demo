import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Users, Calendar, TrendingUp, ArrowLeft, Gamepad2 } from 'lucide-react';
import api from '../../api/axios';

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const CATEGORY_COLORS = {
  gaming: '#e8001c',
  hardware: '#3b82f6',
  culture: '#a855f7',
  esports: '#f59e0b',
};
function catColor(slug) {
  return CATEGORY_COLORS[slug] || '#10b981';
}

/* ─── Loading ─────────────────────────────────────────────────────────────── */
function LoadingState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#10b981', borderTopColor: 'transparent' }}
        />
        <p className="text-[#555566] text-[13px] font-semibold uppercase tracking-widest">Loading game…</p>
      </div>
    </div>
  );
}

/* ─── Error ───────────────────────────────────────────────────────────────── */
function ErrorState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-6">
        <p className="font-black text-[28px] uppercase mb-3" style={{ color: '#e8001c' }}>
          Game not found
        </p>
        <p className="text-[#555566] text-[14px] mb-8 max-w-sm mx-auto leading-relaxed">
          This game page may have been moved or does not exist.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 text-white font-black text-[12px] uppercase tracking-widest hover:opacity-90 transition-opacity"
          style={{ background: '#10b981' }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

/* ─── Related Game Card ───────────────────────────────────────────────────── */
function RelatedCard({ game }) {
  return (
    <Link
      to={`/games/${game.slug}`}
      className="group block"
    >
      <div className="overflow-hidden" style={{ height: 200 }}>
        <img
          src={game.image_url || `https://picsum.photos/seed/${game.slug}/400/280`}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${game.slug}/400/280`; }}
        />
      </div>
      <div className="pt-2">
        <p className="text-[13px] font-bold text-white leading-snug line-clamp-2 group-hover:text-[#10b981] transition-colors">
          {game.title}
        </p>
        {game.release_display && (
          <p className="text-[11px] text-[#555566] mt-0.5">{game.release_display}</p>
        )}
      </div>
    </Link>
  );
}

/* ─── Root Component ──────────────────────────────────────────────────────── */
export default function GameDetailPage() {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    setGame(null);

    api
      .get(`/games/${slug}/`)
      .then(({ data }) => {
        setGame(data);
        // fetch related games of same type
        const params = { page_size: 8, is_active: true };
        if (data.game_type && data.game_type !== 'both') params.game_type = data.game_type;
        return api.get('/games/', { params });
      })
      .then(({ data }) => {
        const others = (data.results || data).filter((g) => g.slug !== slug).slice(0, 6);
        setRelated(others);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingState />;
  if (error || !game) return <ErrorState />;

  const accentColor = game.categories?.[0]?.slug ? catColor(game.categories[0].slug) : '#10b981';
  const typeLabel = { popular: 'Popular', anticipated: 'Most Anticipated', both: 'Featured' }[game.game_type] || 'Game';

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-12 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] text-[#555566] mb-6 flex-wrap">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={10} className="text-[#333344]" />
          <Link to="/gaming" className="hover:text-white transition-colors">Gaming</Link>
          <ChevronRight size={10} className="text-[#333344]" />
          <span className="text-[#888899] truncate max-w-[300px]">{game.title}</span>
        </nav>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 mb-12">

          {/* ── Cover ── */}
          <div>
            {/* Type badge */}
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2 py-1 text-white inline-block mb-3"
              style={{ background: accentColor }}
            >
              {typeLabel}
            </span>

            {/* Poster */}
            <div className="overflow-hidden rounded" style={{ aspectRatio: '3/4' }}>
              <img
                src={game.image_url || `https://picsum.photos/seed/${game.slug}/400/533`}
                alt={game.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${game.slug}/400/533`; }}
              />
            </div>

            {/* Meta */}
            <div className="mt-4 space-y-3">
              {game.categories?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {game.categories.map((c) => (
                    <Link
                      key={c.id}
                      to={`/${c.slug}`}
                      className="text-[10px] font-bold px-2 py-1 rounded transition-all hover:opacity-80"
                      style={{ background: `${catColor(c.slug)}20`, color: catColor(c.slug), border: `1px solid ${catColor(c.slug)}40` }}
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}

              {game.players && (
                <div className="flex items-center gap-2 text-[12px] text-[#888899]">
                  <Users size={12} />
                  <span>{game.players}</span>
                </div>
              )}

              {game.release_display && (
                <div className="flex items-center gap-2 text-[12px] text-[#888899]">
                  <Calendar size={12} />
                  <span>{game.release_display}</span>
                </div>
              )}

              {game.trend && (
                <div className="flex items-center gap-2 text-[12px]">
                  <TrendingUp size={12} style={{ color: game.trend.startsWith('+') ? '#10b981' : '#ef4444' }} />
                  <span style={{ color: game.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>{game.trend}</span>
                </div>
              )}

              {game.rank > 0 && (
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-[12px] font-black"
                  style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}
                >
                  <Gamepad2 size={12} />
                  Rank #{game.rank}
                </div>
              )}
            </div>
          </div>

          {/* ── Content ── */}
          <div>
            <h1
              className="text-[36px] lg:text-[48px] font-black uppercase tracking-tighter leading-tight mb-3"
              style={{ textShadow: `0 0 40px ${accentColor}30` }}
            >
              {game.title}
            </h1>

            {game.short_description && (
              <p className="text-[#aaaabc] text-[16px] leading-relaxed mb-6 border-l-4 pl-4" style={{ borderColor: accentColor }}>
                {game.short_description}
              </p>
            )}

            {/* Divider */}
            <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />

            {/* Full description */}
            {game.description ? (
              <div className="text-[#ccccd8] text-[15px] leading-relaxed space-y-4">
                {game.description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <p className="text-[#555566] italic">No description available yet.</p>
            )}

            {/* Back link */}
            <div className="mt-10 pt-6 border-t border-[#1a1a28]">
              <Link
                to="/gaming"
                className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[#555566] hover:text-white transition-colors"
              >
                <ArrowLeft size={13} />
                Back to Gaming
              </Link>
            </div>
          </div>
        </div>

        {/* ── Related games ── */}
        {related.length > 0 && (
          <section className="border-t border-[#1a1a28] pt-10">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="flex gap-[3px] items-center">
                <div className="w-[4px] h-[20px] rounded-full" style={{ background: accentColor }} />
                <div className="w-[2px] h-[13px] rounded-full opacity-40" style={{ background: accentColor }} />
              </div>
              <h2 className="text-[24px] font-black uppercase tracking-tight text-white leading-none">
                More Games
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {related.map((g) => (
                <RelatedCard key={g.id} game={g} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
