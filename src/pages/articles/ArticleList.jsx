import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus, Search, ChevronLeft, ChevronRight,
  SlidersHorizontal, X,
} from 'lucide-react';
import api from '../../api/axios';
import DeleteModal from '../../components/DeleteModal';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import ArticleTable from './ArticleTable';

/* ─── Status filter options ─────────────────────────────────────────── */
const STATUS_OPTIONS = [
  { value: '',            label: 'All',       colorRgb: '255,255,255'  },
  { value: 'nouveau',     label: 'New',       colorRgb: '96,165,250'   },
  { value: 'brouillon_ia',label: 'AI Draft',  colorRgb: '250,204,21'   },
  { value: 'en_revision', label: 'In Review', colorRgb: '251,146,60'   },
  { value: 'publie',      label: 'Published', colorRgb: '74,222,128'   },
  { value: 'archive',     label: 'Archived',  colorRgb: '107,114,128'  },
];

/* ─── Metric card (header stats) ────────────────────────────────────── */
function MetricCard({ label, value, colorRgb, icon: Icon }) {
  return (
    <div
      className="relative flex flex-col gap-1 px-4 pt-3 pb-3 rounded-xl min-w-[110px]"
      style={{
        background: `rgba(${colorRgb},0.06)`,
        border: `1px solid rgba(${colorRgb},0.15)`,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-4 right-4 h-[2px] rounded-b-full"
        style={{ background: `linear-gradient(90deg, rgba(${colorRgb},0.8), rgba(${colorRgb},0.2))` }}
      />
      <div className="flex items-center justify-between gap-3">
        <span
          className="text-2xl font-black tracking-tighter leading-none"
          style={{ color: `rgb(${colorRgb})` }}
        >
          {value ?? '—'}
        </span>
        {Icon && (
          <div
            className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0"
            style={{ background: `rgba(${colorRgb},0.1)` }}
          >
            <Icon size={13} style={{ color: `rgb(${colorRgb})` }} />
          </div>
        )}
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: `rgba(${colorRgb},0.6)` }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Status filter pill ────────────────────────────────────────────── */
function StatusPill({ active, onClick, colorRgb, children }) {
  return (
    <button
      onClick={onClick}
      className="relative text-[11px] font-bold px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 tracking-wide"
      style={
        active
          ? {
              background: `rgba(${colorRgb},0.12)`,
              color: `rgb(${colorRgb})`,
              border: `1px solid rgba(${colorRgb},0.3)`,
              boxShadow: `0 0 12px rgba(${colorRgb},0.15)`,
            }
          : {
              background: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.35)',
              border: '1px solid rgba(255,255,255,0.07)',
            }
      }
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = `rgba(${colorRgb},0.07)`;
          e.currentTarget.style.color = `rgba(${colorRgb},0.8)`;
          e.currentTarget.style.borderColor = `rgba(${colorRgb},0.2)`;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        }
      }}
    >
      {active && (
        /* Active indicator dot */
        <span
          className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
          style={{ background: `rgb(${colorRgb})`, boxShadow: `0 0 6px rgb(${colorRgb})` }}
        />
      )}
      {children}
    </button>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function ArticleList() {
  const { canEdit, canDelete } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles]         = useState([]);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalCount, setTotalCount]     = useState(0);
  const [loading, setLoading]           = useState(true);
  const [categories, setCategories]     = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [stats, setStats]               = useState({});
  const [searchInput, setSearchInput]   = useState('');

  const page     = parseInt(searchParams.get('page') || '1');
  const search   = searchParams.get('search') || '';
  const status   = searchParams.get('status') || '';
  const category = searchParams.get('category') || '';

  // Sync local search input with URL param on mount
  useEffect(() => { setSearchInput(search); }, []);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search)   params.search   = search;
      if (status)   params.status   = status;
      if (category) params.category = category;
      const { data } = await api.get('/articles/', { params });
      setArticles(data.results);
      setTotalCount(data.count ?? 0);
      setTotalPages(Math.ceil((data.count ?? 0) / 20));
    } catch {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, category]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  // Fetch aggregate stats (best-effort — uses unfiltered counts)
  useEffect(() => {
    Promise.all(
      ['publie', 'en_revision', 'brouillon_ia', 'nouveau'].map((s) =>
        api.get('/articles/', { params: { status: s, page_size: 1 } })
          .then(({ data }) => ({ [s]: data.count ?? 0 }))
          .catch(() => ({ [s]: 0 }))
      )
    ).then((results) => setStats(Object.assign({}, ...results)));
  }, []);

  useEffect(() => {
    api.get('/categories/', { params: { page_size: 100 } })
      .then(({ data }) => setCategories(data.results))
      .catch(() => {});
  }, []);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasFilters = search || status || category;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { updateParam('search', searchInput); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleAction = async (action, article) => {
    try {
      if (action === 'delete') { setDeleteTarget(article); return; }
      if (action === 'publish') await api.post(`/articles/${article.id}/publish/`);
      if (action === 'archive') await api.post(`/articles/${article.id}/archive/`);
      toast.success(`Article ${action}d`);
      fetchArticles();
    } catch {
      toast.error(`Failed to ${action} article`);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/articles/${deleteTarget.id}/`);
      toast.success('Article deleted');
      setDeleteTarget(null);
      fetchArticles();
    } catch {
      toast.error('Failed to delete article');
    }
  };

  /* ── Page range for pagination ── */
  const getPageNumbers = () => {
    const range = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) range.push(i);
    return range;
  };

  return (
    <div className="space-y-5">

      {/* ════════════════════════════════════════════════════════════
          HEADER AREA
      ════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        {/* Breadcrumb + title */}
        <div>
         

          <div className="flex items-baseline gap-3">
            <h1 className="text-[48px] font-black uppercase tracking-tighter text-white leading-none">Articles</h1>
           
          </div>
          <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Manage, publish, and organise your content library
          </p>
        </div>

        {/* Right side: metric cards + CTA */}
        <div className="flex items-center gap-3 flex-wrap">
          

          {canEdit && (
            <Link
              to="/admin/articles/new"
              className="flex items-center gap-2 px-4 py-3 text-[13px] font-black text-white tracking-wide shrink-0 select-none"
              style={{
                background: 'linear-gradient(135deg, var(--color-orange) 0%, #e05500 100%)',
                boxShadow: '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
                transform: 'translateY(-3px)',
                transition: 'transform 0.08s ease, box-shadow 0.08s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 0 #a33a00, 0 12px 24px rgba(255,107,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 0 #a33a00, 0 4px 8px rgba(255,107,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
            >
              <Plus size={15} strokeWidth={3} />
              New Article
            </Link>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          FILTER BAR
      ════════════════════════════════════════════════════════════ */}
      <div
        className="overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #161618 0%, #111113 100%)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
        }}
      >
        {/* Top accent line on the filter card */}
        <div className="h-[1.5px] w-full" style={{ background: 'linear-gradient(90deg, rgba(255,107,0,0.6) 0%, rgba(255,107,0,0.0) 60%)' }} />

        {/* Row 1: search + category + clear */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">

          {/* Search input */}
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.22)' }} />
            <input
              type="text"
              placeholder="Search articles…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search articles"
              className="w-full text-[13px] rounded-xl pl-9 pr-9 py-2.5 transition-all duration-150"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.88)',
                outline: 'none',
                caretColor: 'var(--color-orange)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,107,0,0.45)';
                e.currentTarget.style.background = 'rgba(255,107,0,0.035)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.07)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full transition-colors"
                style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              >
                <X size={9} />
              </button>
            )}
          </div>

          {/* Separator */}
          <div className="h-7 w-px shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }} />

          {/* Category dropdown */}
          <div className="relative shrink-0">
            <SlidersHorizontal size={12} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.22)' }} />
            <select
              value={category}
              onChange={(e) => updateParam('category', e.target.value)}
              aria-label="Filter by category"
              className="text-[12px] font-medium rounded-xl pl-8 pr-7 py-2.5 appearance-none transition-all duration-150 cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: category ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.32)',
                outline: 'none',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.45)'; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <option value="" style={{ background: '#161618', color: '#fff' }}>All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} style={{ background: '#161618', color: '#fff' }}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Clear all filters */}
          {hasFilters && (
            <>
              <div className="h-7 w-px shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }} />
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2.5 rounded-xl transition-all duration-150 whitespace-nowrap"
                style={{
                  background: 'rgba(248,113,113,0.07)',
                  color: '#f87171',
                  border: '1px solid rgba(248,113,113,0.16)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,0.13)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,0.07)'; }}
              >
                <X size={11} /> Clear all
              </button>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="mx-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

        {/* Row 2: status filter pills */}
        <div className="flex items-center gap-1.5 px-4 py-3 flex-wrap">
          {STATUS_OPTIONS.map(({ value, label, colorRgb }) => (
            <StatusPill
              key={value}
              active={status === value}
              onClick={() => updateParam('status', value)}
              colorRgb={colorRgb}
            >
              {label}
            </StatusPill>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          ARTICLE TABLE
      ════════════════════════════════════════════════════════════ */}
      <ArticleTable
        articles={articles}
        loading={loading}
        canEdit={canEdit}
        canDelete={canDelete}
        onAction={handleAction}
        hasFilters={!!hasFilters}
        clearFilters={clearFilters}
      />

      {/* ════════════════════════════════════════════════════════
          PAGINATION
      ════════════════════════════════════════════════════════ */}
      {!loading && totalPages > 1 && (
        <div
          className="flex items-center justify-between px-5 py-3 rounded-2xl"
          style={{
            background: 'linear-gradient(160deg, #161618 0%, #111113 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Page info */}
          <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.22)' }}>
            Page{' '}
            <span className="font-bold" style={{ color: 'rgba(255,255,255,0.65)' }}>{page}</span>
            {' '}of{' '}
            <span className="font-bold" style={{ color: 'rgba(255,255,255,0.65)' }}>{totalPages}</span>
            <span
              className="ml-2 pl-2"
              style={{ color: 'rgba(255,255,255,0.15)', borderLeft: '1px solid rgba(255,255,255,0.1)' }}
            >
              {totalCount.toLocaleString()} total
            </span>
          </span>

          {/* Page buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateParam('page', String(page - 1))}
              disabled={page <= 1}
              aria-label="Previous page"
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-100 disabled:opacity-20 disabled:cursor-not-allowed"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}
              onMouseEnter={(e) => { if (page > 1) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              <ChevronLeft size={14} />
            </button>

            {getPageNumbers()[0] > 1 && (
              <>
                <button
                  onClick={() => updateParam('page', '1')}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-[12px] font-bold transition-all duration-100"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                >1</button>
                {getPageNumbers()[0] > 2 && (
                  <span className="w-8 h-8 flex items-center justify-center text-[12px]" style={{ color: 'rgba(255,255,255,0.18)' }}>…</span>
                )}
              </>
            )}

            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => updateParam('page', String(p))}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-[12px] font-bold transition-all duration-100"
                style={p === page
                  ? { background: 'rgba(255,107,0,0.16)', color: 'var(--color-orange)', border: '1px solid rgba(255,107,0,0.35)', boxShadow: '0 0 12px rgba(255,107,0,0.2)' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }
                }
                onMouseEnter={(e) => { if (p !== page) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                onMouseLeave={(e) => { if (p !== page) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >{p}</button>
            ))}

            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                  <span className="w-8 h-8 flex items-center justify-center text-[12px]" style={{ color: 'rgba(255,255,255,0.18)' }}>…</span>
                )}
                <button
                  onClick={() => updateParam('page', String(totalPages))}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-[12px] font-bold transition-all duration-100"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                >{totalPages}</button>
              </>
            )}

            <button
              onClick={() => updateParam('page', String(page + 1))}
              disabled={page >= totalPages}
              aria-label="Next page"
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-100 disabled:opacity-20 disabled:cursor-not-allowed"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}
              onMouseEnter={(e) => { if (page < totalPages) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <DeleteModal
          title="Delete Article"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
