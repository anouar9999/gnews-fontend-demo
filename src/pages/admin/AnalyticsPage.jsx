import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PolarRadiusAxis,
} from 'recharts';
import {
  TrendingUp, Eye, FileText, Users, Rss, Tag, Image, Mail,
  FolderTree, Newspaper, RefreshCw, Activity, Globe, Zap,
  Flame, Star, Archive, Clock, CheckCircle,
} from 'lucide-react';
import api from '../../api/axios';
import { usePageTitle } from '../../context/PageTitleContext';

/* ══════════════════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════════════════ */
const C = {
  orange:      '#FF6B00',
  orangeFaint: 'rgba(255,107,0,0.1)',
  surface:     'linear-gradient(160deg,#161618,#111113)',
  border:      'rgba(255,255,255,0.07)',
  muted:       'rgba(255,255,255,0.28)',
  bg:          '#0D0D0D',
};

const PALETTE = [
  '#FF6B00','#3B82F6','#10B981','#F59E0B','#8B5CF6',
  '#EC4899','#14B8A6','#F97316','#6366F1','#22C55E',
  '#EF4444','#A855F7','#0EA5E9','#84CC16','#FB923C',
];

/* ══════════════════════════════════════════════════════════
   MOCK DATA  (used whenever real arrays are empty)
══════════════════════════════════════════════════════════ */
const MOCK = {
  pubByDay: Array.from({ length: 30 }, (_, i) => {
    const d = new Date('2026-03-14');
    d.setUTCDate(d.getUTCDate() + i);
    return {
      date: d.toLocaleDateString('en', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      count: Math.floor(Math.random() * 8) + 1,
    };
  }),

  pubByMonth: [
    { month: "May '25", count: 18 },
    { month: "Jun '25", count: 24 },
    { month: "Jul '25", count: 31 },
    { month: "Aug '25", count: 27 },
    { month: "Sep '25", count: 35 },
    { month: "Oct '25", count: 42 },
    { month: "Nov '25", count: 38 },
    { month: "Dec '25", count: 29 },
    { month: "Jan '26", count: 44 },
    { month: "Feb '26", count: 51 },
    { month: "Mar '26", count: 47 },
    { month: "Apr '26", count: 33 },
  ],

  artByStatus: [
    { name: 'publie',       value: 142 },
    { name: 'en_revision',  value: 28 },
    { name: 'brouillon_ia', value: 45 },
    { name: 'nouveau',      value: 19 },
    { name: 'archive',      value: 67 },
  ],

  topViewed: [
    { name: 'RTX 5090 Full Benchmark Review',        views: 48200 },
    { name: 'Elden Ring DLC: All Bosses Ranked',     views: 39700 },
    { name: 'PS5 Pro vs Xbox Series X: 2026 Update', views: 31500 },
    { name: 'Best Gaming Monitors Under $500',       views: 27800 },
    { name: 'League of Legends Season 16 Tier List', views: 24100 },
    { name: 'CS2 Pro Settings Guide 2026',           views: 19600 },
    { name: 'GTA VI Release Date Confirmed',         views: 17300 },
    { name: 'Steam Deck 2 Hands-On Preview',         views: 14900 },
    { name: 'Best Free-to-Play Games of 2026',       views: 12400 },
    { name: 'AMD RX 9700 XT Performance Deep Dive',  views: 10200 },
  ],

  catDetail: [
    { name: 'Gaming',    total: 87,  published: 74 },
    { name: 'Hardware',  total: 62,  published: 55 },
    { name: 'Esports',   total: 54,  published: 49 },
    { name: 'Culture',   total: 41,  published: 36 },
    { name: 'Software',  total: 33,  published: 28 },
    { name: 'Mobile',    total: 24,  published: 21 },
  ],

  srcByType: [
    { name: 'RSS',     value: 12 },
    { name: 'API',     value: 5  },
    { name: 'Scraper', value: 8  },
  ],

  artPerSrc: [
    { name: 'IGN',          articles: 84, raw: 210 },
    { name: 'Eurogamer',    articles: 71, raw: 189 },
    { name: 'PCGamer',      articles: 65, raw: 174 },
    { name: 'GameSpot',     articles: 58, raw: 155 },
    { name: 'Kotaku',       articles: 52, raw: 143 },
    { name: 'VGC',          articles: 44, raw: 118 },
    { name: 'Rock Paper S.', articles: 39, raw: 97  },
    { name: 'Polygon',      articles: 34, raw: 88  },
  ],

  rnByStatus: [
    { name: 'nouveau', value: 134 },
    { name: 'traite',  value: 389 },
    { name: 'ignore',  value: 57  },
  ],

  rnByDay: Array.from({ length: 30 }, (_, i) => {
    const d = new Date('2026-03-14');
    d.setUTCDate(d.getUTCDate() + i);
    return {
      date: d.toLocaleDateString('en', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      count: Math.floor(Math.random() * 25) + 5,
    };
  }),

  tagsByType: [
    { name: 'game',     value: 68 },
    { name: 'platform', value: 24 },
    { name: 'genre',    value: 39 },
    { name: 'brand',    value: 17 },
    { name: 'event',    value: 12 },
  ],

  topTags: [
    { name: 'PlayStation',  count: 94 },
    { name: 'Xbox',         count: 87 },
    { name: 'PC Gaming',    count: 82 },
    { name: 'Nintendo',     count: 75 },
    { name: 'FPS',          count: 68 },
    { name: 'RPG',          count: 63 },
    { name: 'Esports',      count: 59 },
    { name: 'GPU',          count: 54 },
    { name: 'Steam',        count: 49 },
    { name: 'Indie',        count: 44 },
    { name: 'Strategy',     count: 41 },
    { name: 'Mobile',       count: 37 },
    { name: 'VR',           count: 32 },
    { name: 'Open World',   count: 28 },
    { name: 'Multiplayer',  count: 25 },
  ],

  nlByMonth: [
    { month: "May '25", count: 120 },
    { month: "Jun '25", count: 185 },
    { month: "Jul '25", count: 240 },
    { month: "Aug '25", count: 198 },
    { month: "Sep '25", count: 312 },
    { month: "Oct '25", count: 278 },
    { month: "Nov '25", count: 345 },
    { month: "Dec '25", count: 289 },
    { month: "Jan '26", count: 401 },
    { month: "Feb '26", count: 467 },
    { month: "Mar '26", count: 523 },
    { month: "Apr '26", count: 388 },
  ],

  usrByType: [
    { name: 'admin',  value: 3 },
    { name: 'editor', value: 12 },
    { name: 'viewer', value: 84 },
  ],

  usrByMonth: [
    { month: "May '25", count: 4  },
    { month: "Jun '25", count: 7  },
    { month: "Jul '25", count: 5  },
    { month: "Aug '25", count: 11 },
    { month: "Sep '25", count: 9  },
    { month: "Oct '25", count: 14 },
    { month: "Nov '25", count: 18 },
    { month: "Dec '25", count: 12 },
    { month: "Jan '26", count: 22 },
    { month: "Feb '26", count: 19 },
    { month: "Mar '26", count: 27 },
    { month: "Apr '26", count: 15 },
  ],

  contentRadar: [
    { subject: 'Articles',   A: 85 },
    { subject: 'Raw News',   A: 62 },
    { subject: 'Sources',    A: 55 },
    { subject: 'Tags',       A: 78 },
    { subject: 'Categories', A: 70 },
    { subject: 'Media',      A: 48 },
  ],
};

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
function fmtDay(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}
function fmtMonth(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en', { month: 'short', year: '2-digit', timeZone: 'UTC' });
}
function fmt(n) {
  if (n == null) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'k';
  return String(n);
}
function hexToRgb(hex) {
  const m = (hex || '#FF6B00').replace('#', '').match(/.{2}/g);
  return m ? m.map(x => parseInt(x, 16)).join(',') : '255,107,0';
}
// Return real data if non-empty, else mock fallback
function live(arr, mockKey) {
  return arr && arr.length > 0 ? arr : MOCK[mockKey];
}

/* ══════════════════════════════════════════════════════════
   RECHARTS SHARED TOOLTIP
══════════════════════════════════════════════════════════ */
const TT = {
  contentStyle: {
    background: '#1a1a1c',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
  },
  itemStyle:  { color: 'rgba(255,255,255,0.8)' },
  labelStyle: { color: 'rgba(255,255,255,0.45)', marginBottom: 4 },
};

const AXIS = { fill: 'rgba(255,255,255,0.28)', fontSize: 10 };
const GRID = { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.04)' };

/* ══════════════════════════════════════════════════════════
   UI COMPONENTS
══════════════════════════════════════════════════════════ */
function Card({ children, className = '', style = {} }) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, icon: Icon, accent = C.orange, isMock }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div style={{ width: 3, height: 32, borderRadius: '0 2px 2px 0', background: accent, flexShrink: 0 }} />
      {Icon && (
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: `rgba(${hexToRgb(accent)},0.12)` }}
        >
          <Icon size={16} color={accent} strokeWidth={2.5} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-black text-white uppercase tracking-wider">{title}</p>
        {subtitle && <p className="text-[11px] mt-0.5" style={{ color: C.muted }}>{subtitle}</p>}
      </div>
      {isMock && (
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          DEMO
        </span>
      )}
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, color = C.orange, sub }) {
  const rgb = hexToRgb(color);
  return (
    <Card>
      <div className="px-5 py-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: C.muted }}>{label}</p>
          <p className="text-[32px] font-black text-white leading-none">{fmt(value)}</p>
          {sub && <p className="text-[11px] mt-1.5 font-semibold" style={{ color: C.muted }}>{sub}</p>}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.2)` }}
        >
          <Icon size={18} color={color} strokeWidth={2} />
        </div>
      </div>
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg,rgba(${rgb},0.55),transparent)` }} />
    </Card>
  );
}

