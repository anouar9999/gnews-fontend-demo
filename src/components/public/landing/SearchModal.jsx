import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  HERO, SIDE_ARTICLES, GAMING_ARTICLES, ESPORTS_ARTICLES,
  HARDWARE_ARTICLES, LATEST_ARTICLES, MOST_READ,
} from '../../../data/landingMockData';

// Flatten all available articles into one searchable pool
const ALL_ARTICLES = [
  HERO,
  ...SIDE_ARTICLES,
  ...GAMING_ARTICLES,
  ...ESPORTS_ARTICLES,
  ...HARDWARE_ARTICLES,
  ...(LATEST_ARTICLES || []),
].filter((a, i, arr) => arr.findIndex(b => b.id === a.id) === i); // dedupe

const TRENDING = MOST_READ.slice(0, 5);

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: 'rgba(232,0,28,0.25)', color: '#fff', borderRadius: 2, padding: '0 1px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Auto-focus
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Search
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setActiveIdx(-1); return; }
    const filtered = ALL_ARTICLES.filter(a =>
      a.title.toLowerCase().includes(q) ||
      (a.tag && a.tag.toLowerCase().includes(q))
    ).slice(0, 8);
    setResults(filtered);
    setActiveIdx(-1);
  }, [query]);

  // Keyboard navigation
  const handleKey = useCallback(e => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      onClose();
    }
  }, [results.length, activeIdx, onClose]);

  const showTrending = !query.trim();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Modal panel */}
      <div
        style={{
          position: 'fixed', top: '12vh', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9001, width: '100%', maxWidth: 1220,
          background: '#0d0d18',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(232,0,28,0.08)',
          overflow: 'hidden',
          margin: '0 16px',
        }}
      >
        {/* Search input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 18px',
          borderBottom: '1px solid #1a1a28',
        }}>
          <Search size={17} style={{ color: '#666677', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search articles, games, hardware…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: '#fff', fontSize: 15, fontWeight: 500,
              caretColor: '#e8001c',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666677', padding: 2, lineHeight: 0 }}
            >
              <X size={14} />
            </button>
          )}
          <kbd style={{
            flexShrink: 0, fontSize: 10, fontWeight: 700, color: '#444455',
            background: '#111118', border: '1px solid #222233',
            borderRadius: 5, padding: '2px 6px', letterSpacing: '0.05em',
          }}>ESC</kbd>
        </div>

        {/* Body */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }} ref={listRef}>

          {/* ── Results ── */}
          {results.length > 0 && (
            <div style={{ padding: '8px 0' }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', color: '#444455', textTransform: 'uppercase', padding: '6px 18px 4px' }}>
                Results
              </p>
              {results.map((article, i) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug || article.id}`}
                  onClick={onClose}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '9px 18px',
                    background: activeIdx === i ? '#111118' : 'transparent',
                    textDecoration: 'none',
                    transition: 'background 0.1s',
                    borderLeft: activeIdx === i ? '2px solid #e8001c' : '2px solid transparent',
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(-1)}
                >
                  {article.image && (
                    <img
                      src={article.image}
                      alt=""
                      style={{ width: 52, height: 34, objectFit: 'cover', borderRadius: 5, flexShrink: 0, opacity: 0.85 }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {article.tag && (
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: article.tagColor || '#e8001c', marginBottom: 2, display: 'block' }}>
                        {article.tag}
                      </span>
                    )}
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#ccccdd', lineHeight: 1.4, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {highlight(article.title, query)}
                    </p>
                  </div>
                  <ArrowRight size={13} style={{ color: '#333344', flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          )}

          {/* ── No results ── */}
          {query.trim() && results.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: '#444455', margin: 0 }}>No results for <span style={{ color: '#ccccdd' }}>"{query}"</span></p>
              <p style={{ fontSize: 12, color: '#333344', marginTop: 6 }}>Try different keywords</p>
            </div>
          )}

          {/* ── Trending (empty state) ── */}
          {showTrending && (
            <div style={{ padding: '8px 0 12px' }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', color: '#444455', textTransform: 'uppercase', padding: '6px 18px 4px', display: 'flex', alignItems: 'center', gap: 5 }}>
                <TrendingUp size={10} /> Trending
              </p>
              {TRENDING.map((item, i) => (
                <Link
                  key={item.id}
                  to={`/articles/${item.slug}`}
                  onClick={onClose}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '9px 18px',
                    textDecoration: 'none',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#111118'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#333344', width: 18, textAlign: 'right', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#aaaabc', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </p>
                  <span style={{ fontSize: 11, color: '#333344', flexShrink: 0 }}>{item.views}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '10px 18px',
          borderTop: '1px solid #111118',
          display: 'flex', alignItems: 'center', gap: 14,
          background: '#080810',
        }}>
          {[
            { key: '↑↓', label: 'navigate' },
            { key: '↵', label: 'open' },
            { key: 'esc', label: 'close' },
          ].map(k => (
            <span key={k.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <kbd style={{ fontSize: 10, fontWeight: 700, color: '#444455', background: '#111118', border: '1px solid #222233', borderRadius: 4, padding: '1px 5px' }}>{k.key}</kbd>
              <span style={{ fontSize: 11, color: '#333344' }}>{k.label}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
