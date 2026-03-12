import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Image, LayoutGrid, List } from 'lucide-react';
import api from '../../api/axios';
import DataTable from '../../components/DataTable';
import DeleteModal from '../../components/DeleteModal';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function MediaList() {
  const { canEdit, canDelete } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [media, setMedia] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      const { data } = await api.get('/media/', { params });
      setMedia(data.results);
      setTotalPages(Math.ceil(data.count / 20));
    } catch { toast.error('Failed to load media'); }
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
      await api.delete(`/media/${deleteTarget.id}/`);
      toast.success('Media deleted');
      setDeleteTarget(null);
      fetchData();
    } catch { toast.error('Failed to delete media'); }
  };

  const columns = [
    {
      key: 'preview', label: 'Preview',
      render: (row) => (
        <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
          {row.url ? <img src={row.url} alt={row.alt_text} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />  : null}
          <div className="hidden items-center justify-center w-full h-full"><Image size={16} className="text-gray-400" /></div>
        </div>
      ),
    },
    { key: 'alt_text', label: 'Alt Text', render: (row) => <span className="font-medium text-gray-800">{row.alt_text || '—'}</span> },
    { key: 'caption', label: 'Caption', render: (row) => <span className="text-gray-600 text-sm truncate max-w-[200px] block">{row.caption || '—'}</span> },
    { key: 'credit', label: 'Credit', render: (row) => <span className="text-gray-500 text-xs">{row.credit || '—'}</span> },
    { key: 'created_at', label: 'Created', render: (row) => <span className="text-xs text-gray-500">{new Date(row.created_at).toLocaleDateString()}</span> },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          {canEdit && <Link to={`/media/${row.id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={15} /></Link>}
          {canDelete && <button onClick={() => setDeleteTarget(row)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={15} /></button>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Media</h1>
        <div className="flex items-center gap-2">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}><LayoutGrid size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}><List size={16} /></button>
          </div>
          {canEdit && (
            <Link to="/media/new" className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={16} /> New Media
            </Link>
          )}
        </div>
      </div>
      <div className="mb-4">
        <input type="text" placeholder="Search media..." value={search} onChange={(e) => updateParam('search', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : viewMode === 'grid' ? (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  {item.url ? (
                    <img src={item.url} alt={item.alt_text} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <Image size={24} className="text-gray-400" />
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-800 truncate">{item.alt_text || `Media #${item.id}`}</p>
                  <p className="text-xs text-gray-500 truncate">{item.credit || ''}</p>
                  <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canEdit && <Link to={`/media/${item.id}/edit`} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Pencil size={13} /></Link>}
                    {canDelete && <button onClick={() => setDeleteTarget(item)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={13} /></button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {media.length === 0 && <p className="text-center text-gray-500 py-8">No media found.</p>}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={() => updateParam('page', String(page - 1))} disabled={page <= 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40">Previous</button>
              <span className="px-3 py-1.5 text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button onClick={() => updateParam('page', String(page + 1))} disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40">Next</button>
            </div>
          )}
        </div>
      ) : (
        <DataTable columns={columns} data={media} page={page} totalPages={totalPages} onPageChange={(p) => updateParam('page', String(p))} />
      )}
      {deleteTarget && <DeleteModal title="Delete Media" message={`Delete "${deleteTarget.alt_text || 'this media'}"?`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
