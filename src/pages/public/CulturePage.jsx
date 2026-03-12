import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, User } from 'lucide-react';
import NewsCard from '../../components/public/NewsCard';

const editorial = {
  slug: 'gaming-mental-health-2025',
  title: 'Gaming and Mental Health in 2025: How the Industry Is Finally Taking Notice',
  excerpt: 'From burnout to belonging — the gaming world is having a long-overdue conversation about mental wellness, creator culture, and the human cost of hypercompetitive gaming.',
  category: 'Culture',
  tag: 'EDITORIAL',
  image: 'https://picsum.photos/seed/culturehero/1200/600',
  time: '3h ago',
  views: '78K',
};

const magazineFeatures = [
  {
    slug: 'women-esports',
    title: 'Breaking In: How Women Are Redefining Esports From the Inside',
    excerpt: 'A new wave of athletes, coaches, and executives is dismantling decades of barriers in competitive gaming.',
    category: 'Culture',
    tag: 'FEATURE',
    image: 'https://picsum.photos/seed/womenesports/800/500',
    author: 'Amara Chen',
    readTime: '12 min read',
    time: '1d ago',
    views: '41K',
  },
  {
    slug: 'retro-gaming-revival',
    title: 'The Retro Revival: Why Gen Z Is Obsessed with 16-Bit Classics',
    excerpt: 'Nostalgia isn\'t just for boomers. A generation raised on smartphones is discovering the joy of pixel art and chiptunes.',
    category: 'Culture',
    tag: 'TREND',
    image: 'https://picsum.photos/seed/retrogaming/800/500',
    author: 'Marcus Webb',
    readTime: '8 min read',
    time: '2d ago',
    views: '29K',
  },
  {
    slug: 'game-soundtrack-era',
    title: 'The Golden Age of Game Soundtracks: When Music Became the Game',
    excerpt: 'From Nier: Automata to Hades II, composers are creating works that stand shoulder to shoulder with classical masterpieces.',
    category: 'Culture',
    tag: 'MUSIC',
    image: 'https://picsum.photos/seed/gamesoundtrack/800/500',
    author: 'Sofia Reyes',
    readTime: '10 min read',
    time: '3d ago',
    views: '33K',
  },
];

const longReads = [
  { slug: 'streamers-burnout', title: 'The Burnout Epidemic: Life Inside the 8-Hour Streaming Grind', author: 'Jake Frost', readTime: '18 min', tag: 'Long Read', image: 'https://picsum.photos/seed/streamburn/400/300', time: '5d ago', views: '52K', category: 'Culture' },
  { slug: 'indie-dev-survival', title: 'Indie Dev Survival Guide: Making Games When the Market Is Saturated', author: 'Nadia Park', readTime: '14 min', tag: 'Guide', image: 'https://picsum.photos/seed/indiedev/400/300', time: '6d ago', views: '28K', category: 'Culture' },
  { slug: 'gaming-history-arcade', title: 'Lost Arcades: Preserving Gaming\'s Most Important Cultural Spaces', author: 'Chris Yamamoto', readTime: '22 min', tag: 'History', image: 'https://picsum.photos/seed/arcade/400/300', time: '1w ago', views: '19K', category: 'Culture' },
  { slug: 'ai-game-writing', title: 'Can AI Write Better Game Stories Than Humans? We Put It to the Test', author: 'Emma Liu', readTime: '16 min', tag: 'AI', image: 'https://picsum.photos/seed/aigaming/400/300', time: '1w ago', views: '44K', category: 'Culture' },
];

const voices = [
  { name: 'Amara Chen', role: 'Senior Editor', img: 'https://picsum.photos/seed/amara/80/80', articles: 142 },
  { name: 'Marcus Webb', role: 'Culture Writer', img: 'https://picsum.photos/seed/marcus/80/80', articles: 98 },
  { name: 'Sofia Reyes', role: 'Music & Games', img: 'https://picsum.photos/seed/sofia/80/80', articles: 87 },
  { name: 'Jake Frost', role: 'Esports & Culture', img: 'https://picsum.photos/seed/jake/80/80', articles: 201 },
];

export default function CulturePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-[#FF6B00] rounded-full" />
        <h1 className="text-3xl font-900 text-white uppercase tracking-wide">Culture</h1>
        <span className="gnewz-tag ml-2">Editorial & Features</span>
      </div>

      {/* Editorial hero */}
      <div className="mb-10">
        <NewsCard article={editorial} size="hero" />
      </div>

      {/* Magazine feature grid */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <BookOpen size={18} className="text-[#FF6B00]" />
          <h2 className="text-xl font-900 text-white uppercase tracking-wide">Featured Stories</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {magazineFeatures.map((a) => (
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
                <h3 className="font-800 text-base text-white leading-snug mb-2 group-hover:text-[#FF6B00] transition-colors">
                  {a.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{a.excerpt}</p>
                <div className="flex items-center justify-between border-t border-[#2a2a2a] pt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                      <User size={12} className="text-[#FF6B00]" />
                    </div>
                    <span className="text-xs text-gray-400 font-600">{a.author}</span>
                  </div>
                  <span className="text-[11px] text-gray-500">{a.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Long reads + Voices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Long reads */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-[#FF6B00] rounded-full" />
            <h2 className="text-xl font-900 text-white uppercase tracking-wide">Long Reads</h2>
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
                    <span className="text-gray-500 text-[11px]">{a.readTime} read</span>
                  </div>
                  <h4 className="font-800 text-sm text-white leading-snug group-hover:text-[#FF6B00] transition-colors line-clamp-2 mb-2">
                    {a.title}
                  </h4>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <User size={10} />
                    <span>{a.author}</span>
                    <span>·</span>
                    <span>{a.time}</span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-600 group-hover:text-[#FF6B00] transition-colors shrink-0 self-center" />
              </Link>
            ))}
          </div>
        </div>

        {/* Voices */}
        <aside>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-[#FF6B00] rounded-full" />
            <h2 className="text-xl font-900 text-white uppercase tracking-wide">Our Voices</h2>
          </div>
          <div className="gnewz-card p-4 space-y-4">
            {voices.map((v) => (
              <div key={v.name} className="flex items-center gap-3 pb-4 border-b border-[#2a2a2a] last:border-0 last:pb-0 hover:opacity-80 cursor-pointer transition-opacity">
                <img src={v.img} alt={v.name} className="w-11 h-11 rounded-full object-cover border-2 border-[#FF6B00]" />
                <div className="flex-1">
                  <p className="text-white font-700 text-sm">{v.name}</p>
                  <p className="text-gray-500 text-xs">{v.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#FF6B00] font-800 text-sm">{v.articles}</p>
                  <p className="text-gray-600 text-[10px]">articles</p>
                </div>
              </div>
            ))}
          </div>

          {/* Opinion piece CTA */}
          <div className="gnewz-card p-5 mt-4 text-center border border-[#FF6B00]/30">
            <p className="text-[#FF6B00] text-xs font-700 uppercase tracking-widest mb-2">Write for Us</p>
            <h3 className="text-white font-800 text-base mb-2">Share Your Voice</h3>
            <p className="text-gray-400 text-xs mb-4">Got a hot take? We want to hear it. Submit your gaming opinion piece to GNEWZ Culture.</p>
            <button className="w-full bg-transparent border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white text-xs font-700 uppercase py-2.5 rounded transition-colors tracking-wider">
              Submit Article
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
