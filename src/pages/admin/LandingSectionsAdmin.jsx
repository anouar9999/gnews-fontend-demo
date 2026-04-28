import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout, X, Save, Search, Plus, Trash2, GripVertical,
  ChevronDown, RefreshCw, CheckSquare, Square, Eye, EyeOff,
  Newspaper, Flame, Monitor, Swords, Film, Tag, Star,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { usePageTitle } from '../../context/PageTitleContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SECTION_META = {
  hero:      { label: 'Hero Section',    icon: Star,      color: '255,107,0',  desc: 'Main featured article + side stack' },
  trending:  { label: 'Trending Now',    icon: Flame,     color: '239,68,68',  desc: 'Horizontal trending carousel' },
  latest:    { label: 'Latest Grid',     icon: Newspaper, color: '59,130,246', desc: 'Latest news grid' },
  game_news: { label: 'Game News',       icon: Tag,       color: '168,85,247', desc: 'Game news banner + scroll' },
  hardware:  { label: 'Hardware',        icon: Monitor,   color: '52,211,153', desc: 'Hardware review spotlight' },
  esports:   { label: 'Esports',         icon: Swords,    color: '251,191,36', desc: 'Live match / esports feed' },
  culture:   { label: 'Culture',         icon: Film,      color: '251,113,133',desc: 'Culture & entertainment mix' },
  category:  { label: 'Category Block',  icon: Layout,    color: '96,165,250', desc: '4-column category grid' },
};

const inputStyle = {
  width: '100%', padding: '10px 13px',
  background: '#111111', border: '1px solid #2a2a2a',
  borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none',
  caretColor: '#FF6B00', transition: 'border-color .15s, box-shadow .15s',
};
const focusInput  = e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.07)'; };
const blurInput   = e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none'; };

// ─── Article picker modal ────────────────────────────────────────────────────
// Backdrop and modal are a single flex container so centering is viewport-
// independent and unaffected by any ancestor CSS transform (Framer Motion
// animates the drawer with translateX which would break a sibling position:fixed).

