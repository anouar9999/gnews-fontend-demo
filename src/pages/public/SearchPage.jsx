import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Clock, Eye } from 'lucide-react';
import api from '../../api/axios';

const MOCK_ARTICLES = [
  { id: 1, slug: 'gta-vi-pc-date', title: 'GTA VI PC Release Date Officially Confirmed — Everything You Need to Know', excerpt: 'Rockstar Games finally breaks the silence with a full reveal of GTA VI coming to PC, along with system requirements and exclusive content.', category: { name: 'Gaming' }, published_at: '2025-01-15T10:00:00Z', view_count: 142000, featured_image: 'https://picsum.photos/seed/gtavi/800/450' },
  { id: 2, slug: 'rtx-5090-review', title: 'RTX 5090 Review: The Monster GPU That Redefines 4K Gaming', excerpt: "NVIDIA's flagship pushes every boundary. We tested it for 3 weeks.", category: { name: 'Hardware' }, published_at: '2025-01-15T06:00:00Z', view_count: 98000, featured_image: 'https://picsum.photos/seed/rtx5090/800/450' },
  { id: 3, slug: 'esl-pro-league-s22', title: 'ESL Pro League S22 — Team Liquid Dominates Opening Week', excerpt: 'The CS2 season opens with jaw-dropping performances and major upsets.', category: { name: 'Esports' }, published_at: '2025-01-15T09:00:00Z', view_count: 67000, featured_image: 'https://picsum.photos/seed/esports22/800/450' },
  { id: 4, slug: 'ai-npcs-gaming', title: 'How AI-Driven NPCs Are About to Change Everything in Open-World Games', excerpt: 'From Starfield to Skyrim — the next generation of AI companions is here.', category: { name: 'Culture' }, published_at: '2025-01-14T14:00:00Z', view_count: 51000, featured_image: 'https://picsum.photos/seed/ainpc/800/450' },
  { id: 5, slug: 'diablo-5-leak', title: 'Diablo V Leaks: New Classes, World Map, and Release Window Revealed', excerpt: 'Leaked images show a massive new world map and five never-before-seen character classes.', category: { name: 'Gaming' }, published_at: '2025-01-15T09:30:00Z', view_count: 22000, featured_image: 'https://picsum.photos/seed/d5/400/300' },
  { id: 6, slug: 'ps6-specs', title: 'PS6 Dev Kit Specs Surface Online — 4nm Chip and 32GB VRAM', excerpt: 'Sony\'s next-gen console is shaping up to be a powerhouse.', category: { name: 'Gaming' }, published_at: '2025-01-15T08:00:00Z', view_count: 88000, featured_image: 'https://picsum.photos/seed/ps6/400/300' },
  { id: 7, slug: 'valorant-ep9', title: 'Valorant Episode 9: New Agent Abilities and Map Changes Detailed', excerpt: 'Riot Games reveals sweeping changes coming to the tactical shooter this season.', category: { name: 'Gaming' }, published_at: '2025-01-15T07:00:00Z', view_count: 44000, featured_image: 'https://picsum.photos/seed/val9/400/300' },
  { id: 8, slug: 'xbox-handheld', title: 'Xbox Handheld: Microsoft Confirms Portable Console Is in Development', excerpt: 'Phil Spencer officially acknowledges the handheld project in a new interview.', category: { name: 'Gaming' }, published_at: '2025-01-15T05:00:00Z', view_count: 110000, featured_image: 'https://picsum.photos/seed/xboxhand/400/300' },
  { id: 9, slug: 'ryzen-9950x3d', title: 'AMD Ryzen 9 9950X3D: The CPU King Returns with 3D V-Cache', excerpt: 'AMD\'s latest flagship processor dominates every benchmark we threw at it.', category: { name: 'Hardware' }, published_at: '2025-01-14T08:00:00Z', view_count: 35000, featured_image: 'https://picsum.photos/seed/9950x3d/400/300' },
  { id: 10, slug: 'ddr6-ram', title: 'DDR6 RAM: Everything We Know About Next-Gen Memory Standards', excerpt: 'The next generation of memory is coming — here\'s what to expect.', category: { name: 'Hardware' }, published_at: '2025-01-13T10:00:00Z', view_count: 28000, featured_image: 'https://picsum.photos/seed/ddr6/400/300' },
  { id: 11, slug: 'monitor-4k240', title: "Best 4K 240Hz Monitors of 2025: The Definitive Buyer's Guide", excerpt: 'We tested 12 monitors so you don\'t have to. Here are the best picks.', category: { name: 'Hardware' }, published_at: '2025-01-12T10:00:00Z', view_count: 19000, featured_image: 'https://picsum.photos/seed/monitor4k/400/300' },
  { id: 12, slug: 'ai-future-gaming', title: 'The Future of Gaming: AI, Cloud & Beyond', excerpt: 'A deep look at the technologies reshaping how we play, create, and experience games in 2025 and beyond.', category: { name: 'Culture' }, published_at: '2025-01-11T10:00:00Z', view_count: 73000, featured_image: 'https://picsum.photos/seed/futuregaming/800/450' },
];

