import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Plus, Search, ChevronLeft, ChevronRight, X,
  ExternalLink, Pencil, Trash2, CheckSquare, Square, MinusSquare,
} from 'lucide-react';
import api from '../../api/axios';
import DeleteModal from '../../components/DeleteModal';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import RawNewsForm from './RawNewsForm';

/* ─── Status config ──────────────────────────────────────────── */
const STATUS_OPTIONS = [
  { value: '',        label: 'All',       colorRgb: '255,255,255' },
  { value: 'nouveau', label: 'New',       colorRgb: '96,165,250'  },
  { value: 'traite',  label: 'Processed', colorRgb: '74,222,128'  },
  { value: 'ignore',  label: 'Ignored',   colorRgb: '107,114,128' },
];

const STATUS_MAP = {
  nouveau: { label: 'New',       colorRgb: '96,165,250'  },
  traite:  { label: 'Processed', colorRgb: '74,222,128'  },
  ignore:  { label: 'Ignored',   colorRgb: '107,114,128' },
};

/* ─── Filter pill ────────────────────────────────────────────── */
function StatusPill({ active, onClick, colorRgb, children }) {
  return (
    <button
      onClick={onClick}
      className="relative text-[11px] font-bold px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 tracking-wide"
      style={
        active
          ? { background: `rgba(${colorRgb},0.12)`, color: `rgb(${colorRgb})`, border: `1px solid rgba(${colorRgb},0.3)`, boxShadow: `0 0 12px rgba(${colorRgb},0.15)` }
          : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)' }
      }
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = `rgba(${colorRgb},0.07)`; e.currentTarget.style.color = `rgba(${colorRgb},0.8)`; e.currentTarget.style.borderColor = `rgba(${colorRgb},0.2)`; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; } }}
    >
      {active && <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle" style={{ background: `rgb(${colorRgb})`, boxShadow: `0 0 6px rgb(${colorRgb})` }} />}
      {children}
    </button>
  );
}

/* ─── Checkbox ───────────────────────────────────────────────── */
function Checkbox({ checked, indeterminate, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .12s', cursor: 'pointer',
        background: checked ? 'rgba(255,107,0,0.15)' : 'transparent',
        border: checked ? '1.5px solid rgba(255,107,0,0.7)' : '1.5px solid rgba(255,255,255,0.15)',
        boxShadow: checked ? '0 0 8px rgba(255,107,0,0.25)' : 'none',
      }}
    >
      {checked && <span style={{ width: 8, height: 8, borderRadius: 2, background: '#FF6B00', display: 'block' }} />}
      {!checked && indeterminate && <span style={{ width: 8, height: 2, borderRadius: 1, background: 'rgba(255,107,0,0.5)', display: 'block' }} />}
    </button>
  );
}

