import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, ChevronDown } from 'lucide-react';
import NewsCard from '../../components/public/NewsCard';
import api from '../../api/axios';
import { toCard } from '../../utils/article';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';

const FILTER_KEYS = ['all', 'pc', 'ps', 'xbox', 'nintendo', 'mobile', 'vr'];
const FILTER_VALUES = ['All', 'PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile', 'VR'];

export default function GamingPage() {
  const { t } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(0);
  const [hero, setHero] = useState(null);
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);


  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get('/articles/', { params: { status: 'publie', category__slug: 'gaming', ordering: '-published_at' } }),
      api.get('/articles/', { params: { status: 'publie', category__slug: 'gaming', ordering: '-view_count' } }),
    ])
      .then(([mainRes, trendRes]) => {
        const all = (mainRes.data.results || []).map(toCard);
        setHero(all[0] || null);
        setArticles(all.slice(1));
        setNextPage(mainRes.data.next || null);
        setTrending((trendRes.data.results || []).slice(0, 4).map(toCard));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useRefetchOnFocus(fetchData);

  const activeValue = FILTER_VALUES[activeIdx];
  const displayed = activeIdx === 0
    ? articles
    : articles.filter((a) =>
        a.tag?.toLowerCase().includes(activeValue.toLowerCase()) ||
        a.category?.toLowerCase().includes(activeValue.toLowerCase())
      );

  const handleLoadMore = async () => {
    if (!nextPage) return;
    setLoadingMore(true);
    try {
      const { data } = await api.get(nextPage.replace(/^.*\/api/, '/api'));
      setArticles((prev) => [...prev, ...(data.results || []).map(toCard)]);
      setNextPage(data.next || null);
    } catch {}
    finally { setLoadingMore(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

      {/* ── Header + filter bar ── */}
      <div
        className="flex items-center gap-4 flex-wrap"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 20 }}
      >
        <div className="flex items-center gap-3 shrink-0">
          <div style={{
            width: 3, height: 36, flexShrink: 0,
            background: 'var(--color-orange)',
            boxShadow: '0 0 10px var(--color-orange)',
          }} />
          <h1 className="text-[48px] font-black uppercase tracking-tighter text-white leading-none">
            {t('gaming.title')}
          </h1>
        </div>
        <span className="gnewz-tag">{t('gaming.today')}</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {FILTER_KEYS.map((key, idx) => {
            const active = activeIdx === idx;
            return (
              <button
                key={key}
                onClick={() => setActiveIdx(idx)}
                className="shrink-0 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all duration-100"
                style={{
                  background: active ? 'var(--color-orange)' : 'rgba(255,255,255,0.04)',
                  color:      active ? '#fff'                 : 'rgba(255,255,255,0.35)',
                  boxShadow:  active ? '0 0 14px rgba(254,107,0,0.4), 0 4px 0 rgba(163,58,0,0.8)' : 'none',
                  transform:  active ? 'translateY(-2px)'    : 'none',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; } }}
              >
                {t(`gaming.filters.${key}`)}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2.5px solid var(--color-orange)', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {hero && <NewsCard article={hero} size="lg" />}
            {hero.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hero.map((a) =>
                   <NewsCard key={a.slug} article={a} size="lg"  />)}
              </div>
            ) : (
              <p className="py-8 text-center text-sm" style={{ color: 'rgba(255,255,255,0.28)' }}>{t('gaming.noArticles')}</p>
            )
            
            }
            {nextPage && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-8 py-3 text-[13px] font-black uppercase tracking-widest text-white disabled:opacity-40"
                  style={{
                    background: loadingMore ? '#2a2a2a' : 'linear-gradient(135deg, var(--color-orange) 0%, #c44400 100%)',
                    boxShadow: loadingMore ? 'none' : '0 6px 0 #7a2a00, 0 8px 20px rgba(255,107,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                    transform: loadingMore ? 'none' : 'translateY(-3px)',
                    transition: 'transform 0.08s ease, box-shadow 0.08s ease',
                  }}
                  onMouseEnter={e => { if (!loadingMore) { e.currentTarget.style.boxShadow = '0 8px 0 #7a2a00, 0 12px 28px rgba(255,107,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-5px)'; } }}
                  onMouseLeave={e => { if (!loadingMore) { e.currentTarget.style.boxShadow = '0 6px 0 #7a2a00, 0 8px 20px rgba(255,107,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; } }}
                  onMouseDown={e  => { if (!loadingMore) { e.currentTarget.style.boxShadow = '0 2px 0 #7a2a00, 0 4px 10px rgba(255,107,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0px)'; } }}
                  onMouseUp={e    => { if (!loadingMore) { e.currentTarget.style.boxShadow = '0 6px 0 #7a2a00, 0 8px 20px rgba(255,107,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; } }}
                >
                  {loadingMore ? (
                    <>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                      {t('gaming.loading')}
                    </>
                  ) : (
                    <>
                      <ChevronDown size={15} strokeWidth={3} />
                      {t('gaming.loadMore')}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {trending.length > 0 && (
              <div className="overflow-hidden" style={{ background: 'linear-gradient(160deg, #161618, #111113)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
                {/* Orange top accent */}
                <div style={{ height: 2, background: 'linear-gradient(90deg, var(--color-orange) 0%, rgba(255,107,0,0) 70%)' }} />
                {/* Header */}
                <div className="flex items-center gap-3 px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={14} style={{ color: 'var(--color-orange)' }} />
                  </div>
                  <h3 className="font-black text-xs uppercase tracking-widest text-white">{t('gaming.trendingNow')}</h3>
                </div>
                {/* Items */}
                <div className="px-3 py-2">
                  {trending.map((a, i) => (
                    <div key={a.slug} className="flex items-start gap-3 py-1" style={{ borderBottom: i < trending.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <span
                        className="text-2xl font-black leading-none w-6 shrink-0 pt-3 tabular-nums"
                        style={{ color: i === 0 ? 'var(--color-orange)' : 'rgba(255,255,255,0.12)' }}
                      >
                        {i + 1}
                      </span>
                      <NewsCard article={a} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
