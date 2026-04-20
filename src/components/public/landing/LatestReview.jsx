import { Link } from 'react-router-dom';
import { Award, ChevronRight, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { LATEST_REVIEW } from '../../../data/landingMockData';
import { Tag, Meta } from './shared';

function ScoreBadge({ score, color }) {
  return (
    <div className="flex flex-col items-center justify-center"
      style={{ width: 72, height: 72, background: color || '#e8001c' }}
    >
      <span className="text-white font-black text-[22px] leading-none">{score}</span>
    </div>
  );
}

function SmallReviewCard({ review }) {
  return (
    <Link to={`/articles/${review.id}`}
      className="flex gap-3 group p-3 hover:bg-white/[0.03] transition-colors"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="shrink-0 w-[112px] h-[72px] overflow-hidden relative"
        style={{ borderTop: `2px solid ${review.tagColor}` }}>
        <img src={review.image} alt={review.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="min-w-0 flex-1">
        <Tag label={review.tag} color={review.tagColor} />
        <p className="text-[12px] font-bold text-[#c8c8d8] leading-snug mt-0.5 line-clamp-1 group-hover:text-white transition-colors">
          {review.title}
        </p>
        <span className="text-[12px] font-black" style={{ color: '#e8001c' }}>{review.score}</span>
      </div>
    </Link>
  );
}

export default function LatestReview() {
  const r = LATEST_REVIEW;

  return (
    <section className="py-8 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-orange" />
            <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
          </div>
          <Award size={16} className="text-orange" strokeWidth={2.5} />
          <h2 className="text-[35px] font-black uppercase tracking-tight text-white leading-none">Dernier Test</h2>
        </div>
        <Link to="/tests"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          Tous les tests <ChevronRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-0">
        {/* Featured review */}
        <Link to={`/articles/${r.id}`}
          className="relative block overflow-hidden group"
          style={{ borderTop: `3px solid ${r.scoreColor}` }}
        >
          <img src={r.image} alt={r.title}
            className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            style={{ minHeight: 280 }}
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.45) 50%, transparent 100%)' }}
          />
          {/* Score */}
          <div className="absolute top-4 right-4">
            <ScoreBadge score={r.score} color={r.scoreColor} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <Tag label={r.tag} color={r.tagColor} />
            <h3 className="text-white font-black text-[20px] leading-tight mt-2 mb-2 line-clamp-2">{r.title}</h3>
            <p className="text-[#9999b0] text-[13px] line-clamp-2 mb-3">{r.excerpt}</p>
            {/* Pros/Cons */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                {r.pros.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#10b981] mb-0.5">
                    <ThumbsUp size={9} strokeWidth={2.5} /> {p}
                  </div>
                ))}
              </div>
              <div>
                {r.cons.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#ef4444] mb-0.5">
                    <ThumbsDown size={9} strokeWidth={2.5} /> {c}
                  </div>
                ))}
              </div>
            </div>
            <Meta time={r.time} views={r.views} />
          </div>
        </Link>

        {/* Supporting reviews */}
        <div className="flex flex-col" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="p-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#555566]">Tests récents</p>
          </div>
          {r.supportingReviews.map(sr => <SmallReviewCard key={sr.id} review={sr} />)}
          <Link to="/tests"
            className="flex items-center justify-center gap-2 p-4 text-[11px] font-black uppercase tracking-widest mt-auto transition-colors"
            style={{ color: '#e8001c', borderTop: '1px solid rgba(255,255,255,0.05)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Tous les tests <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
