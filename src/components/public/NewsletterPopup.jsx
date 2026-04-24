import { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import api from '../../api/axios';

const STORAGE_KEY = 'gnewz_newsletter';

export default function NewsletterPopup({ forceOpen = false, onForceClose }) {
  const [visible, setVisible]  = useState(false);
  const [email,   setEmail]    = useState('');
  const [loading, setLoading]  = useState(false);
  const [success, setSuccess]  = useState(false);
  const [error,   setError]    = useState('');

  useEffect(() => {
    if (forceOpen) {
      setVisible(true);
      setSuccess(false);
      setEmail('');
      setError('');
    }
  }, [forceOpen]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'dismissed');
    setVisible(false);
    onForceClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.post('/newsletter/subscribe/', { email: email.trim() });
      setSuccess(true);
      localStorage.setItem(STORAGE_KEY, 'subscribed');
      setTimeout(() => { setVisible(false); onForceClose?.(); }, 3500);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(232,0,28,0.15)]">

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#1e1e1e] text-[#666] hover:text-white hover:bg-[#2a2a2a] transition-colors"
        >
          <X size={16} />
        </button>

        <div className="px-8 py-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                   style={{ background: 'rgba(232,0,28,0.12)', border: '1px solid rgba(232,0,28,0.3)' }}>
                <CheckCircle size={32} style={{ color: '#e8001c' }} />
              </div>
              <h3 className="text-white text-2xl font-black mb-2">You're subscribed!</h3>
              <p className="text-[#888] text-[14px] max-w-xs leading-relaxed">
                Welcome to GNEWZ. Get ready for the best of Gaming &amp; Tech in your inbox.
              </p>
            </div>
          ) : (
            <>
              {/* Title */}
              <h2 className="text-white font-black text-[26px] leading-tight uppercase tracking-tight mb-4">
                Subscribe to the{' '}
                <span style={{ color: '#e8001c' }}>GNEWZ</span>{' '}
                Newsletter
              </h2>

              {/* Description */}
              <p className="text-[#bbb] text-[15px] leading-relaxed mb-5">
                It's <strong className="text-white">free!</strong> Stay up to date with the best of Gaming &amp; Tech —
                news, reviews, previews, hardware picks and exclusive features delivered straight to your inbox.
              </p>

              {/* What you get */}
              <ul className="space-y-2.5 mb-7">
                {[
                  'Breaking gaming news and exclusive previews',
                  'In-depth reviews and hardware comparisons',
                  'Esports results, tournaments and highlights',
                  'Best deals on games and tech gear',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[14px] text-[#ccc]">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5" style={{ background: '#e8001c' }} />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-[#1a1a1a] border border-[#333] text-white text-[14px] rounded-xl px-4 py-3 outline-none placeholder-[#555] transition-colors"
                  onFocus={e => (e.target.style.borderColor = '#e8001c')}
                  onBlur={e  => (e.target.style.borderColor = '#333')}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl text-[13px] font-black uppercase tracking-widest text-white disabled:opacity-60 transition-opacity hover:opacity-90 shrink-0"
                  style={{ background: '#e8001c' }}
                >
                  {loading ? '…' : 'Subscribe'}
                </button>
              </form>

              {error && <p className="text-red-400 text-[13px] mb-3">{error}</p>}

              <p className="text-[#555] text-[11px] leading-relaxed">
                By providing your email you confirm you are over 13 years old. You can unsubscribe at
                any time via the link in each email. See our{' '}
                <a href="/privacy-policy" className="underline text-[#777] hover:text-white transition-colors">
                  Privacy Policy
                </a>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
