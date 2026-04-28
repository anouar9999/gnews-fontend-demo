import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Tag as TagIcon, ChevronDown, ChevronRight, Clock, Eye, TrendingUp, Flame, Search, X,
} from 'lucide-react';
import { FontImport, Tag, Meta, SectionHeader } from '../../components/public/landing/shared';
import api from '../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../utils/article';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';

const ACCENT = '#FF6B00';

const CATEGORY_COLORS = {
  gaming: '#e8001c',
  hardware: '#3b82f6',
  culture: '#a855f7',
  esports: '#f59e0b',
};
function catColor(slug) {
  return CATEGORY_COLORS[slug] || '#f59e0b';
}

function mapArticle(a) {
  return {
    id:      a.id,
    slug:    a.slug,
    title:   a.title,
    image:   a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/800/450`,
    tag:     a.category?.name || a.tags?.[0]?.name || 'NEWS',
    tagColor: catColor(a.category?.slug),
    time:    timeAgo(a.published_at),
    views:   formatViews(a.view_count),
    excerpt: a.meta_description || '',
  };
}

function mapSidebarArticle(a) {
  return {
    slug:     a.slug,
    title:    a.title,
    image:    a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/400/240`,
    time:     timeAgo(a.published_at),
    views:    formatViews(a.view_count),
    tag:      a.category?.name || 'NEWS',
    tagColor: catColor(a.category?.slug),
  };
}

