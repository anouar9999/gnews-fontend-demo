import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Info, Mail, Shield, BookOpen, Cookie,
  Plus, Trash2, Save, ChevronDown, ChevronUp, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

// ─── Page registry ────────────────────────────────────────────────────────────

const PAGE_META = [
  { slug: 'about',          label: 'About Us',       icon: Info,     desc: 'Team stats, story & values',      color: '96,165,250' },
  { slug: 'contact',        label: 'Contact',        icon: Mail,     desc: 'Contact info & form topics',      color: '52,211,153' },
  { slug: 'privacy-policy', label: 'Privacy Policy', icon: Shield,   desc: 'Privacy sections (GDPR etc.)',    color: '251,191,36' },
  { slug: 'terms-of-use',   label: 'Terms of Use',   icon: BookOpen, desc: 'Terms & conditions sections',     color: '167,139,250' },
  { slug: 'cookie-policy',  label: 'Cookie Policy',  icon: Cookie,   desc: 'Cookie types & descriptions',     color: '251,113,133' },
];

// ─── Input primitives ─────────────────────────────────────────────────────────

const baseInputStyle = {
  width: '100%',
  padding: '10px 13px',
  background: '#0d0d0d',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  color: '#fff',
  fontSize: 13,
  outline: 'none',
  caretColor: '#FF6B00',
  transition: 'border-color .15s, box-shadow .15s',
  boxSizing: 'border-box',
};

function DarkInput({ style, ...props }) {
  return (
    <input
      {...props}
      style={{ ...baseInputStyle, ...style }}
      onFocus={e => {
        e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)';
        e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(255,107,0,0.07)';
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.boxShadow   = 'none';
      }}
    />
  );
}

