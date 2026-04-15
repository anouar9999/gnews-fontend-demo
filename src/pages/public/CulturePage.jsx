import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, ArrowRight, User } from 'lucide-react';
import NewsCard from '../../components/public/NewsCard';
import api from '../../api/axios';
import { toCard } from '../../utils/article';

const VOICES = [
  { name: 'Amara Chen', role: 'Senior Editor', img: 'https://picsum.photos/seed/amara/80/80', articles: 142 },
  { name: 'Marcus Webb', role: 'Culture Writer', img: 'https://picsum.photos/seed/marcus/80/80', articles: 98 },
  { name: 'Sofia Reyes', role: 'Music & Games', img: 'https://picsum.photos/seed/sofia/80/80', articles: 87 },
  { name: 'Jake Frost', role: 'Esports & Culture', img: 'https://picsum.photos/seed/jake/80/80', articles: 201 },
];

export default function CulturePage() {
  const { t } = useTranslation();
  const [editorialHero, setEditorialHero] = useState(null);
  const [features, setFeatures] = useState([]);
  const [longReads, setLongReads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/articles/', { params: { status: 'publie', category__slug: 'culture', ordering: '-published_at' } })
      .then(({ data }) => {
        const all = (data.results || []).map(toCard);
        setEditorialHero(all[0] || null);
        setFeatures(all.slice(1, 4));
        setLongReads(all.slice(4, 8));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-orange rounded-full" />
        <h1 className="text-[48px] font-black uppercase tracking-tighter text-white leading-none">{t('culture.title')}</h1>
        <span className="gnewz-tag ml-2">{t('culture.tag')}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {editorialHero && (
            <div className="mb-10">
              <NewsCard article={editorialHero} size="hero" />
            </div>
          )}

          {features.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <BookOpen size={18} className="text-orange" />
                <h2 className="text-xl font-900 text-white uppercase tracking-wide">{t('culture.featuredStories')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((a) => (
                  <Link
                    key={a.slug}
                    to={`/article/${a.slug}`}
                    className="gnewz-card group block overflow-hidden"
                  >
                    <div className="relative overflow-hidden" style={{ height: 240 }}>
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <span className="gnewz-tag absolute top-3 left-3">{a.tag}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-800 text-base text-white leading-snug mb-2 group-hover:text-orange transition-colors">
                        {a.title}
                      </h3>
                      {a.excerpt && (
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{a.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between border-t border-[#2a2a2a] pt-3">
                        <span className="text-[11px] text-gray-500">{a.time}</span>
                        <ArrowRight size={14} className="text-gray-500 group-hover:text-orange transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {longReads.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-6 bg-orange rounded-full" />
                    <h2 className="text-xl font-900 text-white uppercase tracking-wide">{t('culture.longReads')}</h2>
                  </div>
                  <div className="space-y-4">
                    {longReads.map((a) => (
                      <Link
                        key={a.slug}
                        to={`/article/${a.slug}`}
                        className="gnewz-card group flex gap-4 p-4"
                      >
                        <div className="shrink-0 relative rounded-lg overflow-hidden" style={{ width: 120, height: 90 }}>
                          <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="gnewz-tag">{a.tag}</span>
                          </div>
                          <h4 className="font-800 text-sm text-white leading-snug group-hover:text-orange transition-colors line-clamp-2 mb-2">
                            {a.title}
                          </h4>
                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <span>{a.time}</span>
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-gray-600 group-hover:text-orange transition-colors shrink-0 self-center" />
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <aside>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-orange rounded-full" />
                <h2 className="text-xl font-900 text-white uppercase tracking-wide">{t('culture.ourVoices')}</h2>
              </div>
              <div className="gnewz-card p-4 space-y-4">
                {VOICES.map((v) => (
                  <div key={v.name} className="flex items-center gap-3 pb-4 border-b border-[#2a2a2a] last:border-0 last:pb-0 hover:opacity-80 cursor-pointer transition-opacity">
                    <img src={v.img} alt={v.name} className="w-11 h-11 rounded-full object-cover border-2 border-orange" />
                    <div className="flex-1">
                      <p className="text-white font-700 text-sm">{v.name}</p>
                      <p className="text-gray-500 text-xs">{v.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange font-800 text-sm">{v.articles}</p>
                      <p className="text-gray-600 text-[10px]">{t('culture.articles')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="gnewz-card p-5 mt-4 text-center border border-orange/30">
                <p className="text-orange text-xs font-700 uppercase tracking-widest mb-2">{t('culture.writeForUs')}</p>
                <h3 className="text-white font-800 text-base mb-2">{t('culture.shareYourVoice')}</h3>
                <p className="text-gray-400 text-xs mb-4">{t('culture.shareDesc')}</p>
                <button className="w-full bg-transparent border border-orange text-orange hover:bg-orange hover:text-white text-xs font-700 uppercase py-2.5 rounded transition-colors tracking-wider">
                  {t('culture.submitArticle')}
                </button>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