/* ─── Filter helpers ─────────────────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { id: '-published_at',             label: 'Latest'       },
  { id: '-view_count,-published_at', label: 'Most Popular' },
  { id: 'title',                     label: 'A – Z'        },
];

const PERIOD_OPTIONS = [
  { id: '',       label: 'All time'   },
  { id: 'today',  label: 'Today'      },
  { id: 'week',   label: 'This week'  },
  { id: 'month',  label: 'This month' },
];

/* ─── Dropdown ───────────────────────────────────────────────────────────────── */
function FilterDropdown({ options, value, onChange, color = ACCENT }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.id === value) ?? options[0];
  const isActive = value !== '' && value !== options[0].id;

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-widest transition-all"
        style={{
          minWidth: 145,
          background: isActive ? `${color}12` : 'rgba(255,255,255,0.04)',
          border:     `1px solid ${isActive ? color : 'rgba(255,255,255,0.09)'}`,
          color:      isActive ? color : 'rgba(255,255,255,0.45)',
          boxShadow:  isActive ? `0 0 10px ${color}20` : 'none',
        }}
      >
        {isActive && (
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
        )}
        <span className="flex-1 text-left truncate">{selected.label}</span>
        <ChevronDown
          size={11}
          className="shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: 'rgba(255,255,255,0.25)' }}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50 min-w-full overflow-hidden"
          style={{
            background: '#0c0c16',
            border: '1px solid rgba(255,255,255,0.11)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.75)',
          }}
        >
          {options.map(o => {
            const active = o.id === value;
            return (
              <button
                key={o.id}
                onClick={() => { onChange(o.id); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors"
                style={{
                  background:  active ? `${color}14` : 'transparent',
                  color:       active ? color : 'rgba(255,255,255,0.38)',
                  borderLeft:  active ? `2px solid ${color}` : '2px solid transparent',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                )}
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Filter bar ─────────────────────────────────────────────────────────────── */
function FilterBar({ search, onSearch, sort, onSort, period, onPeriod, tagName }) {
  return (
    <div
      className="mb-8 overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#0e0e18,#0a0a14)' }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <Search size={14} className="shrink-0 text-[#444455]" />
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder={`Search ${tagName ? `#${tagName}` : 'tagged'} articles…`}
          className="flex-1 bg-transparent text-[13px] text-white placeholder-[#444455] outline-none"
          style={{ caretColor: ACCENT }}
        />
        {search && (
          <button onClick={() => onSearch('')} className="text-[#444455] hover:text-white transition-colors">
            <X size={13} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5 px-4 py-3 flex-wrap">
        <FilterDropdown options={SORT_OPTIONS}   value={sort}   onChange={onSort}   color={ACCENT}  />
        <FilterDropdown options={PERIOD_OPTIONS} value={period} onChange={onPeriod} color="#3b82f6" />
      </div>
    </div>
  );
}

/* ─── Article list item ──────────────────────────────────────────────────────── */
function ArticleListItem({ article }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="flex gap-4 py-4 border-b border-[#1a1a28] group hover:bg-[#0a0a14] transition-colors -mx-2 px-2"
    >
      <div className="shrink-0 overflow-hidden" style={{ width: 150, height: 95 }}>
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-400"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/300/190`; }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <Tag label={article.tag} color={article.tagColor} />
        <h3 className="text-[14px] font-bold text-[#ccccdd] leading-snug mt-1.5 mb-1.5 line-clamp-2 group-hover:text-white transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="hidden md:block text-[12px] text-[#555566] line-clamp-1 mb-1.5 leading-snug">
            {article.excerpt}
          </p>
        )}
        <Meta time={article.time} views={article.views} />
      </div>
    </Link>
  );
}

/* ─── Sidebar widgets ────────────────────────────────────────────────────────── */
function WidgetHeader({ title, icon: Icon, color, href }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {Icon ? (
          <Icon size={14} style={{ color }} />
        ) : (
          <div className="w-[3px] h-5 rounded-full" style={{ background: color }} />
        )}
        <h3 className="text-[13px] font-black uppercase text-white">{title}</h3>
      </div>
      {href && (
        <Link
          to={href}
          className="text-[10px] font-bold uppercase tracking-widest text-[#444455] hover:text-white transition-colors flex items-center gap-0.5"
        >
          All <ChevronRight size={9} />
        </Link>
      )}
    </div>
  );
}

function TopArticlesWidget() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get('/articles/', {
      params: { status: 'publie', ordering: '-view_count,-published_at', page_size: 7 },
    })
      .then(({ data }) => {
        setArticles(
          (data.results || []).slice(0, 5).map(a => ({
            slug:     a.slug,
            title:    a.title,
            views:    formatViews(a.view_count),
            tag:      a.category?.name || 'NEWS',
            tagColor: catColor(a.category?.slug),
          })),
        );
      })
      .catch(() => {});
  }, []);

  if (!articles.length) return null;

  return (
    <div>
      <WidgetHeader title="Top Articles" icon={TrendingUp} color="#f59e0b" />
      <div className="flex flex-col gap-px bg-[#1a1a28]">
        {articles.map((a, i) => (
          <Link
            key={a.slug}
            to={`/articles/${a.slug}`}
            className="flex items-start gap-3 p-3 bg-[#0d0d18] hover:bg-[#12121e] transition-colors group"
          >
            <span className="shrink-0 w-7 h-7 flex items-center justify-center text-[64px] font-black text-gray-500">
              {i + 1}
            </span>
            <div className="min-w-0">
              <span
                className="text-[9px] font-black uppercase tracking-widest px-1.5 py-[2px] text-white inline-block mb-1"
                style={{ background: a.tagColor }}
              >
                {a.tag}
              </span>
              <p className="text-[12px] font-semibold text-[#ccccdd] leading-snug line-clamp-2 group-hover:text-white transition-colors">
                {a.title}
              </p>
              {a.views && (
                <span className="text-[10px] text-[#444455] flex items-center gap-1 mt-0.5">
                  <Eye size={8} /> {a.views}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function RecentArticlesWidget({ excludeTagSlug }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get('/articles/', {
      params: { status: 'publie', ordering: '-published_at', page_size: 6 },
    })
      .then(({ data }) => {
        setArticles(
          (data.results || [])
            .filter(a => !a.tags?.some(t => t.slug === excludeTagSlug))
            .slice(0, 4)
            .map(a => ({
              slug:     a.slug,
              title:    a.title,
              image:    a.featured_image_b64 || normalizeMediaUrl(a.featured_image) || `https://picsum.photos/seed/${a.slug}/400/240`,
              time:     timeAgo(a.published_at),
              tag:      a.category?.name || 'NEWS',
              tagColor: catColor(a.category?.slug),
            })),
        );
      })
      .catch(() => {});
  }, [excludeTagSlug]);

  if (!articles.length) return null;

  return (
    <div>
      <WidgetHeader title="Latest News" icon={Flame} color={ACCENT} />
      <div className="flex flex-col gap-px bg-[#1a1a28]">
        {articles.map(a => (
          <Link
            key={a.slug}
            to={`/articles/${a.slug}`}
            className="flex gap-2.5 p-2.5 bg-[#0d0d18] hover:bg-[#12121e] transition-colors group"
          >
            <div className="shrink-0 w-[72px] h-[46px] overflow-hidden">
              <img
                src={a.image}
                alt={a.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${a.slug}/200/130`; }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <span
                className="text-[9px] font-black uppercase tracking-widest px-1.5 py-[2px] text-white inline-block mb-0.5"
                style={{ background: a.tagColor }}
              >
                {a.tag}
              </span>
              <p className="text-[11.5px] font-semibold text-[#ccccdd] leading-snug line-clamp-2 group-hover:text-white transition-colors">
                {a.title}
              </p>
              <span className="text-[10px] text-[#555566] flex items-center gap-1 mt-0.5">
                <Clock size={8} /> {a.time}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Sidebar({ tagSlug }) {
  return (
    <aside className="flex flex-col gap-8">
      <RecentArticlesWidget excludeTagSlug={tagSlug} />
      <TopArticlesWidget />
    </aside>
  );
}

/* ─── Period → published_at__gte date string ─────────────────────────────────── */
function periodToDate(period) {
  if (!period) return null;
  const now = new Date();
  if (period === 'today') {
    const d = new Date(now); d.setHours(0, 0, 0, 0); return d.toISOString();
  }
  if (period === 'week') {
    const d = new Date(now); d.setDate(d.getDate() - 7); return d.toISOString();
  }
  if (period === 'month') {
    const d = new Date(now); d.setMonth(d.getMonth() - 1); return d.toISOString();
  }
  return null;
}

function formatSlugAsName(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/* ─── Root ───────────────────────────────────────────────────────────────────── */
export default function TagPage() {
  const { slug } = useParams();

  const [tagName,     setTagName]     = useState(formatSlugAsName(slug));
  const [articles,    setArticles]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [nextPage,    setNextPage]    = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sort,        setSort]        = useState('-published_at');
  const [search,      setSearch]      = useState('');
  const [period,      setPeriod]      = useState('');
  const debounceRef = useRef(null);

  // Fetch the canonical tag name from the API
  useEffect(() => {
    api.get('/tags/', { params: { search: slug, page_size: 20 } })
      .then(({ data }) => {
        const results = data.results || data;
        const match = results.find(t => t.slug === slug);
        if (match?.name) setTagName(match.name);
      })
      .catch(() => {});
  }, [slug]);

  const buildParams = useCallback((q) => {
    const params = { status: 'publie', tags__slug: slug, ordering: sort };
    if (q?.trim()) params.search = q.trim();
    const since = periodToDate(period);
    if (since) params.published_at__gte = since;
    return params;
  }, [slug, sort, period]);

  const fetchData = useCallback((q = search) => {
    setLoading(true);
    api.get('/articles/', { params: buildParams(q) })
      .then(({ data }) => {
        setArticles((data.results || []).map(mapArticle));
        setNextPage(data.next || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [buildParams, search]);

  useEffect(() => {
    setArticles([]);
    setNextPage(null);
    fetchData('');
  }, [slug, sort, period]);

  useRefetchOnFocus(() => fetchData());

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchData(val), 400);
  };

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

  const hasActiveFilter = search || period;

  const resultTitle = (() => {
    if (search)             return `Results for "${search}"`;
    if (period === 'today') return `Today — #${tagName}`;
    if (period === 'week')  return `This Week — #${tagName}`;
    if (period === 'month') return `This Month — #${tagName}`;
    return `All articles tagged #${tagName}`;
  })();

  return (
    <div className="text-white">
      <FontImport />
      <div className="max-w-[1280px] mx-auto px-22 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#444455] mb-6">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span style={{ color: ACCENT }}># {tagName}</span>
        </div>

        <SectionHeader title={`#${tagName}`} icon={TagIcon} color={ACCENT} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mt-6">

          {/* ── Main content ── */}
          <div>
            <FilterBar
              search={search}  onSearch={handleSearch}
              sort={sort}      onSort={s => setSort(s)}
              period={period}  onPeriod={p => setPeriod(p)}
              tagName={tagName}
            />

            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <h2 className="text-[22px] font-black uppercase tracking-tight text-white leading-none">
                  {resultTitle}
                </h2>
                {!loading && (
                  <p className="text-[11px] text-[#444455] mt-1.5 font-semibold uppercase tracking-widest">
                    <span style={{ color: ACCENT }}>{articles.length}{nextPage ? '+' : ''}</span>
                    {' '}article{articles.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              {hasActiveFilter && (
                <button
                  onClick={() => { setSearch(''); setPeriod(''); }}
                  className="flex items-center gap-1.5 shrink-0 text-[11px] font-bold uppercase tracking-widest text-[#444455] hover:text-white transition-colors pb-0.5"
                >
                  <X size={10} /> Clear
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-24">
                <div style={{ width: 36, height: 36, borderRadius: '50%', border: `2.5px solid ${ACCENT}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
              </div>
            ) : articles.length > 0 ? (
              <div className="flex flex-col">
                {articles.map(a => (
                  <ArticleListItem key={a.slug} article={a} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-24 gap-3">
                <span
                  className="text-[32px] font-black"
                  style={{ color: ACCENT, opacity: 0.2 }}
                >
                  #
                </span>
                <p className="text-[#555566] text-sm text-center">
                  {hasActiveFilter
                    ? 'No articles match your filters.'
                    : `No published articles found for #${tagName} yet.`}
                </p>
              </div>
            )}

            {!loading && nextPage && (
              <div className="flex justify-center pt-6 pb-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-8 py-3 text-[13px] font-black uppercase tracking-widest text-white disabled:opacity-40 transition-all"
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
          <div className="hidden lg:block lg:pl-8">
            <Sidebar tagSlug={slug} />
          </div>

        </div>
      </div>
    </div>
  );
}
