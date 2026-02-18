import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import DataTable from '../../components/DataTable';
import DeleteModal from '../../components/DeleteModal';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function CategoryList() {
  const { canEdit, canDelete } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
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
      const { data } = await api.get('/categories/', { params });
      setCategories(data.results);
      setTotalPages(Math.ceil(data.count / 20));
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
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
      await api.delete(`/categories/${deleteTarget.id}/`);
      toast.success('Category deleted');
      setDeleteTarget(null);
      fetchData();
    } catch { toast.error('Failed to delete category'); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-medium text-gray-800">{row.name}</span> },
    { key: 'slug', label: 'Slug', render: (row) => <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{row.slug}</code> },
    { key: 'parent', label: 'Parent', render: (row) => row.parent_name || '—' },
    { key: 'created_at', label: 'Created', render: (row) => <span className="text-xs text-gray-500">{new Date(row.created_at).toLocaleDateString()}</span> },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          {canEdit && <Link to={`/categories/${row.id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={15} /></Link>}
          {canDelete && <button onClick={() => setDeleteTarget(row)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={15} /></button>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        {canEdit && (
          <Link to="/categories/new" className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={16} /> New Category
          </Link>
        )}
      </div>
      <div className="mb-4">
        <input type="text" placeholder="Search categories..." value={search} onChange={(e) => updateParam('search', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : (
        <DataTable columns={columns} data={categories} page={page} totalPages={totalPages} onPageChange={(p) => updateParam('page', String(p))} />
      )}
      {deleteTarget && <DeleteModal title="Delete Category" message={`Delete "${deleteTarget.name}"?`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
