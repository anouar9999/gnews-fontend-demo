import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import toast from 'react-hot-toast';

import { fmtEdited, uuid, serializeBlocks, initBlocksFromContent } from './articleUtils';
import FieldLabel        from './components/FieldLabel';
import DarkInput         from './components/DarkInput';
import DarkTextarea      from './components/DarkTextarea';
import DarkSelect        from './components/DarkSelect';
import Toggle            from './components/Toggle';
import ImageBlock        from './components/ImageBlock';
import TagSelector       from './components/TagSelector';
import TitleTextarea     from './components/TitleTextarea';
import BlockEditor       from './components/BlockEditor';

const CHAPTERS = [
  { key: 'content',  num: '01', title: 'Content',  desc: 'Title, body & media' },
  { key: 'seo',      num: '02', title: 'SEO',       desc: 'Meta & slug' },
  { key: 'settings', num: '03', title: 'Settings',  desc: 'Status, tags, category & flags' },
];

export default function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  /* form state */
  const [form, setForm] = useState({
    title: '', slug: '', content: '', meta_title: '', meta_description: '',
    status: 'nouveau', is_featured: false, is_breaking: false,
    category: '', tag_ids: [], media_ids: [],
  });
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [imageFile, setImageFile]               = useState(null);
  const [imagePreview, setImagePreview]         = useState('');
  const [categories, setCategories]             = useState([]);
  const [tags, setTags]                         = useState([]);
  const [mediaItems, setMediaItems]             = useState([]);
  const [loading, setLoading]                   = useState(false);
  const [fetching, setFetching]                 = useState(isEdit);
  const [updatedAt, setUpdatedAt]               = useState(null);
  const [blocks, setBlocks]                     = useState([{ id: uuid(), type: 'text', content: '' }]);
  const [activeSection, setActiveSection]       = useState('content');

  /* fetch lookup data */
  useEffect(() => {
    Promise.all([
      api.get('/categories/', { params: { page_size: 100 } }),
      api.get('/tags/',       { params: { page_size: 100 } }),
      api.get('/media/',      { params: { page_size: 100 } }),
    ]).then(([catRes, tagRes, mediaRes]) => {
      setCategories(catRes.data.results);
      setTags(tagRes.data.results);
      setMediaItems(mediaRes.data.results);
    });
  }, []);

  /* fetch article for edit */
  useEffect(() => {
    if (!isEdit) return;
    api.get(`/articles/${id}/`).then(({ data }) => {
      setForm({
        title:            data.title            || '',
        slug:             data.slug             || '',
        content:          data.content          || '',
        meta_title:       data.meta_title       || '',
        meta_description: data.meta_description || '',
        status:           data.status           || 'nouveau',
        is_featured:      data.is_featured      || false,
        is_breaking:      data.is_breaking      || false,
        category:         data.category?.id     || '',
        tag_ids:          data.tags?.map(t => t.id)  || [],
        media_ids:        data.media?.map(m => m.id) || [],
      });
      setBlocks(initBlocksFromContent(data.content));
      if (data.featured_image) {
        setExistingImageUrl(data.featured_image);
        setImagePreview(data.featured_image);
      }
      setUpdatedAt(data.updated_at || null);
      setFetching(false);
    }).catch(() => {
      toast.error('Failed to load article');
      navigate('/admin/articles');
    });
  }, [id, isEdit, navigate]);

  /* handlers */
  const toSlug = text =>
    text.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'title') updated.slug = toSlug(value);
      return updated;
    });
  };

  const handleMultiSelect = (name, value) => {
    const numVal = Number(value);
    setForm(prev => ({
      ...prev,
      [name]: prev[name].includes(numVal)
        ? prev[name].filter(v => v !== numVal)
        : [...prev[name], numVal],
    }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setExistingImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title',            form.title);
      if (form.slug) fd.append('slug', form.slug);
      fd.append('content',          serializeBlocks(blocks));
      fd.append('meta_title',       form.meta_title);
      fd.append('meta_description', form.meta_description);
      fd.append('status',           form.status);
      fd.append('is_featured',      form.is_featured);
      fd.append('is_breaking',      form.is_breaking);
      fd.append('category',         form.category || '');
      form.tag_ids.forEach(tid => fd.append('tag_ids', tid));
      const blockMediaIds = blocks.filter(b => b.mediaId).map(b => b.mediaId);
      const allMediaIds = [...new Set([...form.media_ids, ...blockMediaIds])];
      allMediaIds.forEach(mid => fd.append('media_ids', mid));
      if (imageFile) {
        fd.append('featured_image', imageFile);
      } else if (!imagePreview && existingImageUrl) {
        fd.append('featured_image', '');
      }
      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEdit) {
        await api.patch(`/articles/${id}/`, fd, cfg);
        toast.success('Article updated');
      } else {
        await api.post('/articles/', fd, cfg);
        toast.success('Article created');
      }
      navigate('/admin/articles');
    } catch (err) {
      const errors = err.response?.data;
      if (errors && typeof errors === 'object') {
        toast.error(String(Object.values(errors).flat()[0]));
      } else {
        toast.error('Failed to save article');
      }
    } finally {
      setLoading(false);
    }
  };

  /* loading state */
  if (fetching) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#111111' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
            style={{ borderTopColor: '#FF6B00', borderRightColor: 'rgba(255,107,0,0.3)' }}
          />
          <p className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>Loading article…</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: '#111111', padding: '8px', zIndex: 10 }}
    >
      {/* Outer rounded window */}
      <motion.div
        className="flex flex-col w-full h-full overflow-hidden"
        style={{ background: '#161616', borderRadius: '16px', border: '1px solid #2a2a2a' }}
        initial={{ opacity: 0, y: 20, scale: 0.99 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >

        {/* TOP NAVBAR */}
        <nav
          className="flex items-center justify-between px-4 shrink-0"
          style={{ height: '56px', background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}
        >
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0" style={{ width: '240px' }}>
            <button
              type="button"
              onClick={() => navigate('/admin/articles')}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all shrink-0"
              style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid #2a2a2a' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
            >
              <ArrowLeft size={15} />
            </button>
            <span className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.22)' }}>
              Edited {fmtEdited(updatedAt)}
            </span>
          </div>

          {/* Center breadcrumb */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-center">
            <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Articles</span>
            <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
            <span className="text-[13px] font-semibold text-white truncate max-w-[260px]" title={form.title || 'Untitled'}>
              {form.title || 'Untitled'}
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0" style={{ width: '240px', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 h-8 rounded-lg text-[12px] font-black text-white transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #FF6B00 0%, #cc4400 100%)',
                boxShadow: '0 4px 0 #7a2800, 0 6px 14px rgba(255,107,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                transform: 'translateY(-2px)',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 6px 0 #7a2800, 0 10px 20px rgba(255,107,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 0 #7a2800, 0 6px 14px rgba(255,107,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseDown={e  => { e.currentTarget.style.boxShadow = '0 1px 0 #7a2800, 0 2px 6px rgba(255,107,0,0.25), inset 0 1px 0 rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(1px)'; }}
              onMouseUp={e    => { e.currentTarget.style.boxShadow = '0 4px 0 #7a2800, 0 6px 14px rgba(255,107,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            >
              <Save size={12} strokeWidth={2.5} />
              {loading ? 'Saving…' : isEdit ? 'Update' : 'Publish'}
            </button>
          </div>
        </nav>

        {/* BODY */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* LEFT SIDEBAR */}
          <aside
            className="flex flex-col shrink-0 overflow-y-auto"
            style={{ width: '260px', background: '#1c1c1c', borderRight: '1px solid #2a2a2a' }}
          >
            <div className="px-4 pt-4 pb-3">
              <p className="text-[11px] font-semibold mb-2 mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Article Structure
              </p>
              <div className="space-y-1.5">
                {CHAPTERS.map(ch => {
                  const isActive = activeSection === ch.key;
                  return (
                    <button
                      key={ch.key}
                      type="button"
                      onClick={() => setActiveSection(ch.key)}
                      className="w-full text-left rounded-lg p-3 transition-all duration-150"
                      style={{
                        background: isActive ? '#2a2a2a' : '#1f1f1f',
                        border: isActive ? '1px solid rgba(255,107,0,0.2)' : '1px solid transparent',
                        borderLeftWidth: '2px',
                        borderLeftColor: isActive ? '#FF6B00' : 'transparent',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#242424'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = '#1f1f1f'; }}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className="text-[10px] font-black mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center rounded-md"
                          style={{
                            background: isActive ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.05)',
                            color: isActive ? '#FF6B00' : 'rgba(255,255,255,0.3)',
                          }}
                        >
                          {ch.num}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold leading-none mb-1"
                            style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>
                            {ch.title}
                          </p>
                          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            {ch.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* MAIN EDITOR */}
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto" style={{ background: '#141414' }}>
            <div className="flex-1 px-16 py-10" style={{ maxWidth: '820px', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>

              {/* CONTENT SECTION */}
              {activeSection === 'content' && (
                <div className="space-y-0">
                  <ImageBlock
                    imagePreview={imagePreview}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                    handleRemoveImage={handleRemoveImage}
                  />
                  <div className="mt-8">
                    <TitleTextarea
                      value={form.title}
                      onChange={v => setForm(p => ({ ...p, title: v, slug: toSlug(v) }))}
                    />
                  </div>
                  <BlockEditor blocks={blocks} onChange={setBlocks} />
                </div>
              )}

              {/* SEO SECTION */}
              {activeSection === 'seo' && (
                <div>
                  <h2 className="font-black text-white mb-1" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
                    SEO &amp; Metadata
                  </h2>
                  <p className="text-[13px] mb-8" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Optimise how your article appears in search engines.
                  </p>
                  <div className="rounded-xl p-6 space-y-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                    <div>
                      <FieldLabel>Meta Title</FieldLabel>
                      <DarkInput
                        name="meta_title"
                        value={form.meta_title}
                        onChange={handleChange}
                        placeholder="Custom title for search engines…"
                      />
                    </div>
                    <div>
                      <FieldLabel>Meta Description</FieldLabel>
                      <DarkTextarea
                        name="meta_description"
                        value={form.meta_description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Brief summary shown in search results…"
                      />
                    </div>
                    <div>
                      <FieldLabel>
                        Slug{' '}
                        <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                          — auto-generated
                        </span>
                      </FieldLabel>
                      <div
                        className="flex items-center rounded-lg overflow-hidden"
                        style={{ border: '1px solid #2a2a2a', background: '#111111', opacity: 0.7 }}
                      >
                        <span
                          className="px-3 py-3 text-[13px] shrink-0 select-none"
                          style={{ color: 'rgba(255,255,255,0.25)', borderRight: '1px solid #2a2a2a', background: '#1a1a1a' }}
                        >
                          /articles/
                        </span>
                        <span className="flex-1 px-3 py-3 text-[13px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          {form.slug || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SETTINGS SECTION */}
              {activeSection === 'settings' && (
                <div>
                  <h2 className="font-black text-white mb-1" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
                    Article Settings
                  </h2>
                  <p className="text-[13px] mb-8" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Control visibility, classification, and display options.
                  </p>
                  <div className="space-y-4">

                    {/* Status + Category + Toggles */}
                    <div className="rounded-xl p-6 space-y-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <FieldLabel>Status</FieldLabel>
                          <DarkSelect name="status" value={form.status} onChange={handleChange}>
                            <option value="nouveau"      style={{ background: '#111' }}>New</option>
                            <option value="brouillon_ia" style={{ background: '#111' }}>AI Draft</option>
                            <option value="en_revision"  style={{ background: '#111' }}>In Review</option>
                            <option value="publie"       style={{ background: '#111' }}>Published</option>
                            <option value="archive"      style={{ background: '#111' }}>Archived</option>
                          </DarkSelect>
                        </div>
                        <div>
                          <FieldLabel>Category</FieldLabel>
                          <DarkSelect name="category" value={form.category} onChange={handleChange}>
                            <option value="" style={{ background: '#111' }}>No category</option>
                            {categories.map(c => (
                              <option key={c.id} value={c.id} style={{ background: '#111' }}>{c.name}</option>
                            ))}
                          </DarkSelect>
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '16px' }}>
                        <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <div>
                            <p className="text-[13px] font-semibold text-white">Featured article</p>
                            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Pin to homepage featured slot</p>
                          </div>
                          <Toggle
                            checked={form.is_featured}
                            onChange={() => setForm(p => ({ ...p, is_featured: !p.is_featured }))}
                          />
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="text-[13px] font-semibold text-white">Breaking news</p>
                            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Show in the breaking news ticker</p>
                          </div>
                          <Toggle
                            checked={form.is_breaking}
                            onChange={() => setForm(p => ({ ...p, is_breaking: !p.is_breaking }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="rounded-xl p-6" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                      <div className="flex items-center justify-between mb-3">
                        <FieldLabel>Tags</FieldLabel>
                        {form.tag_ids.length > 0 && (
                          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            {form.tag_ids.length} selected
                          </span>
                        )}
                      </div>
                      <TagSelector
                        tags={tags}
                        value={form.tag_ids}
                        onChange={tagIds => setForm(p => ({ ...p, tag_ids: tagIds }))}
                      />
                    </div>

                    {/* Cover image */}
                    <div className="rounded-xl p-6" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                      <ImageBlock
                        imagePreview={imagePreview}
                        fileInputRef={fileInputRef}
                        handleFileChange={handleFileChange}
                        handleRemoveImage={handleRemoveImage}
                      />
                    </div>

                    {/* Media */}
                    {mediaItems.length > 0 && (
                      <div className="rounded-xl p-6" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                        <FieldLabel>Media</FieldLabel>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {mediaItems.map(m => {
                            const active = form.media_ids.includes(m.id);
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => handleMultiSelect('media_ids', m.id)}
                                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150"
                                style={active
                                  ? { background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.28)', color: '#818cf8' }
                                  : { background: '#1f1f1f', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.35)' }
                                }
                              >
                                {m.alt_text || m.caption || `Media #${m.id}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </motion.div>

      {/* Floating help button */}
      <button
        type="button"
        className="fixed bottom-6 right-6 w-11 h-11 flex items-center justify-center rounded-full shadow-xl transition-all duration-150"
        style={{ background: '#1f1f1f', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.3)', zIndex: 50 }}
        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'; e.currentTarget.style.background = '#242424'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.background = '#1f1f1f'; }}
      >
        <HelpCircle size={18} />
      </button>
    </form>
  );
}