/* ─── Status badge ───────────────────────────────────────────── */
function RawStatusBadge({ status }) {
  const cfg = STATUS_MAP[status] || { label: status, colorRgb: '107,114,128' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 20,
      background: `rgba(${cfg.colorRgb},0.1)`,
      border: `1px solid rgba(${cfg.colorRgb},0.25)`,
      color: `rgb(${cfg.colorRgb})`,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: `rgb(${cfg.colorRgb})`, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

/* ─── Table row ──────────────────────────────────────────────── */
function RawNewsRow({ row, checked, onToggle, onEdit, onDelete, canEdit, canDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '44px 1fr 180px 100px 130px 110px 90px',
        alignItems: 'center',
        gap: 0,
        padding: '0 20px',
        minHeight: 54,
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: checked ? 'rgba(255,107,0,0.04)' : hovered ? 'rgba(255,255,255,0.025)' : 'transparent',
        transition: 'background .1s',
        position: 'relative',
        cursor: 'default',
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: '0 2px 2px 0',
        background: checked ? 'rgba(255,107,0,0.7)' : hovered ? 'rgba(255,107,0,0.35)' : 'transparent',
        transition: 'background .12s',
      }} />

      {/* Checkbox */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Checkbox checked={checked} onClick={(e) => { e.stopPropagation(); onToggle(); }} />
      </div>

      {/* Title */}
      <div style={{ paddingRight: 16, minWidth: 0 }}>
        <span style={{
          display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          fontSize: 13, fontWeight: 600, color: '#fff',
        }}>
          {row.title || `#${row.id}`}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 1, display: 'block' }}>
          #{row.id}
        </span>
      </div>

      {/* URL */}
      <div style={{ paddingRight: 16, minWidth: 0 }}>
        {row.url ? (
          <a
            href={row.url} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'rgba(96,165,250,0.8)', fontSize: 11, textDecoration: 'none', maxWidth: '100%' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgb(96,165,250)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(96,165,250,0.8)'; }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{row.url}</span>
            <ExternalLink size={10} style={{ flexShrink: 0 }} />
          </a>
        ) : (
          <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11 }}>—</span>
        )}
      </div>

      {/* Status */}
      <div><RawStatusBadge status={row.status} /></div>

      {/* Source */}
      <div>
        <span style={{ fontSize: 12, color: row.source ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)' }}>
          {row.source || '—'}
        </span>
      </div>

      {/* Created */}
      <div>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>
          {new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        {canEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid transparent', color: 'rgba(96,165,250,0.5)', cursor: 'pointer', transition: 'all .12s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(96,165,250,0.08)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.2)'; e.currentTarget.style.color = 'rgb(96,165,250)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'rgba(96,165,250,0.5)'; }}
          >
            <Pencil size={13} />
          </button>
        )}
        {canDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid transparent', color: 'rgba(248,113,113,0.5)', cursor: 'pointer', transition: 'all .12s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)'; e.currentTarget.style.color = 'rgb(248,113,113)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'rgba(248,113,113,0.5)'; }}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════ */
