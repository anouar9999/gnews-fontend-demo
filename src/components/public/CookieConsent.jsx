import { useState, useEffect } from 'react';
import { Shield, ChevronDown, ChevronUp, X } from 'lucide-react';

const STORAGE_KEY = 'gnewz_cookie_consent';

const COOKIE_TYPES = [
  {
    id: 'essential',
    label: 'Essential Cookies',
    description:
      "Strictly necessary for the website to function. They enable core features like page navigation, secure login, and access to protected areas. These cannot be disabled.",
    alwaysOn: true,
    defaultOn: true,
  },
  {
    id: 'analytics',
    label: 'Analytics & Performance',
    description:
      "Help us understand how visitors interact with our website by collecting information anonymously. This helps us improve the site's structure and content.",
    alwaysOn: false,
    defaultOn: true,
  },
  {
    id: 'marketing',
    label: 'Marketing & Advertising',
    description:
      "Used to deliver advertisements more relevant to you. They track your browsing activity across websites and are set by third-party advertising partners.",
    alwaysOn: false,
    defaultOn: false,
  },
  {
    id: 'preferences',
    label: 'Preferences & Personalisation',
    description:
      "Allow the website to remember choices you make (such as language or region) and provide enhanced, more personal features for a better experience.",
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
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 transition-colors duration-200 focus:outline-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${on ? 'border-[#e8001c] bg-[#e8001c]' : 'border-[#444] bg-[#222]'}`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 mt-[1px]
          ${on ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  );
}

function CookieRow({ type, on, onChange }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 bg-[#151515]">
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-2.5 text-left flex-1 min-w-0"
        >
          {expanded
            ? <ChevronUp size={15} className="text-[#666] shrink-0" />
            : <ChevronDown size={15} className="text-[#666] shrink-0" />}
          <span className="text-white text-[14px] font-bold">{type.label}</span>
          {type.alwaysOn && (
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded text-white ml-1"
                  style={{ background: '#e8001c' }}>
              Always On
            </span>
          )}
        </button>
        <div className="ml-4 shrink-0">
          <Toggle on={on} onChange={onChange} disabled={type.alwaysOn} />
        </div>
      </div>
      {expanded && (
        <div className="px-4 py-3 bg-[#0d0d0d] border-t border-[#222]">
          <p className="text-[#aaa] text-[13px] leading-relaxed">{type.description}</p>
        </div>
      )}
    </div>
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
    onForceClose?.();
    onDone?.();
  };

  const acceptAll  = () => close('accepted', Object.fromEntries(COOKIE_TYPES.map(t => [t.id, true])));
  const declineAll = () => close('declined', Object.fromEntries(COOKIE_TYPES.map(t => [t.id, t.alwaysOn])));
  const savePrefs  = () => close('custom', prefs);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-[#2a2a2a] rounded-2xl shadow-[0_0_100px_rgba(232,0,28,0.12)] overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: 'rgba(232,0,28,0.12)' }}>
              <Shield size={24} style={{ color: '#e8001c' }} />
            </div>
            <div>
              <h2 className="text-white text-[22px] font-black leading-tight">We Value Your Privacy</h2>
              <p className="text-[#666] text-[12px] mt-0.5 font-medium">gnewz.com · Cookie Preferences</p>
            </div>
          </div>
          <button onClick={declineAll} className="text-[#555] hover:text-white transition-colors ml-4 mt-1">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          <p className="text-[#bbb] text-[14px] leading-relaxed mb-6">
            We use cookies and similar technologies to enhance your browsing experience, analyse site
            traffic, personalise content and serve targeted advertisements. By clicking{' '}
            <strong className="text-white font-bold">"Accept All"</strong>, you consent to our use of
            cookies. You can manage your preferences at any time. For more details, see our{' '}
            <a href="/cookie-policy"   className="underline font-semibold" style={{ color: '#e8001c' }}>Cookie Policy</a>{' '}
            and{' '}
            <a href="/privacy-policy"  className="underline font-semibold" style={{ color: '#e8001c' }}>Privacy Policy</a>.
          </p>

          {/* Manage toggle */}
          <button
            type="button"
            onClick={() => setShowManage(m => !m)}
            className="flex items-center gap-2 text-[13px] font-black uppercase tracking-widest mb-5 transition-colors"
            style={{ color: showManage ? '#e8001c' : '#777' }}
          >
            {showManage ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showManage ? 'Hide Preferences' : 'Manage Preferences'}
          </button>

          {showManage && (
            <div className="flex flex-col gap-2 mb-6">
              {COOKIE_TYPES.map(type => (
                <CookieRow
                  key={type.id}
                  type={type}
                  on={prefs[type.id]}
                  onChange={val => setPrefs(p => ({ ...p, [type.id]: val }))}
                />
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={acceptAll}
              className="flex-1 py-3.5 text-[14px] font-black uppercase tracking-widest text-white rounded-xl transition-opacity hover:opacity-90"
              style={{ background: '#e8001c' }}
            >
              Accept All
            </button>
            {showManage && (
              <button
                onClick={savePrefs}
                className="flex-1 py-3.5 text-[14px] font-black uppercase tracking-widest text-white rounded-xl border border-[#333] bg-[#1a1a1a] hover:bg-[#222] transition-colors"
              >
                Save Preferences
              </button>
            )}
            <button
              onClick={declineAll}
              className="flex-1 py-3.5 text-[14px] font-bold text-[#777] hover:text-white rounded-xl border border-[#2a2a2a] hover:border-[#444] transition-colors"
            >
              Decline All
            </button>
          </div>

          <p className="text-[#444] text-[11px] text-center mt-5 leading-relaxed">
            You can update your preferences at any time via the cookie icon in the footer.
          </p>
        </div>
      </div>
    </div>
  );
}
