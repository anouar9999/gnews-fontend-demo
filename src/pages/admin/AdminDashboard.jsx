import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users, Trophy, Activity, Download, RefreshCw,
  Search, Filter, Pencil, CheckCircle, Trash2,
  ChevronLeft, ChevronRight, Database, Wifi, AlertCircle,
  TrendingUp, TrendingDown,
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const SOURCE_BADGE = {
  rss:     'bg-blue-500/20 text-blue-300 border-blue-500/30',
  api:     'bg-purple-500/20 text-purple-300 border-purple-500/30',
  scraper: 'bg-[#FF6B00]/20 text-orange-300 border-orange-500/30',
};

const STATUS_CFG = {
  publie:       { label: 'Published', cls: 'text-green-400' },
  nouveau:      { label: 'New',       cls: 'text-blue-400' },
  brouillon_ia: { label: 'AI Draft',  cls: 'text-yellow-400' },
  en_revision:  { label: 'Review',    cls: 'text-orange-400' },
  archive:      { label: 'Archived',  cls: 'text-gray-500' },
};

function StatCard({ icon: Icon, label, value, badge, badgeUp }) {
  return (
    <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-5 flex items-start gap-4">
      <div className="p-2.5 bg-[#FF6B00]/10 rounded-lg">
        <Icon size={20} className="text-[#FF6B00]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        {badge && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold mt-1 ${badgeUp ? 'text-green-400' : 'text-red-400'}`}>
            {badgeUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [rawNews, setRawNews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [page, setPage]         = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRawNews = async () => {
    try {
      setLoading(true);
      const params = { page, page_size: 7 };
      if (search) params.search = search;
      if (filter !== 'all') params.type = filter;
      const { data } = await api.get('/raw-news/', { params });
      setRawNews(data.results ?? []);
      setTotalCount(data.count ?? 0);
    } catch {
      // offline — keep empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRawNews(); }, [page, filter]); // eslint-disable-line
  // debounce search
  useEffect(() => {
    const id = setTimeout(() => { setPage(1); fetchRawNews(); }, 400);
    return () => clearTimeout(id);
  }, [search]); // eslint-disable-line

  const handleApprove = async (id) => {
    try {
      await api.patch(`/raw-news/${id}/`, { status: 'traite' });
      toast.success('Marked as processed');
      fetchRawNews();
    } catch {
      toast.error('Could not update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/raw-news/${id}/`);
      toast.success('Deleted');
      fetchRawNews();
    } catch {
      toast.error('Could not delete');
    }
  };

  const totalPages = Math.ceil(totalCount / 7);

  const FILTERS = [
    { key: 'all', label: t('dashboard.all') },
    { key: 'rss', label: t('dashboard.rss') },
    { key: 'api', label: t('dashboard.api') },
    { key: 'scraper', label: t('dashboard.scraper') },
  ];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-white text-2xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users}    label={t('dashboard.totalVisits')}      value="24,592" badge="+12.5%" badgeUp />
        <StatCard icon={Trophy}   label={t('dashboard.tournamentClicks')} value="1,840"  badge="+5.2%"  badgeUp />
        <StatCard icon={Activity} label={t('dashboard.socialEngagement')} value="89.2k"  badge="-2.1%"  badgeUp={false} />
      </div>

      {/* Raw News Feed */}
      <div className="bg-[#111] border border-[#1A1A1A] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-white font-bold">{t('dashboard.rawNewsFeed')}</h2>
            <p className="text-gray-500 text-xs mt-0.5">{t('dashboard.rawNewsSubtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 border border-[#333] rounded-lg hover:border-[#FF6B00] transition-colors">
              <Download size={14} /> {t('dashboard.export')}
            </button>
            <button
              onClick={fetchRawNews}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#cc5500] rounded-lg transition-colors"
            >
              <RefreshCw size={14} /> {t('dashboard.syncScrapers')}
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-[#1A1A1A] flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('dashboard.searchPlaceholder')}
              className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:border-[#FF6B00] transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF6B00]">
              <Filter size={14} />
            </button>
          </div>
          {/* Filter tabs */}
          <div className="flex items-center gap-1">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setFilter(key); setPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  filter === key
                    ? 'bg-[#1A1A1A] text-white border border-[#333]'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1A1A1A]">
                {[t('dashboard.articleDetails'), t('dashboard.source'), t('dashboard.dateFetched'), t('dashboard.status'), t('dashboard.actions')].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-600">Loading...</td></tr>
              ) : rawNews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <p className="text-gray-500 text-sm">No raw news yet.</p>
                    <p className="text-gray-600 text-xs mt-1">Add sources and sync scrapers to start collecting news.</p>
                  </td>
                </tr>
              ) : (
                rawNews.map((item) => {
                  const srcType = item.source_type ?? (item.source ? 'rss' : 'api');
                  const srcBadge = SOURCE_BADGE[srcType] ?? SOURCE_BADGE.api;
                  const statusCfg = STATUS_CFG[item.status] ?? { label: item.status, cls: 'text-gray-400' };
                  const ago = item.created_at ? new Date(item.created_at).toLocaleDateString() : '—';
                  return (
                    <tr key={item.id} className="border-b border-[#111] hover:bg-[#151515] transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-white font-medium truncate max-w-[240px]">{item.title ?? '—'}</p>
                        <p className="text-gray-600 text-[11px] mt-0.5">#{item.id}</p>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${srcBadge}`}>
                          {srcType?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">{ago}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`text-xs font-semibold ${statusCfg.cls}`}>{statusCfg.label}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/raw-news/${item.id}/edit`}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                          >
                            <Pencil size={13} />
                          </Link>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors"
                          >
                            <CheckCircle size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-[#1A1A1A] flex items-center justify-between">
          <span className="text-gray-500 text-xs">
            {t('dashboard.showing')} {totalCount} {t('dashboard.results')}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs text-gray-400 border border-[#222] rounded-lg hover:border-[#FF6B00] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 text-xs rounded-lg transition-colors ${
                  page === p ? 'bg-[#FF6B00] text-white' : 'text-gray-400 hover:bg-[#1A1A1A]'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs text-gray-400 border border-[#222] rounded-lg hover:border-[#FF6B00] disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Event — full width */}
      <div className="bg-gradient-to-br from-[#FF6B00]/80 to-[#cc4400]/80 border border-[#FF6B00]/30 rounded-xl p-5 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end opacity-10 pr-8">
          <Trophy size={100} className="text-white" />
        </div>
        <div className="relative">
          <h2 className="text-white font-bold mb-2">{t('dashboard.upcomingEvent')}</h2>
          <p className="text-orange-100 text-sm leading-relaxed mb-4 max-w-xl">
            &apos;GNEWZ Cup Maroc&apos; registrations are spiking. Ensure server capacity is allocated for the live stream dashboard.
          </p>
          <button className="px-4 py-2 bg-black/40 hover:bg-black/60 text-white text-xs font-bold rounded-lg transition-colors">
            {t('dashboard.manageEvent')}
          </button>
        </div>
      </div>
    </div>
  );
}
