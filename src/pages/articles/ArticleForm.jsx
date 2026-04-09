import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const inputCls = 'w-full px-3 py-2 bg-[#181818] border border-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] placeholder-gray-600';
const labelCls = 'block text-sm font-medium text-gray-300 mb-1';
const cardCls = 'bg-[#111] rounded-lg border border-[#1f1f1f] p-6 space-y-4';

export default function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '', slug: '', content: '', meta_title: '', meta_description: '',
    status: 'nouveau', is_featured: false,
    is_breaking: false, category: '', tag_ids: [], media_ids: [],
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    Promise.all([
      api.get('/categories/', { params: { page_size: 100 } }),
      api.get('/tags/', { params: { page_size: 100 } }),
      api.get('/media/', { params: { page_size: 100 } }),
    ]).then(([catRes, tagRes, mediaRes]) => {
      setCategories(catRes.data.results);
      setTags(tagRes.data.results);
      setMediaItems(mediaRes.data.results);
    });
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/articles/${id}/`).then(({ data }) => {
      setForm({
        title: data.title || '',
        slug: data.slug || '',
        content: data.content || '',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        status: data.status || 'nouveau',
        is_featured: data.is_featured || false,
        is_breaking: data.is_breaking || false,
        category: data.category?.id || '',
        tag_ids: data.tags?.map((t) => t.id) || [],
        media_ids: data.media?.map((m) => m.id) || [],
      });
      if (data.featured_image) {
        setExistingImageUrl(data.featured_image);
        setImagePreview(data.featured_image);
      }
      setFetching(false);
    }).catch(() => {
      toast.error('Failed to load article');
      navigate('/admin/articles');
    });
  }, [id, isEdit, navigate]);

  const toSlug = (text) =>
    text.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'title' && !isEdit && !slugManuallyEdited) {
        updated.slug = toSlug(value);
      }
      return updated;
    });
  };

  const handleSlugChange = (e) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleMultiSelect = (name, value) => {
    const numVal = Number(value);
    setForm((prev) => ({
      ...prev,
      [name]: prev[name].includes(numVal) ? prev[name].filter((v) => v !== numVal) : [...prev[name], numVal],
    }));
  };

  const handleFileChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      if (form.slug) formData.append('slug', form.slug);
      formData.append('content', form.content);
      formData.append('meta_title', form.meta_title);
      formData.append('meta_description', form.meta_description);
      formData.append('status', form.status);
      formData.append('is_featured', form.is_featured);
      formData.append('is_breaking', form.is_breaking);
      formData.append('category', form.category || '');
      form.tag_ids.forEach((tid) => formData.append('tag_ids', tid));
      form.media_ids.forEach((mid) => formData.append('media_ids', mid));

      if (imageFile) {
        formData.append('featured_image', imageFile);
      } else if (!imagePreview && existingImageUrl) {
        formData.append('featured_image', '');
      }

      if (isEdit) {
        await api.patch(`/articles/${id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Article updated');
      } else {
        await api.post('/articles/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
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

  if (fetching) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]" /></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/articles')} className="p-2 hover:bg-[#1c1c1c] rounded-lg text-gray-300 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Article' : 'New Article'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Main fields */}
        <div className={cardCls}>
          <div>
            <label className={labelCls}>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>
              Slug
              {!isEdit && <span className="ml-2 text-xs text-gray-500 font-normal">auto-generated from title</span>}
            </label>
            <div className="flex items-center border border-[#2a2a2a] rounded-lg focus-within:ring-2 focus-within:ring-[#FF6B00] overflow-hidden">
              <span className="px-3 py-2 bg-[#1c1c1c] text-gray-500 text-sm border-r border-[#2a2a2a] select-none whitespace-nowrap">/articles/</span>
              <input
                name="slug"
                value={form.slug}
                onChange={handleSlugChange}
                placeholder="auto-generated"
                className="flex-1 px-3 py-2 bg-[#181818] text-white text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Content *</label>
            <textarea name="content" value={form.content} onChange={handleChange} required rows={10} className={inputCls} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Meta Title</label>
              <input name="meta_title" value={form.meta_title} onChange={handleChange} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Featured Image</label>
              {imagePreview ? (
                <div className="relative w-full h-36 rounded-lg overflow-hidden border border-[#2a2a2a] group">
                  <img src={imagePreview} alt="Featured" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#2a2a2a] rounded-lg cursor-pointer hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 transition-colors">
                  <Upload size={24} className="text-gray-500 mb-1" />
                  <span className="text-sm text-gray-500">Click to upload image</span>
                  <span className="text-xs text-gray-600 mt-1">PNG, JPG, WEBP</span>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className={labelCls}>Meta Description</label>
            <textarea name="meta_description" value={form.meta_description} onChange={handleChange} rows={2} className={inputCls} />
          </div>
        </div>

        {/* Status & options */}
        <div className={cardCls}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputCls + ' [&>option]:bg-[#181818]'}>
                <option value="nouveau">New</option>
                <option value="brouillon_ia">AI Draft</option>
                <option value="en_revision">In Review</option>
                <option value="publie">Published</option>
                <option value="archive">Archived</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputCls + ' [&>option]:bg-[#181818]'}>
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange}
                className="w-4 h-4 rounded border-[#2a2a2a] accent-[#FF6B00]" />
              <span className="text-sm text-gray-300">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_breaking" checked={form.is_breaking} onChange={handleChange}
                className="w-4 h-4 rounded border-[#2a2a2a] accent-red-500" />
              <span className="text-sm text-gray-300">Breaking News</span>
            </label>
          </div>
        </div>

        {/* Tags & Media */}
        <div className={cardCls}>
          <div>
            <label className={labelCls}>Tags</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {tags.map((tag) => (
                <button key={tag.id} type="button" onClick={() => handleMultiSelect('tag_ids', tag.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    form.tag_ids.includes(tag.id)
                      ? 'bg-[#FF6B00]/20 border-[#FF6B00]/40 text-[#FF6B00]'
                      : 'bg-[#1c1c1c] border-[#2a2a2a] text-gray-400 hover:bg-[#252525]'
                  }`}>
                  {tag.name}
                </button>
              ))}
              {tags.length === 0 && <p className="text-sm text-gray-500">No tags available</p>}
            </div>
          </div>

          <div>
            <label className={labelCls}>Media</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {mediaItems.map((m) => (
                <button key={m.id} type="button" onClick={() => handleMultiSelect('media_ids', m.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    form.media_ids.includes(m.id)
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                      : 'bg-[#1c1c1c] border-[#2a2a2a] text-gray-400 hover:bg-[#252525]'
                  }`}>
                  {m.alt_text || m.caption || `Media #${m.id}`}
                </button>
              ))}
              {mediaItems.length === 0 && <p className="text-sm text-gray-500">No media available</p>}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B00] text-white font-medium rounded-lg hover:bg-[#cc5500] disabled:opacity-50 transition-colors">
            <Save size={16} />
            {loading ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}
          </button>
          <button type="button" onClick={() => navigate('/admin/articles')}
            className="px-6 py-2.5 text-gray-400 bg-[#1c1c1c] font-medium rounded-lg hover:bg-[#252525] transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
