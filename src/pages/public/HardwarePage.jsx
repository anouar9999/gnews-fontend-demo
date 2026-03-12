import { useState } from 'react';
import { Star, CheckCircle, XCircle, Cpu, Monitor, HardDrive, Zap } from 'lucide-react';
import NewsCard from '../../components/public/NewsCard';

const filters = ['All', 'GPUs', 'CPUs', 'Monitors', 'Memory', 'Storage', 'Peripherals', 'Cooling'];

const heroReview = {
  slug: 'rtx-5090-review',
  title: 'RTX 5090 Review: NVIDIA\'s Most Powerful GPU Ever Tested — Is It Worth $1,999?',
  excerpt: 'We put the RTX 5090 through 3 weeks of intensive testing across 40 games and professional workflows. The results are staggering.',
  category: 'Hardware',
  tag: '★ REVIEW',
  image: 'https://picsum.photos/seed/rtx5090main/1200/600',
  time: '2h ago',
  views: '156K',
};

const specComparison = {
  title: 'GPU Comparison 2025',
  subtitle: 'RTX 5090 vs RX 9900 XTX vs RTX 4090',
  headers: ['Spec', 'RTX 5090', 'RX 9900 XTX', 'RTX 4090'],
  rows: [
    ['Architecture', 'Blackwell', 'RDNA 5', 'Ada Lovelace'],
    ['VRAM', '32 GB GDDR7', '24 GB GDDR7', '24 GB GDDR6X'],
    ['TDP', '600W', '350W', '450W'],
    ['4K FPS (avg)', '180 fps', '155 fps', '120 fps'],
    ['DLSS / FSR', 'DLSS 4', 'FSR 4', 'DLSS 3'],
    ['MSRP', '$1,999', '$899', '$999'],
  ],
  winner: 0,
};

const latestReviews = [
  { slug: 'ryzen9-9950x3d', title: 'AMD Ryzen 9 9950X3D Review: 3D V-Cache Crushes Gaming Benchmarks', category: 'Hardware', tag: 'CPU', image: 'https://picsum.photos/seed/r9950/800/450', time: '1d ago', views: '45K', excerpt: 'AMD doubles down on 3D V-Cache with remarkable results in both gaming and creative workflows.' },
  { slug: 'asus-rog-swift', title: 'ASUS ROG Swift OLED 4K 240Hz Review: The Perfect Gaming Monitor?', category: 'Hardware', tag: 'Monitor', image: 'https://picsum.photos/seed/rogswift/800/450', time: '2d ago', views: '31K', excerpt: 'Stunning OLED panel meets buttery-smooth 240Hz refresh for an unmatched gaming experience.' },
  { slug: 'samsung-990-pro', title: 'Samsung 990 Pro 4TB Review: Fastest PCIe 5.0 SSD We\'ve Tested', category: 'Hardware', tag: 'Storage', image: 'https://picsum.photos/seed/990pro/800/450', time: '3d ago', views: '22K', excerpt: 'Blazing sequential reads up to 14,500 MB/s — this SSD redefines what storage performance means.' },
  { slug: 'ddr6-preview', title: 'DDR6 Memory Preview: We Got Early Samples and Ran the Numbers', category: 'Hardware', tag: 'Memory', image: 'https://picsum.photos/seed/ddr6prev/800/450', time: '4d ago', views: '38K', excerpt: '2x the bandwidth of DDR5, latency concerns, and a 2026 release window — here\'s everything we know.' },
];

const scoredReview = {
  product: 'NVIDIA GeForce RTX 5090',
  score: 9.2,
  pros: ['Unmatched rasterization performance', 'DLSS 4 is transformative', 'Future-proof 32GB GDDR7'],
  cons: ['$1,999 price tag is extreme', '600W TDP requires premium PSU', 'Overkill for 1080p/1440p'],
};

const categories = [
  { icon: Cpu, label: 'CPUs', count: 24 },
  { icon: Monitor, label: 'Monitors', count: 18 },
  { icon: HardDrive, label: 'Storage', count: 15 },
  { icon: Zap, label: 'GPUs', count: 31 },
];

