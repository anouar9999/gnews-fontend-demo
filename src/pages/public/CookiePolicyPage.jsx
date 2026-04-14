import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const DEFAULT_TYPES = [
  { name: 'Essential Cookies', required: true,  desc: 'These cookies are necessary for the website to function. They enable core features such as security, session management, and cookie consent preferences. They cannot be disabled.', examples: 'Session token, cookie consent preference' },
  { name: 'Analytics Cookies', required: false, desc: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data helps us improve our content and user experience.', examples: 'Page views, time on page, referral source' },
  { name: 'Preference Cookies', required: false, desc: 'These cookies remember your preferences and settings to personalise your experience on GNEWZ, such as your selected language.', examples: 'Language selection, theme preference' },
  { name: 'Advertising Cookies', required: false, desc: 'These cookies may be set by our advertising partners to build a profile of your interests and show you relevant ads on other sites. They do not store personal information directly.', examples: 'Ad targeting, frequency capping' },
];

export default function CookiePolicyPage() {
  const { t } = useTranslation();
  const [cookieTypes, setCookieTypes] = useState(DEFAULT_TYPES);

  useEffect(() => {
    api.get('/pages/cookie-policy/')
      .then(r => { if (r.data.content?.cookie_types) setCookieTypes(r.data.content.cookie_types); })
      .catch(() => {});
  }, []);

  const clearConsent = () => {
    localStorage.removeItem('gnewz_cookie_consent');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <p className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest mb-3">{t('legal.label')}</p>
        <h1 className="text-4xl font-black mb-2">{t('legal.cookie.title')}</h1>
        <p className="text-gray-500 text-sm mb-12">{t('legal.lastUpdated')}</p>

        <p className="text-gray-300 leading-relaxed mb-10">
          {t('legal.cookie.intro')}
        </p>

        <h2 className="text-white text-lg font-bold mb-4">{t('legal.cookie.whatAreCookies')}</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-10">
          {t('legal.cookie.whatAreCookiesDesc')}
        </p>

        <h2 className="text-white text-lg font-bold mb-6">{t('legal.cookie.cookiesWeUse')}</h2>
        <div className="space-y-4 mb-10">
          {cookieTypes.map((c) => (
            <div key={c.name} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-bold text-sm">{c.name}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.required ? 'bg-[#FF6B00]/15 text-[#FF6B00]' : 'bg-gray-800 text-gray-500'}`}>
                  {c.required ? t('legal.cookie.alwaysActive') : t('legal.cookie.optional')}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">{c.desc}</p>
              <p className="text-gray-600 text-xs">{c.examples}</p>
            </div>
          ))}
        </div>

        <h2 className="text-white text-lg font-bold mb-3">{t('legal.cookie.managingPrefs')}</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          {t('legal.cookie.managingDesc')}
        </p>
        <button
          onClick={clearConsent}
          className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#cc5500] text-white text-sm font-bold rounded-xl transition-colors"
        >
          {t('legal.cookie.updatePrefs')}
        </button>

        <div className="mt-12 pt-8 border-t border-[#1f1f1f] text-gray-600 text-xs">
          {t('legal.questions')} <Link to="/contact" className="text-[#FF6B00] hover:underline">{t('legal.contactUs')}</Link>
        </div>
      </div>
    </div>
  );
}
