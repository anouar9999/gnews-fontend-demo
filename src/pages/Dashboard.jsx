import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FolderTree, Tags, Radio, Image, Eye } from 'lucide-react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({ articles: 0, categories: 0, tags: 0, sources: 0, media: 0 });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const requests = [
          api.get('/articles/', { params: { page_size: 5 } }),
          api.get('/categories/', { params: { page_size: 1 } }),
          api.get('/tags/', { params: { page_size: 1 } }),
        ];
        if (isAdmin) {
          requests.push(
            api.get('/sources/', { params: { page_size: 1 } }),
            api.get('/media/', { params: { page_size: 1 } }),
          );
        }
        const results = await Promise.all(requests);
        setStats({
          articles: results[0].data.count,
          categories: results[1].data.count,
          tags: results[2].data.count,
          sources: isAdmin ? results[3].data.count : 0,
          media: isAdmin ? results[4].data.count : 0,
        });
        setRecentArticles(results[0].data.results);
      } catch {
        // stats will remain 0
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [isAdmin]);

  const allStatCards = [
    { label: 'Articles', value: stats.articles, icon: FileText, color: 'bg-blue-500', link: '/articles' },
    { label: 'Categories', value: stats.categories, icon: FolderTree, color: 'bg-green-500', link: '/categories' },
    { label: 'Tags', value: stats.tags, icon: Tags, color: 'bg-purple-500', link: '/tags' },
    { label: 'Sources', value: stats.sources, icon: Radio, color: 'bg-orange-500', link: '/sources', adminOnly: true },
    { label: 'Media', value: stats.media, icon: Image, color: 'bg-pink-500', link: '/media', adminOnly: true },
  ];

  const statCards = allStatCards.filter((card) => !card.adminOnly || isAdmin);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAdmin ? 'lg:grid-cols-5' : 'lg:grid-cols-3'} gap-4 mb-8`}>
        {statCards.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} to={link} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
              </div>
              <div className={`${color} p-2.5 rounded-lg`}>
                <Icon className="text-white" size={20} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Articles</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentArticles.map((article) => (
            <Link key={article.id} to={`/articles/${article.id}/edit`} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-medium text-gray-800 truncate">{article.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{article.category?.name || 'No category'}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Eye size={14} />
                  {article.view_count}
                </div>
                <StatusBadge status={article.status} />
              </div>
            </Link>
          ))}
          {recentArticles.length === 0 && (
            <p className="p-4 text-sm text-gray-500 text-center">No articles yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
