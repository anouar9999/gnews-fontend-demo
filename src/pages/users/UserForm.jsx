import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const inputCls = 'w-full px-3 py-2 bg-[#181818] border border-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] placeholder-gray-600';
const labelCls = 'block text-sm font-medium text-gray-300 mb-1';

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ username: '', email: '', password: '', user_type: 'editor' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/auth/users/${id}/`).then(({ data }) => {
      setForm({ username: data.username, email: data.email, password: '', user_type: data.user_type });
      setFetching(false);
    }).catch(() => { toast.error('Failed to load user'); navigate('/admin/users'); });
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        const { password, ...payload } = form;
        await api.patch(`/auth/users/${id}/`, payload);
      } else {
        await api.post('/auth/users/', form);
      }
      toast.success(isEdit ? 'User updated' : 'User created');
      navigate('/admin/users');
    } catch (err) {
      const msg = err.response?.data ? Object.values(err.response.data).flat()[0] : 'Failed to save';
      toast.error(String(msg));
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/users')} className="p-2 hover:bg-[#1c1c1c] rounded-lg text-gray-300"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit User' : 'New User'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-lg bg-[#111] rounded-lg border border-[#1f1f1f] p-6 space-y-4">
        <div>
          <label className={labelCls}>Username *</label>
          <input name="username" value={form.username} onChange={handleChange} required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputCls} />
        </div>
        {!isEdit && (
          <div>
            <label className={labelCls}>Password *</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required={!isEdit} minLength={8} className={inputCls} />
          </div>
        )}
        <div>
          <label className={labelCls}>Role</label>
          <select name="user_type" value={form.user_type} onChange={handleChange} className={inputCls + ' [&>option]:bg-[#181818]'}>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B00] text-white font-medium rounded-lg hover:bg-[#cc5500] disabled:opacity-50 transition-colors">
            <Save size={16} /> {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate('/admin/users')}
            className="px-6 py-2.5 text-gray-400 bg-[#1c1c1c] rounded-lg hover:bg-[#252525] transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
}
