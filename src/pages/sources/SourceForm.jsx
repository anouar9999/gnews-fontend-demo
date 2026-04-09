import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const inputCls = 'w-full px-3 py-2 bg-[#181818] border border-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] placeholder-gray-600';
const labelCls = 'block text-sm font-medium text-gray-300 mb-1';

export default function SourceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: '', type: 'rss', url: '', fetch_interval: 30, is_active: true });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/sources/${id}/`).then(({ data }) => {
      setForm({ name: data.name, type: data.type, url: data.url, fetch_interval: data.fetch_interval, is_active: data.is_active });
      setFetching(false);
    }).catch(() => { toast.error('Failed to load source'); navigate('/admin/sources'); });
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, fetch_interval: Number(form.fetch_interval) };
      if (isEdit) await api.put(`/sources/${id}/`, payload);
      else await api.post('/sources/', payload);
      toast.success(isEdit ? 'Source updated' : 'Source created');
      navigate('/admin/sources');
    } catch (err) {
      const msg = err.response?.data ? Object.values(err.response.data).flat()[0] : 'Failed to save';
      toast.error(String(msg));
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/sources')} className="p-2 hover:bg-[#1c1c1c] rounded-lg text-gray-300"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Source' : 'New Source'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-lg bg-[#111] rounded-lg border border-[#1f1f1f] p-6 space-y-4">
        <div>
          <label className={labelCls}>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Type</label>
          <select name="type" value={form.type} onChange={handleChange} className={inputCls + ' [&>option]:bg-[#181818]'}>
            <option value="rss">RSS</option>
            <option value="api">API</option>
            <option value="scraper">Scraper</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>URL *</label>
          <input name="url" value={form.url} onChange={handleChange} required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Fetch Interval (minutes)</label>
          <input name="fetch_interval" type="number" min="1" value={form.fetch_interval} onChange={handleChange} className={inputCls} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange}
            className="w-4 h-4 rounded border-[#2a2a2a] bg-[#181818] accent-[#FF6B00]" />
          <span className="text-sm text-gray-300">Active</span>
        </label>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B00] text-white font-medium rounded-lg hover:bg-[#cc5500] disabled:opacity-50 transition-colors">
            <Save size={16} /> {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate('/admin/sources')}
            className="px-6 py-2.5 text-gray-400 bg-[#1c1c1c] rounded-lg hover:bg-[#252525] transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
}
