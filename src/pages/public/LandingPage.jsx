import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Zap, Monitor, Trophy } from 'lucide-react';
import NewsCard from '../../components/public/NewsCard';

const heroArticle = {
  slug: 'gta-vi-pc-date',
  title: 'GTA VI PC Release Date Officially Confirmed — Everything You Need to Know',
  excerpt: 'Rockstar Games finally breaks the silence with a full reveal of GTA VI coming to PC, along with system requirements and exclusive content.',
  category: 'Gaming',
  tag: 'EXCLUSIVE',
  image: 'https://picsum.photos/seed/gtavi/1200/600',
  time: '2h ago',
  views: '142K',
};

const featuredArticles = [
  {
    slug: 'rtx-5090-review',
    title: 'RTX 5090 Review: The Monster GPU That Redefines 4K Gaming',
    excerpt: 'NVIDIA\'s flagship pushes every boundary. We tested it for 3 weeks.',
    category: 'Hardware',
    tag: 'REVIEW',
    image: 'https://picsum.photos/seed/rtx5090/800/450',
    time: '4h ago',
    views: '98K',
  },
  {
    slug: 'esl-pro-league-s22',
    title: 'ESL Pro League S22 — Team Liquid Dominates Opening Week',
    excerpt: 'The CS2 season opens with jaw-dropping performances and major upsets.',
    category: 'Esports',
    tag: 'LIVE',
    image: 'https://picsum.photos/seed/esports22/800/450',
    time: '1h ago',
    views: '67K',
  },
  {
    slug: 'ai-npcs-gaming',
    title: 'How AI-Driven NPCs Are About to Change Everything in Open-World Games',
    excerpt: 'From Starfield to Skyrim — the next generation of AI companions is here.',
    category: 'Culture',
    tag: 'DEEP DIVE',
    image: 'https://picsum.photos/seed/ainpc/800/450',
    time: '6h ago',
    views: '51K',
  },
];

const latestGaming = [
  { slug: 'diablo-5-leak', title: 'Diablo V Leaks: New Classes, World Map, and Release Window Revealed', category: 'Gaming', tag: 'Gaming', image: 'https://picsum.photos/seed/d5/400/300', time: '30m ago', views: '22K' },
  { slug: 'ps6-specs', title: 'PS6 Dev Kit Specs Surface Online — 4nm Chip and 32GB VRAM', category: 'Gaming', tag: 'Gaming', image: 'https://picsum.photos/seed/ps6/400/300', time: '1h ago', views: '88K' },
  { slug: 'valorant-ep9', title: 'Valorant Episode 9: New Agent Abilities and Map Changes Detailed', category: 'Gaming', tag: 'Gaming', image: 'https://picsum.photos/seed/val9/400/300', time: '3h ago', views: '44K' },
  { slug: 'xbox-handheld', title: 'Xbox Handheld: Microsoft Confirms Portable Console Is in Development', category: 'Gaming', tag: 'Gaming', image: 'https://picsum.photos/seed/xboxhand/400/300', time: '5h ago', views: '110K' },
];

const hardwareSpotlight = [
  { slug: 'ryzen-9950x3d', title: 'AMD Ryzen 9 9950X3D: The CPU King Returns with 3D V-Cache', category: 'Hardware', tag: 'Hardware', image: 'https://picsum.photos/seed/9950x3d/400/300', time: '8h ago', views: '35K' },
  { slug: 'ddr6-ram', title: 'DDR6 RAM: Everything We Know About Next-Gen Memory Standards', category: 'Hardware', tag: 'Hardware', image: 'https://picsum.photos/seed/ddr6/400/300', time: '1d ago', views: '28K' },
  { slug: 'monitor-4k240', title: 'Best 4K 240Hz Monitors of 2025: The Definitive Buyer\'s Guide', category: 'Hardware', tag: 'Hardware', image: 'https://picsum.photos/seed/monitor4k/400/300', time: '2d ago', views: '19K' },
];

const categories = [
  { label: 'Gaming News', icon: Zap, to: '/gaming', color: '#FF6B00', desc: 'Latest game releases & updates' },
  { label: 'Hardware', icon: Monitor, to: '/hardware', color: '#FF6B00', desc: 'Reviews, specs & benchmarks' },
  { label: 'Esports', icon: Trophy, to: '/esports', color: '#FF6B00', desc: 'Live scores & tournaments' },
  { label: 'Trending', icon: TrendingUp, to: '/culture', color: '#FF6B00', desc: 'What the community is talking about' },
];

