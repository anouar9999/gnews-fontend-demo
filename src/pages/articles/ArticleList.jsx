import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Send, Archive, Eye, Star, Zap } from 'lucide-react';
import api from '../../api/axios';
import DataTable from '../../components/DataTable';
import DeleteModal from '../../components/DeleteModal';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ArticleList() {
  const { canEdit, canDelete } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const category = searchParams.get('category') || '';

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      if (status) params.status = status;
      if (category) params.category = category;
      const { data } = await api.get('/articles/', { params });
      setArticles(data.results);
      setTotalPages(Math.ceil(data.count / 20));
    } catch {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, category]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    api.get('/categories/', { params: { page_size: 100 } }).then(({ data }) => setCategories(data.results)).catch(() => {});
  }, []);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const handleAction = async (action, article) => {
    try {
      if (action === 'publish') {
        await api.post(`/articles/${article.id}/publish/`);
        toast.success('Article published');
      } else if (action === 'archive') {
        await api.post(`/articles/${article.id}/archive/`);
        toast.success('Article archived');
      } else if (action === 'delete') {
        setDeleteTarget(article);
        return;
      }
      fetchArticles();
    } catch {
      toast.error(`Failed to ${action} article`);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/articles/${deleteTarget.id}/`);
      toast.success('Article deleted');
      setDeleteTarget(null);
      fetchArticles();
    } catch {
      toast.error('Failed to delete article');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (row) => (
        <div className="max-w-xs">
          <p className="font-medium text-gray-800 truncate">{row.title}</p>
          <p className="text-xs text-gray-500 truncate">{row.category?.name || '—'}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'flags',
      label: 'Flags',
      render: (row) => (
        <div className="flex gap-1">
          {row.is_featured && <Star size={16} className="text-yellow-500" />}
          {row.is_breaking && <Zap size={16} className="text-red-500" />}
        </div>
      ),
    },
    {
      key: 'view_count',
      label: 'Views',
      render: (row) => <span className="flex items-center gap-1 text-gray-500"><Eye size={14} />{row.view_count}</span>,
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (row) => <span className="text-gray-500 text-xs">{new Date(row.created_at).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          {canEdit && (
            <>
              <Link to={`/articles/${row.id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                <Pencil size={15} />
              </Link>
              {row.status !== 'publie' && (
                <button onClick={() => handleAction('publish', row)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Publish">
                  <Send size={15} />
                </button>
              )}
              {row.status !== 'archive' && (
                <button onClick={() => handleAction('archive', row)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded" title="Archive">
                  <Archive size={15} />
                </button>
              )}
            </>
          )}
          {canDelete && (
            <button onClick={() => handleAction('delete', row)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Articles</h1>
        {canEdit && (
          <Link to="/articles/new" className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={16} /> New Article
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <select
          value={status}
          onChange={(e) => updateParam('status', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="nouveau">New</option>
          <option value="brouillon_ia">AI Draft</option>
          <option value="en_revision">In Review</option>
          <option value="publie">Published</option>
          <option value="archive">Archived</option>
        </select>
        <select
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : (
        <DataTable
          columns={columns}
          data={articles}
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => updateParam('page', String(p))}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          title="Delete Article"
          message={`Are you sure you want to delete "${deleteTarget.title}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
