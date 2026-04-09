import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import DataTable from '../../components/DataTable';
import DeleteModal from '../../components/DeleteModal';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const typeLabels = { game: 'Game', platform: 'Platform', genre: 'Genre', general: 'General' };

export default function TagList() {
  const { canEdit, canDelete } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tags, setTags] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      if (type) params.type = type;
      const { data } = await api.get('/tags/', { params });
      setTags(data.results);
      setTotalPages(Math.ceil(data.count / 20));
    } catch { toast.error('Failed to load tags'); }
    finally { setLoading(false); }
  }, [page, search, type]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/tags/${deleteTarget.id}/`);
      toast.success('Tag deleted');
      setDeleteTarget(null);
      fetchData();
    } catch { toast.error('Failed to delete tag'); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-medium text-white">{row.name}</span> },
    { key: 'slug', label: 'Slug', render: (row) => <code className="text-xs bg-[#1A1A1A] px-2 py-0.5 rounded">{row.slug}</code> },
    {
      key: 'type', label: 'Type',
      render: (row) => <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">{typeLabels[row.type] || row.type}</span>,
    },
    { key: 'created_at', label: 'Created', render: (row) => <span className="text-xs text-gray-500">{new Date(row.created_at).toLocaleDateString()}</span> },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          {canEdit && <Link to={`/admin/tags/${row.id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-500/10 rounded"><Pencil size={15} /></Link>}
          {canDelete && <button onClick={() => setDeleteTarget(row)} className="p-1.5 text-red-600 hover:bg-red-500/10 rounded"><Trash2 size={15} /></button>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Tags</h1>
        {canEdit && (
          <Link to="/admin/tags/new" className="flex items-center gap-1.5 px-4 py-2 bg-[#FF6B00] text-white text-sm font-medium rounded-lg hover:bg-[#cc5500] transition-colors">
            <Plus size={16} /> New Tag
          </Link>
        )}
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input type="text" placeholder="Search tags..." value={search} onChange={(e) => updateParam('search', e.target.value)}
          className="px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg text-sm outline-none focus:border-[#FF6B00] transition-colors w-64" />
        <select value={type} onChange={(e) => updateParam('type', e.target.value)}
          className="px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg text-sm outline-none focus:border-[#FF6B00] transition-colors">
          <option value="">All Types</option>
          <option value="game">Game</option>
          <option value="platform">Platform</option>
          <option value="genre">Genre</option>
          <option value="general">General</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]" /></div>
      ) : (
        <DataTable columns={columns} data={tags} page={page} totalPages={totalPages} onPageChange={(p) => updateParam('page', String(p))} />
      )}
      {deleteTarget && <DeleteModal title="Delete Tag" message={`Delete "${deleteTarget.name}"?`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
