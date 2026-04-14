import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X, Image as ImageIcon, Film } from 'lucide-react';

export default function AddBlockButton({ onAdd }) {
  // stage: 'closed' | 'pick' | 'image' | 'video'
  const [stage, setStage] = useState('closed');
  const [url, setUrl]     = useState('');
  const urlRef            = useRef(null);

  useEffect(() => {
    if ((stage === 'image' || stage === 'video') && urlRef.current) {
      urlRef.current.focus();
    }
  }, [stage]);

  const reset = () => { setStage('closed'); setUrl(''); };

  const handleInsert = () => {
    if (!url.trim()) return;
    onAdd({ type: stage, url: url.trim(), alt: '', caption: '', mediaId: null });
    reset();
  };

  return (
    <div style={{ margin: '4px 0' }}>
      <AnimatePresence initial={false} mode="wait">

        {/* Closed: faint divider + Insert button */}
        {stage === 'closed' && (
          <motion.div
            key="closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="group flex items-center gap-2 py-1 cursor-default"
          >
            <div className="flex-1 h-px transition-colors duration-150" style={{ background: 'rgba(255,255,255,0.04)' }} />
            <button
              type="button"
              onClick={() => setStage('pick')}
              className="flex items-center gap-1.5 px-2.5 h-6 rounded-full text-[11px] font-semibold shrink-0 transition-all duration-150"
              style={{ background: '#1f1f1f', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.25)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)'; e.currentTarget.style.color = '#FF6B00'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1f1f1f'; e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; }}
            >
              <Plus size={10} strokeWidth={2.5} /> Insert
            </button>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </motion.div>
        )}

        {/* Pick type */}
        {stage === 'pick' && (
          <motion.div
            key="pick"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, margin: '2px 0' }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginRight: 4, whiteSpace: 'nowrap' }}>
                Insert:
              </span>
              {[
                { type: 'image', icon: ImageIcon, label: 'Image' },
                { type: 'video', icon: Film,       label: 'Video' },
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setStage(type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,107,0,0.3)'; e.currentTarget.style.color = '#FF6B00'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
                >
                  <Icon size={12} /> {label}
                </button>
              ))}
              <button
                type="button"
                onClick={reset}
                className="ml-auto w-6 h-6 flex items-center justify-center rounded-lg transition-all"
                style={{ color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >
                <X size={11} />
              </button>
            </div>
          </motion.div>
        )}

        {/* URL input stage */}
        {(stage === 'image' || stage === 'video') && (
          <motion.div
            key="url"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '12px 14px', background: '#1a1a1a', border: '1px solid rgba(255,107,0,0.18)', borderRadius: 10, margin: '2px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {stage === 'image'
                    ? <ImageIcon size={13} style={{ color: '#FF6B00' }} />
                    : <Film size={13} style={{ color: '#FF6B00' }} />}
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {stage === 'image' ? 'Image URL' : 'Video URL'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => setStage('pick')}
                    className="text-[11px] px-2 py-0.5 rounded"
                    style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                  >← Back</button>
                  <button
                    type="button"
                    onClick={reset}
                    className="w-5 h-5 flex items-center justify-center rounded"
                    style={{ color: 'rgba(255,255,255,0.2)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.2)'; }}
                  >
                    <X size={11} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  ref={urlRef}
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { e.preventDefault(); handleInsert(); }
                    if (e.key === 'Escape') reset();
                  }}
                  placeholder={stage === 'image' ? 'https://example.com/photo.jpg' : 'https://youtube.com/watch?v=… or direct .mp4'}
                  className="flex-1 px-3 py-2 rounded-lg text-[13px] text-white outline-none"
                  style={{ background: '#111', border: '1px solid #2a2a2a', caretColor: '#FF6B00' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,107,0,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.07)'; }}
                  onBlur={e  => { e.target.style.borderColor = '#2a2a2a'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={handleInsert}
                  disabled={!url.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold text-white disabled:opacity-30 transition-all"
                  style={{ background: 'linear-gradient(135deg,#FF6B00,#e05500)', boxShadow: '0 3px 0 #a33a00', transform: 'translateY(-1px)' }}
                  onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 5px 0 #a33a00'; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 3px 0 #a33a00'; }}
                  onMouseDown={e  => { e.currentTarget.style.transform = 'translateY(1px)'; e.currentTarget.style.boxShadow = '0 1px 0 #a33a00'; }}
                  onMouseUp={e    => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 3px 0 #a33a00'; }}
                >
                  Insert
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
