import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Link as LinkIcon, FileText, User, Image, Loader2 } from 'lucide-react';
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
    <input {...props} style={{ ...inputStyle, ...props.style }}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.07)'; }}
      onBlur={e  => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none'; }}
    />
  );
}

function DarkTextarea({ ...props }) {
  return (
    <textarea {...props} style={{ ...inputStyle, resize: 'vertical', ...props.style }}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.07)'; }}
      onBlur={e  => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none'; }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function MediaForm({ editId, onClose, onSaved }) {
  const isEdit = Boolean(editId);

  const [form, setForm]         = useState({ url: '', alt_text: '', caption: '', credit: '' });
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/media/${editId}/`)
      .then(({ data }) => {
        setForm({ url: data.url, alt_text: data.alt_text, caption: data.caption, credit: data.credit });
        setFetching(false);
      })
      .catch(() => { toast.error('Failed to load media'); onClose(); });
  }, [editId, isEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'url') setImgError(false);
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) await api.put(`/media/${editId}/`, form);
      else        await api.post('/media/', form);
      toast.success(isEdit ? 'Media updated' : 'Media created');
      onSaved();
    } catch (err) {
      const msg = err.response?.data ? Object.values(err.response.data).flat()[0] : 'Failed to save';
      toast.error(String(msg));
    } finally { setLoading(false); }
  };

  const PANEL_W = 460;

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
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>{isEdit ? 'Edit Media' : 'New Media'}</h2>
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', margin: '3px 0 0 11px' }}>{isEdit ? `Editing media #${editId}` : 'Add a new media entry'}</p>
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

              {/* URL */}
              <Field label="URL *" icon={LinkIcon}>
                <DarkInput name="url" value={form.url} onChange={handleChange} placeholder="https://…" required />
              </Field>

              {/* Image preview */}
              {form.url && !imgError && (
                <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: '#111', position: 'relative' }}>
                  <img
                    src={form.url} alt="Preview"
                    onError={() => setImgError(true)}
                    style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(to top,rgba(0,0,0,0.6),transparent)' }} />
                </div>
              )}
              {form.url && imgError && (
                <div style={{ height: 80, borderRadius: 10, border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Image size={20} style={{ color: 'rgba(255,255,255,0.15)' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Unable to preview image</span>
                </div>
              )}

              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

              {/* Alt text */}
              <Field label="Alt Text *" icon={Image}>
                <DarkInput name="alt_text" value={form.alt_text} onChange={handleChange} placeholder="Descriptive alt text…" required />
              </Field>

              {/* Caption */}
              <Field label="Caption" icon={FileText}>
                <DarkTextarea name="caption" value={form.caption} onChange={handleChange} rows={3} placeholder="Optional caption…" />
              </Field>

              {/* Credit */}
              <Field label="Credit" icon={User}>
                <DarkInput name="credit" value={form.credit} onChange={handleChange} placeholder="Photographer / source…" />
              </Field>

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