function SectionDivider({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5 mt-2">
      <div className="h-[1.5px] flex-1" style={{ background: `linear-gradient(90deg,${C.orange},transparent)` }} />
      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2" style={{ color: C.muted }}>{children}</span>
      <div className="h-[1.5px] flex-1" style={{ background: `linear-gradient(270deg,${C.orange},transparent)` }} />
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-32">
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${C.orange}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );
}

function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.07) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function AnalyticsPage() {
  const { setPageTitle } = usePageTitle();
  useEffect(() => { setPageTitle('Analytics'); return () => setPageTitle(null); }, [setPageTitle]);

  const [loading, setLoading] = useState(true);
  const [ts, setTs] = useState(null);
  const [ov,  setOv]  = useState({});
  const [art, setArt] = useState({});
  const [src, setSrc] = useState({});
  const [rn,  setRn]  = useState({});
  const [cat, setCat] = useState({});
  const [tag, setTag] = useState({});
  const [nl,  setNl]  = useState({});
  const [usr, setUsr] = useState({});

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [r0,r1,r2,r3,r4,r5,r6,r7] = await Promise.all([
        api.get('/stats/'),
        api.get('/stats/articles/'),
        api.get('/stats/sources/'),
        api.get('/stats/raw-news/'),
        api.get('/stats/categories/'),
        api.get('/stats/tags/'),
        api.get('/stats/newsletter/'),
        api.get('/stats/users/'),
      ]);
      setOv(r0.data);  setArt(r1.data); setSrc(r2.data); setRn(r3.data);
      setCat(r4.data); setTag(r5.data); setNl(r6.data);  setUsr(r7.data);
      setTs(new Date());
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Overview shortcuts ───────────────────────────────── */
  const ovA  = ov.articles   || {};
  const ovRN = ov.raw_news   || {};
  const ovS  = ov.sources    || {};
  const ovNL = ov.newsletter || {};
  const ovU  = ov.users      || {};

  /* ── Articles ─────────────────────────────────────────── */
  const rawArtByStatus = (art.by_status || []).map(d => ({ name: d.status, value: d.count }));
  const artByStatus    = live(rawArtByStatus, 'artByStatus');
  const isMockArtStatus = rawArtByStatus.length === 0;

  const rawPubByDay = (art.published_by_day || []).map(d => ({ date: fmtDay(d.day), count: d.count }));
  const pubByDay    = live(rawPubByDay, 'pubByDay');
  const isMockPubDay = rawPubByDay.length === 0;

  const rawPubByMonth = (art.published_by_month || []).map(d => ({ month: fmtMonth(d.month), count: d.count }));
  const pubByMonth    = live(rawPubByMonth, 'pubByMonth');
  const isMockPubMonth = rawPubByMonth.length === 0;

  const rawTopViewed = (art.top_viewed || []).slice(0, 10).map(a => ({
    name: (a.title || '').length > 36 ? a.title.slice(0, 34) + '…' : (a.title || ''),
    views: a.view_count ?? 0,
  }));
  const topViewed    = live(rawTopViewed, 'topViewed');
  const isMockTopViewed = rawTopViewed.length === 0;

  // Category detail: prefer /stats/categories/ (has published_count); fallback mock
  const rawCatDetail = (cat.categories || []).map(c => ({
    name: c.name, total: c.article_count, published: c.published_count,
  }));
  const catDetail    = live(rawCatDetail, 'catDetail');
  const isMockCat    = rawCatDetail.length === 0;

  /* ── Sources ──────────────────────────────────────────── */
  const rawSrcByType = (src.by_type || []).map(d => ({ name: d.type ?? d.name ?? '', value: d.count }));
  const srcByType    = live(rawSrcByType, 'srcByType');
  const isMockSrcType = rawSrcByType.length === 0;

  const rawArtPerSrc = (src.articles_per_source || []).slice(0, 10).map(s => ({
    name: (s.name || s.source__name || '').slice(0, 22),
    articles: s.article_count ?? s.count ?? 0,
    raw: (src.raw_news_per_source || []).find(r => r.name === s.name)?.count ?? 0,
  }));
  const artPerSrc    = live(rawArtPerSrc, 'artPerSrc');
  const isMockSrcArt = rawArtPerSrc.length === 0;

  /* ── Raw News ─────────────────────────────────────────── */
  const rawRnByStatus = (rn.by_status || []).map(d => ({ name: d.status, value: d.count }));
  const rnByStatus    = live(rawRnByStatus, 'rnByStatus');
  const isMockRnStatus = rawRnByStatus.length === 0;

  const rawRnByDay = (rn.ingested_by_day || []).map(d => ({ date: fmtDay(d.day), count: d.count }));
  const rnByDay    = live(rawRnByDay, 'rnByDay');
  const isMockRnDay = rawRnByDay.length === 0;

  /* ── Tags ─────────────────────────────────────────────── */
  const rawTagsByType = (tag.by_type || []).map(d => ({ name: d.type ?? d.tag_type ?? d.name ?? '', value: d.count }));
  const tagsByType    = live(rawTagsByType, 'tagsByType');
  const isMockTagType = rawTagsByType.length === 0;

  const rawTopTags = (tag.top_tags || []).slice(0, 15).map(t => ({
    name: (t.name || '').length > 14 ? t.name.slice(0, 13) + '…' : (t.name || ''),
    count: t.article_count ?? t.count ?? 0,
  }));
  const topTags    = live(rawTopTags, 'topTags');
  const isMockTopTags = rawTopTags.length === 0;

  /* ── Newsletter ───────────────────────────────────────── */
  const rawNlByMonth = (nl.subscriptions_by_month || []).map(d => ({ month: fmtMonth(d.month), count: d.count }));
  const nlByMonth    = live(rawNlByMonth, 'nlByMonth');
  const isMockNl     = rawNlByMonth.length === 0;

  /* ── Users ────────────────────────────────────────────── */
  const rawUsrByType = (usr.by_type || []).map(d => ({ name: d.user_type, value: d.count }));
  const usrByType    = live(rawUsrByType, 'usrByType');
  const isMockUsrType = rawUsrByType.length === 0;

  const rawUsrByMonth = (usr.registrations_by_month || []).map(d => ({ month: fmtMonth(d.month), count: d.count }));
  const usrByMonth    = live(rawUsrByMonth, 'usrByMonth');
  const isMockUsrMonth = rawUsrByMonth.length === 0;

  /* ── Radar (always uses real or mock mix) ─────────────── */
  const radarData = [
    { subject: 'Articles',   A: ovA.total        || MOCK.contentRadar[0].A },
    { subject: 'Raw News',   A: ovRN.total        || MOCK.contentRadar[1].A },
    { subject: 'Sources',    A: ovS.total         || MOCK.contentRadar[2].A },
    { subject: 'Tags',       A: ov.tags?.total    || MOCK.contentRadar[3].A },
    { subject: 'Categories', A: ov.categories?.total || MOCK.contentRadar[4].A },
    { subject: 'Media',      A: ov.media?.total   || MOCK.contentRadar[5].A },
  ];
  const maxRadar = Math.max(...radarData.map(d => d.A), 1);
  const radarNorm = radarData.map(d => ({ ...d, A: Math.round((d.A / maxRadar) * 100) }));

  /* ── Animation variants ───────────────────────────────── */
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div className="space-y-10 pb-16">

      {/* ── Header ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-end justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-[48px] font-black uppercase tracking-tighter text-white leading-none">Analytics</h1>
          <p className="text-[13px] mt-2" style={{ color: C.muted }}>
            Full platform insights — articles, sources, audience & more
          </p>
        </div>
        <div className="flex items-center gap-3">
          {ts && <span className="text-[11px]" style={{ color: C.muted }}>Updated {ts.toLocaleTimeString()}</span>}
          <button
            onClick={fetchAll} disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold text-white disabled:opacity-40 transition-opacity"
            style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}` }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </motion.div>

      {loading ? <Spinner /> : (
        <>
          {/* ══ OVERVIEW KPIs ══════════════════════════════ */}
          <section>
            <SectionDivider>Overview</SectionDivider>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[
                { label: 'Total Articles',  value: ovA.total,            icon: FileText,    color: C.orange,   sub: `${ovA.published ?? 0} published` },
                { label: 'Total Views',     value: ov.total_views,       icon: Eye,         color: '#3B82F6' },
                { label: 'Featured',        value: ovA.featured,         icon: Star,        color: '#F59E0B' },
                { label: 'Breaking',        value: ovA.breaking,         icon: Flame,       color: '#EF4444' },
                { label: 'In Review',       value: ovA.in_review,        icon: Clock,       color: '#8B5CF6' },
                { label: 'Archived',        value: ovA.archived,         icon: Archive,     color: '#6B7280' },
                { label: 'Raw News',        value: ovRN.total,           icon: Newspaper,   color: '#10B981',  sub: `${ovRN.nouveau ?? 0} new` },
                { label: 'Sources',         value: ovS.total,            icon: Rss,         color: '#F59E0B',  sub: `${ovS.active ?? 0} active` },
                { label: 'Categories',      value: ov.categories?.total, icon: FolderTree,  color: '#8B5CF6' },
                { label: 'Tags',            value: ov.tags?.total,       icon: Tag,         color: '#EC4899' },
                { label: 'Media',           value: ov.media?.total,      icon: Image,       color: '#14B8A6' },
                { label: 'Subscribers',     value: ovNL.total,           icon: Mail,        color: '#F97316',  sub: `${ovNL.active ?? 0} active` },
                { label: 'Users',           value: ovU.total,            icon: Users,       color: '#6366F1',  sub: `${ovU.admins ?? 0} admins` },
                { label: 'Published',       value: ovA.published,        icon: CheckCircle, color: '#22C55E' },
                { label: 'Drafts',          value: ovA.draft,            icon: Activity,    color: '#94A3B8' },
              ].map((kpi, i) => (
                <motion.div key={kpi.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                  <KpiCard {...kpi} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══ ARTICLES ═══════════════════════════════════ */}
          <section>
            <SectionDivider>Articles</SectionDivider>

            {/* Row 1: area + donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

              <Card className="lg:col-span-2">
                <CardHeader title="Published Per Day" subtitle="Last 30 days" icon={TrendingUp} isMock={isMockPubDay} />
                <div className="px-4 py-5">
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={pubByDay}>
                      <defs>
                        <linearGradient id="gOrange" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={C.orange} stopOpacity={0.35} />
                          <stop offset="95%" stopColor={C.orange} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid {...GRID} />
                      <XAxis dataKey="date"  tick={AXIS} axisLine={false} tickLine={false} interval={4} />
                      <YAxis tick={AXIS} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                      <Tooltip {...TT} />
                      <Area type="monotone" dataKey="count" stroke={C.orange} strokeWidth={2.5}
                        fill="url(#gOrange)" dot={false} name="Published" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <CardHeader title="By Status" subtitle="Article pipeline" icon={Activity} isMock={isMockArtStatus} />
                <div className="px-4 py-5">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={artByStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                        dataKey="value" nameKey="name" labelLine={false} label={PieLabel}>
                        {artByStatus.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                      </Pie>
                      <Tooltip {...TT} />
                      <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Row 2: bar month + top viewed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

              <Card className="lg:col-span-2">
                <CardHeader title="Published Per Month" subtitle="Last 12 months" icon={TrendingUp} isMock={isMockPubMonth} />
                <div className="px-4 py-5">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={pubByMonth} barSize={20}>
                      <CartesianGrid {...GRID} />
                      <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
                      <YAxis tick={AXIS} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                      <Tooltip {...TT} />
                      <Bar dataKey="count" name="Published" radius={[6, 6, 0, 0]}>
                        {pubByMonth.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <CardHeader title="Top Viewed" subtitle="By view count" icon={Eye} isMock={isMockTopViewed} />
                <div className="px-4 py-3 space-y-2.5">
                  {topViewed.map((a, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black shrink-0"
                        style={{ background: i === 0 ? C.orange : 'rgba(255,255,255,0.06)', color: i === 0 ? '#fff' : C.muted }}
                      >{i + 1}</span>
                      <span className="text-[12px] text-white truncate flex-1 min-w-0">{a.name}</span>
                      <span className="text-[12px] font-bold shrink-0" style={{ color: C.orange }}>{fmt(a.views)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Row 3: category grouped bar + radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Card className="lg:col-span-2">
                <CardHeader title="Articles by Category" subtitle="Total vs Published" icon={FolderTree} isMock={isMockCat} />
                <div className="px-4 py-5">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={catDetail} barGap={6} barSize={18}>
                      <CartesianGrid {...GRID} />
                      <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
                      <YAxis tick={AXIS} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                      <Tooltip {...TT} />
                      <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }} />
                      <Bar dataKey="total"     name="Total"     fill={C.orange} radius={[5, 5, 0, 0]} />
                      <Bar dataKey="published" name="Published" fill="#3B82F6"  radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <CardHeader title="Content Radar" subtitle="Platform health overview" icon={Activity} />
                <div className="px-4 py-5">
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarNorm}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Score" dataKey="A" stroke={C.orange} fill={C.orange} fillOpacity={0.2} strokeWidth={2} />
                      <Tooltip {...TT} formatter={(v) => [`${v}%`, 'Relative']} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </section>

          {/* ══ SOURCES ════════════════════════════════════ */}
          <section>
            <SectionDivider>Sources</SectionDivider>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              <Card>
                <CardHeader title="Sources by Type" subtitle="RSS · API · Scraper" icon={Rss} accent="#F59E0B" isMock={isMockSrcType} />
                <div className="px-4 py-5">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={srcByType} cx="50%" cy="50%" outerRadius={90}
                        dataKey="value" nameKey="name" labelLine={false} label={PieLabel}>
                        {srcByType.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                      </Pie>
                      <Tooltip {...TT} />
                      <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader title="Content Per Source" subtitle="Articles vs Raw news (top 10)" icon={Globe} accent="#F59E0B" isMock={isMockSrcArt} />
                <div className="px-4 py-5">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={artPerSrc} barGap={4} barSize={14}>
                      <CartesianGrid {...GRID} />
                      <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
                      <YAxis tick={AXIS} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
                      <Tooltip {...TT} />
                      <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }} />
                      <Bar dataKey="articles" name="Articles"  fill={C.orange} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="raw"      name="Raw News"  fill="#3B82F6"  radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </section>

          {/* ══ RAW NEWS ═══════════════════════════════════ */}
          <section>
            <SectionDivider>Raw News Ingestion</SectionDivider>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              <Card>
                <CardHeader title="By Status" subtitle="nouveau · traité · ignoré" icon={Newspaper} accent="#10B981" isMock={isMockRnStatus} />
                <div className="px-4 py-5">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={rnByStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                        dataKey="value" nameKey="name" labelLine={false} label={PieLabel}>
                        {rnByStatus.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                      </Pie>
                      <Tooltip {...TT} />
                      <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader title="Ingested Per Day" subtitle="Last 30 days" icon={Zap} accent="#10B981" isMock={isMockRnDay} />
                <div className="px-4 py-5">
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={rnByDay}>
                      <defs>
                        <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#10B981" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid {...GRID} />
                      <XAxis dataKey="date" tick={AXIS} axisLine={false} tickLine={false} interval={4} />
                      <YAxis tick={AXIS} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                      <Tooltip {...TT} />
                      <Area type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2.5}
                        fill="url(#gGreen)" dot={false} name="Ingested" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </section>

          {/* ══ TAGS ═══════════════════════════════════════ */}
          <section>
            <SectionDivider>Tags</SectionDivider>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              <Card>
                <CardHeader title="Tags by Type" subtitle="Distribution" icon={Tag} accent="#EC4899" isMock={isMockTagType} />
                <div className="px-4 py-5">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={tagsByType} cx="50%" cy="50%" outerRadius={90}
                        dataKey="value" nameKey="name" labelLine={false} label={PieLabel}>
                        {tagsByType.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                      </Pie>
                      <Tooltip {...TT} />
                      <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader title="Top Tags by Usage" subtitle="Top 15 by article count" icon={Tag} accent="#EC4899" isMock={isMockTopTags} />
                <div className="px-4 py-5">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topTags} layout="vertical" barSize={12} margin={{ left: 8 }}>
                      <CartesianGrid {...GRID} horizontal={false} />
                      <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" tick={AXIS} axisLine={false} tickLine={false} width={100} />
                      <Tooltip {...TT} />
                      <Bar dataKey="count" name="Articles" radius={[0, 5, 5, 0]}>
                        {topTags.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </section>

          {/* ══ AUDIENCE ═══════════════════════════════════ */}
          <section>
            <SectionDivider>Audience</SectionDivider>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Newsletter */}
              <Card>
                <CardHeader title="Newsletter" subtitle="Subscriber growth per month" icon={Mail} accent="#F97316" isMock={isMockNl} />
                <div className="px-4 pt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total',        value: nl.total        ?? 0 },
                    { label: 'Active',       value: nl.active       ?? 0 },
                    { label: 'Unsubscribed', value: nl.unsubscribed ?? 0 },
                  ].map(kpi => (
                    <div key={kpi.label} className="py-3 rounded-xl text-center"
                      style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.14)' }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.muted }}>{kpi.label}</p>
                      <p className="text-[22px] font-black text-white mt-0.5">{fmt(kpi.value)}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-5">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={nlByMonth}>
                      <CartesianGrid {...GRID} />
                      <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
                      <YAxis tick={AXIS} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                      <Tooltip {...TT} />
                      <Line type="monotone" dataKey="count" stroke="#F97316" strokeWidth={2.5}
                        dot={{ fill: '#F97316', r: 3 }} activeDot={{ r: 5 }} name="Subscriptions" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Users */}
              <Card>
                <CardHeader title="Users" subtitle="Roles & monthly registrations" icon={Users} accent="#6366F1" isMock={isMockUsrType || isMockUsrMonth} />
                <div className="px-4 pt-4 grid grid-cols-4 gap-3">
                  {[
                    { label: 'Total',   value: usr.total    ?? 0 },
                    { label: 'Active',  value: usr.active   ?? 0 },
                    { label: 'Admins',  value: ovU.admins   ?? 0 },
                    { label: 'Editors', value: ovU.editors  ?? 0 },
                  ].map(kpi => (
                    <div key={kpi.label} className="py-3 rounded-xl text-center"
                      style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.14)' }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.muted }}>{kpi.label}</p>
                      <p className="text-[20px] font-black text-white mt-0.5">{fmt(kpi.value)}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 pt-4 grid grid-cols-2 gap-4 pb-2">
                  {/* Roles donut */}
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={usrByType} cx="50%" cy="50%" innerRadius={38} outerRadius={60}
                        dataKey="value" nameKey="name" labelLine={false} label={PieLabel}>
                        {usrByType.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                      </Pie>
                      <Tooltip {...TT} />
                      <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Registrations bar */}
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={usrByMonth.slice(-6)} barSize={14}>
                      <CartesianGrid {...GRID} />
                      <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 9 }} axisLine={false} tickLine={false} width={20} allowDecimals={false} />
                      <Tooltip {...TT} />
                      <Bar dataKey="count" name="Registrations" radius={[4, 4, 0, 0]}>
                        {usrByMonth.slice(-6).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Full registrations line chart */}
                <div className="px-4 pb-5">
                  <ResponsiveContainer width="100%" height={130}>
                    <LineChart data={usrByMonth}>
                      <CartesianGrid {...GRID} />
                      <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
                      <YAxis tick={AXIS} axisLine={false} tickLine={false} width={24} allowDecimals={false} />
                      <Tooltip {...TT} />
                      <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2.5}
                        dot={{ fill: '#6366F1', r: 3 }} activeDot={{ r: 5 }} name="Registrations" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </section>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
