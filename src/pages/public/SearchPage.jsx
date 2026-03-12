import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Clock, Eye } from 'lucide-react';
import api from '../../api/axios';

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const [query, setQuery]     = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal]     = useState(0);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    api.get('/articles/', { params: { search: q, status: 'publie', ordering: '-published_at' } })
      .then(({ data }) => { setResults(data.results ?? []); setTotal(data.count ?? 0); })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

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
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('nav.search')}
              className="w-full bg-[#111] border border-[#333] text-white text-base rounded-xl pl-12 pr-4 py-4 outline-none focus:border-[#FF6B00] transition-colors"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#FF6B00] hover:bg-[#cc5500] text-white text-sm font-bold rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results header */}
        {q && (
          <p className="text-gray-500 text-sm mb-4">
            {loading ? 'Searching...' : `${total} result${total !== 1 ? 's' : ''} for `}
            {!loading && <span className="text-white font-semibold">"{q}"</span>}
          </p>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug ?? article.id}`}
                className="flex gap-4 bg-[#111] border border-[#1A1A1A] hover:border-[#FF6B00]/40 rounded-xl p-4 transition-colors group"
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
                    <span className="text-[#FF6B00] text-[10px] font-bold uppercase tracking-wider">
                      {article.category.name}
                    </span>
                  )}
                  <h3 className="text-white font-semibold text-sm group-hover:text-[#FF6B00] transition-colors line-clamp-2 mt-0.5">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-gray-500 text-xs">
                    <span className="flex items-center gap-1"><Clock size={11} /> {new Date(article.published_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Eye size={11} /> {article.view_count}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : q && !loading ? (
          <div className="text-center py-16">
            <Search size={40} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-semibold">No results found</p>
            <p className="text-gray-600 text-sm mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <Search size={40} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">Enter a search term above</p>
          </div>
        )}
      </div>
    </div>
  );
}
