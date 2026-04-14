import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'gnewz_cookie_consent';

export default function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const handle = (choice) => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-72">
      <div className="bg-black border border-[#222] rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-1.5 bg-orange/15 rounded-lg">
            <Cookie size={18} className="text-orange" />
          </div>
          <p className="text-white text-sm font-bold">{t('cookie.title')}</p>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed mb-5">
          {t('cookie.body')}
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handle('accepted')}
            className="w-full py-2.5 text-xs font-bold text-white bg-orange hover:bg-orange-dim rounded-xl transition-colors"
          >
            {t('cookie.acceptAll')}
          </button>
          <button
            onClick={() => handle('declined')}
            className="w-full py-2.5 text-xs font-bold text-gray-400 bg-[#1c1c1c] hover:bg-[#252525] rounded-xl transition-colors"
          >
            {t('cookie.decline')}
          </button>
        </div>
      </div>
    </div>
  );
}
