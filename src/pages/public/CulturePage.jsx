import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronDown } from 'lucide-react';
import { FontImport, Tag, Meta, SectionHeader, ArticleCardV } from '../../components/public/landing/shared';
import CategorySidebar from '../../components/public/landing/CategorySidebar';
import api from '../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../utils/article';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';

const ACCENT = '#a855f7';
const SLUG   = 'culture';

function mapArticle(a) {
  return {
    id:      a.id,
    slug:    a.slug,
    title:   a.title,
    image:   a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/800/450`,
    tag:     a.category?.name || a.tags?.[0]?.name || 'CULTURE',
    tagColor: ACCENT,
    time:    timeAgo(a.published_at),
    views:   formatViews(a.view_count),
    author:  a.author?.username || '',
    excerpt: a.meta_description || '',
  };
}

export default function CulturePage() {
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

        <SectionHeader title="Culture" icon={Sparkles} color={ACCENT} />

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
      </div>
    </div>
  );
}
