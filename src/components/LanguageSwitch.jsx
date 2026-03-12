import { useTranslation } from 'react-i18next';

export default function LanguageSwitch({ className = '' }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const toggle = () => {
    const next = isAr ? 'en' : 'ar';
    i18n.changeLanguage(next);
    localStorage.setItem('gnewz-lang', next);
    document.documentElement.dir  = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1 sm:gap-1.5 border border-[#333] hover:border-[#FF6B00] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 sm:px-3 py-1 sm:py-1.5 rounded transition-colors whitespace-nowrap ${className}`}
      title={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {/* Morocco flag for FR/EN, US flag for AR */}
      <span className="text-[11px]">{isAr ? '🇺🇸' : '🇲🇦'}</span>
      {isAr ? 'EN' : 'AR'}
    </button>
  );
}
