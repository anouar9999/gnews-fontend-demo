import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bold, Italic, Underline, List, ListOrdered,
  Link2, Quote, Heading2, Heading3, X,
} from 'lucide-react';

const TOOLS = [
  { Icon: Bold,        cmd: 'bold',                  title: 'Bold (Ctrl+B)' },
  { Icon: Italic,      cmd: 'italic',                title: 'Italic (Ctrl+I)' },
  { Icon: Underline,   cmd: 'underline',             title: 'Underline (Ctrl+U)' },
  null,
  { Icon: Heading2,    cmd: 'formatBlock', val: 'h2',          title: 'Heading 2' },
  { Icon: Heading3,    cmd: 'formatBlock', val: 'h3',          title: 'Heading 3' },
  null,
  { Icon: Quote,       cmd: 'formatBlock', val: 'blockquote',  title: 'Blockquote' },
  { Icon: List,        cmd: 'insertUnorderedList',              title: 'Bullet List' },
  { Icon: ListOrdered, cmd: 'insertOrderedList',               title: 'Numbered List' },
  null,
  { Icon: Link2,       cmd: '__link',                          title: 'Insert Link' },
];

export default function RichTextEditor({ value, onChange, placeholder = 'Write here…', minHeight = 80 }) {
  const editorRef  = useRef(null);
  const savedRange = useRef(null);
  const [linkMode, setLinkMode] = useState(false);
  const [linkUrl,  setLinkUrl]  = useState('');

  // Initialize once on mount — DOM is source of truth while editing
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreRange = () => {
    if (!savedRange.current) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange.current);
  };

  const exec = (cmd, val = null) => {
    restoreRange();
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    onChange(editorRef.current.innerHTML);
  };

  const handleInput = () => onChange(editorRef.current.innerHTML);

  const insertLink = () => {
    if (linkUrl.trim()) exec('createLink', linkUrl.trim());
    setLinkMode(false);
    setLinkUrl('');
  };

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div
        className="flex items-center flex-wrap gap-0.5 px-2 py-1.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.025)' }}
      >
        {TOOLS.map((tool, i) => {
          if (!tool) return (
            <div key={i} style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
          );
          const { Icon, cmd, val, title } = tool;
          const isActive = cmd === '__link' && linkMode;
          return (
            <button
              key={cmd + (val || '')}
              type="button"
              title={title}
              onMouseDown={e => {
                e.preventDefault();
                saveRange();
                if (cmd === '__link') {
                  setLinkMode(v => !v);
                  setLinkUrl('');
                } else if (val) {
                  exec(cmd, val);
                } else {
                  exec(cmd);
                }
              }}
              className="w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-100"
              style={{
                background: isActive ? 'rgba(255,107,0,0.15)' : 'transparent',
                color: isActive ? '#FF6B00' : 'rgba(255,255,255,0.4)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.12)'; e.currentTarget.style.color = '#FF6B00'; }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isActive ? 'rgba(255,107,0,0.15)' : 'transparent';
                e.currentTarget.style.color = isActive ? '#FF6B00' : 'rgba(255,255,255,0.4)';
              }}
            >
              <Icon size={13} strokeWidth={2} />
            </button>
          );
        })}
      </div>

      {/* Link input row */}
      <AnimatePresence>
        {linkMode && (
          <motion.div
            key="link-row"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,107,0,0.04)' }}
            >
              <Link2 size={12} style={{ color: '#FF6B00', flexShrink: 0 }} />
              <input
                autoFocus
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); insertLink(); }
                  if (e.key === 'Escape') { setLinkMode(false); setLinkUrl(''); }
                }}
                placeholder="https://…"
                className="flex-1 px-2 py-1 rounded-md text-[12px] text-white outline-none"
                style={{ background: '#111', border: '1px solid rgba(255,107,0,0.3)', caretColor: '#FF6B00' }}
                onFocus={e => { e.target.style.boxShadow = '0 0 0 2px rgba(255,107,0,0.15)'; }}
                onBlur={e  => { e.target.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                onClick={insertLink}
                className="px-3 py-1 rounded-md text-[11px] font-bold text-white shrink-0"
                style={{ background: '#FF6B00' }}
              >
                Insert
              </button>
              <button
                type="button"
                onClick={() => { setLinkMode(false); setLinkUrl(''); }}
                className="w-6 h-6 flex items-center justify-center rounded-md shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
              >
                <X size={11} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={saveRange}
        onMouseUp={saveRange}
        data-placeholder={placeholder}
        className="rich-editor outline-none leading-relaxed"
        style={{
          minHeight,
          padding: '12px 14px',
          fontSize: 15,
          color: 'rgba(255,255,255,0.75)',
          caretColor: '#FF6B00',
          wordBreak: 'break-word',
        }}
      />
    </div>
  );
}