export default function RawNewsList() {
  const { canEdit, canDelete } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rawNews, setRawNews]       = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selected, setSelected]     = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Overlay form state: null = closed, { editId: number|null } = open
  const [formState, setFormState] = useState(null);

  const page   = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  useEffect(() => { setSearchInput(search); }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      if (status) params.status = status;
      const { data } = await api.get('/raw-news/', { params });
      setRawNews(data.results);
      setTotalCount(data.count ?? 0);
      setTotalPages(Math.ceil((data.count ?? 0) / 20));
    } catch { toast.error('Failed to load raw news'); }
    finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setSelected(new Set()); }, [page, search, status]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { updateParam('search', searchInput); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const toggleSelect = (id) => {
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const toggleAll = () => {
    setSelected(selected.size === rawNews.length ? new Set() : new Set(rawNews.map((r) => r.id)));
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/raw-news/${deleteTarget.id}/`);
      toast.success('Deleted');
      setDeleteTarget(null);
      setSelected((prev) => { const next = new Set(prev); next.delete(deleteTarget.id); return next; });
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const confirmBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      await api.post('/raw-news/bulk-delete/', { ids: [...selected] });
      toast.success(`Deleted ${selected.size} item(s)`);
      setSelected(new Set()); setShowBulkDelete(false);
      fetchData();
    } catch { toast.error('Failed to bulk delete'); }
    finally { setBulkDeleting(false); }
  };

  const bulkUpdateStatus = async (newStatus) => {
    try {
      await api.post('/raw-news/bulk-status/', { ids: [...selected], status: newStatus });
      toast.success(`Updated ${selected.size} item(s)`);
      setSelected(new Set()); fetchData();
    } catch { toast.error('Failed to update status'); }
  };

  const allSelected  = rawNews.length > 0 && selected.size === rawNews.length;
  const someSelected = selected.size > 0 && selected.size < rawNews.length;

  const getPageNumbers = () => {
    const range = []; const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) range.push(i);
    return range;
  };

  return (
    <div className="space-y-5">

      {/* ══ HEADER ══ */}
      <div className=" flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-[48px] font-black uppercase tracking-tighter text-white leading-none">Raw News</h1>
          </div>
          <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Ingested articles pending review and processing
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {canEdit && (
            <button
              onClick={() => setFormState({ editId: null })}
              className="flex items-center gap-2 px-4 py-3 text-[13px] font-black text-white tracking-wide shrink-0 select-none"
              style={{
                background: 'linear-gradient(135deg, var(--color-orange) 0%, #e05500 100%)',
                boxShadow: '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
                transform: 'translateY(-3px)',
                transition: 'transform 0.08s ease, box-shadow 0.08s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 0 #a33a00, 0 12px 24px rgba(255,107,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseDown={(e)  => { e.currentTarget.style.boxShadow = '0 2px 0 #a33a00, 0 4px 8px rgba(255,107,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0px)'; }}
              onMouseUp={(e)    => { e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            >
              <Plus size={15} strokeWidth={3} />
              New Raw News
            </button>
          )}
        </div>
      </div>

      {/* ══ BULK ACTION BAR ══ */}
      {selected.size > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'linear-gradient(160deg,#161618,#111113)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span className="text-sm font-bold text-white">{selected.size} selected</span>
          <div className="flex gap-2 ml-auto flex-wrap">
            {canEdit && (
              <>
                <button onClick={() => bulkUpdateStatus('nouveau')}
                  className="px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors"
                  style={{ background: 'rgba(96,165,250,0.08)', color: 'rgb(96,165,250)', border: '1px solid rgba(96,165,250,0.2)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(96,165,250,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(96,165,250,0.08)'}
                >Mark New</button>
                <button onClick={() => bulkUpdateStatus('traite')}
                  className="px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors"
                  style={{ background: 'rgba(74,222,128,0.08)', color: 'rgb(74,222,128)', border: '1px solid rgba(74,222,128,0.2)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(74,222,128,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(74,222,128,0.08)'}
                >Mark Processed</button>
                <button onClick={() => bulkUpdateStatus('ignore')}
                  className="px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors"
                  style={{ background: 'rgba(107,114,128,0.08)', color: 'rgb(156,163,175)', border: '1px solid rgba(107,114,128,0.2)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(107,114,128,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(107,114,128,0.08)'}
                >Mark Ignored</button>
              </>
            )}
            {canDelete && (
              <button onClick={() => setShowBulkDelete(true)}
                className="px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors"
                style={{ background: 'rgba(248,113,113,0.08)', color: 'rgb(248,113,113)', border: '1px solid rgba(248,113,113,0.2)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
              >Delete Selected</button>
            )}
            <button onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >Clear</button>
          </div>
        </div>
      )}

      {/* ══ FILTER BAR ══ */}
      <div
        className="overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#161618 0%,#111113 100%)', boxShadow: '0 2px 16px rgba(0,0,0,0.3)' }}
      >
        <div className="h-[1.5px] w-full" style={{ background: 'linear-gradient(90deg,rgba(255,107,0,0.6) 0%,rgba(255,107,0,0) 60%)' }} />

        {/* Row 1: search + clear */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.22)' }} />
            <input
              type="text"
              placeholder="Search raw news…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full text-[13px] rounded-xl pl-9 pr-9 py-2.5 transition-all duration-150"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.88)', outline: 'none', caretColor: 'var(--color-orange)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.45)'; e.currentTarget.style.background = 'rgba(255,107,0,0.035)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.07)'; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full transition-colors"
                style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <X size={9} />
              </button>
            )}
          </div>
          {(search || status) && (
            <>
              <div className="h-7 w-px shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }} />
              <button
                onClick={() => { setSearchInput(''); setSearchParams({}); }}
                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2.5 rounded-xl whitespace-nowrap"
                style={{ background: 'rgba(248,113,113,0.07)', color: '#f87171', border: '1px solid rgba(248,113,113,0.16)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.13)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.07)'}
              >
                <X size={11} /> Clear all
              </button>
            </>
          )}
        </div>

        <div className="mx-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

        {/* Row 2: status pills */}
        <div className="flex items-center gap-1.5 px-4 py-3 flex-wrap">
          {STATUS_OPTIONS.map(({ value, label, colorRgb }) => (
            <StatusPill key={value} active={status === value} onClick={() => updateParam('status', value)} colorRgb={colorRgb}>
              {label}
            </StatusPill>
          ))}
        </div>
      </div>

      {/* ══ TABLE ══ */}
      <div style={{
        background: 'linear-gradient(160deg,#161618 0%,#111113 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '44px 1fr 180px 100px 130px 110px 90px',
          padding: '0 20px',
          height: 40,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          alignItems: 'center',
          gap: 0,
        }}>
          {/* Checkbox all */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={toggleAll} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 2 }}>
              {allSelected
                ? <CheckSquare size={14} style={{ color: '#FF6B00' }} />
                : someSelected
                ? <MinusSquare  size={14} style={{ color: 'rgba(255,107,0,0.6)' }} />
                : <Square       size={14} />}
            </button>
          </div>
          {['Title', 'URL', 'Status', 'Source', 'Created', 'Actions'].map((h, i) => (
            <div key={h} style={{
              fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)', paddingRight: i === 5 ? 0 : 16,
              textAlign: i === 5 ? 'right' : 'left',
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 160 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2.5px solid #FF6B00', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
          </div>
        ) : rawNews.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, gap: 8 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>No raw news found</span>
            {(search || status) && (
              <button
                onClick={() => { setSearchInput(''); setSearchParams({}); }}
                style={{ fontSize: 11, color: 'rgba(255,107,0,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          rawNews.map((row) => (
            <RawNewsRow
              key={row.id}
              row={row}
              checked={selected.has(row.id)}
              onToggle={() => toggleSelect(row.id)}
              onEdit={() => setFormState({ editId: row.id })}
              onDelete={() => setDeleteTarget(row)}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          ))
        )}
      </div>

      {/* ══ PAGINATION ══ */}
      {!loading && totalPages > 1 && (
        <div
          className="flex items-center justify-between px-5 py-3 rounded-2xl"
          style={{ background: 'linear-gradient(160deg,#161618 0%,#111113 100%)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.22)' }}>
            Page <span className="font-bold" style={{ color: 'rgba(255,255,255,0.65)' }}>{page}</span> of{' '}
            <span className="font-bold" style={{ color: 'rgba(255,255,255,0.65)' }}>{totalPages}</span>
            <span className="ml-2 pl-2" style={{ color: 'rgba(255,255,255,0.15)', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
              {totalCount.toLocaleString()} total
            </span>
          </span>

          <div className="flex items-center gap-1">
            <button onClick={() => updateParam('page', String(page - 1))} disabled={page <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}
              onMouseEnter={(e) => { if (page > 1) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            ><ChevronLeft size={14} /></button>

            {getPageNumbers().map((p) => (
              <button key={p} onClick={() => updateParam('page', String(p))}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-[12px] font-bold transition-all"
                style={p === page
                  ? { background: 'rgba(255,107,0,0.16)', color: 'var(--color-orange)', border: '1px solid rgba(255,107,0,0.35)', boxShadow: '0 0 12px rgba(255,107,0,0.2)' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }
                }
                onMouseEnter={(e) => { if (p !== page) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                onMouseLeave={(e) => { if (p !== page) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >{p}</button>
            ))}

            <button onClick={() => updateParam('page', String(page + 1))} disabled={page >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}
              onMouseEnter={(e) => { if (page < totalPages) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            ><ChevronRight size={14} /></button>
          </div>
        </div>
      )}

      {/* ══ DELETE MODALS ══ */}
      {deleteTarget && (
        <DeleteModal
          title="Delete Raw News"
          message={`Delete "${deleteTarget.title || `#${deleteTarget.id}`}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {showBulkDelete && (
        <DeleteModal
          title="Delete Selected"
          message={`Delete ${selected.size} item(s)? This cannot be undone.`}
          onConfirm={confirmBulkDelete}
          onCancel={() => setShowBulkDelete(false)}
        />
      )}

      {/* ══ FORM OVERLAY ══ */}
      <AnimatePresence>
        {formState && (
          <RawNewsForm
            editId={formState.editId}
            onClose={() => setFormState(null)}
            onSaved={() => { setFormState(null); fetchData(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
