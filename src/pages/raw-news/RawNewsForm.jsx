import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const inputCls = 'w-full px-3 py-2 bg-[#181818] border border-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] placeholder-gray-600';
const labelCls = 'block text-sm font-medium text-gray-300 mb-1';

export default function RawNewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ source: '', title: '', url: '', content: '', status: 'nouveau', raw_data: '' });
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    api.get('/sources/', { params: { page_size: 100 } }).then(({ data }) => {
      setSources(data.results || data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/raw-news/${id}/`).then(({ data }) => {
      setForm({
        source: data.source || '',
        title: data.title || '',
        url: data.url || '',
        content: data.content || '',
        status: data.status || 'nouveau',
        raw_data: data.raw_data ? JSON.stringify(data.raw_data, null, 2) : '',
      });
      setFetching(false);
    }).catch(() => { toast.error('Failed to load raw news'); navigate('/admin/raw-news'); });
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        source: form.source || null,
        raw_data: form.raw_data ? JSON.parse(form.raw_data) : null,
      };
      if (isEdit) await api.put(`/raw-news/${id}/`, payload);
      else await api.post('/raw-news/', payload);
      toast.success(isEdit ? 'Raw news updated' : 'Raw news created');
      navigate('/admin/raw-news');
    } catch (err) {
      if (err instanceof SyntaxError) {
        toast.error('Invalid JSON in raw data field');
      } else {
        const msg = err.response?.data ? Object.values(err.response.data).flat()[0] : 'Failed to save';
        toast.error(String(msg));
      }
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/raw-news')} className="p-2 hover:bg-[#1c1c1c] rounded-lg text-gray-300"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Raw News' : 'New Raw News'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-lg bg-[#111] rounded-lg border border-[#1f1f1f] p-6 space-y-4">
        <div>
          <label className={labelCls}>Source</label>
          <select name="source" value={form.source} onChange={handleChange} className={inputCls + ' [&>option]:bg-[#181818]'}>
            <option value="">No source</option>
            {sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Title</label>
          <input name="title" value={form.title} onChange={handleChange} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>URL</label>
          <input name="url" value={form.url} onChange={handleChange} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Content</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={5} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputCls + ' [&>option]:bg-[#181818]'}>
            <option value="nouveau">New</option>
            <option value="traite">Processed</option>
            <option value="ignore">Ignored</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Raw Data (JSON)</label>
          <textarea name="raw_data" value={form.raw_data} onChange={handleChange} rows={5} placeholder='{"key": "value"}'
            className={inputCls + ' font-mono text-sm'} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B00] text-white font-medium rounded-lg hover:bg-[#cc5500] disabled:opacity-50 transition-colors">
            <Save size={16} /> {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate('/admin/raw-news')}
            className="px-6 py-2.5 text-gray-400 bg-[#1c1c1c] rounded-lg hover:bg-[#252525] transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
}
