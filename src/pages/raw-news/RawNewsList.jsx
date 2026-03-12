import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, ExternalLink, CheckSquare, Square, MinusSquare } from 'lucide-react';
import api from '../../api/axios';
import DataTable from '../../components/DataTable';
import DeleteModal from '../../components/DeleteModal';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RawNewsList() {
  const { canEdit, canDelete } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rawNews, setRawNews] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      if (status) params.status = status;
      const { data } = await api.get('/raw-news/', { params });
      setRawNews(data.results);
      setTotalPages(Math.ceil(data.count / 20));
    } catch { toast.error('Failed to load raw news'); }
    finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setSelected(new Set()); }, [page, search, status]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === rawNews.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rawNews.map((r) => r.id)));
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/raw-news/${deleteTarget.id}/`);
      toast.success('Raw news deleted');
      setDeleteTarget(null);
      setSelected((prev) => { const next = new Set(prev); next.delete(deleteTarget.id); return next; });
      fetchData();
    } catch { toast.error('Failed to delete raw news'); }
  };

  const confirmBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      const ids = [...selected];
      await api.post('/raw-news/bulk-delete/', { ids });
      toast.success(`Deleted ${ids.length} item(s)`);
      setSelected(new Set());
      setShowBulkDelete(false);
      fetchData();
    } catch { toast.error('Failed to bulk delete'); }
    finally { setBulkDeleting(false); }
  };

  const bulkUpdateStatus = async (newStatus) => {
    try {
      const ids = [...selected];
      await api.post('/raw-news/bulk-status/', { ids, status: newStatus });
      toast.success(`Updated ${ids.length} item(s)`);
      setSelected(new Set());
      fetchData();
    } catch { toast.error('Failed to update status'); }
  };

  const allSelected = rawNews.length > 0 && selected.size === rawNews.length;
  const someSelected = selected.size > 0 && selected.size < rawNews.length;

  const columns = [
    {
      key: 'select', label: (
        <button onClick={toggleAll} className="p-0.5 text-gray-500 hover:text-[#FF6B00]">
          {allSelected ? <CheckSquare size={18} /> : someSelected ? <MinusSquare size={18} /> : <Square size={18} />}
        </button>
      ),
      render: (row) => (
        <button onClick={(e) => { e.stopPropagation(); toggleSelect(row.id); }} className="p-0.5 text-gray-500 hover:text-[#FF6B00]">
          {selected.has(row.id) ? <CheckSquare size={18} className="text-[#FF6B00]" /> : <Square size={18} />}
        </button>
      ),
    },
    {
      key: 'title', label: 'Title',
      render: (row) => <span className="font-medium text-white truncate max-w-[250px] block">{row.title || `#${row.id}`}</span>,
    },
    {
      key: 'url', label: 'URL',
      render: (row) => row.url ? (
        <a href={row.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-xs truncate max-w-[200px]">
          {row.url} <ExternalLink size={12} />
        </a>
      ) : <span className="text-gray-400">-</span>,
    },
    {
      key: 'status', label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'source', label: 'Source',
      render: (row) => <span className="text-gray-400">{row.source || '-'}</span>,
    },
    {
      key: 'created_at', label: 'Created',
      render: (row) => <span className="text-gray-500 text-xs">{new Date(row.created_at).toLocaleDateString()}</span>,
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          {canEdit && <Link to={`/raw-news/${row.id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-500/10 rounded"><Pencil size={15} /></Link>}
          {canDelete && <button onClick={() => setDeleteTarget(row)} className="p-1.5 text-red-600 hover:bg-red-500/10 rounded"><Trash2 size={15} /></button>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Raw News</h1>
        {canEdit && (
          <Link to="/raw-news/new" className="flex items-center gap-1.5 px-4 py-2 bg-[#FF6B00] text-white text-sm font-medium rounded-lg hover:bg-[#cc5500] transition-colors">
            <Plus size={16} /> New Raw News
          </Link>
        )}
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg">
          <span className="text-sm font-medium text-white">{selected.size} selected</span>
          <div className="flex gap-2 ml-auto">
            {canEdit && (
              <>
                <button onClick={() => bulkUpdateStatus('nouveau')}
                  className="px-3 py-1.5 text-xs font-medium bg-[#222] text-gray-300 rounded-lg hover:bg-[#2a2a2a] transition-colors">
                  Mark New
                </button>
                <button onClick={() => bulkUpdateStatus('traite')}
                  className="px-3 py-1.5 text-xs font-medium bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors">
                  Mark Processed
                </button>
                <button onClick={() => bulkUpdateStatus('ignore')}
                  className="px-3 py-1.5 text-xs font-medium bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors">
                  Mark Ignored
                </button>
              </>
            )}
            {canDelete && (
              <button onClick={() => setShowBulkDelete(true)}
                className="px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
                Delete Selected
              </button>
            )}
            <button onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <input type="text" placeholder="Search raw news..." value={search} onChange={(e) => updateParam('search', e.target.value)}
          className="px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg text-sm outline-none focus:border-[#FF6B00] transition-colors w-64" />
        <select value={status} onChange={(e) => updateParam('status', e.target.value)}
          className="px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg text-sm outline-none focus:border-[#FF6B00] transition-colors">
          <option value="">All Statuses</option>
          <option value="nouveau">New</option>
          <option value="traite">Processed</option>
          <option value="ignore">Ignored</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]" /></div>
      ) : (
        <DataTable columns={columns} data={rawNews} page={page} totalPages={totalPages} onPageChange={(p) => updateParam('page', String(p))} />
      )}
      {deleteTarget && <DeleteModal title="Delete Raw News" message={`Delete "${deleteTarget.title || `#${deleteTarget.id}`}"?`} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
      {showBulkDelete && (
        <DeleteModal
          title="Delete Selected"
          message={`Delete ${selected.size} selected item(s)? This action cannot be undone.`}
          onConfirm={confirmBulkDelete}
          onCancel={() => setShowBulkDelete(false)}
        />
      )}
    </div>
  );
}
