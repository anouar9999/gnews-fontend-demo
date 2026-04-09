import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const inputCls = 'w-full px-3 py-2 bg-[#181818] border border-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] placeholder-gray-600';
const labelCls = 'block text-sm font-medium text-gray-300 mb-1';

export default function MediaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ url: '', alt_text: '', caption: '', credit: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/media/${id}/`).then(({ data }) => {
      setForm({ url: data.url, alt_text: data.alt_text, caption: data.caption, credit: data.credit });
      setFetching(false);
    }).catch(() => { toast.error('Failed to load media'); navigate('/admin/media'); });
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) await api.put(`/media/${id}/`, form);
      else await api.post('/media/', form);
      toast.success(isEdit ? 'Media updated' : 'Media created');
      navigate('/admin/media');
    } catch (err) {
      const msg = err.response?.data ? Object.values(err.response.data).flat()[0] : 'Failed to save';
      toast.error(String(msg));
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/media')} className="p-2 hover:bg-[#1c1c1c] rounded-lg text-gray-300"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Media' : 'New Media'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-lg bg-[#111] rounded-lg border border-[#1f1f1f] p-6 space-y-4">
        <div>
          <label className={labelCls}>URL *</label>
          <input name="url" value={form.url} onChange={handleChange} required className={inputCls} />
        </div>
        {form.url && (
          <div className="rounded-lg overflow-hidden border border-[#2a2a2a] bg-[#181818]">
            <img src={form.url} alt="Preview" className="max-h-48 mx-auto object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        )}
        <div>
          <label className={labelCls}>Alt Text *</label>
          <input name="alt_text" value={form.alt_text} onChange={handleChange} required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Caption</label>
          <textarea name="caption" value={form.caption} onChange={handleChange} rows={3} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Credit</label>
          <input name="credit" value={form.credit} onChange={handleChange} className={inputCls} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B00] text-white font-medium rounded-lg hover:bg-[#cc5500] disabled:opacity-50 transition-colors">
            <Save size={16} /> {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate('/admin/media')}
            className="px-6 py-2.5 text-gray-400 bg-[#1c1c1c] rounded-lg hover:bg-[#252525] transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
}
