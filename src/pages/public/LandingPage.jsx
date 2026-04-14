import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, TrendingUp, Zap, Monitor, Trophy } from 'lucide-react';
import NewsCard from '../../components/public/NewsCard';
import api from '../../api/axios';
import { toCard } from '../../utils/article';

const LIVE_MATCHES = [
  { t1: 'Team Liquid', t2: 'NAVI', s1: 16, s2: 9, game: 'CS2', round: 'grandFinal', map: 'Inferno' },
  { t1: 'T1', t2: 'Cloud9', s1: 2, s2: 1, game: 'Valorant', round: 'semiFinals', map: 'Bind' },
  { t1: 'FaZe Clan', t2: 'G2 Esports', s1: 3, s2: 3, game: 'CS2', round: 'quarterFinals', map: 'Mirage' },
];

export default function LandingPage() {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState([]);
  const [gaming, setGaming] = useState([]);
  const [hardware, setHardware] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { label: t('landing.cats.gamingNews'), icon: Zap,       to: '/gaming',    desc: t('landing.cats.gamingDesc') },
    { label: t('landing.cats.hardware'),   icon: Monitor,    to: '/hardware',  desc: t('landing.cats.hardwareDesc') },
    { label: t('landing.cats.esports'),    icon: Trophy,     to: '/esports',   desc: t('landing.cats.esportsDesc') },
    { label: t('landing.cats.trending'),   icon: TrendingUp, to: '/culture',   desc: t('landing.cats.trendingDesc') },
  ];

  useEffect(() => {
    Promise.all([
      api.get('/articles/', { params: { status: 'publie', is_featured: true, ordering: '-published_at' } }),
      api.get('/articles/', { params: { status: 'publie', category__slug: 'gaming', ordering: '-published_at' } }),
      api.get('/articles/', { params: { status: 'publie', category__slug: 'hardware', ordering: '-published_at' } }),
    ])
      .then(([featRes, gamRes, hwRes]) => {
        setFeatured((featRes.data.results || []).slice(0, 3).map(toCard));
        setGaming((gamRes.data.results || []).slice(0, 4).map(toCard));
        setHardware((hwRes.data.results || []).slice(0, 3).map(toCard));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hero = featured[0];
  const sideFeatured = featured.slice(1, 3);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">

      {/* ─── Hero + Featured Grid ─────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="rounded-[10px] bg-[#111] animate-pulse" style={{ height: 'clamp(260px, 45vw, 480px)' }} />
          ) : hero ? (
            <NewsCard article={hero} size="hero" />
          ) : null}
        </div>
        <div className="flex flex-col gap-4">
          {loading ? (
            <>
              <div className="rounded-[10px] bg-[#111] animate-pulse h-[200px]" />
              <div className="rounded-[10px] bg-[#111] animate-pulse h-[200px]" />
            </>
          ) : (
            sideFeatured.map((a) => <NewsCard key={a.slug} article={a} size="lg" />)
          )}
        </div>
      </section>

      {/* ─── Category Quick Links ─────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {categories.map(({ label, icon: Icon, to, desc }) => (
          <Link key={to} to={to} className="gnewz-card flex flex-col gap-2 p-4 group">
            <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center group-hover:bg-orange transition-colors">
              <Icon size={20} className="text-orange group-hover:text-white transition-colors" />
            </div>
            <p className="font-800 text-sm text-white">{label}</p>
            <p className="text-gray-500 text-xs">{desc}</p>
          </Link>
        ))}
      </section>

      {/* ─── Latest Gaming ────────────────────────────── */}
      {gaming.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-orange rounded-full" />
              <h2 className="text-xl font-900 text-white uppercase tracking-wide">{t('landing.latestGaming')}</h2>
            </div>
            <Link to="/gaming" className="flex items-center gap-1 text-orange text-sm font-700 hover:gap-2 transition-all">
              {t('public.viewAll')} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gaming.map((a) => <NewsCard key={a.slug} article={a} size="lg" />)}
          </div>
        </section>
      )}

      {/* ─── Hardware Spotlight ───────────────────────── */}
      {hardware.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-orange rounded-full" />
              <h2 className="text-xl font-900 text-white uppercase tracking-wide">{t('landing.hardwareSpotlight')}</h2>
            </div>
            <Link to="/hardware" className="flex items-center gap-1 text-orange text-sm font-700 hover:gap-2 transition-all">
              {t('public.viewAll')} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hardware.map((a) => <NewsCard key={a.slug} article={a} size="lg" showExcerpt />)}
          </div>
        </section>
      )}

      {/* ─── Esports Live Strip (static scores) ──────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-orange rounded-full" />
            <h2 className="text-xl font-900 text-white uppercase tracking-wide">{t('landing.esportsLive')}</h2>
            <span className="live-badge"><span className="live-dot" />{t('public.live')}</span>
          </div>
          <Link to="/esports" className="flex items-center gap-1 text-orange text-sm font-700 hover:gap-2 transition-all">
            {t('landing.fullDashboard')} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {LIVE_MATCHES.map((m, i) => (
            <div key={i} className="gnewz-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="gnewz-tag">{m.game}</span>
                <span className="text-gray-500 text-xs">{t(`esports.${m.round}`)} · {m.map}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#2a2a2a] mx-auto mb-1 flex items-center justify-center text-lg font-900 text-orange">
                    {m.t1[0]}
                  </div>
                  <p className="text-white text-xs font-700 truncate">{m.t1}</p>
                </div>
                <div className="px-4 text-center">
                  <span className="text-2xl font-900 text-white">{m.s1}</span>
                  <span className="text-orange font-900 mx-1">:</span>
                  <span className="text-2xl font-900 text-white">{m.s2}</span>
                  <p className="text-[10px] text-orange font-700 uppercase tracking-wider mt-0.5">{t('public.live')}</p>
                </div>
                <div className="text-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#2a2a2a] mx-auto mb-1 flex items-center justify-center text-lg font-900 text-orange">
                    {m.t2[0]}
                  </div>
                  <p className="text-white text-xs font-700 truncate">{m.t2}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
