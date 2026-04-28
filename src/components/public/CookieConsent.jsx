import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Lock, BarChart2, Megaphone, Settings2 } from 'lucide-react';
import Button3D from '../Button3D';

const COOKIE_IMG = 'https://lh3.googleusercontent.com/yML5TEO1-N1ngawnIW4MxhsnB7HQr7DMS4RBH8SJGEg-R0P3RDAUoSSgtROcpcsy6l44h-G3urZYL9JEIj8S7ypQ=s120';

const STORAGE_KEY = 'gnewz_cookie_consent';

const COOKIE_TYPES = [
  {
    id: 'essential',
    icon: Lock,
    label: 'Essential',
    description: 'Required for the site to function — login sessions, navigation, and security. These cannot be disabled.',
    alwaysOn: true,
    defaultOn: true,
  },
  {
    id: 'analytics',
    icon: BarChart2,
    label: 'Analytics',
    description: 'Collects anonymous data on how you navigate the site so we can improve performance and content relevance.',
    alwaysOn: false,
    defaultOn: true,
  },
  {
    id: 'marketing',
    icon: Megaphone,
    label: 'Marketing',
    description: 'Tracks browsing activity to serve personalised ads via third-party advertising partners.',
    alwaysOn: false,
    defaultOn: false,
  },
  {
    id: 'preferences',
    icon: Settings2,
    label: 'Preferences',
    description: 'Remembers your settings such as language, region, and display options across visits.',
    alwaysOn: false,
    defaultOn: true,
  },
];

function Toggle({ on, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!on)}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 focus:outline-none
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${on ? 'bg-orange' : 'bg-[#3a3a3a]'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200 mt-[3px]
          ${on ? 'translate-x-[18px]' : 'translate-x-[3px]'}`}
      />
    </button>
  );
}

export default function CookieConsent({ forceOpen = false, onForceClose, onDone }) {
  const [visible,    setVisible]    = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [prefs,      setPrefs]      = useState(() =>
    Object.fromEntries(COOKIE_TYPES.map(t => [t.id, t.defaultOn]))
  );

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  useEffect(() => {
    if (forceOpen) setVisible(true);
  }, [forceOpen]);

  const close = (choice, savedPrefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, prefs: savedPrefs }));
    setVisible(false);
    setShowManage(false);
    onForceClose?.();
    onDone?.();
  };

  const acceptAll  = () => close('accepted', Object.fromEntries(COOKIE_TYPES.map(t => [t.id, true])));
  const declineAll = () => close('declined', Object.fromEntries(COOKIE_TYPES.map(t => [t.id, t.alwaysOn])));
  const savePrefs  = () => close('custom',   prefs);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] overflow-hidden"
      style={{ background: '#1a1a1a', borderTop: '1px solid #2e2e2e' }}
    >
      {/* Cookie watermark background */}
      <div
        className="absolute right-0 top-0 bottom-0 w-48 pointer-events-none"
        style={{
          backgroundImage: `url(${COOKIE_IMG})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right -16px center',
          backgroundSize: '120px 120px',
          opacity: 0.04,
        }}
      />
      {/* Manage panel — expands upward */}
      {showManage && (
        <div style={{ borderBottom: '1px solid #2e2e2e', background: '#161616' }}>
          <div className="max-w-[1280px] mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {COOKIE_TYPES.map(type => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  className="flex flex-col gap-3 p-4"
                  style={{ background: '#1e1e1e', border: '1px solid #2e2e2e' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon size={13} style={{ color: type.alwaysOn ? 'var(--color-orange)' : '#888' }} />
                      <span className="text-[11px] font-black uppercase tracking-widest text-white">
                        {type.label}
                      </span>
                    </div>
                    {type.alwaysOn ? (
                      <span
                        className="text-[9px] font-black bg-orange   uppercase tracking-widest px-1.5 py-[3px] text-white shrink-0"
                       
                      >
                        Always On
                      </span>
                    ) : (
                      <Toggle
                        on={prefs[type.id]}
                        onChange={val => setPrefs(p => ({ ...p, [type.id]: val }))}
                      />
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: '#888' }}>
                    {type.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main bar */}
      <div className="max-w-[1280px] mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">

          {/* Info block */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <img
              src={COOKIE_IMG}
              alt="cookie"
              className="shrink-0 w-9 h-9 object-contain"
            />
            <div className="min-w-0">
              <p className="text-[12px] font-black uppercase tracking-widest text-white mb-0.5">
                Cookie &amp; Privacy Settings
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: '#888' }}>
                We use cookies to personalise content, analyse traffic, and serve relevant ads. By clicking{' '}
                <strong className="text-white font-bold">Accept All</strong> you agree to our{' '}
                <a
                  href="/cookie-policy"
                  className="underline transition-colors"
                  style={{ color: '#aaa' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
                >
                  Cookie Policy
                </a>{' '}
                and{' '}
                <a
                  href="/privacy-policy"
                  className="underline transition-colors"
                  style={{ color: '#aaa' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
                >
                  Privacy Policy
                </a>
                . You can adjust preferences at any time via the cookie icon in the footer.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Manage */}
            <button
              onClick={() => setShowManage(m => !m)}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-3 h-8 transition-colors duration-150"
              style={{
                color: showManage ? '#fff' : '#888',
                border: '1px solid #2e2e2e',
                background: showManage ? '#2a2a2a' : 'transparent',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#444'; }}
              onMouseLeave={e => { e.currentTarget.style.color = showManage ? '#fff' : '#888'; e.currentTarget.style.borderColor = '#2e2e2e'; }}
            >
              {showManage ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
              Manage
            </button>

            {/* Save preferences — only when manage is open */}
            {showManage && (
              <button
                onClick={savePrefs}
                className="text-[11px] font-black uppercase tracking-widest text-white px-3 h-8 transition-colors duration-150"
                style={{ border: '1px solid #2e2e2e', background: '#2a2a2a' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.background = '#333'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2e2e2e'; e.currentTarget.style.background = '#2a2a2a'; }}
              >
                Save Preferences
              </button>
            )}

            {/* Decline */}
            <button
              onClick={declineAll}
              className="text-[11px] font-black uppercase tracking-widest px-3 h-8 transition-colors duration-150"
              style={{ color: '#888', border: '1px solid #2e2e2e' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#444'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#2e2e2e'; }}
            >
              Decline All
            </button>

            {/* Accept All */}
            <Button3D
              color="var(--color-orange)"
              onClick={acceptAll}
              className="text-[11px] uppercase tracking-widest px-4 h-8"
            >
              Accept All
            </Button3D>

            {/* Dismiss */}
            <button
              onClick={declineAll}
              className="w-7 h-7 flex items-center justify-center transition-colors duration-150"
              style={{ color: '#555' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ccc')}
              onMouseLeave={e => (e.currentTarget.style.color = '#555')}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
