import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const inputCls = 'w-full px-3 py-2 bg-[#181818] border border-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] placeholder-gray-600';
const labelCls = 'block text-sm font-medium text-gray-300 mb-1';

export default function TagForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: '', type: 'general' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/tags/${id}/`).then(({ data }) => {
      setForm({ name: data.name, type: data.type });
      setFetching(false);
    }).catch(() => { toast.error('Failed to load tag'); navigate('/admin/tags'); });
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) await api.put(`/tags/${id}/`, form);
      else await api.post('/tags/', form);
      toast.success(isEdit ? 'Tag updated' : 'Tag created');
      navigate('/admin/tags');
    } catch (err) {
      const msg = err.response?.data ? Object.values(err.response.data).flat()[0] : 'Failed to save';
      toast.error(String(msg));
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/tags')} className="p-2 hover:bg-[#1c1c1c] rounded-lg text-gray-300"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Tag' : 'New Tag'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-lg bg-[#111] rounded-lg border border-[#1f1f1f] p-6 space-y-4">
        <div>
          <label className={labelCls}>Name *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls + ' [&>option]:bg-[#181818]'}>
            <option value="general">General</option>
            <option value="game">Game</option>
            <option value="platform">Platform</option>
            <option value="genre">Genre</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B00] text-white font-medium rounded-lg hover:bg-[#cc5500] disabled:opacity-50 transition-colors">
            <Save size={16} /> {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate('/admin/tags')}
            className="px-6 py-2.5 text-gray-400 bg-[#1c1c1c] rounded-lg hover:bg-[#252525] transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
}