function searchMock(q) {
  const lower = q.toLowerCase();
  const filtered = MOCK_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(lower) ||
      a.excerpt.toLowerCase().includes(lower) ||
      a.category.name.toLowerCase().includes(lower)
  );
  return { results: filtered, count: filtered.length };
}

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const [query, setQuery]     = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal]     = useState(0);

  useEffect(() => {
    if (!q) { setResults([]); setTotal(0); return; }
    setLoading(true);
    api.get('/articles/', { params: { search: q, status: 'publie', ordering: '-published_at' } })
      .then(({ data }) => {
        setResults(data.results ?? []);
        setTotal(data.count ?? 0);
      })
      .catch(() => {
        // Backend offline — fall back to mock data
        const { results: r, count } = searchMock(q);
        setResults(r);
        setTotal(count);
      })
      .finally(() => setLoading(false));
  }, [q]);

  // keep input in sync if URL param changes
  useEffect(() => { setQuery(q); }, [q]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) setSearchParams({ q: query.trim() });
  };

  return (
    <div className="min-h-screen bg-black pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Search bar */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('nav.search') || 'Search articles, games, hardware…'}
              className="w-full bg-[#111] border border-[#333] text-white text-base rounded-xl pl-12 pr-28 py-4 outline-none focus:border-orange transition-colors"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-orange hover:bg-orange-dim text-white text-sm font-bold rounded-lg transition-colors"
            >
              {t('search.button')}
            </button>
          </div>
        </form>

        {/* Results header */}
        {q && (
          <p className="text-gray-500 text-sm mb-6">
            {loading
              ? t('search.searching')
              : <>{t('search.resultsFor', { count: total, plural: total !== 1 ? 's' : '' })} <span className="text-white font-semibold">"{q}"</span></>
            }
          </p>
        )}

        {/* States */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug ?? article.id}`}
                className="flex gap-4 bg-[#111] border border-[#1A1A1A] hover:border-orange/40 rounded-xl p-4 transition-colors group"
              >
                {article.featured_image && (
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-24 h-16 object-cover rounded-lg shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  {article.category?.name && (
                    <span className="text-orange text-[10px] font-bold uppercase tracking-wider">
                      {article.category.name}
                    </span>
                  )}
                  <h3 className="text-white font-semibold text-sm group-hover:text-orange transition-colors line-clamp-2 mt-0.5">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">{article.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-gray-600 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(article.published_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={11} />
                      {article.view_count?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : q && !loading ? (
          <div className="text-center py-16">
            <Search size={40} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-semibold">{t('search.noResults')}</p>
            <p className="text-gray-600 text-sm mt-2">{t('search.tryDifferent')}</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <Search size={40} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">{t('search.enterTerm')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
