import { useState, useEffect } from 'react';
import { X, Zap, CheckCircle } from 'lucide-react';
import api from '../../api/axios';

const STORAGE_KEY = 'gnewz_newsletter';
const DELAY_MS = 6000;

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'dismissed');
    setVisible(false);
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
      setTimeout(() => setVisible(false), 3500);
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={handleClose} />

      {/* Card */}
      <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(255,107,0,0.15)]">

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-gray-600 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {success ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-5">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h3 className="text-white text-2xl font-black mb-2">You're in! 🎮</h3>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Breaking news, game drops, esports results — straight to your inbox. No noise, just GNEWZ.
            </p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">

            {/* ── Left panel — visual ── */}
            <div className="md:w-2/5 bg-gradient-to-br from-[#FF6B00] to-[#cc3a00] p-8 flex flex-col justify-between relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-black/20" />
              <div className="absolute top-1/2 right-0 w-16 h-16 rounded-full bg-white/5" />

              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Zap size={22} className="text-white" fill="white" />
                </div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">Newsletter</p>
                <h2 className="text-white text-2xl font-black leading-tight">
                  Never miss a drop
                </h2>
              </div>

              <div className="relative z-10 mt-8">
                {['Game releases', 'Esports results', 'Hardware reviews'].map((tag) => (
                  <div key={tag} className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    <span className="text-white/80 text-xs font-medium">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right panel — form ── */}
            <div className="md:w-3/5 p-8 flex flex-col justify-center">
              <p className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest mb-2">
                Free · No spam · Unsubscribe anytime
              </p>
              <h3 className="text-white text-xl font-black leading-snug mb-2">
                Stay ahead of the game
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Get the latest gaming, esports & hardware news the moment we publish it.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-[#181818] border border-[#2a2a2a] focus:border-[#FF6B00] text-white text-sm rounded-xl px-4 py-3 outline-none transition-colors placeholder-gray-600"
                />

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#FF6B00] hover:bg-[#cc5500] disabled:opacity-60 text-white text-sm font-black rounded-xl transition-colors tracking-wide"
                >
                  {loading ? 'Subscribing…' : 'Subscribe for free →'}
                </button>
              </form>

              <div className="flex items-center gap-4 mt-5">
                <div className="flex-1 h-px bg-[#1f1f1f]" />
                <span className="text-gray-700 text-xs">join 10,000+ readers</span>
                <div className="flex-1 h-px bg-[#1f1f1f]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
