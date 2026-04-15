import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, X, AlertTriangle } from 'lucide-react';

export default function DeleteModal({
  title   = 'Delete Item',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  onConfirm,
  onCancel,
}) {
  const [deleting, setDeleting] = useState(false);
  const confirmRef = useRef(null);

  /* Escape to close */
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onCancel?.(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onCancel]);

  /* Auto-focus confirm */
  useEffect(() => {
    const t = setTimeout(() => confirmRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  const handleConfirm = async () => {
    setDeleting(true);
    try { await onConfirm?.(); }
    finally { setDeleting(false); }
  };

  return (
    /* ── Backdrop ── */
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22 }}
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        /* Perspective origin so the 3-D flip looks like it falls toward the viewer */
        perspective: '1200px',
        perspectiveOrigin: '50% 40%',
      }}
    >
      {/* ── 3-D panel ── */}
      <motion.div
        initial={{ opacity: 0, rotateX: -22, scale: 0.92, y: -24 }}
        animate={{ opacity: 1, rotateX: 0,   scale: 1,    y: 0   }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 444,
          /* ── 3-D depth: layered shadows ── */
          boxShadow: [
            /* ground plane — deepest, diffuse */
            '0 40px 80px rgba(0,0,0,0.85)',
            /* mid elevation */
            '0 20px 40px rgba(0,0,0,0.6)',
            /* tight contact shadow */
            '0 8px 16px rgba(0,0,0,0.5)',
            /* red ambient glow */
            '0 0 60px rgba(239,68,68,0.12)',
            /* outer rim highlight — simulates light hitting the card edge */
            '0 0 0 1px rgba(255,255,255,0.08)',
            /* inner top highlight — like a raised surface catching overhead light */
            'inset 0 1px 0 rgba(255,255,255,0.1)',
          ].join(', '),
          /* preserve-3d lets children stack in Z space */
          transformStyle: 'preserve-3d',
          overflow: 'hidden',
          /* card face */
          background: 'linear-gradient(170deg, #1e1e20 0%, #131315 55%, #0f0f11 100%)',
        }}
      >
        {/* ── Top gloss band (simulates overhead light on a physical card) ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        

        {/* ── Header ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '20px 22px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

            {/* Icon box — also 3-D: slightly raised with its own shadow */}
            <div style={{
              width: 46, height: 46, borderRadius: 14, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(145deg, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.08) 100%)',
              border: '1px solid rgba(239,68,68,0.3)',
              boxShadow: [
                '0 4px 12px rgba(239,68,68,0.2)',
                '0 1px 0 rgba(255,255,255,0.08) inset',
                '0 -1px 0 rgba(0,0,0,0.3) inset',
              ].join(', '),
            }}>
              <Trash2 size={18} style={{ color: '#f87171', filter: 'drop-shadow(0 1px 4px rgba(239,68,68,0.5))' }} />
            </div>

            <div>
              <div className='text-[23px] font-black uppercase tracking-tighter text-white leading-none'>
                {title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
                <AlertTriangle size={11} style={{ color: 'rgba(239,68,68,0.75)', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'rgba(239,68,68,0.75)', fontWeight: 600, letterSpacing: '0.01em' }}>
                  Permanent — cannot be undone
                </span>
              </div>
            </div>
          </div>

          {/* ✕ close */}
          <button
            onClick={onCancel}
            style={{
              width: 30, height: 30, borderRadius: 9, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.35)',
              flexShrink: 0, marginLeft: 10,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
              transition: 'background .12s, color .12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ position: 'relative', zIndex: 1, padding: '18px 22px 20px' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, margin: 0 }}>
            {message}
          </p>

          {/* Warning callout — recessed inset look */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            marginTop: 16, padding: '12px 14px',
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 11,
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}>
            <div style={{
              width: 4, flexShrink: 0, alignSelf: 'stretch',
              background: 'linear-gradient(180deg, #ef4444, rgba(239,68,68,0.3))',
              borderRadius: 4, minHeight: 28,
            }} />
            <span style={{ fontSize: 12, color: 'rgba(239,68,68,0.85)', fontWeight: 500, lineHeight: 1.55 }}>
              All data associated with this item will be permanently removed from the system.
            </span>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', gap: 10, padding: '12px 22px 22px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>

          {/* Cancel — recessed ghost button */}
          <button
            onClick={onCancel}
            disabled={deleting}
            style={{
              flex: 1, padding: '11px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 11, cursor: 'pointer',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: 700, letterSpacing: '0.02em',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
              transition: 'all .12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            Cancel
          </button>

          {/* Delete — 3-D raised red button */}
          <button
            ref={confirmRef}
            onClick={handleConfirm}
            disabled={deleting}
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 16px',
              background: deleting
                ? 'rgba(239,68,68,0.45)'
                : 'linear-gradient(160deg, #f05252 0%, #dc2626 50%, #b91c1c 100%)',
              border: 'none', borderRadius: 11,
              cursor: deleting ? 'not-allowed' : 'pointer',
              color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: '0.02em',
              /* 3-D depth floor + glow */
              boxShadow: deleting ? 'none' : [
                '0 6px 0 #7f1d1d',
                '0 9px 20px rgba(239,68,68,0.45)',
                'inset 0 1px 0 rgba(255,255,255,0.2)',
                'inset 0 -1px 0 rgba(0,0,0,0.2)',
              ].join(', '),
              transform: deleting ? 'none' : 'translateY(-3px)',
              transition: 'transform 0.08s ease, box-shadow 0.08s ease',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={e => {
              if (deleting) return;
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = [
                '0 8px 0 #7f1d1d',
                '0 14px 28px rgba(239,68,68,0.55)',
                'inset 0 1px 0 rgba(255,255,255,0.22)',
                'inset 0 -1px 0 rgba(0,0,0,0.2)',
              ].join(', ');
            }}
            onMouseLeave={e => {
              if (deleting) return;
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = [
                '0 6px 0 #7f1d1d',
                '0 9px 20px rgba(239,68,68,0.45)',
                'inset 0 1px 0 rgba(255,255,255,0.2)',
                'inset 0 -1px 0 rgba(0,0,0,0.2)',
              ].join(', ');
            }}
            onMouseDown={e => {
              if (deleting) return;
              e.currentTarget.style.transform = 'translateY(1px)';
              e.currentTarget.style.boxShadow = [
                '0 2px 0 #7f1d1d',
                '0 4px 8px rgba(239,68,68,0.3)',
                'inset 0 1px 0 rgba(255,255,255,0.12)',
                'inset 0 2px 6px rgba(0,0,0,0.25)',
              ].join(', ');
            }}
            onMouseUp={e => {
              if (deleting) return;
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = [
                '0 6px 0 #7f1d1d',
                '0 9px 20px rgba(239,68,68,0.45)',
                'inset 0 1px 0 rgba(255,255,255,0.2)',
                'inset 0 -1px 0 rgba(0,0,0,0.2)',
              ].join(', ');
            }}
          >
            {deleting ? (
              <>
                <div style={{
                  width: 13, height: 13, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  animation: 'spin 0.7s linear infinite',
                  flexShrink: 0,
                }} />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 size={13} strokeWidth={2.5} />
                Delete
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