function ArticlePicker({ categories, selectedIds, onConfirm, onClose }) {
  const [q, setQ]                 = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [articles, setArticles]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [picked, setPicked]       = useState(new Set(selectedIds));

  const fetch = useCallback(async (search, slug) => {
    setLoading(true);
    try {
      const params = { ordering: '-created_at', page_size: 100 };
      if (search) params.search           = search;
      if (slug)   params['category__slug'] = slug;
      const { data } = await api.get('/articles/', { params });
      setArticles(data.results ?? data);
    } catch {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => { fetch('', ''); }, [fetch]);

  // Re-fetch whenever search or category changes
  useEffect(() => { fetch(q, catFilter); }, [q, catFilter, fetch]);

  const toggle = id => setPicked(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  return (
    /* Single element: full-screen backdrop that ALSO flex-centers the modal.
       This avoids position:fixed on the modal itself, so Framer Motion
       transforms on the parent drawer cannot shift it. */
    <motion.div
      key="picker-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Modal — stop-propagation keeps backdrop click from closing when clicking inside */}
      <motion.div
        key="picker-modal"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%', maxWidth: 860, maxHeight: '86vh',
          background: 'linear-gradient(160deg,#161618,#111113)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Pick Articles</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
              {picked.size} selected · choose from any category
            </p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        {/* Filters row */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10, flexShrink: 0 }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search by title…"
              style={{ ...inputStyle, paddingLeft: 32 }}
              onFocus={focusInput} onBlur={blurInput}
            />
          </div>
          {/* Category filter */}
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            style={{ ...inputStyle, width: 200, cursor: 'pointer' }}
            onFocus={focusInput} onBlur={blurInput}
          >
            <option value="">All categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          {/* Active filter badge */}
          {catFilter && (
            <button
              onClick={() => setCatFilter('')}
              title="Clear category filter"
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 12px', background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.3)', borderRadius: 8, color: '#FF6B00', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <X size={11} /> Clear
            </button>
          )}
        </div>

        {/* Article grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2.5px solid #FF6B00', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
            </div>
          ) : articles.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: 48, fontSize: 13 }}>
              No articles found{catFilter ? ' in this category' : ''}
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
              {articles.map(a => {
                const sel = picked.has(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggle(a.id)}
                    style={{
                      display: 'flex', gap: 10, padding: '10px 12px', textAlign: 'left', width: '100%',
                      background: sel ? 'rgba(255,107,0,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${sel ? 'rgba(255,107,0,0.4)' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: 10, cursor: 'pointer', transition: 'all 0.12s', alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ width: 52, height: 40, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#1a1a1a' }}>
                      {(a.featured_image || a.featured_image_b64) ? (
                        <img
                          src={a.featured_image || `data:image/jpeg;base64,${a.featured_image_b64}`}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Newspaper size={15} color="rgba(255,255,255,0.12)" />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: 4,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {a.title}
                      </p>
                      {a.category && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#FF6B00', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {a.category.name}
                        </span>
                      )}
                    </div>
                    {sel
                      ? <CheckSquare size={16} color="#FF6B00" style={{ flexShrink: 0, marginTop: 1 }} />
                      : <Square     size={16} color="rgba(255,255,255,0.15)" style={{ flexShrink: 0, marginTop: 1 }} />
                    }
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0 }}>
          <button onClick={onClose}
            style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            onClick={() => onConfirm([...picked])}
            disabled={picked.size === 0}
            style={{
              padding: '9px 22px', fontSize: 13, fontWeight: 800, color: '#fff', cursor: picked.size === 0 ? 'not-allowed' : 'pointer',
              border: 'none', borderRadius: 8, opacity: picked.size === 0 ? 0.5 : 1,
              background: 'linear-gradient(135deg,#FF6B00,#e05500)',
              boxShadow: '0 4px 0 #a33a00, 0 6px 16px rgba(255,107,0,0.4)',
              transition: 'opacity 0.15s',
            }}>
            Add {picked.size} article{picked.size !== 1 ? 's' : ''}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Section drawer ──────────────────────────────────────────────────────────

const PANEL_W = 520;

function SectionDrawer({ section, categories, onClose, onSaved }) {
  const [form, setForm]       = useState({
    category:      section.category ?? '',
    article_count: section.article_count,
    is_active:     section.is_active,
  });
  const [pinned, setPinned]   = useState(section.articles?.map(sa => sa.article) ?? []);
  const [saving, setSaving]   = useState(false);
  const [picker, setPicker]   = useState(false);

  const meta = SECTION_META[section.key] ?? { label: section.label, color: '255,255,255' };
  const Icon = meta.icon ?? Layout;

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/landing-sections/${section.id}/`, {
        category:      form.category || null,
        article_count: Number(form.article_count),
        is_active:     form.is_active,
        article_ids:   pinned.map(a => a.id),
      });
      toast.success('Section saved');
      onSaved();
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const removeArticle = id => setPinned(prev => prev.filter(a => a.id !== id));

  const handlePickerConfirm = ids => {
    const existing = new Map(pinned.map(a => [a.id, a]));
    // We need to load metadata for newly added ids that aren't in pinned already
    const currentIds = new Set(pinned.map(a => a.id));
    const removedIds = new Set(pinned.map(a => a.id).filter(id => !ids.includes(id)));
    // Keep order: existing pinned in new selection, then add newly picked
    const kept = pinned.filter(a => ids.includes(a.id));
    const keptIds = new Set(kept.map(a => a.id));
    // Add new ones — we need to fetch them or find them in section.articles
    const newIds = ids.filter(id => !keptIds.has(id));
    // Fetch missing article details
    if (newIds.length > 0) {
      Promise.all(newIds.map(id => api.get(`/articles/${id}/`).then(r => r.data)))
        .then(fetched => setPinned([...kept, ...fetched]))
        .catch(() => toast.error('Could not load selected articles'));
    } else {
      setPinned(kept);
    }
    setPicker(false);
  };

  return (
    <>
      <motion.div key="drawer-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(3px)' }}
      />
      <motion.div key="drawer-panel"
        initial={{ x: -PANEL_W, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -PANEL_W, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, width: PANEL_W,
          background: '#161618', borderRight: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '8px 0 40px rgba(0,0,0,0.5)', zIndex: 50,
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ background: '#1a1a1c', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 3, height: 36, borderRadius: '2px 0 0 2px', background: `linear-gradient(to bottom, rgb(${meta.color}), rgba(${meta.color},0.3))` }} />
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(${meta.color},0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={18} color={`rgb(${meta.color})`} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{meta.label}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{meta.desc}</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Active toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Section Active</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Show this section on the landing page</p>
              </div>
              <button type="button" onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                style={{ position: 'relative', width: 40, height: 24, borderRadius: 12, background: form.is_active ? '#FF6B00' : '#2a2a2a', border: 'none', cursor: 'pointer', boxShadow: form.is_active ? '0 0 12px rgba(255,107,0,0.4)' : 'none', transition: 'background .2s' }}>
                <span style={{ position: 'absolute', top: 4, left: form.is_active ? 20 : 4, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s', display: 'block' }} />
              </button>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                Auto-pull Category
              </label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={inputStyle}
                onFocus={focusInput} onBlur={blurInput}
              >
                <option value="">— None / Manual only —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>
                When set, the landing page auto-pulls the latest articles from this category if no pinned articles are set.
              </p>
            </div>

            {/* Count */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                Article Count
              </label>
              <input
                type="number" min={1} max={20}
                value={form.article_count}
                onChange={e => setForm(f => ({ ...f, article_count: e.target.value }))}
                style={{ ...inputStyle, width: 100 }}
                onFocus={focusInput} onBlur={blurInput}
              />
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

            {/* Pinned articles */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Pinned Articles</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                    {pinned.length} pinned — these always appear first in the section
                  </p>
                </div>
                <button
                  onClick={() => setPicker(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.25)', borderRadius: 8, color: '#FF6B00', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  <Plus size={13} /> Pick Articles
                </button>
              </div>

              {pinned.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 10 }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>No pinned articles — section will auto-pull from category</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {pinned.map((a, i) => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,107,0,0.6)', width: 18, textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
                      <div style={{ width: 40, height: 32, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#1a1a1a' }}>
                        {(a.featured_image || a.featured_image_b64) ? (
                          <img src={a.featured_image || `data:image/jpeg;base64,${a.featured_image_b64}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Newspaper size={14} color="rgba(255,255,255,0.12)" />
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</p>
                        {a.category && <p style={{ fontSize: 10, color: '#FF6B00', fontWeight: 700, textTransform: 'uppercase', marginTop: 2 }}>{a.category.name}</p>}
                      </div>
                      <button onClick={() => removeArticle(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                        <Trash2 size={14} color="rgba(239,68,68,0.5)" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: '#1a1a1c', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 20px', fontSize: 13, fontWeight: 800, color: '#fff', border: 'none', borderRadius: 10, cursor: saving ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg,#FF6B00,#e05500)',
              boxShadow: '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45)',
              transform: 'translateY(-3px)', transition: 'all 0.08s ease',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save Section'}
          </button>
          <button onClick={onClose}
            style={{ padding: '11px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </motion.div>

      {/* Article Picker */}
      <AnimatePresence>
        {picker && (
          <ArticlePicker
            categories={categories}
            selectedIds={pinned.map(a => a.id)}
            onConfirm={handlePickerConfirm}
            onClose={() => setPicker(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ section, onEdit }) {
  const meta = SECTION_META[section.key] ?? { label: section.label, color: '255,255,255', desc: '' };
  const Icon = meta.icon ?? Layout;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        background: hovered ? 'linear-gradient(160deg,#1a1a1c,#141416)' : 'linear-gradient(160deg,#161618,#111113)',
       padding: '18px 20px', cursor: 'pointer',
        transition: 'all 0.2s ease', boxShadow: hovered ? `0 0 0 1px rgba(${meta.color},0.15), 0 8px 32px rgba(0,0,0,0.3)` : '0 2px 8px rgba(0,0,0,0.2)',
      }}
      onClick={() => onEdit(section)}
    >
      {/* Top accent */}

      {/* Icon + title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `rgba(${meta.color},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={18} color={`rgb(${meta.color})`} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{meta.label}</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2, lineHeight: 1.4 }}>{meta.desc}</p>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
          background: section.is_active ? `rgba(${meta.color},0.1)` : 'rgba(255,255,255,0.05)',
          border: `1px solid ${section.is_active ? `rgba(${meta.color},0.25)` : 'rgba(255,255,255,0.08)'}`,
          color: section.is_active ? `rgb(${meta.color})` : 'rgba(255,255,255,0.25)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {section.is_active ? 'Active' : 'Hidden'}
        </span>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</p>
          <p style={{ fontSize: 12, fontWeight: 700, color: section.category ? '#fff' : 'rgba(255,255,255,0.2)', marginTop: 3 }}>
            {section.category_name || 'Not set'}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Count</p>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginTop: 3 }}>{section.article_count}</p>
        </div>
        <div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pinned</p>
          <p style={{ fontSize: 12, fontWeight: 700, color: section.articles?.length > 0 ? `rgb(${meta.color})` : 'rgba(255,255,255,0.2)', marginTop: 3 }}>
            {section.articles?.length ?? 0}
          </p>
        </div>
      </div>

      {/* Hover glow */}
      {hovered && (
        <div style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `rgba(${meta.color},0.06)`, filter: 'blur(20px)', pointerEvents: 'none' }} />
      )}
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LandingSectionsAdmin() {
  const { setPageTitle } = usePageTitle();
  const [sections, setSections]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(null);

  useEffect(() => {
    setPageTitle('Landing Sections');
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sec, cat] = await Promise.all([
        api.get('/landing-sections/'),
        api.get('/categories/'),
      ]);
      setSections(sec.data.results ?? sec.data);
      setCategories(cat.data.results ?? cat.data);
    } catch {
      toast.error('Failed to load sections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSaved = () => {
    setEditing(null);
    fetchAll();
    toast.success('Landing page updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1 }}>
            Landing Sections
          </h1>
          {/* <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
            Control which articles appear in each section of the public landing page
          </p> */}
        </div>
        {/* <button
          onClick={fetchAll}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }}>
          <RefreshCw size={14} />
          Refresh
        </button> */}
      </div>

      {/* Info banner */}
      <div style={{ padding: '12px 16px', background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.18)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF6B00', flexShrink: 0 }} />
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
          Click any section card to configure it. You can set a <strong style={{ color: 'rgba(255,255,255,0.7)' }}>category</strong> for auto-pull, or <strong style={{ color: 'rgba(255,255,255,0.7)' }}>pin specific articles</strong> that always show first. Pinned articles take priority.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #FF6B00', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {sections.map(s => (
            <SectionCard key={s.id} section={s} onEdit={setEditing} />
          ))}
        </div>
      )}

      {/* Drawer */}
      <AnimatePresence>
        {editing && (
          <SectionDrawer
            key={editing.id}
            section={editing}
            categories={categories}
            onClose={() => setEditing(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
