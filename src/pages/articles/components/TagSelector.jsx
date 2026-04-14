import { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function TagSelector({ tags, value, onChange }) {
  const [query, setQuery] = useState('');

  const selected  = tags.filter(t => value.includes(t.id));
  const available = tags.filter(t =>
    !value.includes(t.id) &&
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  const add    = id => onChange([...value, id]);
  const remove = id => onChange(value.filter(v => v !== id));

  return (
    <div>
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selected.map(tag => (
            <span
              key={tag.id}
              className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-[11px] font-bold"
              style={{ background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.3)', color: '#FF6B00' }}
            >
              #{tag.name}
              <button
                type="button"
                onClick={() => remove(tag.id)}
                className="w-4 h-4 flex items-center justify-center rounded-full transition-colors"
                style={{ background: 'rgba(255,107,0,0.15)', color: 'rgba(255,107,0,0.7)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.35)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.15)'; e.currentTarget.style.color = 'rgba(255,107,0,0.7)'; }}
              >
                <X size={8} strokeWidth={3} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={selected.length ? 'Add more tags…' : 'Search tags…'}
        className="w-full px-4 py-2.5 rounded-lg text-[13px] text-white outline-none transition-all duration-150"
        style={{ background: '#111111', border: '1px solid #2a2a2a', caretColor: '#FF6B00' }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.07)'; }}
        onBlur={e  => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none'; }}
      />

      {/* Available tags */}
      {available.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {available.slice(0, 40).map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => { add(tag.id); setQuery(''); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-100"
              style={{ background: '#1f1f1f', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.35)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,107,0,0.25)'; e.currentTarget.style.color = '#FF6B00'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1f1f1f'; e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
            >
              <Plus size={9} strokeWidth={2.5} />
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {query && available.length === 0 && (
        <p className="mt-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          No tags match &ldquo;{query}&rdquo;
        </p>
      )}

      {!query && tags.length === 0 && (
        <p className="mt-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          No tags available — create some in Tags management.
        </p>
      )}
    </div>
  );
}
