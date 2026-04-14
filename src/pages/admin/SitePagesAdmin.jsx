import { useState, useEffect, useCallback } from 'react';
import { FileText, Info, Mail, Shield, BookOpen, Cookie, Plus, Trash2, Save, ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

// ─── Page registry ───────────────────────────────────────────────────────────

const PAGE_META = [
  { slug: 'about',          label: 'About Us',       icon: Info,     desc: 'Team stats, story, and values' },
  { slug: 'contact',        label: 'Contact',        icon: Mail,     desc: 'Contact info and form topics' },
  { slug: 'privacy-policy', label: 'Privacy Policy', icon: Shield,   desc: 'Privacy sections (GDPR etc.)' },
  { slug: 'terms-of-use',   label: 'Terms of Use',   icon: BookOpen, desc: 'Terms and conditions sections' },
  { slug: 'cookie-policy',  label: 'Cookie Policy',  icon: Cookie,   desc: 'Cookie types and descriptions' },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

const inputCls = 'w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#FF6B00] transition-colors placeholder-gray-600 resize-none';
const labelCls = 'text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 block';

function Field({ label, children }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

// ─── Sections editor (Privacy Policy & Terms of Use) ─────────────────────────

function SectionsEditor({ sections, onChange }) {
  const update = (i, key, val) => {
    const next = sections.map((s, idx) => idx === i ? { ...s, [key]: val } : s);
    onChange(next);
  };
  const remove = (i) => onChange(sections.filter((_, idx) => idx !== i));
  const add = () => onChange([...sections, { title: '', body: '' }]);
  const move = (i, dir) => {
    const next = [...sections];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {sections.map((s, i) => (
        <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Section {i + 1}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => move(i, -1)} disabled={i === 0}
                className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-[#222] disabled:opacity-30 transition-colors">
                <ChevronUp size={14} />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === sections.length - 1}
                className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-[#222] disabled:opacity-30 transition-colors">
                <ChevronDown size={14} />
              </button>
              <button onClick={() => remove(i)}
                className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <Field label="Title">
            <input value={s.title} onChange={e => update(i, 'title', e.target.value)} className={inputCls} placeholder="Section title…" />
          </Field>
          <Field label="Body">
            <textarea value={s.body} onChange={e => update(i, 'body', e.target.value)} rows={4} className={inputCls} placeholder="Section content…" />
          </Field>
        </div>
      ))}
      <button onClick={add}
        className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#FF6B00]/40 hover:border-[#FF6B00] text-[#FF6B00]/60 hover:text-[#FF6B00] rounded-xl text-sm font-bold transition-colors w-full justify-center">
        <Plus size={15} /> Add Section
      </button>
    </div>
  );
}

// ─── About editor ─────────────────────────────────────────────────────────────

function AboutEditor({ content, onChange }) {
  const stats  = content.stats  ?? [];
  const story  = content.story  ?? [];
  const values = content.values ?? [];

  const updStats  = (v) => onChange({ ...content, stats: v });
  const updStory  = (v) => onChange({ ...content, story: v });
  const updValues = (v) => onChange({ ...content, values: v });

  const updateStat = (i, key, val) => updStats(stats.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  const removeStat = (i) => updStats(stats.filter((_, idx) => idx !== i));
  const addStat    = () => updStats([...stats, { label: '', value: '' }]);

  const updateStory = (i, val) => updStory(story.map((s, idx) => idx === i ? val : s));
  const removeStory = (i) => updStory(story.filter((_, idx) => idx !== i));
  const addStory    = () => updStory([...story, '']);

  const updateValue = (i, key, val) => updValues(values.map((v, idx) => idx === i ? { ...v, [key]: val } : v));
  const removeValue = (i) => updValues(values.filter((_, idx) => idx !== i));
  const addValue    = () => updValues([...values, { title: '', desc: '' }]);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <section>
        <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" /> Stats
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Stat {i + 1}</span>
                <button onClick={() => removeStat(i)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
              <input value={s.value} onChange={e => updateStat(i, 'value', e.target.value)} className={inputCls} placeholder="2.4M+" />
              <input value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} className={inputCls} placeholder="Monthly Readers" />
            </div>
          ))}
        </div>
        <button onClick={addStat} className="mt-3 flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#FF6B00]/40 hover:border-[#FF6B00] text-[#FF6B00]/60 hover:text-[#FF6B00] rounded-xl text-sm font-bold transition-colors w-full justify-center">
          <Plus size={15} /> Add Stat
        </button>
      </section>

      {/* Story */}
      <section>
        <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" /> Our Story (paragraphs)
        </h3>
        <div className="space-y-3">
          {story.map((para, i) => (
            <div key={i} className="flex gap-2">
              <textarea value={para} onChange={e => updateStory(i, e.target.value)} rows={3} className={`${inputCls} flex-1`} placeholder={`Paragraph ${i + 1}…`} />
              <button onClick={() => removeStory(i)} className="text-gray-600 hover:text-red-400 transition-colors self-start mt-2"><Trash2 size={14} /></button>
            </div>
          ))}
          <button onClick={addStory} className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#FF6B00]/40 hover:border-[#FF6B00] text-[#FF6B00]/60 hover:text-[#FF6B00] rounded-xl text-sm font-bold transition-colors w-full justify-center">
            <Plus size={15} /> Add Paragraph
          </button>
        </div>
      </section>

      {/* Values */}
      <section>
        <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" /> What We Stand For
        </h3>
        <div className="space-y-3">
          {values.map((v, i) => (
            <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Value {i + 1}</span>
                <button onClick={() => removeValue(i)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
              <input value={v.title} onChange={e => updateValue(i, 'title', e.target.value)} className={inputCls} placeholder="Speed" />
              <textarea value={v.desc} onChange={e => updateValue(i, 'desc', e.target.value)} rows={2} className={inputCls} placeholder="Description…" />
            </div>
          ))}
          <button onClick={addValue} className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#FF6B00]/40 hover:border-[#FF6B00] text-[#FF6B00]/60 hover:text-[#FF6B00] rounded-xl text-sm font-bold transition-colors w-full justify-center">
            <Plus size={15} /> Add Value
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Contact editor ───────────────────────────────────────────────────────────

function ContactEditor({ content, onChange }) {
  const info   = content.info   ?? [];
  const topics = content.topics ?? [];

  const updateInfo  = (i, key, val) => onChange({ ...content, info: info.map((x, idx) => idx === i ? { ...x, [key]: val } : x) });
  const removeInfo  = (i) => onChange({ ...content, info: info.filter((_, idx) => idx !== i) });
  const addInfo     = () => onChange({ ...content, info: [...info, { title: '', val: '' }] });

  const updateTopic = (i, val) => onChange({ ...content, topics: topics.map((t, idx) => idx === i ? val : t) });
  const removeTopic = (i) => onChange({ ...content, topics: topics.filter((_, idx) => idx !== i) });
  const addTopic    = () => onChange({ ...content, topics: [...topics, ''] });

  return (
    <div className="space-y-8">
      {/* Info cards */}
      <section>
        <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" /> Info Cards
        </h3>
        <div className="space-y-3">
          {info.map((c, i) => (
            <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Card {i + 1}</span>
                <button onClick={() => removeInfo(i)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={c.title} onChange={e => updateInfo(i, 'title', e.target.value)} className={inputCls} placeholder="Label (e.g. Email)" />
                <input value={c.val} onChange={e => updateInfo(i, 'val', e.target.value)} className={inputCls} placeholder="Value (e.g. hello@gnewz.com)" />
              </div>
            </div>
          ))}
          <button onClick={addInfo} className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#FF6B00]/40 hover:border-[#FF6B00] text-[#FF6B00]/60 hover:text-[#FF6B00] rounded-xl text-sm font-bold transition-colors w-full justify-center">
            <Plus size={15} /> Add Info Card
          </button>
        </div>
      </section>

      {/* Topics */}
      <section>
        <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" /> Contact Form Topics
        </h3>
        <div className="space-y-2">
          {topics.map((t, i) => (
            <div key={i} className="flex gap-2">
              <input value={t} onChange={e => updateTopic(i, e.target.value)} className={`${inputCls} flex-1`} placeholder={`Topic ${i + 1}`} />
              <button onClick={() => removeTopic(i)} className="text-gray-600 hover:text-red-400 transition-colors p-2"><Trash2 size={14} /></button>
            </div>
          ))}
          <button onClick={addTopic} className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#FF6B00]/40 hover:border-[#FF6B00] text-[#FF6B00]/60 hover:text-[#FF6B00] rounded-xl text-sm font-bold transition-colors w-full justify-center">
            <Plus size={15} /> Add Topic
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Cookie Policy editor ─────────────────────────────────────────────────────

function CookiePolicyEditor({ content, onChange }) {
  const types = content.cookie_types ?? [];

  const update = (i, key, val) => {
    const next = types.map((t, idx) => idx === i ? { ...t, [key]: val } : t);
    onChange({ ...content, cookie_types: next });
  };
  const remove = (i) => onChange({ ...content, cookie_types: types.filter((_, idx) => idx !== i) });
  const add    = () => onChange({ ...content, cookie_types: [...types, { name: '', required: false, desc: '', examples: '' }] });

  return (
    <div className="space-y-4">
      {types.map((t, i) => (
        <div key={i} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Cookie Type {i + 1}</span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={t.required} onChange={e => update(i, 'required', e.target.checked)}
                  className="w-4 h-4 accent-[#FF6B00]" />
                <span className="text-xs text-gray-400">Always Active</span>
              </label>
              <button onClick={() => remove(i)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
          <Field label="Name"><input value={t.name} onChange={e => update(i, 'name', e.target.value)} className={inputCls} placeholder="Essential Cookies" /></Field>
          <Field label="Description"><textarea value={t.desc} onChange={e => update(i, 'desc', e.target.value)} rows={3} className={inputCls} placeholder="What these cookies do…" /></Field>
          <Field label="Examples"><input value={t.examples} onChange={e => update(i, 'examples', e.target.value)} className={inputCls} placeholder="Session token, consent preference" /></Field>
        </div>
      ))}
      <button onClick={add}
        className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#FF6B00]/40 hover:border-[#FF6B00] text-[#FF6B00]/60 hover:text-[#FF6B00] rounded-xl text-sm font-bold transition-colors w-full justify-center">
        <Plus size={15} /> Add Cookie Type
      </button>
    </div>
  );
}

// ─── Editor dispatcher ────────────────────────────────────────────────────────

function PageContentEditor({ slug, content, onChange }) {
  if (slug === 'about')          return <AboutEditor content={content}      onChange={onChange} />;
  if (slug === 'contact')        return <ContactEditor content={content}    onChange={onChange} />;
  if (slug === 'cookie-policy')  return <CookiePolicyEditor content={content} onChange={onChange} />;
  return <SectionsEditor sections={content.sections ?? []} onChange={v => onChange({ ...content, sections: v })} />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SitePagesAdmin() {
  const [pages, setPages] = useState({});          // { slug: content }
  const [selected, setSelected] = useState('about');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all pages on mount
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
      .catch(() => setError('Failed to load pages from API.'))
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
    if (dirty) {
      if (!window.confirm('You have unsaved changes. Discard them?')) return;
    }
    setSelected(slug);
    setDirty(false);
  };

  const meta = PAGE_META.find(p => p.slug === selected);

  return (
    <div className="flex gap-6 h-full min-h-0">

      {/* ── Left: page list ── */}
      <aside className="w-64 shrink-0 space-y-2">
        {PAGE_META.map(({ slug, label, icon: Icon, desc }) => {
          const active = slug === selected;
          return (
            <button
              key={slug}
              onClick={() => handleSelect(slug)}
              className={`w-full text-left rounded-2xl p-4 border transition-all ${
                active
                  ? 'border-[#FF6B00]/40 bg-[#FF6B00]/10'
                  : 'border-[#1f1f1f] bg-[#0d0d0d] hover:border-[#333]'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <Icon size={15} className={active ? 'text-[#FF6B00]' : 'text-gray-500'} />
                <span className={`text-sm font-bold ${active ? 'text-white' : 'text-gray-400'}`}>{label}</span>
              </div>
              <p className="text-xs text-gray-600 pl-6">{desc}</p>
            </button>
          );
        })}
      </aside>

      {/* ── Right: editor ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center flex-1 text-gray-600 text-sm">Loading pages…</div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-800/40 rounded-2xl text-red-400 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-black text-xl">{meta?.label}</h2>
                <p className="text-gray-500 text-sm mt-0.5">{meta?.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                {dirty && (
                  <span className="flex items-center gap-1.5 text-amber-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Unsaved changes
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving || !dirty}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B00] hover:bg-[#cc5500] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl transition-colors"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>

            {/* Editor body */}
            <div className="flex-1 overflow-y-auto pr-1">
              {pages[selected] !== undefined && (
                <PageContentEditor
                  slug={selected}
                  content={pages[selected]}
                  onChange={handleChange}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
