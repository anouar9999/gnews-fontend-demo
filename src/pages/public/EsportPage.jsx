import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ChevronDown, Radio } from 'lucide-react';
import { FontImport, Tag, Meta, SectionHeader, ArticleCardV } from '../../components/public/landing/shared';
import CategorySidebar from '../../components/public/landing/CategorySidebar';
import PopularGames from '../../components/public/landing/PopularGames';
import AnticipatedGames from '../../components/public/landing/AnticipatedGames';
import api from '../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../utils/article';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';

const ACCENT = '#f59e0b';
const SLUG   = 'esports';

/* ── Static live matches strip ─────────────────────────────────────────────── */
const LIVE_MATCHES = [
  { id: 1, t1: 'Team Liquid', t2: 'NAVI',       s1: 16, s2: 9,  game: 'CS2',      round: 'Grand Final',    map: 'Inferno' },
  { id: 2, t1: 'T1',          t2: 'Cloud9',     s1: 2,  s2: 1,  game: 'Valorant', round: 'Semi-Finals',    map: 'Bind'    },
  { id: 3, t1: 'FaZe Clan',   t2: 'G2 Esports', s1: 3,  s2: 3,  game: 'CS2',      round: 'Quarter-Finals', map: 'Mirage'  },
];

function mapArticle(a) {
  return {
    id:      a.id,
    slug:    a.slug,
    title:   a.title,
    image:   a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/800/450`,
    tag:     a.category?.name || a.tags?.[0]?.name || 'ESPORTS',
    tagColor: ACCENT,
    time:    timeAgo(a.published_at),
    views:   formatViews(a.view_count),
    author:  a.author?.username || '',
    excerpt: a.meta_description || '',
  };
}

export default function EsportPage() {
  const [hero,        setHero]        = useState(null);
  const [articles,    setArticles]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [nextPage,    setNextPage]    = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    api.get('/articles/', { params: { status: 'publie', category__slug: SLUG, ordering: '-published_at' } })
      .then(({ data }) => {
        const all = (data.results || []).map(mapArticle);
        setHero(all[0] || null);
        setArticles(all.slice(1));
        setNextPage(data.next || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useRefetchOnFocus(fetchData);

  const loadMore = async () => {
    if (!nextPage || loadingMore) return;
    setLoadingMore(true);
    try {
      const { data } = await api.get(nextPage.replace(/^.*\/api/, '/api'));
      setArticles(prev => [...prev, ...(data.results || []).map(mapArticle)]);
      setNextPage(data.next || null);
    } catch {}
    finally { setLoadingMore(false); }
  };

  return (
    <div className="text-white">
      <FontImport />
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 py-8">

        <SectionHeader title="Esports" icon={Trophy} color={ACCENT} />

        {/* ── Live matches strip ── */}
        <section className="mb-10 border-b border-[#1a1a28] pb-10">
          <div className="flex items-center gap-2 mb-4">
            <Radio size={13} style={{ color: ACCENT }} />
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: ACCENT }}>Live Now</span>
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse ml-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {LIVE_MATCHES.map(m => (
              <div
                key={m.id}
                className="p-4 border border-[#1a1a28] bg-[#111120]"
                style={{ borderTop: `2px solid ${ACCENT}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: ACCENT }}>{m.game}</span>
                  <span className="text-[#555566] text-[10px]">{m.round} · {m.map}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div className="w-9 h-9 rounded-full bg-[#1a1a28] mx-auto mb-1 flex items-center justify-center text-sm font-black" style={{ color: ACCENT }}>
                      {m.t1[0]}
                    </div>
                    <p className="text-white text-[11px] font-bold truncate">{m.t1}</p>
                  </div>
                  <div className="px-4 text-center">
                    <p className="text-white font-black text-xl leading-none">{m.s1} <span style={{ color: ACCENT }}>:</span> {m.s2}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest mt-1" style={{ color: ACCENT }}>LIVE</p>
                  </div>
                  <div className="text-center flex-1">
                    <div className="w-9 h-9 rounded-full bg-[#1a1a28] mx-auto mb-1 flex items-center justify-center text-sm font-black" style={{ color: ACCENT }}>
                      {m.t2[0]}
                    </div>
                    <p className="text-white text-[11px] font-bold truncate">{m.t2}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-24">
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: `2.5px solid ${ACCENT}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

            {/* ── Main content ── */}
            <div>
              {/* Hero article */}
              {hero && (
                <section className="mb-10 border-b border-[#1a1a28] pb-10">
                  <Link to={`/articles/${hero.slug}`} className="relative block overflow-hidden group">
                    <img
                      src={hero.image}
                      alt={hero.title}
                      className="w-full aspect-video md:aspect-[21/9] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${hero.slug}/800/450`; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d18] via-[#0d0d18]/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
                      <Tag label={hero.tag} color={hero.tagColor} />
                      <h1 className="text-white font-black text-[18px] md:text-[28px] leading-tight mt-2 mb-2 line-clamp-2 max-w-3xl">
                        {hero.title}
                      </h1>
                      {hero.excerpt && (
                        <p className="hidden md:block text-[#aaaabc] text-[15px] line-clamp-2 max-w-2xl mb-3">{hero.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 text-[13px]">
                        {hero.author && <span className="font-bold" style={{ color: ACCENT }}>{hero.author}</span>}
                        <Meta time={hero.time} views={hero.views} />
                      </div>
                    </div>
                  </Link>
                </section>
              )}

              {/* Article grid */}
              {articles.length > 0 && (
                <section className="mb-10">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {articles.map(a => (
                      <ArticleCardV key={a.slug} article={a} accentColor={ACCENT} />
                    ))}
                  </div>
                </section>
              )}

              {articles.length === 0 && !hero && (
                <p className="text-center text-[#555566] py-24 text-sm">No articles found in this category yet.</p>
              )}

              {/* Load more */}
              {nextPage && (
                <div className="flex justify-center pt-4 pb-10">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-8 py-3 text-[13px] font-black uppercase tracking-widest text-white disabled:opacity-40"
                    style={{ background: loadingMore ? '#1a1a28' : ACCENT }}
                  >
                    {loadingMore
                      ? <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                      : <ChevronDown size={15} strokeWidth={3} />}
                    {loadingMore ? 'Loading…' : 'Load More'}
                  </button>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:border-l lg:border-[#1a1a28] lg:pl-8">
              <CategorySidebar currentSlug={SLUG} />
            </div>

          </div>
        )}

        {/* ── Games sections ── */}
        <PopularGames />
        <AnticipatedGames />

      </div>
    </div>
  );
}
