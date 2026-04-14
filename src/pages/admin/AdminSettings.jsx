import { useState, useEffect } from 'react';
import { Save, Globe, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

/* ─── Input primitives ───────────────────────────────────────── */
const inputStyle = {
  width: '100%', padding: '10px 13px',
  background: '#111111', border: '1px solid #2a2a2a',
  borderRadius: 8, color: '#fff', fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
  caretColor: '#FF6B00', transition: 'border-color .15s, box-shadow .15s',
};

function DarkInput({ style, ...props }) {
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...style }}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.07)'; }}
      onBlur={e  => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none'; }}
    />
  );
}

function DarkTextarea({ style, ...props }) {
  return (
    <textarea
      {...props}
      style={{ ...inputStyle, resize: 'vertical', ...style }}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.07)'; }}
      onBlur={e  => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none'; }}
    />
  );
}

function DarkSelect({ style, children, ...props }) {
  return (
    <select
      {...props}
      style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', ...style }}
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
      type="button"
      onClick={() => onChange(!checked)}
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
        transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        display: 'block',
      }} />
    </button>
  );
}

/* ─── Section card ───────────────────────────────────────────── */
function Section({ icon: Icon, title, children }) {
  return (
    <div style={{
      background: 'linear-gradient(160deg,#161618 0%,#111113 100%)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)',
        }}>
          <Icon size={15} style={{ color: '#FF6B00' }} />
        </div>
        <h2 style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
      </div>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Field row ──────────────────────────────────────────────── */
function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 24 }}>
      <div style={{ width: 220, flexShrink: 0, paddingTop: 2 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{label}</p>
        {hint && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', margin: '3px 0 0' }}>{hint}</p>}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

/* ─── Toggle field row ───────────────────────────────────────── */
function ToggleField({ label, hint, checked, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      padding: '12px 16px', borderRadius: 10,
      background: checked ? 'rgba(255,107,0,0.04)' : 'rgba(255,255,255,0.02)',
      border: checked ? '1px solid rgba(255,107,0,0.12)' : '1px solid rgba(255,255,255,0.05)',
      transition: 'all .2s',
    }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{label}</p>
        {hint && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', margin: '3px 0 0' }}>{hint}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

/* ─── Divider ────────────────────────────────────────────────── */
function Divider() {
  return <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />;
}

/* ─── Defaults ───────────────────────────────────────────────── */
const DEFAULT_GENERAL = {
  siteName: 'GNEWZ',
  siteDescription: "Morocco's #1 Gaming & Esports News Platform",
  defaultLanguage: 'en',
  timezone: 'Africa/Casablanca',
};

const DEFAULT_CONTENT = {
  articlesPerPage: 20,
  autoPublishAI: false,
  breakingNewsDuration: 24,
  enableComments: true,
};

/* ═══════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════ */
export default function AdminSettings() {
  const [general, setGeneral] = useState(DEFAULT_GENERAL);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [dirty, setDirty]     = useState(false);

  /* Load settings on mount */
  useEffect(() => {
    api.get('/settings/')
      .then(r => {
        if (r.data.general    && Object.keys(r.data.general).length)    setGeneral(r.data.general);
        if (r.data.content_cfg && Object.keys(r.data.content_cfg).length) setContent(r.data.content_cfg);
      })
      .catch(() => toast.error('Could not load settings.'))
      .finally(() => setLoading(false));
  }, []);

  const setGen = (patch) => { setGeneral(g => ({ ...g, ...patch })); setDirty(true); };
  const setCon = (patch) => { setContent(c => ({ ...c, ...patch })); setDirty(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/settings/', { general, content_cfg: content });
      toast.success('Settings saved successfully.');
      setDirty(false);
    } catch {
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 gap-2 text-sm">
        <Loader2 size={18} className="animate-spin" /> Loading settings…
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">

      {/* ══ HEADER ══ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[48px] font-black uppercase tracking-tighter text-white leading-none">Settings</h1>
          <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Manage your platform configuration and preferences
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap pt-2">
          {dirty && (
            <span className="text-xs text-amber-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" /> Unsaved changes
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="flex items-center gap-2 px-4 py-3 text-[13px] font-black text-white tracking-wide shrink-0 select-none disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, var(--color-orange) 0%, #e05500 100%)',
              boxShadow: '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
              transform: 'translateY(-3px)', transition: 'transform 0.08s ease, box-shadow 0.08s ease',
              borderRadius: 10,
            }}
            onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform = 'translateY(-5px)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseDown={e  => { e.currentTarget.style.transform = 'translateY(0px)'; }}
            onMouseUp={e    => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} strokeWidth={3} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ══ GENERAL ══ */}
      <Section icon={Globe} title="General Settings">
        <Field label="Site Name">
          <DarkInput
            value={general.siteName}
            onChange={e => setGen({ siteName: e.target.value })}
            placeholder="Your site name"
          />
        </Field>
        <Divider />
        <Field label="Site Description" hint="Shown in search engines and social shares">
          <DarkTextarea
            value={general.siteDescription}
            onChange={e => setGen({ siteDescription: e.target.value })}
            rows={2}
          />
        </Field>
        <Divider />
        <Field label="Default Language">
          <DarkSelect
            value={general.defaultLanguage}
            onChange={e => setGen({ defaultLanguage: e.target.value })}
            style={{ width: 200 }}
          >
            <option value="en" style={{ background: '#111' }}>English</option>
            <option value="ar" style={{ background: '#111' }}>العربية</option>
          </DarkSelect>
        </Field>
        <Divider />
        <Field label="Timezone">
          <DarkSelect
            value={general.timezone}
            onChange={e => setGen({ timezone: e.target.value })}
            style={{ width: 280 }}
          >
            <option value="Africa/Casablanca" style={{ background: '#111' }}>Africa/Casablanca (GMT+1)</option>
            <option value="UTC"               style={{ background: '#111' }}>UTC</option>
            <option value="Europe/London"     style={{ background: '#111' }}>Europe/London (GMT+1)</option>
            <option value="Europe/Paris"      style={{ background: '#111' }}>Europe/Paris (GMT+2)</option>
            <option value="America/New_York"  style={{ background: '#111' }}>America/New_York (GMT-5)</option>
            <option value="America/Los_Angeles" style={{ background: '#111' }}>America/Los_Angeles (GMT-8)</option>
            <option value="Asia/Dubai"        style={{ background: '#111' }}>Asia/Dubai (GMT+4)</option>
          </DarkSelect>
        </Field>
      </Section>

      {/* ══ CONTENT ══ */}
      <Section icon={FileText} title="Content Settings">
        <Field label="Articles per page" hint="Number of articles shown in listings">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DarkInput
              type="number" min={5} max={100}
              value={content.articlesPerPage}
              onChange={e => setCon({ articlesPerPage: Number(e.target.value) })}
              style={{ width: 88 }}
            />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>per page</span>
          </div>
        </Field>
        <Divider />
        <ToggleField
          label="Auto-publish AI drafts"
          hint="Automatically publish AI-generated articles without review"
          checked={content.autoPublishAI}
          onChange={v => setCon({ autoPublishAI: v })}
        />
        <Divider />
        <Field label="Breaking news duration" hint="Hours before a story is no longer marked as breaking">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DarkInput
              type="number" min={1} max={72}
              value={content.breakingNewsDuration}
              onChange={e => setCon({ breakingNewsDuration: Number(e.target.value) })}
              style={{ width: 88 }}
            />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>hours</span>
          </div>
        </Field>
        <Divider />
        <ToggleField
          label="Enable comments"
          hint="Allow readers to comment on articles"
          checked={content.enableComments}
          onChange={v => setCon({ enableComments: v })}
        />
      </Section>

    </div>
  );
}