function DarkTextarea({ style, ...props }) {
  return (
    <textarea
      {...props}
      style={{ ...baseInputStyle, resize: 'vertical', ...style }}
      onFocus={e => {
        e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)';
        e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(255,107,0,0.07)';
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.boxShadow   = 'none';
      }}
    />
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Sub-section header ────────────────────────────────────────────────────────

function SubSection({ title, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 3, height: 18, borderRadius: 2,
          background: 'linear-gradient(180deg, #FF6B00, rgba(255,107,0,0))',
        }} />
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

// ─── Item card (reusable wrapper for editors) ─────────────────────────────────

function ItemCard({ index, label, onMoveUp, onMoveDown, onRemove, canUp, canDown, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered ? 'rgba(255,255,255,0.03)' : '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'background .15s, border-color .15s',
        borderColor: hovered ? 'rgba(255,107,0,0.2)' : 'rgba(255,255,255,0.07)',
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 10, bottom: 10, width: 3,
        borderRadius: '0 2px 2px 0',
        background: hovered ? 'rgba(255,107,0,0.4)' : 'transparent',
        transition: 'background .15s',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)' }}>
          {label} {index + 1}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {onMoveUp && (
            <button
              onClick={onMoveUp} disabled={!canUp}
              style={{ padding: '4px 6px', borderRadius: 7, border: 'none', cursor: canUp ? 'pointer' : 'not-allowed', background: 'rgba(255,255,255,0.05)', color: canUp ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)', transition: 'all .12s' }}
              onMouseEnter={e => { if (canUp) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <ChevronUp size={13} />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown} disabled={!canDown}
              style={{ padding: '4px 6px', borderRadius: 7, border: 'none', cursor: canDown ? 'pointer' : 'not-allowed', background: 'rgba(255,255,255,0.05)', color: canDown ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)', transition: 'all .12s' }}
              onMouseEnter={e => { if (canDown) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <ChevronDown size={13} />
            </button>
          )}
          <button
            onClick={onRemove}
            style={{ padding: '4px 6px', borderRadius: 7, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', transition: 'all .12s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Add button ───────────────────────────────────────────────────────────────

function AddButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: '100%', padding: '10px 16px',
        background: 'transparent',
        border: '1px dashed rgba(255,107,0,0.3)',
        borderRadius: 10, cursor: 'pointer',
        color: 'rgba(255,107,0,0.6)',
        fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
        transition: 'all .15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(255,107,0,0.7)';
        e.currentTarget.style.color = '#FF6B00';
        e.currentTarget.style.background = 'rgba(255,107,0,0.05)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)';
        e.currentTarget.style.color = 'rgba(255,107,0,0.6)';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <Plus size={14} strokeWidth={2.5} />
      {label}
    </button>
  );
}

// ─── Sections editor (Privacy Policy & Terms of Use) ─────────────────────────

function SectionsEditor({ sections, onChange }) {
  const update = (i, key, val) => onChange(sections.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  const remove = (i) => onChange(sections.filter((_, idx) => idx !== i));
  const add    = () => onChange([...sections, { title: '', body: '' }]);
  const move   = (i, dir) => {
    const next = [...sections];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <AnimatePresence>
        {sections.map((s, i) => (
          <ItemCard
            key={i} index={i} label="Section"
            onMoveUp={() => move(i, -1)} canUp={i > 0}
            onMoveDown={() => move(i, 1)} canDown={i < sections.length - 1}
            onRemove={() => remove(i)}
          >
            <Field label="Title">
              <DarkInput value={s.title} onChange={e => update(i, 'title', e.target.value)} placeholder="Section title…" />
            </Field>
            <Field label="Body">
              <DarkTextarea value={s.body} onChange={e => update(i, 'body', e.target.value)} rows={4} placeholder="Section content…" />
            </Field>
          </ItemCard>
        ))}
      </AnimatePresence>
      <AddButton onClick={add} label="Add Section" />
    </div>
  );
}

// ─── About editor ─────────────────────────────────────────────────────────────

function AboutEditor({ content, onChange }) {
  const stats  = content.stats  ?? [];
  const story  = content.story  ?? [];
  const values = content.values ?? [];

  const updStats  = v => onChange({ ...content, stats: v });
  const updStory  = v => onChange({ ...content, story: v });
  const updValues = v => onChange({ ...content, values: v });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Stats */}
      <SubSection title="Stats">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
          <AnimatePresence>
            {stats.map((s, i) => (
              <ItemCard key={i} index={i} label="Stat" onRemove={() => updStats(stats.filter((_, idx) => idx !== i))}>
                <Field label="Value">
                  <DarkInput value={s.value} onChange={e => updStats(stats.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x))} placeholder="2.4M+" />
                </Field>
                <Field label="Label">
                  <DarkInput value={s.label} onChange={e => updStats(stats.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} placeholder="Monthly Readers" />
                </Field>
              </ItemCard>
            ))}
          </AnimatePresence>
        </div>
        <AddButton onClick={() => updStats([...stats, { label: '', value: '' }])} label="Add Stat" />
      </SubSection>

      {/* Story */}
      <SubSection title="Our Story — Paragraphs">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AnimatePresence>
            {story.map((para, i) => (
              <ItemCard key={i} index={i} label="Paragraph" onRemove={() => updStory(story.filter((_, idx) => idx !== i))}>
                <DarkTextarea
                  value={para}
                  onChange={e => updStory(story.map((p, idx) => idx === i ? e.target.value : p))}
                  rows={3} placeholder={`Paragraph ${i + 1}…`}
                />
              </ItemCard>
            ))}
          </AnimatePresence>
          <AddButton onClick={() => updStory([...story, ''])} label="Add Paragraph" />
        </div>
      </SubSection>

      {/* Values */}
      <SubSection title="What We Stand For">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AnimatePresence>
            {values.map((v, i) => (
              <ItemCard key={i} index={i} label="Value" onRemove={() => updValues(values.filter((_, idx) => idx !== i))}>
                <Field label="Title">
                  <DarkInput value={v.title} onChange={e => updValues(values.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} placeholder="Speed" />
                </Field>
                <Field label="Description">
                  <DarkTextarea value={v.desc} onChange={e => updValues(values.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x))} rows={2} placeholder="Description…" />
                </Field>
              </ItemCard>
            ))}
          </AnimatePresence>
          <AddButton onClick={() => updValues([...values, { title: '', desc: '' }])} label="Add Value" />
        </div>
      </SubSection>
    </div>
  );
}

// ─── Contact editor ───────────────────────────────────────────────────────────

function ContactEditor({ content, onChange }) {
  const info   = content.info   ?? [];
  const topics = content.topics ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <SubSection title="Info Cards">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AnimatePresence>
            {info.map((c, i) => (
              <ItemCard key={i} index={i} label="Card" onRemove={() => onChange({ ...content, info: info.filter((_, idx) => idx !== i) })}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Field label="Label">
                    <DarkInput value={c.title} onChange={e => onChange({ ...content, info: info.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x) })} placeholder="Email" />
                  </Field>
                  <Field label="Value">
                    <DarkInput value={c.val} onChange={e => onChange({ ...content, info: info.map((x, idx) => idx === i ? { ...x, val: e.target.value } : x) })} placeholder="hello@gnewz.com" />
                  </Field>
                </div>
              </ItemCard>
            ))}
          </AnimatePresence>
          <AddButton onClick={() => onChange({ ...content, info: [...info, { title: '', val: '' }] })} label="Add Info Card" />
        </div>
      </SubSection>

      <SubSection title="Contact Form Topics">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <AnimatePresence>
            {topics.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex', gap: 8, alignItems: 'center' }}
              >
                <DarkInput
                  value={t}
                  onChange={e => onChange({ ...content, topics: topics.map((x, idx) => idx === i ? e.target.value : x) })}
                  placeholder={`Topic ${i + 1}`}
                  style={{ flex: 1 }}
                />
                <button
                  onClick={() => onChange({ ...content, topics: topics.filter((_, idx) => idx !== i) })}
                  style={{ padding: '8px 10px', borderRadius: 9, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', flexShrink: 0, transition: 'all .12s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <AddButton onClick={() => onChange({ ...content, topics: [...topics, ''] })} label="Add Topic" />
        </div>
      </SubSection>
    </div>
  );
}

// ─── Cookie Policy editor ─────────────────────────────────────────────────────

function CookiePolicyEditor({ content, onChange }) {
  const types = content.cookie_types ?? [];

  const update = (i, key, val) => onChange({ ...content, cookie_types: types.map((t, idx) => idx === i ? { ...t, [key]: val } : t) });
  const remove = (i) => onChange({ ...content, cookie_types: types.filter((_, idx) => idx !== i) });
  const add    = () => onChange({ ...content, cookie_types: [...types, { name: '', required: false, desc: '', examples: '' }] });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <AnimatePresence>
        {types.map((t, i) => (
          <ItemCard key={i} index={i} label="Cookie Type" onRemove={() => remove(i)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <Field label="Name" style={{ flex: 1 }}>
                <DarkInput value={t.name} onChange={e => update(i, 'name', e.target.value)} placeholder="Essential Cookies" />
              </Field>
              {/* Always Active toggle */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 16 }}>
                <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)' }}>Always On</span>
                <button
                  type="button"
                  onClick={() => update(i, 'required', !t.required)}
                  style={{
                    position: 'relative', width: 36, height: 20, borderRadius: 10,
                    border: 'none', cursor: 'pointer', flexShrink: 0,
                    background: t.required ? '#FF6B00' : 'rgba(255,255,255,0.1)',
                    transition: 'background .2s',
                    boxShadow: t.required ? '0 0 10px rgba(255,107,0,0.4)' : 'none',
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 3, left: t.required ? 18 : 3,
                    width: 14, height: 14, borderRadius: '50%', background: '#fff',
                    transition: 'left .2s', display: 'block',
                  }} />
                </button>
              </div>
            </div>
            <Field label="Description">
              <DarkTextarea value={t.desc} onChange={e => update(i, 'desc', e.target.value)} rows={3} placeholder="What these cookies do…" />
            </Field>
            <Field label="Examples">
              <DarkInput value={t.examples} onChange={e => update(i, 'examples', e.target.value)} placeholder="Session token, consent preference" />
            </Field>
          </ItemCard>
        ))}
      </AnimatePresence>
      <AddButton onClick={add} label="Add Cookie Type" />
    </div>
  );
}

// ─── Editor dispatcher ────────────────────────────────────────────────────────

function PageContentEditor({ slug, content, onChange }) {
  if (slug === 'about')         return <AboutEditor content={content} onChange={onChange} />;
  if (slug === 'contact')       return <ContactEditor content={content} onChange={onChange} />;
  if (slug === 'cookie-policy') return <CookiePolicyEditor content={content} onChange={onChange} />;
  return <SectionsEditor sections={content.sections ?? []} onChange={v => onChange({ ...content, sections: v })} />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SitePagesAdmin() {
  const [pages,    setPages]    = useState({});
  const [selected, setSelected] = useState('about');
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [dirty,    setDirty]    = useState(false);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all(
      PAGE_META.map(({ slug }) =>
        api.get(`/pages/${slug}/`).then(r => ({ slug, content: r.data.content }))
      )
    )
      .then(results => {
        const map = {};
        results.forEach(({ slug, content }) => { map[slug] = content; });
        setPages(map);
      })
      .catch(() => setError('Failed to load pages from the API.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = useCallback((newContent) => {
    setPages(prev => ({ ...prev, [selected]: newContent }));
    setDirty(true);
  }, [selected]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/pages/${selected}/`, { content: pages[selected] });
      toast.success('Page saved successfully.');
      setDirty(false);
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = (slug) => {
    if (dirty && !window.confirm('You have unsaved changes. Discard them?')) return;
    setSelected(slug);
    setDirty(false);
  };

  const meta = PAGE_META.find(p => p.slug === selected);

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-[48px] font-black uppercase tracking-tighter text-white leading-none"
            style={{ letterSpacing: '-0.03em' }}
          >
            Site Pages
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
            Manage public page content — About, Contact, Privacy, Terms &amp; Cookies
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 6, flexShrink: 0 }}>
          {/* Unsaved badge */}
          <AnimatePresence>
            {dirty && (
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.18 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 10px', borderRadius: 20,
                  background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)',
                  color: '#fbbf24', fontSize: 11, fontWeight: 700,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 6px rgba(251,191,36,0.6)' }} />
                Unsaved changes
              </motion.span>
            )}
          </AnimatePresence>

          {/* 3D Save button */}
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="flex items-center gap-2 px-5 py-3 text-[13px] font-black text-white tracking-wide disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #FF6B00 0%, #e05500 100%)',
              boxShadow: (!saving && dirty) ? '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)' : 'none',
              borderRadius: 10, border: 'none', cursor: (saving || !dirty) ? 'not-allowed' : 'pointer',
              transform: (!saving && dirty) ? 'translateY(-3px)' : 'none',
              transition: 'transform 0.08s ease, box-shadow 0.08s ease, opacity .2s',
            }}
            onMouseEnter={e => { if (!saving && dirty) { e.currentTarget.style.boxShadow = '0 8px 0 #a33a00, 0 12px 24px rgba(255,107,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-5px)'; } }}
            onMouseLeave={e => { if (!saving && dirty) { e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; } }}
            onMouseDown={e  => { if (!saving && dirty) { e.currentTarget.style.boxShadow = '0 2px 0 #a33a00, 0 4px 8px rgba(255,107,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0px)'; } }}
            onMouseUp={e    => { if (!saving && dirty) { e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; } }}
          >
            {saving ? (
              <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
            ) : (
              <Save size={14} strokeWidth={3} />
            )}
            {saving ? 'Saving…' : 'Save Page'}
          </button>
        </div>
      </div>

      {/* ── Body: sidebar + editor ── */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* ── Left nav ── */}
        <nav style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Nav card */}
          <div style={{
            background: 'linear-gradient(160deg,#161618 0%,#111113 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}>
            {/* Top accent */}
            <div style={{ height: 2, background: 'linear-gradient(90deg,rgba(255,107,0,0.7),rgba(255,107,0,0) 60%)' }} />

            <div style={{ padding: '6px 6px' }}>
              {PAGE_META.map(({ slug, label, icon: Icon, desc, color }) => {
                const active = slug === selected;
                return (
                  <button
                    key={slug}
                    onClick={() => handleSelect(slug)}
                    style={{
                      width: '100%', textAlign: 'left', display: 'block',
                      padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                      border: 'none', marginBottom: 2,
                      background: active ? `rgba(${color},0.1)` : 'transparent',
                      outline: active ? `1px solid rgba(${color},0.25)` : '1px solid transparent',
                      transition: 'all .15s',
                      position: 'relative', overflow: 'hidden',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Active left bar */}
                    <div style={{
                      position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3,
                      borderRadius: '0 2px 2px 0',
                      background: active ? `rgb(${color})` : 'transparent',
                      boxShadow: active ? `0 0 8px rgba(${color},0.6)` : 'none',
                      transition: 'background .15s',
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: active ? `rgba(${color},0.15)` : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${active ? `rgba(${color},0.3)` : 'rgba(255,255,255,0.07)'}`,
                        transition: 'all .15s',
                      }}>
                        <Icon size={13} style={{ color: active ? `rgb(${color})` : 'rgba(255,255,255,0.35)', transition: 'color .15s' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: active ? '#fff' : 'rgba(255,255,255,0.55)', letterSpacing: '-0.01em', transition: 'color .15s' }}>
                          {label}
                        </div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {desc}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* ── Right editor ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 16, padding: '80px 0',
              background: 'linear-gradient(160deg,#161618 0%,#111113 100%)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2.5px solid #FF6B00', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>Loading pages…</span>
            </div>
          ) : error ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 14, color: '#f87171', fontSize: 13,
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          ) : (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'linear-gradient(160deg,#161618 0%,#111113 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
            >
              {/* Top accent */}
              <div style={{ height: 2, background: `linear-gradient(90deg,rgba(${meta?.color},0.8),rgba(${meta?.color},0) 60%)` }} />

              {/* Editor header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `rgba(${meta?.color},0.12)`,
                  border: `1px solid rgba(${meta?.color},0.25)`,
                }}>
                  {meta && <meta.icon size={16} style={{ color: `rgb(${meta.color})` }} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{meta?.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{meta?.desc}</div>
                </div>
              </div>

              {/* Editor body */}
              <div style={{ padding: '24px', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
                {pages[selected] !== undefined && (
                  <PageContentEditor
                    slug={selected}
                    content={pages[selected]}
                    onChange={handleChange}
                  />
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
