import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, X, Edit2, Trash2, ExternalLink, Gamepad2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import DeleteModal from '../../components/DeleteModal';
import toast from 'react-hot-toast';

/* ─── Game Form Modal ──────────────────────────────────────────────────── */
function GameModal({ game, categories, onClose, onSaved }) {
  const isEdit = Boolean(game?.id);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    short_description: '',
    image_url: '',
    release_display: 'TBA',
    players: '',
    trend: '',
    rank: 0,
    game_type: 'popular',
    is_active: true,
    category_ids: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (game) {
      setForm({
        title: game.title || '',
        slug: game.slug || '',
        description: game.description || '',
        short_description: game.short_description || '',
        image_url: game.image_url || '',
        release_display: game.release_display || 'TBA',
        players: game.players || '',
        trend: game.trend || '',
        rank: game.rank || 0,
        game_type: game.game_type || 'popular',
        is_active: game.is_active !== false,
        category_ids: (game.categories || []).map((c) => c.id),
      });
    }
  }, [game]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleCat = (id) => {
    setForm((f) => ({
      ...f,
      category_ids: f.category_ids.includes(id)
        ? f.category_ids.filter((c) => c !== id)
        : [...f.category_ids, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (isEdit) {
        await api.patch(`/games/${game.id}/`, payload);
        toast.success('Game updated');
      } else {
        await api.post('/games/', payload);
        toast.success('Game created');
      }
      onSaved();
    } catch (err) {
      toast.error('Failed to save game');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: 'rgba(255,255,255,0.88)',
    outline: 'none',
  };
  const focusStyle = {
    borderColor: 'rgba(255,107,0,0.45)',
    background: 'rgba(255,107,0,0.035)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: '#161618', border: '1px solid rgba(255,107,0,0.15)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <h2 className="text-white font-black text-[17px] uppercase tracking-tight">
            {isEdit ? 'Edit Game' : 'Add Game'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="w-full text-[13px] px-3 py-2.5 rounded-lg"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                placeholder="auto-generated"
                className="w-full text-[13px] px-3 py-2.5 rounded-lg"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Short Description</label>
            <input
              value={form.short_description}
              onChange={(e) => set('short_description', e.target.value)}
              className="w-full text-[13px] px-3 py-2.5 rounded-lg"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' })}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Description</label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className="w-full text-[13px] px-3 py-2.5 rounded-lg resize-none"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' })}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Cover Image URL</label>
            <input
              value={form.image_url}
              onChange={(e) => set('image_url', e.target.value)}
              placeholder="https://..."
              className="w-full text-[13px] px-3 py-2.5 rounded-lg"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' })}
            />
            {form.image_url && (
              <img src={form.image_url} alt="preview" className="mt-2 h-20 object-cover rounded" onError={(e) => (e.target.style.display = 'none')} />
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Release</label>
              <input
                value={form.release_display}
                onChange={(e) => set('release_display', e.target.value)}
                className="w-full text-[13px] px-3 py-2.5 rounded-lg"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Players</label>
              <input
                value={form.players}
                onChange={(e) => set('players', e.target.value)}
                placeholder="e.g. 2.1M players"
                className="w-full text-[13px] px-3 py-2.5 rounded-lg"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Trend</label>
              <input
                value={form.trend}
                onChange={(e) => set('trend', e.target.value)}
                placeholder="e.g. +12%"
                className="w-full text-[13px] px-3 py-2.5 rounded-lg"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Rank</label>
              <input
                type="number"
                min={0}
                value={form.rank}
                onChange={(e) => set('rank', parseInt(e.target.value) || 0)}
                className="w-full text-[13px] px-3 py-2.5 rounded-lg"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Type</label>
              <select
                value={form.game_type}
                onChange={(e) => set('game_type', e.target.value)}
                className="w-full text-[13px] px-3 py-2.5 rounded-lg appearance-none"
                style={inputStyle}
              >
                <option value="popular">Popular</option>
                <option value="anticipated">Anticipated</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const active = form.category_ids.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCat(c.id)}
                    className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all"
                    style={
                      active
                        ? { background: 'rgba(255,107,0,0.15)', color: '#ff6b00', border: '1px solid rgba(255,107,0,0.35)' }
                        : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }
                    }
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Active</label>
            <button
              type="button"
              onClick={() => set('is_active', !form.is_active)}
              className="w-10 h-5 rounded-full transition-all relative"
              style={{ background: form.is_active ? '#ff6b00' : 'rgba(255,255,255,0.1)' }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: form.is_active ? '22px' : '2px' }}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-[13px] font-bold rounded-xl text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-[13px] font-black text-white rounded-xl disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #ff6b00, #e05500)' }}
            >
              {saving ? 'Saving…' : isEdit ? 'Update Game' : 'Create Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main GamesPage ─────────────────────────────────────────────────────── */
export default function GamesPage() {
  const { canEdit, canDelete } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null); // null | 'new' | game object
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page_size: 100 };
      if (typeFilter) params.game_type = typeFilter;
      if (search) params.search = search;
      const { data } = await api.get('/games/', { params });
      setGames(data.results || data);
    } catch {
      toast.error('Failed to load games');
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => { fetchGames(); }, [fetchGames]);

  useEffect(() => {
    api.get('/categories/', { params: { page_size: 100 } })
      .then(({ data }) => setCategories(data.results || []))
      .catch(() => {});
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/games/${deleteTarget.id}/`);
      toast.success('Game deleted');
      setDeleteTarget(null);
      fetchGames();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const TYPE_COLORS = {
    popular: '16,185,129',
    anticipated: '249,115,22',
    both: '139,92,246',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-[48px] font-black uppercase tracking-tighter text-white leading-none">Games</h1>
          </div>
          <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Manage the game library — popular and most anticipated titles
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setModal('new')}
            className="flex items-center gap-2 px-4 py-3 text-[13px] font-black text-white tracking-wide shrink-0 select-none self-start"
            style={{
              background: 'linear-gradient(135deg, var(--color-orange) 0%, #e05500 100%)',
              boxShadow: '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
              transform: 'translateY(-3px)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
          >
            <Plus size={15} strokeWidth={3} />
            Add Game
          </button>
        )}
      </div>

      {/* Filters */}
      <div
        className="overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #161618 0%, #111113 100%)', boxShadow: '0 2px 16px rgba(0,0,0,0.3)' }}
      >
        <div className="h-[1.5px] w-full" style={{ background: 'linear-gradient(90deg, rgba(255,107,0,0.6) 0%, rgba(255,107,0,0.0) 60%)' }} />
        <div className="flex items-center gap-3 px-4 py-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.22)' }} />
            <input
              type="text"
              placeholder="Search games…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-[13px] rounded-xl pl-9 pr-4 py-2.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.88)', outline: 'none' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.45)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
          </div>
          {/* Type filter pills */}
          {[['', 'All'], ['popular', 'Popular'], ['anticipated', 'Anticipated'], ['both', 'Both']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTypeFilter(val)}
              className="text-[11px] font-bold px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all"
              style={
                typeFilter === val
                  ? { background: 'rgba(255,107,0,0.12)', color: '#ff6b00', border: '1px solid rgba(255,107,0,0.3)' }
                  : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)' }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #161618 0%, #111113 100%)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="h-[1.5px]" style={{ background: 'linear-gradient(90deg, rgba(255,107,0,0.6) 0%, rgba(255,107,0,0.0) 60%)' }} />

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-orange border-t-transparent animate-spin" />
          </div>
        ) : games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Gamepad2 size={32} style={{ color: 'rgba(255,255,255,0.1)' }} />
            <p className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.2)' }}>No games found</p>
            {canEdit && (
              <button
                onClick={() => setModal('new')}
                className="mt-2 text-[12px] font-bold px-4 py-2 rounded-xl"
                style={{ background: 'rgba(255,107,0,0.12)', color: '#ff6b00', border: '1px solid rgba(255,107,0,0.2)' }}
              >
                Add first game
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['#', 'Cover', 'Title', 'Type', 'Categories', 'Release', 'Players', 'Active', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-bold uppercase tracking-widest px-4 py-3"
                      style={{ color: 'rgba(255,255,255,0.22)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {games.map((g, idx) => {
                  const typeRgb = TYPE_COLORS[g.game_type] || '255,255,255';
                  return (
                    <tr
                      key={g.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Rank */}
                      <td className="px-4 py-3 text-[12px] font-black" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        {g.rank || idx + 1}
                      </td>
                      {/* Cover */}
                      <td className="px-4 py-3">
                        {g.image_url ? (
                          <img src={g.image_url} alt={g.title} className="w-10 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-14 rounded bg-[#1a1a28] flex items-center justify-center">
                            <Gamepad2 size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
                          </div>
                        )}
                      </td>
                      {/* Title */}
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="text-[13px] font-bold text-white truncate">{g.title}</p>
                        <p className="text-[10px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{g.short_description}</p>
                      </td>
                      {/* Type */}
                      <td className="px-4 py-3">
                        <span
                          className="text-[10px] font-black uppercase px-2 py-1 rounded"
                          style={{ background: `rgba(${typeRgb},0.12)`, color: `rgb(${typeRgb})`, border: `1px solid rgba(${typeRgb},0.25)` }}
                        >
                          {g.game_type}
                        </span>
                      </td>
                      {/* Categories */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(g.categories || []).map((c) => (
                            <span
                              key={c.id}
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                              style={{ background: 'rgba(255,107,0,0.1)', color: 'rgba(255,107,0,0.8)', border: '1px solid rgba(255,107,0,0.18)' }}
                            >
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      {/* Release */}
                      <td className="px-4 py-3 text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {g.release_display || '—'}
                      </td>
                      {/* Players */}
                      <td className="px-4 py-3 text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {g.players || '—'}
                      </td>
                      {/* Active */}
                      <td className="px-4 py-3">
                        <span
                          className="text-[10px] font-bold px-2 py-1 rounded"
                          style={
                            g.is_active
                              ? { background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }
                              : { background: 'rgba(107,114,128,0.1)', color: '#6b7280', border: '1px solid rgba(107,114,128,0.2)' }
                          }
                        >
                          {g.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`/games/${g.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                            style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                          >
                            <ExternalLink size={11} />
                          </a>
                          {canEdit && (
                            <button
                              onClick={() => setModal(g)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                              style={{ background: 'rgba(255,107,0,0.08)', color: 'rgba(255,107,0,0.6)', border: '1px solid rgba(255,107,0,0.15)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#ff6b00'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,107,0,0.6)'; }}
                            >
                              <Edit2 size={11} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => setDeleteTarget(g)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                              style={{ background: 'rgba(248,113,113,0.07)', color: 'rgba(248,113,113,0.5)', border: '1px solid rgba(248,113,113,0.14)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(248,113,113,0.5)'; }}
                            >
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <GameModal
          game={modal === 'new' ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchGames(); }}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteModal
          title="Delete Game"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
