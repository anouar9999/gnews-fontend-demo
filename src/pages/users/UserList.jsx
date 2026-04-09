import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import DataTable from '../../components/DataTable';
import DeleteModal from '../../components/DeleteModal';
import toast from 'react-hot-toast';

export default function UserList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      const { data } = await api.get('/auth/users/', { params });
      setUsers(data.results);
      setTotalPages(Math.ceil(data.count / 20));
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/auth/users/${deleteTarget.id}/`);
      toast.success('User deleted');
      setDeleteTarget(null);
      fetchData();
    } catch { toast.error('Failed to delete user'); }
  };

  const columns = [
    { key: 'username', label: 'Username', render: (row) => <span className="font-medium text-white">{row.username}</span> },
    { key: 'email', label: 'Email', render: (row) => <span className="text-gray-600">{row.email}</span> },
    {
      key: 'user_type', label: 'Role',
      render: (row) => {
        const colors = { editor: 'bg-blue-100 text-blue-700', viewer: 'bg-gray-100 text-gray-700' };
        return <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[row.user_type] || ''}`}>{row.user_type}</span>;
      },
    },
    {
      key: 'is_active', label: 'Status',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          <Link to={`/admin/users/${row.id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={15} /></Link>
          <button onClick={() => setDeleteTarget(row)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <Link to="/admin/users/new" className="flex items-center gap-1.5 px-4 py-2 bg-[#FF6B00] text-white text-sm font-medium rounded-lg hover:bg-[#cc5500] transition-colors">
          <Plus size={16} /> New User
        </Link>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input type="text" placeholder="Search users..." value={search} onChange={(e) => updateParam('search', e.target.value)}
          className="px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg text-sm outline-none focus:border-[#FF6B00] transition-colors w-64" />
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]" /></div>
      ) : (
        <DataTable columns={columns} data={users} page={page} totalPages={totalPages} onPageChange={(p) => updateParam('page', String(p))} />
      )}
      {deleteTarget && <DeleteModal title="Delete User" message={`Delete "${deleteTarget.username}"?`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
