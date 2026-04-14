import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Plus, Search, ChevronLeft, ChevronRight, X, Pencil, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import DeleteModal from '../../components/DeleteModal';
import toast from 'react-hot-toast';
import UserForm from './UserForm';

/* ─── Role / status config ───────────────────────────────────── */
const ROLE_MAP = {
  admin:   { label: 'Admin',  colorRgb: '255,107,0'   },
  editor:  { label: 'Editor', colorRgb: '96,165,250'  },
  viewer:  { label: 'Viewer', colorRgb: '156,163,175' },
};

/* ─── Role badge ─────────────────────────────────────────────── */
function RoleBadge({ role }) {
  const cfg = ROLE_MAP[role] || { label: role, colorRgb: '156,163,175' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 20,
      background: `rgba(${cfg.colorRgb},0.1)`,
      border: `1px solid rgba(${cfg.colorRgb},0.25)`,
      color: `rgb(${cfg.colorRgb})`,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
    }}>
      {cfg.label}
    </span>
  );
}

/* ─── Active badge ───────────────────────────────────────────── */
function ActiveBadge({ active }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 20,
      background: active ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
      border: active ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(248,113,113,0.2)',
      color: active ? 'rgb(74,222,128)' : 'rgb(248,113,113)',
      fontSize: 11, fontWeight: 700,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────── */
function UserAvatar({ username, role }) {
  const cfg = ROLE_MAP[role] || { colorRgb: '156,163,175' };
  return (
    <div style={{
      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `rgba(${cfg.colorRgb},0.15)`,
      border: `1.5px solid rgba(${cfg.colorRgb},0.3)`,
      fontSize: 12, fontWeight: 800, color: `rgb(${cfg.colorRgb})`,
      letterSpacing: '-0.01em',
    }}>
      {(username || '?')[0].toUpperCase()}
    </div>
  );
}

/* ─── Table row ──────────────────────────────────────────────── */
function UserRow({ row, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '52px 1fr 200px 110px 100px 90px',
        alignItems: 'center',
        padding: '0 20px',
        minHeight: 58,
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: hovered ? 'rgba(255,255,255,0.025)' : 'transparent',
        transition: 'background .1s',
        position: 'relative',
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: '0 2px 2px 0',
        background: hovered ? 'rgba(255,107,0,0.35)' : 'transparent',
        transition: 'background .12s',
      }} />

      {/* Avatar */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <UserAvatar username={row.username} role={row.user_type} />
      </div>

      {/* Username */}
      <div style={{ paddingRight: 16, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.username}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', display: 'block', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.email}
        </span>
      </div>

      {/* Email (hidden — shown in username sub-row above) */}
      <div style={{ paddingRight: 16 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
          {row.email}
        </span>
      </div>

      {/* Role */}
      <div style={{ paddingRight: 16 }}>
        <RoleBadge role={row.user_type} />
      </div>

      {/* Status */}
      <div>
        <ActiveBadge active={row.is_active} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <button
          onClick={e => { e.stopPropagation(); onEdit(); }}
          style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid transparent', color: 'rgba(96,165,250,0.5)', cursor: 'pointer', transition: 'all .12s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.08)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.2)'; e.currentTarget.style.color = 'rgb(96,165,250)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'rgba(96,165,250,0.5)'; }}
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid transparent', color: 'rgba(248,113,113,0.5)', cursor: 'pointer', transition: 'all .12s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)'; e.currentTarget.style.color = 'rgb(248,113,113)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'rgba(248,113,113,0.5)'; }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════ */
export default function UserList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers]           = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchInput, setSearchInput]   = useState('');
  const [formState, setFormState]       = useState(null);

  const page   = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';

  useEffect(() => { setSearchInput(search); }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      const { data } = await api.get('/auth/users/', { params });
      setUsers(data.results);
      setTotalCount(data.count ?? 0);
      setTotalPages(Math.ceil((data.count ?? 0) / 20));
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

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

  const confirmDelete = async () => {
    try {
      await api.delete(`/auth/users/${deleteTarget.id}/`);
      toast.success('User deleted');
      setDeleteTarget(null);
      fetchData();
    } catch { toast.error('Failed to delete user'); }
  };

  const getPageNumbers = () => {
    const range = []; const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) range.push(i);
    return range;
  };

  return (
    <div className="space-y-5">

      {/* ══ HEADER ══ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[48px] font-black uppercase tracking-tighter text-white leading-none">Users</h1>
          <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Manage CMS accounts and access permissions
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setFormState({ editId: null })}
            className="flex items-center gap-2 px-4 py-3 text-[13px] font-black text-white tracking-wide shrink-0 select-none"
            style={{
              background: 'linear-gradient(135deg, var(--color-orange) 0%, #e05500 100%)',
              boxShadow: '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
              transform: 'translateY(-3px)', transition: 'transform 0.08s ease, box-shadow 0.08s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 0 #a33a00, 0 12px 24px rgba(255,107,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseDown={e  => { e.currentTarget.style.boxShadow = '0 2px 0 #a33a00, 0 4px 8px rgba(255,107,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0px)'; }}
            onMouseUp={e    => { e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
          >
            <Plus size={15} strokeWidth={3} />
            New User
          </button>
        </div>
      </div>

      {/* ══ FILTER BAR ══ */}
      <div
        className="overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#161618 0%,#111113 100%)', boxShadow: '0 2px 16px rgba(0,0,0,0.3)' }}
      >
        <div className="h-[1.5px] w-full" style={{ background: 'linear-gradient(90deg,rgba(255,107,0,0.6) 0%,rgba(255,107,0,0) 60%)' }} />
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.22)' }} />
            <input
              type="text"
              placeholder="Search users…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full text-[13px] rounded-xl pl-9 pr-9 py-2.5 transition-all duration-150"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.88)', outline: 'none', caretColor: 'var(--color-orange)' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.45)'; e.currentTarget.style.background = 'rgba(255,107,0,0.035)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.07)'; }}
              onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full"
                style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <X size={9} />
              </button>
            )}
          </div>
          {search && (
            <>
              <div className="h-7 w-px shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }} />
              <button
                onClick={() => { setSearchInput(''); setSearchParams({}); }}
                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2.5 rounded-xl whitespace-nowrap"
                style={{ background: 'rgba(248,113,113,0.07)', color: '#f87171', border: '1px solid rgba(248,113,113,0.16)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.13)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.07)'}
              >
                <X size={11} /> Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* ══ TABLE ══ */}
      <div style={{
        background: 'linear-gradient(160deg,#161618 0%,#111113 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '52px 1fr 200px 110px 100px 90px',
          padding: '0 20px', height: 40,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          alignItems: 'center',
        }}>
          {['', 'User', 'Email', 'Role', 'Status', 'Actions'].map((h, i) => (
            <div key={i} style={{
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
        ) : users.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, gap: 8 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>No users found</span>
            {search && (
              <button
                onClick={() => { setSearchInput(''); setSearchParams({}); }}
                style={{ fontSize: 11, color: 'rgba(255,107,0,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          users.map(row => (
            <UserRow
              key={row.id}
              row={row}
              onEdit={() => setFormState({ editId: row.id })}
              onDelete={() => setDeleteTarget(row)}
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
              onMouseEnter={e => { if (page > 1) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            ><ChevronLeft size={14} /></button>

            {getPageNumbers().map(p => (
              <button key={p} onClick={() => updateParam('page', String(p))}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-[12px] font-bold transition-all"
                style={p === page
                  ? { background: 'rgba(255,107,0,0.16)', color: 'var(--color-orange)', border: '1px solid rgba(255,107,0,0.35)', boxShadow: '0 0 12px rgba(255,107,0,0.2)' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }
                }
                onMouseEnter={e => { if (p !== page) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                onMouseLeave={e => { if (p !== page) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >{p}</button>
            ))}

            <button onClick={() => updateParam('page', String(page + 1))} disabled={page >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}
              onMouseEnter={e => { if (page < totalPages) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            ><ChevronRight size={14} /></button>
          </div>
        </div>
      )}

      {/* ══ DELETE MODAL ══ */}
      {deleteTarget && (
        <DeleteModal
          title="Delete User"
          message={`Delete "${deleteTarget.username}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ══ FORM OVERLAY ══ */}
      <AnimatePresence>
        {formState && (
          <UserForm
            editId={formState.editId}
            onClose={() => setFormState(null)}
            onSaved={() => { setFormState(null); fetchData(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
