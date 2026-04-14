import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const FALLBACK = [
  'Breaking news — stay tuned for the latest updates',
];

export default function BreakingTicker() {
  const { t } = useTranslation();
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    api.get('/articles/', { params: { status: 'publie', is_breaking: true, ordering: '-published_at' } })
      .then(({ data }) => {
        const titles = (data.results || []).map((a) => a.title);
        if (titles.length > 0) setItems(titles);
      })
      .catch(() => {});
  }, []);

  const repeated = [...items, ...items];

  return (
    <div className="bg-orange overflow-hidden flex items-center h-8 sm:h-9 shrink-0">
      <div
        className="bg-black text-orange font-black text-[10px] sm:text-xs uppercase tracking-widest px-2 sm:px-3 h-full flex items-center shrink-0 z-10"
        style={{ minWidth: 'max-content' }}
      >
        {t('public.breaking')}
      </div>
      <div className="overflow-hidden flex-1">
        <div className="ticker-track">
          {repeated.map((item, i) => (
            <span key={i} className="text-black font-semibold text-[11px] sm:text-xs px-6 sm:px-8 whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