export default function LandingPage() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">

      {/* ─── Hero + Featured Grid ─────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        {/* Main hero */}
        <div className="lg:col-span-2">
          <NewsCard article={heroArticle} size="hero" />
        </div>
        {/* Side featured */}
        <div className="flex flex-col gap-4">
          {featuredArticles.slice(0, 2).map((a) => (
            <NewsCard key={a.slug} article={a} size="lg" />
          ))}
        </div>
      </section>

      {/* ─── Category Quick Links ─────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {categories.map(({ label, icon: Icon, to, desc }) => (
          <Link
            key={label}
            to={to}
            className="gnewz-card flex flex-col gap-2 p-4 group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center group-hover:bg-[#FF6B00] transition-colors">
              <Icon size={20} className="text-[#FF6B00] group-hover:text-white transition-colors" />
            </div>
            <p className="font-800 text-sm text-white">{label}</p>
            <p className="text-gray-500 text-xs">{desc}</p>
          </Link>
        ))}
      </section>

      {/* ─── Latest Gaming News ───────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#FF6B00] rounded-full" />
            <h2 className="text-xl font-900 text-white uppercase tracking-wide">Latest Gaming</h2>
          </div>
          <Link to="/gaming" className="flex items-center gap-1 text-[#FF6B00] text-sm font-700 hover:gap-2 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestGaming.map((a) => (
            <NewsCard key={a.slug} article={a} size="lg" />
          ))}
        </div>
      </section>

      {/* ─── Featured Story Banner ────────────────────── */}
      <section className="mb-10">
        <Link
          to="/article/ai-future-gaming"
          className="group relative block rounded-[10px] overflow-hidden border border-[#2a2a2a] hover:border-[#FF6B00] transition-colors"
          style={{ height: 'clamp(160px, 28vw, 260px)' }}
        >
          <img
            src="https://picsum.photos/seed/futuregaming/1400/400"
            alt="Featured"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 flex items-center px-4 sm:px-8">
            <div>
              <span className="gnewz-tag mb-2 sm:mb-3 inline-block">FEATURED</span>
              <h2 className="text-lg sm:text-2xl md:text-4xl font-900 text-white max-w-lg leading-tight group-hover:text-[#FF6B00] transition-colors line-clamp-2">
                The Future of Gaming: AI, Cloud & Beyond
              </h2>
              <p className="hidden sm:block text-gray-300 text-sm mt-2 max-w-md line-clamp-2">
                A deep look at the technologies reshaping how we play, create, and experience games in 2025 and beyond.
              </p>
              <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 bg-[#FF6B00] text-white text-xs font-700 uppercase px-3 sm:px-4 py-1.5 sm:py-2 rounded group-hover:bg-white group-hover:text-black transition-colors">
                Read More <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ─── Hardware Spotlight ───────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#FF6B00] rounded-full" />
            <h2 className="text-xl font-900 text-white uppercase tracking-wide">Hardware Spotlight</h2>
          </div>
          <Link to="/hardware" className="flex items-center gap-1 text-[#FF6B00] text-sm font-700 hover:gap-2 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hardwareSpotlight.map((a) => (
            <NewsCard key={a.slug} article={a} size="lg" showExcerpt />
          ))}
        </div>
      </section>

      {/* ─── Esports Live Strip ───────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#FF6B00] rounded-full" />
            <h2 className="text-xl font-900 text-white uppercase tracking-wide">Esports Live</h2>
            <span className="live-badge"><span className="live-dot" />Live</span>
          </div>
          <Link to="/esports" className="flex items-center gap-1 text-[#FF6B00] text-sm font-700 hover:gap-2 transition-all">
            Full Dashboard <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { t1: 'Team Liquid', t2: 'NAVI', s1: 16, s2: 9, game: 'CS2', round: 'Grand Final', map: 'Inferno' },
            { t1: 'T1', t2: 'Cloud9', s1: 2, s2: 1, game: 'Valorant', round: 'Semi-Final', map: 'Bind' },
            { t1: 'FaZe Clan', t2: 'G2 Esports', s1: 3, s2: 3, game: 'CS2', round: 'Quarter-Final', map: 'Mirage' },
          ].map((m, i) => (
            <div key={i} className="gnewz-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="gnewz-tag">{m.game}</span>
                <span className="text-gray-500 text-xs">{m.round} · {m.map}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#2a2a2a] mx-auto mb-1 flex items-center justify-center text-lg font-900 text-[#FF6B00]">
                    {m.t1[0]}
                  </div>
                  <p className="text-white text-xs font-700 truncate">{m.t1}</p>
                </div>
                <div className="px-4 text-center">
                  <span className="text-2xl font-900 text-white">{m.s1}</span>
                  <span className="text-[#FF6B00] font-900 mx-1">:</span>
                  <span className="text-2xl font-900 text-white">{m.s2}</span>
                  <p className="text-[10px] text-[#FF6B00] font-700 uppercase tracking-wider mt-0.5">Live</p>
                </div>
                <div className="text-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#2a2a2a] mx-auto mb-1 flex items-center justify-center text-lg font-900 text-[#FF6B00]">
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
