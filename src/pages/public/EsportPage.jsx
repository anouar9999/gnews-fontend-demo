import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy, ChevronDown, ChevronRight, Clock, Eye, TrendingUp, Flame, Search, X, Radio,
} from 'lucide-react';
import { FontImport, Tag, Meta, SectionHeader } from '../../components/public/landing/shared';
import PopularGames from '../../components/public/landing/PopularGames';
import AnticipatedGames from '../../components/public/landing/AnticipatedGames';
import api from '../../api/axios';
import { normalizeMediaUrl, timeAgo, formatViews } from '../../utils/article';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';

const ACCENT = '#f59e0b';
const SLUG   = 'esports';

const CATEGORY_COLORS = {
  gaming:   '#e8001c',
  hardware: '#3b82f6',
  culture:  '#a855f7',
  esports:  '#f59e0b',
};
function catColor(slug) { return CATEGORY_COLORS[slug] || '#f59e0b'; }

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

/* ─── Live matches strip ─────────────────────────────────────────────────────── */
function LiveMatchesStrip() {
  return (
    <section className="mb-10 pb-8 border-b border-[#1a1a28]">
      <div className="flex items-center gap-2 mb-4">
        <Radio size={13} style={{ color: ACCENT }} />
        <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: ACCENT }}>Live Now</span>
        <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse ml-1" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {LIVE_MATCHES.map(m => (
          <div key={m.id} className="p-4 border border-[#1a1a28] bg-[#111120]" style={{ borderTop: `2px solid ${ACCENT}` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: ACCENT }}>{m.game}</span>
              <span className="text-[#555566] text-[10px]">{m.round} · {m.map}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="w-9 h-9 rounded-full bg-[#1a1a28] mx-auto mb-1 flex items-center justify-center text-sm font-black" style={{ color: ACCENT }}>{m.t1[0]}</div>
                <p className="text-white text-[11px] font-bold truncate">{m.t1}</p>
              </div>
              <div className="px-4 text-center">
                <p className="text-white font-black text-xl leading-none">{m.s1} <span style={{ color: ACCENT }}>:</span> {m.s2}</p>
                <p className="text-[9px] font-black uppercase tracking-widest mt-1" style={{ color: ACCENT }}>LIVE</p>
              </div>
              <div className="text-center flex-1">
                <div className="w-9 h-9 rounded-full bg-[#1a1a28] mx-auto mb-1 flex items-center justify-center text-sm font-black" style={{ color: ACCENT }}>{m.t2[0]}</div>
                <p className="text-white text-[11px] font-bold truncate">{m.t2}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Filter options ─────────────────────────────────────────────────────────── */
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
const TYPE_OPTIONS = [
  { id: '',         label: 'All types' },
  { id: 'featured', label: 'Featured'  },
  { id: 'breaking', label: 'Breaking'  },
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
        {isActive && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />}
        <span className="flex-1 text-left truncate">{selected.label}</span>
        <ChevronDown size={11} className="shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: 'rgba(255,255,255,0.25)' }} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-full overflow-hidden"
          style={{ background: '#0c0c16', border: '1px solid rgba(255,255,255,0.11)', boxShadow: '0 16px 48px rgba(0,0,0,0.75)' }}>
          {options.map(o => {
            const active = o.id === value;
            return (
              <button key={o.id} onClick={() => { onChange(o.id); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors"
                style={{ background: active ? `${color}14` : 'transparent', color: active ? color : 'rgba(255,255,255,0.38)', borderLeft: active ? `2px solid ${color}` : '2px solid transparent' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />}
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
function FilterBar({ search, onSearch, sort, onSort, period, onPeriod, type, onType }) {
  return (
    <div className="mb-8 overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#0e0e18,#0a0a14)'}}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a28]">
        <Search size={14} className="shrink-0 text-[#444455]" />
        <input type="text" value={search} onChange={e => onSearch(e.target.value)}
          placeholder="Search esports articles…"
          className="flex-1 bg-transparent text-[13px] text-white placeholder-[#444455] outline-none"
          style={{ caretColor: ACCENT }} />
        {search && (
          <button onClick={() => onSearch('')} className="text-[#444455] hover:text-white transition-colors">
            <X size={13} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2.5 px-4 py-3 flex-wrap">
        <FilterDropdown options={SORT_OPTIONS}   value={sort}   onChange={onSort}   color={ACCENT}  />
        <FilterDropdown options={PERIOD_OPTIONS} value={period} onChange={onPeriod} color="#3b82f6" />
        <FilterDropdown options={TYPE_OPTIONS}   value={type}   onChange={onType}   color="#a855f7" />
      </div>
    </div>
  );
}

/* ─── Article list item ──────────────────────────────────────────────────────── */
function ArticleListItem({ article }) {
  return (
    <Link to={`/articles/${article.slug}`}
      className="flex gap-4 py-4 border-b border-[#1a1a28] group hover:bg-[#0a0a14] transition-colors -mx-2 px-2">
      <div className="shrink-0 overflow-hidden" style={{ width: 150, height: 95 }}>
        <img src={article.image} alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${article.slug}/300/190`; }} />
      </div>
      <div className="flex-1 min-w-0">
        <Tag label={article.tag} color={article.tagColor} />
        <h3 className="text-[14px] font-bold text-[#ccccdd] leading-snug mt-1.5 mb-1.5 line-clamp-2 group-hover:text-white transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="hidden md:block text-[12px] text-[#555566] line-clamp-1 mb-1.5 leading-snug">{article.excerpt}</p>
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
        {Icon ? <Icon size={14} style={{ color }} /> : <div className="w-[3px] h-5 rounded-full" style={{ background: color }} />}
        <h3 className="text-[13px] font-black uppercase text-white">{title}</h3>
      </div>
      {href && (
        <Link to={href} className="text-[10px] font-bold uppercase tracking-widest text-[#444455] hover:text-white transition-colors flex items-center gap-0.5">
          All <ChevronRight size={9} />
        </Link>
      )}
    </div>
  );
}

function LatestNewsWidget({ categorySlug }) {
  const [articles, setArticles] = useState([]);
  const color = catColor(categorySlug);
  const label = categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : 'Latest';

  useEffect(() => {
    if (!categorySlug) return;
    api.get('/articles/', { params: { status: 'publie', category__slug: categorySlug, ordering: '-published_at', page_size: 7 } })
      .then(({ data }) => setArticles((data.results || []).slice(0, 5).map(mapSidebarArticle)))
      .catch(() => {});
  }, [categorySlug]);

  if (!articles.length) return null;
  const [featured, ...rest] = articles;

  return (
    <div>
      <WidgetHeader title={`Latest ${label}`} color={color} href={`/${categorySlug}`} />
      <Link to={`/articles/${featured.slug}`} className="block group mb-px bg-[#0d0d18] hover:bg-[#12121e] transition-colors">
        <div className="overflow-hidden">
          <img src={featured.image} alt={featured.title}
            className="w-full aspect-[16/9] object-cover transition-transform duration-400 group-hover:scale-105"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${featured.slug}/400/225`; }} />
        </div>
        <div className="p-2.5">
          <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-[2px] text-white inline-block mb-1" style={{ background: color }}>{featured.tag}</span>
          <p className="text-[13px] font-bold text-white leading-snug line-clamp-2 group-hover:text-orange transition-colors">{featured.title}</p>
          <span className="text-[10px] text-[#555566] flex items-center gap-1 mt-1"><Clock size={9} /> {featured.time}</span>
        </div>
      </Link>
      <div className="flex flex-col gap-px bg-[#1a1a28] mt-px">
        {rest.map(a => (
          <Link key={a.slug} to={`/articles/${a.slug}`} className="flex gap-2.5 p-2.5 bg-[#0d0d18] hover:bg-[#12121e] transition-colors group">
            <div className="shrink-0 w-[72px] h-[46px] overflow-hidden">
              <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://picsum.photos/seed/${a.slug}/200/130`; }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] font-semibold text-[#ccccdd] leading-snug line-clamp-2 group-hover:text-white transition-colors">{a.title}</p>
              <span className="text-[10px] text-[#555566] flex items-center gap-1 mt-0.5"><Clock size={8} /> {a.time}</span>
            </div>
          </Link>
        ))}
      </div>
      <Link to={`/${categorySlug}`} className="flex items-center justify-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-widest text-[#444455] hover:text-white transition-colors py-2 border border-[#1a1a28] hover:border-[#333344]">
        See all {label} news <ChevronRight size={9} />
      </Link>
    </div>
  );
}

function TopArticlesWidget() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get('/articles/', { params: { status: 'publie', ordering: '-view_count,-published_at', page_size: 7 } })
      .then(({ data }) => setArticles((data.results || []).slice(0, 5).map(a => ({
        slug: a.slug, title: a.title, views: formatViews(a.view_count),
        tag: a.category?.name || 'NEWS', tagColor: catColor(a.category?.slug),
      }))))
      .catch(() => {});
  }, []);

  if (!articles.length) return null;

  return (
    <div>
      <WidgetHeader title="Top Articles" icon={TrendingUp} color="#f59e0b" />
      <div className="flex flex-col gap-px bg-[#1a1a28]">
        {articles.map((a, i) => (
          <Link key={a.slug} to={`/articles/${a.slug}`} className="flex items-start gap-3 p-3 bg-[#0d0d18] hover:bg-[#12121e] transition-colors group">
            <span className="shrink-0 w-7 h-7 flex items-center justify-center text-[64px] font-black text-gray-500">{i + 1}</span>
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-[2px] text-white inline-block mb-1" style={{ background: a.tagColor }}>{a.tag}</span>
              <p className="text-[12px] font-semibold text-[#ccccdd] leading-snug line-clamp-2 group-hover:text-white transition-colors">{a.title}</p>
              {a.views && <span className="text-[10px] text-[#444455] flex items-center gap-1 mt-0.5"><Eye size={8} /> {a.views}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PopularGamesWidget() {
  const [games, setGames] = useState([]);
  const GREEN = '#10b981';

  useEffect(() => {
    api.get('/games/', { params: { game_type: 'popular', page_size: 6, ordering: 'rank' } })
      .then(({ data }) => setGames(data.results || data))
      .catch(() => {});
  }, []);

  if (!games.length) return null;

  return (
    <div>
      <div style={{ padding: '10px 12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 3, height: 16, borderRadius: 2, background: GREEN, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff' }}>Popular Games</span>
        </div>
        <Link to="/gaming" style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#444455', display: 'flex', alignItems: 'center', gap: 2 }}
          className="hover:text-white transition-colors">All <ChevronRight size={8} /></Link>
      </div>
      <div className="flex flex-col">
        {games.map((g, i) => (
          <Link key={g.id} to={`/games/${g.slug}`} className="group flex items-center gap-3 transition-colors"
            style={{ padding: '8px 12px', borderBottom: '1px solid #111120', background: '#0a0a14' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#0f0f1e')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0a0a14')}>
            <div className="shrink-0 overflow-hidden" style={{ width: 38, height: 50, borderRadius: 3, background: '#111120' }}>
              {g.cover_image && <img src={g.cover_image} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { e.currentTarget.style.display = 'none'; }} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold leading-snug line-clamp-2 transition-colors" style={{ fontSize: 12, color: '#ccccdd' }}>{g.title}</p>
              {(g.genre || g.players) && <p style={{ fontSize: 10, color: '#555566', marginTop: 2 }}>{g.genre || g.players}</p>}
            </div>
            {i < 3 && <div className="shrink-0" style={{ width: 5, height: 5, borderRadius: '50%', background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />}
          </Link>
        ))}
      </div>
      <Link to="/gaming" className="flex items-center justify-center gap-1.5 transition-colors"
        style={{ padding: '9px 12px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#444455', borderTop: '1px solid #1a1a28' }}
        onMouseEnter={e => { e.currentTarget.style.color = GREEN; e.currentTarget.style.background = 'rgba(16,185,129,0.04)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#444455'; e.currentTarget.style.background = 'transparent'; }}>
        See all top games <ChevronRight size={9} />
      </Link>
    </div>
  );
}

function AnticipatedGamesWidget() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    api.get('/games/', { params: { game_type: 'anticipated', page_size: 6, ordering: 'rank' } })
      .then(({ data }) => setGames(data.results || data))
      .catch(() => {});
  }, []);

  if (!games.length) return null;

  return (
    <div>
      <WidgetHeader title="Most Anticipated" icon={Flame} color="#f97316" href="/gaming" />
      <div className="flex flex-col gap-px bg-[#1a1a28]">
        {games.map(g => (
          <Link key={g.id} to={`/games/${g.slug}`} className="flex items-center gap-3 p-2.5 bg-[#0d0d18] hover:bg-[#12121e] transition-colors group">
            <div className="shrink-0 w-8 h-10 overflow-hidden rounded-sm bg-[#111120]">
              {g.cover_image && <img src={g.cover_image} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { e.currentTarget.style.display = 'none'; }} />}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-white leading-snug line-clamp-1 group-hover:text-[#f97316] transition-colors">{g.title}</p>
              {g.release_display && <p className="text-[10px] text-[#555566] mt-0.5">{g.release_display}</p>}
            </div>
          </Link>
        ))}
      </div>
      <Link to="/gaming" className="flex items-center justify-center gap-1 mt-1 py-2 text-[10px] font-black uppercase tracking-widest text-white border border-[#1a1a28] hover:border-[#f97316] hover:text-[#f97316] transition-colors">
        Most Anticipated <ChevronRight size={9} />
      </Link>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="flex flex-col gap-8">
      <LatestNewsWidget categorySlug="esports" />
      <TopArticlesWidget />
      <LatestNewsWidget categorySlug="gaming" />
      <PopularGamesWidget />
      <AnticipatedGamesWidget />
    </aside>
  );
}

/* ─── Period helper ──────────────────────────────────────────────────────────── */
function periodToDate(period) {
  if (!period) return null;
  const now = new Date();
  if (period === 'today') { const d = new Date(now); d.setHours(0,0,0,0); return d.toISOString(); }
  if (period === 'week')  { const d = new Date(now); d.setDate(d.getDate() - 7); return d.toISOString(); }
  if (period === 'month') { const d = new Date(now); d.setMonth(d.getMonth() - 1); return d.toISOString(); }
  return null;
}

/* ─── Root ───────────────────────────────────────────────────────────────────── */
export default function EsportPage() {
  const [articles,    setArticles]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [nextPage,    setNextPage]    = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sort,        setSort]        = useState('-published_at');
  const [search,      setSearch]      = useState('');
  const [period,      setPeriod]      = useState('');
  const [type,        setType]        = useState('');
  const debounceRef = useRef(null);

  const buildParams = useCallback((q) => {
    const params = { status: 'publie', category__slug: SLUG, ordering: sort };
    if (q?.trim())           params.search            = q.trim();
    if (type === 'featured') params.is_featured       = true;
    if (type === 'breaking') params.is_breaking       = true;
    const since = periodToDate(period);
    if (since)               params.published_at__gte = since;
    return params;
  }, [sort, type, period]);

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

  useEffect(() => { fetchData(); }, [sort, period, type]);
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

  const hasActiveFilter = search || period || type;

  const resultTitle = (() => {
    if (search)              return `Results for "${search}"`;
    if (type === 'featured') return 'Featured Articles';
    if (type === 'breaking') return 'Breaking News';
    if (period === 'today')  return "Today's Esports News";
    if (period === 'week')   return 'This Week in Esports';
    if (period === 'month')  return 'This Month in Esports';
    return 'Latest Esports News';
  })();

  return (
    <div className="text-white">
      <FontImport />
      <div className="max-w-[1280px] mx-auto px-22 py-8">

        <SectionHeader title="Esports"  color={ACCENT} />

        {/* <LiveMatchesStrip /> */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          <div>
            <FilterBar
              search={search}  onSearch={handleSearch}
              sort={sort}      onSort={s => setSort(s)}
              period={period}  onPeriod={p => setPeriod(p)}
              type={type}      onType={t => setType(t)}
            />

            {/* Result title */}
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <h2 className="text-[22px] font-black uppercase tracking-tight text-white leading-none">
                  {resultTitle}
                </h2>
                {!loading && (
                  <p className="text-[11px] text-[#444455] mt-1.5 font-semibold uppercase tracking-widest">
                    {articles.length}{nextPage ? '+' : ''} article{articles.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              {hasActiveFilter && (
                <button
                  onClick={() => { setSearch(''); setPeriod(''); setType(''); }}
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
                {articles.map(a => <ArticleListItem key={a.slug} article={a} />)}
              </div>
            ) : (
              <p className="text-center text-[#555566] py-24 text-sm">
                {hasActiveFilter ? 'No articles match your filters.' : 'No articles found in this category yet.'}
              </p>
            )}

            {!loading && nextPage && (
              <div className="flex justify-center pt-6 pb-10">
                <button onClick={loadMore} disabled={loadingMore}
                  className="flex items-center gap-2 px-8 py-3 text-[13px] font-black uppercase tracking-widest text-white disabled:opacity-40 transition-all"
                  style={{ background: loadingMore ? '#1a1a28' : ACCENT }}>
                  {loadingMore
                    ? <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                    : <ChevronDown size={15} strokeWidth={3} />}
                  {loadingMore ? 'Loading…' : 'Load More'}
                </button>
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:border-l lg:border-[#1a1a28] lg:pl-8">
            <Sidebar />
          </div>
        </div>

        <PopularGames />
        <AnticipatedGames />

      </div>
    </div>
  );
}
