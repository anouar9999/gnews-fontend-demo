import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Globe, Users, Award } from 'lucide-react';
import api from '../../api/axios';

const ICON_MAP = { Speed: Zap, Coverage: Globe, Community: Users, Integrity: Award };

const DEFAULTS = {
  stats: [
    { label: 'Monthly Readers',   value: '2.4M+' },
    { label: 'Articles Published', value: '12,000+' },
    { label: 'Countries Reached', value: '80+' },
    { label: 'Years Online',       value: '6+' },
  ],
  story: [
    'GNEWZ was founded with a single obsession: deliver gaming news faster, more accurately, and more passionately than anyone else. What started as a small blog run by a group of competitive gamers has grown into one of the most-read gaming media outlets in the world.',
    'We cover everything — from AAA game releases and indie gems to GPU benchmarks, esports tournaments, and the culture that surrounds it all. Our editorial team plays the games they write about, tests the hardware they review, and watches every match they report on.',
    'We are independent. We are unsponsored. We are GNEWZ.',
  ],
  values: [
    { title: 'Speed',     desc: 'We publish breaking news within minutes of it happening. Speed is our edge.' },
    { title: 'Coverage',  desc: 'Gaming, esports, hardware, and culture — if it matters to gamers, we cover it.' },
    { title: 'Community', desc: 'We exist for our readers. Every story, every review, every opinion is for you.' },
    { title: 'Integrity', desc: 'No paid reviews. No hidden agendas. We call it as we see it, every time.' },
  ],
};

export default function AboutPage() {
  const { t } = useTranslation();
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    api.get('/pages/about/').then(r => setContent(r.data.content)).catch(() => {});
  }, []);

  const { stats, story, values } = content;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <div className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B00]/10 to-transparent pointer-events-none" />
        <p className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest mb-4">{t('about.label')}</p>
        <h1 className="text-4xl sm:text-6xl font-black leading-tight mb-6 max-w-3xl mx-auto">
          {t('about.heroTitle')}
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          {t('about.heroDesc')}
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl p-6 text-center">
              <p className="text-3xl font-black text-[#FF6B00] mb-1">{s.value}</p>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="max-w-2xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-black mb-6">{t('about.ourStory')}</h2>
        <div className="space-y-4 text-gray-300 leading-relaxed">
          {story.map((para, i) => <p key={i}>{para}</p>)}
        </div>
      </div>

      {/* Values */}
      <div className="max-w-4xl mx-auto px-6 mb-24">
        <h2 className="text-2xl font-black mb-8 text-center">{t('about.whatWeStandFor')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map(({ title, desc }) => {
            const Icon = ICON_MAP[title] ?? Zap;
            return (
              <div key={title} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl p-6 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#FF6B00]" />
                </div>
                <div>
                  <p className="text-white font-bold mb-1">{title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
