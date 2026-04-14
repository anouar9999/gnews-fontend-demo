import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Cpu, Monitor, HardDrive, Zap } from 'lucide-react';
import NewsCard from '../../components/public/NewsCard';
import api from '../../api/axios';
import { toCard } from '../../utils/article';

const FILTERS = ['All', 'GPUs', 'CPUs', 'Monitors', 'Memory', 'Storage', 'Peripherals', 'Cooling'];

const SPEC_COMPARISON = {
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

const SCORED_REVIEW = {
  product: 'NVIDIA GeForce RTX 5090',
  score: 9.2,
  pros: ['Unmatched rasterization performance', 'DLSS 4 is transformative', 'Future-proof 32GB GDDR7'],
  cons: ['$1,999 price tag is extreme', '600W TDP requires premium PSU', 'Overkill for 1080p/1440p'],
};

const CATEGORY_ICONS = [
  { icon: Cpu, label: 'CPUs' },
  { icon: Monitor, label: 'Monitors' },
  { icon: HardDrive, label: 'Storage' },
  { icon: Zap, label: 'GPUs' },
];

export default function HardwarePage() {
  const [active, setActive] = useState('All');
  const [hero, setHero] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/articles/', { params: { status: 'publie', category__slug: 'hardware', ordering: '-published_at' } })
      .then(({ data }) => {
        const all = (data.results || []).map(toCard);
        setHero(all[0] || null);
        setReviews(all.slice(1, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-orange rounded-full" />
        <h1 className="text-3xl font-900 text-white uppercase tracking-wide">Hardware</h1>
        <span className="gnewz-tag ml-2">Reviews & News</span>
      </div>

      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`shrink-0 px-4 py-1.5 rounded text-xs font-700 uppercase tracking-wider transition-colors ${
              active === f ? 'bg-orange text-white' : 'bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#2a2a2a]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {hero && (
            <div className="mb-8">
              <NewsCard article={hero} size="hero" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="gnewz-card p-6 flex flex-col gap-4">
              <p className="text-orange text-xs font-700 uppercase tracking-widest">Editor's Score</p>
              <div>
                <p className="text-white font-900 text-xl leading-tight mb-1">{SCORED_REVIEW.product}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-5xl font-900 text-orange">{SCORED_REVIEW.score}</span>
                  <span className="text-gray-500 text-2xl font-700">/10</span>
                </div>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i < Math.floor(SCORED_REVIEW.score) ? 'bg-orange' : 'bg-[#2a2a2a]'}`} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white text-xs font-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-400" /> Pros
                </p>
                <ul className="space-y-1">
                  {SCORED_REVIEW.pros.map((p) => (
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
                  {SCORED_REVIEW.cons.map((c) => (
                    <li key={c} className="text-gray-300 text-xs flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">−</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="mt-auto bg-orange hover:bg-orange-dim text-white text-xs font-700 uppercase py-2.5 rounded transition-colors tracking-wider">
                Read Full Review
              </button>
            </div>

            <div className="lg:col-span-2 gnewz-card overflow-hidden">
              <div className="px-5 py-4 border-b border-[#2a2a2a]">
                <p className="text-orange text-xs font-700 uppercase tracking-widest">{SPEC_COMPARISON.subtitle}</p>
                <h3 className="text-white font-800 text-lg">{SPEC_COMPARISON.title}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2a2a2a]">
                      {SPEC_COMPARISON.headers.map((h, i) => (
                        <th key={h} className={`px-4 py-3 text-left text-xs font-700 uppercase tracking-wide ${
                          i === 0 ? 'text-gray-500' : i === SPEC_COMPARISON.winner + 1 ? 'text-orange' : 'text-gray-300'
                        }`}>
                          {h} {i === SPEC_COMPARISON.winner + 1 && <span className="text-[10px]">★ BEST</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SPEC_COMPARISON.rows.map((row, ri) => (
                      <tr key={ri} className="border-b border-[#1A1A1A] hover:bg-[#111] transition-colors">
                        {row.map((cell, ci) => (
                          <td key={ci} className={`px-4 py-3 text-sm ${
                            ci === 0 ? 'text-gray-500 font-600' : ci === SPEC_COMPARISON.winner + 1 ? 'text-white font-700' : 'text-gray-400'
                          }`}>
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

          {reviews.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-orange rounded-full" />
                <h2 className="text-xl font-900 text-white uppercase tracking-wide">Latest Reviews</h2>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-orange fill-orange" />)}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {reviews.map((a) => <NewsCard key={a.slug} article={a} size="lg" showExcerpt />)}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORY_ICONS.map(({ icon: Icon, label }) => (
              <button key={label} className="gnewz-card flex flex-col items-center gap-3 p-6 group">
                <div className="w-12 h-12 rounded-xl bg-orange/10 group-hover:bg-orange flex items-center justify-center transition-colors">
                  <Icon size={22} className="text-orange group-hover:text-white transition-colors" />
                </div>
                <p className="text-white font-800 text-sm">{label}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
