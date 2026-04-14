import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const LANGS = [
  { code: 'en', label: 'English', short: 'EN', flag: '/images/flag-us.svg', alt: 'US flag', dir: 'ltr' },
  { code: 'ar', label: 'العربية', short: 'AR', flag: '/images/flag-ma.svg', alt: 'Morocco flag', dir: 'rtl' },
];

export default function LanguageSwitch({ className = '' }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGS.find(l => l.code === i18n.language) ?? LANGS[0];

  const select = (lang) => {
    i18n.changeLanguage(lang.code);
    localStorage.setItem('gnewz-lang', lang.code);
    document.documentElement.dir  = lang.dir;
    document.documentElement.lang = lang.code;
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={`relative shrink-0 ${className}`}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-[#111] border transition-all duration-200 ${
          open ? 'border-orange shadow-[0_0_0_2px_rgba(255,107,0,0.15)]' : 'border-[#2a2a2a] hover:border-[#444]'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <img
          src={current.flag}
          alt={current.alt}
          className="w-5 h-[14px] rounded-[3px] object-cover shadow"
        />
        <span className="text-[11px] font-semibold text-white tracking-wide">{current.short}</span>
        <ChevronDown
          size={12}
          className={`text-[#777] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-1.5 w-48  border border-[#2a2a2a] bg-[#111] shadow-2xl shadow-black/60 overflow-hidden transition-all duration-200 origin-top-right z-50 ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        role="listbox"
      >
        {LANGS.map((lang, i) => {
          const isActive = lang.code === current.code;
          return (
            <button
              key={lang.code}
              onClick={() => select(lang)}
              role="option"
              aria-selected={isActive}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors duration-150 ${
                i < LANGS.length - 1 ? 'border-b border-[#1e1e1e]' : ''
              } ${
                isActive
                  ? 'bg-orange/10 text-white'
                  : 'text-[#aaa] hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <img
                src={lang.flag}
                alt={lang.alt}
                className="w-6 h-[17px] rounded-[3px] object-cover shadow"
              />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[11px] font-bold tracking-wide">{lang.short}</span>
                <span className="text-[9px] text-[#555]">{lang.label}</span>
              </div>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