export default function HardwarePage() {
  const [active, setActive] = useState('All');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-[#FF6B00] rounded-full" />
        <h1 className="text-3xl font-900 text-white uppercase tracking-wide">Hardware</h1>
        <span className="gnewz-tag ml-2">Reviews & News</span>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`shrink-0 px-4 py-1.5 rounded text-xs font-700 uppercase tracking-wider transition-colors ${
              active === f ? 'bg-[#FF6B00] text-white' : 'bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#2a2a2a]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Hero review */}
      <div className="mb-8">
        <NewsCard article={heroReview} size="hero" />
      </div>

      {/* Quick score card + featured review */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Score card */}
        <div className="gnewz-card p-6 flex flex-col gap-4">
          <p className="text-[#FF6B00] text-xs font-700 uppercase tracking-widest">Editor's Score</p>
          <div>
            <p className="text-white font-900 text-xl leading-tight mb-1">{scoredReview.product}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-5xl font-900 text-[#FF6B00]">{scoredReview.score}</span>
              <span className="text-gray-500 text-2xl font-700">/10</span>
            </div>
            <div className="flex gap-0.5 mt-1">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i < Math.floor(scoredReview.score) ? 'bg-[#FF6B00]' : 'bg-[#2a2a2a]'}`} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-white text-xs font-700 uppercase tracking-wide mb-2 flex items-center gap-1">
              <CheckCircle size={12} className="text-green-400" /> Pros
            </p>
            <ul className="space-y-1">
              {scoredReview.pros.map((p) => (
                <li key={p} className="text-gray-300 text-xs flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">+</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-xs font-700 uppercase tracking-wide mb-2 flex items-center gap-1">
              <XCircle size={12} className="text-red-400" /> Cons
            </p>
            <ul className="space-y-1">
              {scoredReview.cons.map((c) => (
                <li key={c} className="text-gray-300 text-xs flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">−</span> {c}
                </li>
              ))}
            </ul>
          </div>
          <button className="mt-auto bg-[#FF6B00] hover:bg-[#cc5500] text-white text-xs font-700 uppercase py-2.5 rounded transition-colors tracking-wider">
            Read Full Review
          </button>
        </div>

        {/* Spec comparison table */}
        <div className="lg:col-span-2 gnewz-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#2a2a2a]">
            <p className="text-[#FF6B00] text-xs font-700 uppercase tracking-widest">{specComparison.subtitle}</p>
            <h3 className="text-white font-800 text-lg">{specComparison.title}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  {specComparison.headers.map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-left text-xs font-700 uppercase tracking-wide ${
                        i === 0 ? 'text-gray-500' : i === specComparison.winner + 1 ? 'text-[#FF6B00]' : 'text-gray-300'
                      }`}
                    >
                      {h} {i === specComparison.winner + 1 && <span className="text-[10px]">★ BEST</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specComparison.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-[#1A1A1A] hover:bg-[#111] transition-colors">
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-4 py-3 text-sm ${
                          ci === 0
                            ? 'text-gray-500 font-600'
                            : ci === specComparison.winner + 1
                            ? 'text-white font-700'
                            : 'text-gray-400'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Latest reviews grid */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-[#FF6B00] rounded-full" />
          <h2 className="text-xl font-900 text-white uppercase tracking-wide">Latest Reviews</h2>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-[#FF6B00] fill-[#FF6B00]" />)}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestReviews.map((a) => (
            <NewsCard key={a.slug} article={a} size="lg" showExcerpt />
          ))}
        </div>
      </div>

      {/* Category explorer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map(({ icon: Icon, label, count }) => (
          <button key={label} className="gnewz-card flex flex-col items-center gap-3 p-6 group">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 group-hover:bg-[#FF6B00] flex items-center justify-center transition-colors">
              <Icon size={22} className="text-[#FF6B00] group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-white font-800 text-sm">{label}</p>
              <p className="text-gray-500 text-xs">{count} reviews</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
