import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Tag, Link as LinkIcon, Clock, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

/* ─── field primitives ───────────────────────────────────────── */
function FieldLabel({ children }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 6 }}>
      {children}
    </p>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        {Icon && <Icon size={11} style={{ color: 'rgba(255,255,255,0.22)', flexShrink: 0 }} />}
        <FieldLabel>{label}</FieldLabel>
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 13px',
  background: '#111111', border: '1px solid #2a2a2a',
  borderRadius: 8, color: '#fff', fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
  caretColor: '#FF6B00', transition: 'border-color .15s, box-shadow .15s',
};

function DarkInput({ ...props }) {
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...props.style }}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.07)'; }}
      onBlur={e  => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none'; }}
    />
  );
}

function DarkSelect({ children, ...props }) {
  return (
    <select
      {...props}
      style={{ ...inputStyle, appearance: 'none', ...props.style }}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)'; }}
      onBlur={e  => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
    >
      {children}
    </select>
  );
}

/* ─── Toggle ─────────────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button" onClick={() => onChange(!checked)}
      style={{
        position: 'relative', width: 40, height: 24, borderRadius: 12,
        border: 'none', cursor: 'pointer', flexShrink: 0,
        background: checked ? '#FF6B00' : '#2a2a2a',
        transition: 'background .2s',
        boxShadow: checked ? '0 0 12px rgba(255,107,0,0.4)' : 'none',
      }}
    >
      <span style={{
        position: 'absolute', top: 4, left: checked ? 20 : 4,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)', display: 'block',
      }} />
    </button>
  );
}

/* ─── Type picker ────────────────────────────────────────────── */
const TYPE_OPTIONS = [
  { value: 'rss',     label: 'RSS',     colorRgb: '255,107,0'   },
  { value: 'api',     label: 'API',     colorRgb: '96,165,250'  },
  { value: 'scraper', label: 'Scraper', colorRgb: '167,139,250' },
];

function TypePicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {TYPE_OPTIONS.map(opt => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value} type="button" onClick={() => onChange(opt.value)}
            style={{
              flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 12, fontWeight: 700,
              cursor: 'pointer', transition: 'all .12s',
              background: active ? `rgba(${opt.colorRgb},0.15)` : 'rgba(255,255,255,0.04)',
              border: active ? `1px solid rgba(${opt.colorRgb},0.4)` : '1px solid rgba(255,255,255,0.08)',
              color: active ? `rgb(${opt.colorRgb})` : 'rgba(255,255,255,0.35)',
              boxShadow: active ? `0 0 10px rgba(${opt.colorRgb},0.15)` : 'none',
            }}
          >{opt.label}</button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function SourceForm({ editId, onClose, onSaved }) {
  const isEdit = Boolean(editId);

  const [form, setForm]         = useState({ name: '', type: 'rss', url: '', fetch_interval: 30, is_active: true });
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/sources/${editId}/`)
      .then(({ data }) => {
        setForm({ name: data.name, type: data.type, url: data.url, fetch_interval: data.fetch_interval, is_active: data.is_active });
        setFetching(false);
      })
      .catch(() => { toast.error('Failed to load source'); onClose(); });
  }, [editId, isEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, fetch_interval: Number(form.fetch_interval) };
      if (isEdit) await api.put(`/sources/${editId}/`, payload);
      else        await api.post('/sources/', payload);
      toast.success(isEdit ? 'Source updated' : 'Source created');
      onSaved();
    } catch (err) {
      const msg = err.response?.data ? Object.values(err.response.data).flat()[0] : 'Failed to save';
      toast.error(String(msg));
    } finally { setLoading(false); }
  };

  const PANEL_W = 440;

  return (
    <AnimatePresence>
      <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
        onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(3px)' }} />

      <motion.div key="panel" initial={{ x: -PANEL_W, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -PANEL_W, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: PANEL_W, background: '#161618', borderRight: '1px solid rgba(255,255,255,0.07)', boxShadow: '8px 0 40px rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#1a1a1c' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 20, borderRadius: 2, background: 'linear-gradient(180deg,#FF6B00,rgba(255,107,0,0.2))' }} />
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>{isEdit ? 'Edit Source' : 'New Source'}</h2>
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', margin: '3px 0 0 11px' }}>{isEdit ? `Editing source #${editId}` : 'Add a new news source'}</p>
          </div>
          <button type="button" onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
          ><X size={14} /></button>
        </div>

        {/* Body */}
        {fetching ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={24} style={{ color: '#FF6B00', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '22px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              <Field label="Name *" icon={Tag}>
                <DarkInput name="name" value={form.name} onChange={handleChange} placeholder="Source name…" required />
              </Field>

              <Field label="Type">
                <TypePicker value={form.type} onChange={v => setForm(p => ({ ...p, type: v }))} />
              </Field>

              <Field label="URL *" icon={LinkIcon}>
                <DarkInput name="url" value={form.url} onChange={handleChange} placeholder="https://…" required />
              </Field>

              <Field label="Fetch Interval" icon={Clock}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <DarkInput name="fetch_interval" type="number" min="1" value={form.fetch_interval} onChange={handleChange} style={{ width: 88 }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>minutes</span>
                </div>
              </Field>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

              {/* Active toggle row */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                padding: '12px 16px', borderRadius: 10,
                background: form.is_active ? 'rgba(255,107,0,0.04)' : 'rgba(255,255,255,0.02)',
                border: form.is_active ? '1px solid rgba(255,107,0,0.12)' : '1px solid rgba(255,255,255,0.05)',
                transition: 'all .2s',
              }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', margin: 0 }}>Active</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', margin: '2px 0 0' }}>Enable fetching from this source</p>
                </div>
                <Toggle checked={form.is_active} onChange={v => setForm(p => ({ ...p, is_active: v }))} />
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '14px 22px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#1a1a1c', display: 'flex', gap: 10, flexShrink: 0 }}>
              <button type="submit" disabled={loading}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 0', borderRadius: 10, background: loading ? 'rgba(255,107,0,0.4)' : 'linear-gradient(135deg,#FF6B00 0%,#cc4400 100%)', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 0 #7a2800,0 6px 14px rgba(255,107,0,0.35),inset 0 1px 0 rgba(255,255,255,0.15)', transform: 'translateY(-2px)', transition: 'transform .08s,box-shadow .08s' }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 0 #7a2800,0 10px 20px rgba(255,107,0,0.45),inset 0 1px 0 rgba(255,255,255,0.15)'; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 0 #7a2800,0 6px 14px rgba(255,107,0,0.35),inset 0 1px 0 rgba(255,255,255,0.15)'; }}
                onMouseDown={e  => { e.currentTarget.style.transform = 'translateY(1px)'; e.currentTarget.style.boxShadow = '0 1px 0 #7a2800,0 2px 6px rgba(255,107,0,0.2),inset 0 1px 0 rgba(0,0,0,0.1)'; }}
                onMouseUp={e    => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 0 #7a2800,0 6px 14px rgba(255,107,0,0.35),inset 0 1px 0 rgba(255,255,255,0.15)'; }}
              >
                {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                {loading ? 'Saving…' : isEdit ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={onClose}
                style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
              >Cancel</button>
            </div>
          </form>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
