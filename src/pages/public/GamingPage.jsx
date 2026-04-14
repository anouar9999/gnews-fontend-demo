import { useState, useEffect } from 'react';
import { TrendingUp, Filter } from 'lucide-react';
import NewsCard from '../../components/public/NewsCard';
import api from '../../api/axios';
import { toCard } from '../../utils/article';

const FILTERS = ['All', 'PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile', 'VR'];

export default function GamingPage() {
  const [active, setActive] = useState('All');
  const [hero, setHero] = useState(null);
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);

  const [nlEmail, setNlEmail] = useState('');
  const [nlLoading, setNlLoading] = useState(false);
  const [nlDone, setNlDone] = useState(false);

  useEffect(() => {
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

  const displayed = active === 'All'
    ? articles
    : articles.filter((a) =>
        a.tag?.toLowerCase().includes(active.toLowerCase()) ||
        a.category?.toLowerCase().includes(active.toLowerCase())
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

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!nlEmail.trim()) return;
    setNlLoading(true);
    try {
      await api.post('/newsletter/subscribe/', { email: nlEmail.trim() });
      setNlDone(true);
    } catch {}
    finally { setNlLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-orange rounded-full" />
        <h1 className="text-3xl font-900 text-white uppercase tracking-wide">Gaming News</h1>
        <span className="gnewz-tag ml-2">Today</span>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <Filter size={14} className="text-gray-500 shrink-0" />
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`shrink-0 px-4 py-1.5 rounded text-xs font-700 uppercase tracking-wider transition-colors ${
              active === f ? 'bg-orange text-white' : 'bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#2a2a2a]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {hero && <NewsCard article={hero} size="hero" />}
            {displayed.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayed.map((a) => <NewsCard key={a.slug} article={a} size="lg" showExcerpt />)}
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-8 text-center">No articles found.</p>
            )}
            {nextPage && (
              <div className="text-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-[#1A1A1A] hover:bg-orange border border-[#2a2a2a] hover:border-orange text-white text-sm font-700 uppercase px-8 py-3 rounded transition-colors tracking-wider disabled:opacity-50"
                >
                  {loadingMore ? 'Loading…' : 'Load More Stories'}
                </button>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {trending.length > 0 && (
              <div className="gnewz-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-orange" />
                  <h3 className="font-800 text-sm uppercase tracking-wider text-white">Trending Now</h3>
                </div>
                <div className="space-y-3">
                  {trending.map((a, i) => (
                    <div key={a.slug} className="flex items-start gap-3">
                      <span className="text-2xl font-900 text-orange/30 leading-none w-6 shrink-0">{i + 1}</span>
                      <NewsCard article={a} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="gnewz-card p-5 text-center">
              <p className="text-orange text-xs font-700 uppercase tracking-widest mb-2">Never Miss a Story</p>
              <h3 className="text-white font-800 text-lg mb-3">Get Gaming News Daily</h3>
              {nlDone ? (
                <p className="text-green-400 text-sm font-700 py-2">You're subscribed!</p>
              ) : (
                <form onSubmit={handleNewsletter}>
                  <input
                    type="email"
                    value={nlEmail}
                    onChange={(e) => setNlEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-orange mb-3 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={nlLoading}
                    className="w-full bg-orange hover:bg-orange-dim text-white text-xs font-700 uppercase py-2.5 rounded transition-colors tracking-wider disabled:opacity-50"
                  >
                    {nlLoading ? 'Subscribing…' : 'Subscribe Free'}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
