import { useState } from 'react';
import { TrendingUp, Filter } from 'lucide-react';
import NewsCard from '../../components/public/NewsCard';

const filters = ['All', 'PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile', 'VR'];

const heroArticle = {
  slug: 'ps6-full-reveal',
  title: 'PlayStation 6 Full Reveal: 4nm Chip, 32GB RAM, and a $599 Price Tag',
  excerpt: 'Sony\'s next-gen console promises 8K gaming at 120fps and a completely redesigned controller with haptic overhaul.',
  category: 'Gaming',
  tag: 'BREAKING',
  image: 'https://picsum.photos/seed/ps6reveal/1200/600',
  time: '45m ago',
  views: '201K',
};

const articles = [
  { slug: 'gta6-pc', title: 'GTA VI PC: Rockstar Confirms Ray Tracing & DLSS 4 Support at Launch', category: 'Gaming', tag: 'PC', image: 'https://picsum.photos/seed/gta6pc/800/450', time: '1h ago', views: '88K', excerpt: 'The PC version of GTA VI will arrive six months after console, packed with next-gen graphical features.' },
  { slug: 'zelda-tears-dlc', title: 'Zelda: Tears of the Kingdom DLC Roadmap Leaked via Nintendo eShop', category: 'Gaming', tag: 'Nintendo', image: 'https://picsum.photos/seed/zelda2025/800/450', time: '2h ago', views: '55K', excerpt: 'Three DLC packs teased, including a brand new overworld and 20+ hours of story content.' },
  { slug: 'elden-ring-dlc2', title: 'Elden Ring Shadow of the Erdtree 2 Is Real — FromSoftware Hints', category: 'Gaming', tag: 'PC', image: 'https://picsum.photos/seed/eldenring2/800/450', time: '3h ago', views: '74K', excerpt: 'Subtle social media clues and a mysterious domain registration point to a second major expansion.' },
  { slug: 'halo-reboot', title: 'Halo Reboot in Development Under New Studio — Insiders Confirm', category: 'Gaming', tag: 'Xbox', image: 'https://picsum.photos/seed/haloreboot/800/450', time: '5h ago', views: '62K', excerpt: 'Microsoft is reportedly building a ground-up Halo reboot with a focus on returning to Combat Evolved roots.' },
  { slug: 'cod-2026', title: 'Call of Duty 2026: WW2 Setting Confirmed, Massive Campaign Teased', category: 'Gaming', tag: 'Multi', image: 'https://picsum.photos/seed/cod2026/800/450', time: '7h ago', views: '91K', excerpt: 'Activision\'s next CoD entry returns to World War II with a new engine and fully destructible environments.' },
  { slug: 'minecraft-2', title: 'Minecraft 2 Officially Announced — New Engine, New World, Same Heart', category: 'Gaming', tag: 'Multi', image: 'https://picsum.photos/seed/mc2/800/450', time: '9h ago', views: '310K', excerpt: 'Microsoft shocks the world announcing a full sequel to the best-selling game of all time.' },
];

const trending = [
  { slug: 'baldurs-gate-4', title: 'Baldur\'s Gate 4 Reportedly in Early Dev at Larian', tag: 'RPG', time: '12h ago', views: '45K', image: 'https://picsum.photos/seed/bg4/100/80', category: 'Gaming' },
  { slug: 'steam-deck-2', title: 'Steam Deck 2 Specs Allegedly Leaked Online', tag: 'PC', time: '14h ago', views: '38K', image: 'https://picsum.photos/seed/steamdeck2/100/80', category: 'Gaming' },
  { slug: 'fortnite-chapter6', title: 'Fortnite Chapter 6 Season 2 Drops New Biomes and Weapons', tag: 'Battle Royale', time: '1d ago', views: '120K', image: 'https://picsum.photos/seed/fn62/100/80', category: 'Gaming' },
  { slug: 'avatar-frontiers', title: 'Avatar: Frontiers Gets Massive Free Update with New Region', tag: 'Open World', time: '1d ago', views: '17K', image: 'https://picsum.photos/seed/avatar2025/100/80', category: 'Gaming' },
];

export default function GamingPage() {
  const [active, setActive] = useState('All');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-[#FF6B00] rounded-full" />
        <h1 className="text-3xl font-900 text-white uppercase tracking-wide">Gaming News</h1>
        <span className="gnewz-tag ml-2">Today</span>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <Filter size={14} className="text-gray-500 shrink-0" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`shrink-0 px-4 py-1.5 rounded text-xs font-700 uppercase tracking-wider transition-colors ${
              active === f
                ? 'bg-[#FF6B00] text-white'
                : 'bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#2a2a2a]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero article */}
          <NewsCard article={heroArticle} size="hero" />

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articles.map((a) => (
              <NewsCard key={a.slug} article={a} size="lg" showExcerpt />
            ))}
          </div>

          {/* Load more */}
          <div className="text-center pt-4">
            <button className="bg-[#1A1A1A] hover:bg-[#FF6B00] border border-[#2a2a2a] hover:border-[#FF6B00] text-white text-sm font-700 uppercase px-8 py-3 rounded transition-colors tracking-wider">
              Load More Stories
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Trending */}
          <div className="gnewz-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-[#FF6B00]" />
              <h3 className="font-800 text-sm uppercase tracking-wider text-white">Trending Now</h3>
            </div>
            <div className="space-y-3">
              {trending.map((a, i) => (
                <div key={a.slug} className="flex items-start gap-3">
                  <span className="text-2xl font-900 text-[#FF6B00]/30 leading-none w-6 shrink-0">{i + 1}</span>
                  <NewsCard article={a} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="gnewz-card p-5 text-center">
            <p className="text-[#FF6B00] text-xs font-700 uppercase tracking-widest mb-2">Never Miss a Story</p>
            <h3 className="text-white font-800 text-lg mb-3">Get Gaming News Daily</h3>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-[#111] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#FF6B00] mb-3 transition-colors"
            />
            <button className="w-full bg-[#FF6B00] hover:bg-[#cc5500] text-white text-xs font-700 uppercase py-2.5 rounded transition-colors tracking-wider">
              Subscribe Free
            </button>
          </div>

          {/* Tags cloud */}
          <div className="gnewz-card p-4">
            <h3 className="font-800 text-sm uppercase tracking-wider text-white mb-3">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['RPG', 'FPS', 'Battle Royale', 'Open World', 'Indie', 'Racing', 'Strategy', 'Horror', 'Sports', 'Simulation'].map((tag) => (
                <button key={tag} className="text-xs font-600 text-gray-400 hover:text-[#FF6B00] bg-[#111] hover:bg-[#FF6B00]/10 border border-[#2a2a2a] hover:border-[#FF6B00] px-3 py-1 rounded transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
