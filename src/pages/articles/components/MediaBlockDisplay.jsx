import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export default function MediaBlockDisplay({ block, onChange, onRemove }) {
  const [hovered, setHovered]       = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlDraft, setUrlDraft]     = useState(block.url);
  const isEmbed = /youtube\.com|youtu\.be|vimeo\.com/.test(block.url);

  const applyUrl = () => {
    onChange({ url: urlDraft.trim() });
    setEditingUrl(false);
  };

  if (!block.url || editingUrl) {
    return (
      <div style={{ border: '1px dashed rgba(255,255,255,0.12)', borderRadius: 10, padding: '16px' }}>
        <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {block.type === 'image' ? 'Image URL' : 'Video URL'}
        </p>
        <div className="flex gap-2">
          <input
            autoFocus
            value={urlDraft}
            onChange={e => setUrlDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); applyUrl(); }
              if (e.key === 'Escape') { if (!block.url) onRemove(); else setEditingUrl(false); }
            }}
            placeholder={block.type === 'image' ? 'https://example.com/image.jpg' : 'https://youtube.com/watch?v=…'}
            className="flex-1 px-3 py-2 rounded-lg text-[13px] text-white outline-none"
            style={{ background: '#111', border: '1px solid #2a2a2a', caretColor: '#FF6B00' }}
            onFocus={e => { e.target.style.borderColor = 'rgba(255,107,0,0.5)'; }}
            onBlur={e  => { e.target.style.borderColor = '#2a2a2a'; }}
          />
          <button
            type="button"
            onClick={applyUrl}
            className="px-3 py-2 rounded-lg text-[12px] font-bold text-white"
            style={{ background: '#FF6B00' }}
          >
            Insert
          </button>
          {block.url && (
            <button
              type="button"
              onClick={() => setEditingUrl(false)}
              className="px-3 py-2 rounded-lg text-[12px]"
              style={{ background: '#2a2a2a', color: 'rgba(255,255,255,0.5)' }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Media area */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative' }}
      >
        {block.type === 'image' ? (
          <img src={block.url} alt={block.alt || ''} style={{ width: '100%', display: 'block' }} />
        ) : isEmbed ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
            <iframe
              src={block.url}
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        ) : (
          <video src={block.url} controls style={{ width: '100%', display: 'block', background: '#000' }} />
        )}

        {/* Hover overlay */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            opacity: hovered ? 1 : 0,
            transition: 'opacity .15s',
            pointerEvents: hovered ? 'auto' : 'none',
          }}
        >
          {block.type === 'image' && (
            <input
              value={block.alt}
              onChange={e => onChange({ alt: e.target.value })}
              placeholder="Alt text…"
              onClick={e => e.stopPropagation()}
              className="px-3 py-1.5 rounded-lg text-[12px] text-white outline-none"
              style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)', caretColor: '#FF6B00', width: 160 }}
            />
          )}
          <button
            type="button"
            onClick={() => { setUrlDraft(block.url); setEditingUrl(true); }}
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
          >
            <Pencil size={13} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ background: 'rgba(248,113,113,0.2)', color: '#f87171' }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Caption */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '6px 14px' }}>
        <input
          value={block.caption}
          onChange={e => onChange({ caption: e.target.value })}
          placeholder="Add caption…"
          className="w-full bg-transparent outline-none text-center"
          style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', caretColor: '#FF6B00', border: 'none' }}
        />
      </div>

      {/* Writing area */}
      <div style={{ padding: '10px 12px' }}>
        <RichTextEditor
          value={block.content}
          onChange={html => onChange({ content: html })}
          placeholder="Write here…"
          minHeight={60}
        />
      </div>
    </div>
  );
}
