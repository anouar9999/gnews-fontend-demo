import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '', content: '', meta_title: '', meta_description: '',
    featured_image: '', status: 'nouveau', is_featured: false,
    is_breaking: false, category: '', tag_ids: [], media_ids: [],
  });
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
        content: data.content || '',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        featured_image: data.featured_image || '',
        status: data.status || 'nouveau',
        is_featured: data.is_featured || false,
        is_breaking: data.is_breaking || false,
        category: data.category?.id || '',
        tag_ids: data.tags?.map((t) => t.id) || [],
        media_ids: data.media?.map((m) => m.id) || [],
      });
      setFetching(false);
    }).catch(() => {
      toast.error('Failed to load article');
      navigate('/articles');
    });
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleMultiSelect = (name, value) => {
    const numVal = Number(value);
    setForm((prev) => ({
      ...prev,
      [name]: prev[name].includes(numVal) ? prev[name].filter((v) => v !== numVal) : [...prev[name], numVal],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        category: form.category || null,
      };
      if (isEdit) {
        await api.put(`/articles/${id}/`, payload);
        toast.success('Article updated');
      } else {
        await api.post('/articles/', payload);
        toast.success('Article created');
      }
      navigate('/articles');
    } catch (err) {
      const errors = err.response?.data;
      if (errors && typeof errors === 'object') {
        const firstError = Object.values(errors).flat()[0];
        toast.error(String(firstError));
      } else {
        toast.error('Failed to save article');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/articles')} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Article' : 'New Article'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea name="content" value={form.content} onChange={handleChange} required rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input name="meta_title" value={form.meta_title} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
              <input name="featured_image" value={form.featured_image} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea name="meta_description" value={form.meta_description} onChange={handleChange} rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="nouveau">New</option>
                <option value="brouillon_ia">AI Draft</option>
                <option value="en_revision">In Review</option>
                <option value="publie">Published</option>
                <option value="archive">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_breaking" checked={form.is_breaking} onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
              <span className="text-sm text-gray-700">Breaking News</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {tags.map((tag) => (
                <button key={tag.id} type="button" onClick={() => handleMultiSelect('tag_ids', tag.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    form.tag_ids.includes(tag.id) ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}>
                  {tag.name}
                </button>
              ))}
              {tags.length === 0 && <p className="text-sm text-gray-500">No tags available</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {mediaItems.map((m) => (
                <button key={m.id} type="button" onClick={() => handleMultiSelect('media_ids', m.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    form.media_ids.includes(m.id) ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
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
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <Save size={16} />
            {loading ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}
          </button>
          <button type="button" onClick={() => navigate('/articles')}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 font-medium rounded-lg hover:bg-gray-200 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
