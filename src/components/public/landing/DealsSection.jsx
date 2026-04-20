import { Link } from 'react-router-dom';
import { Tag as TagIcon, ChevronRight, ExternalLink, Zap } from 'lucide-react';
import { DEALS } from '../../../data/landingMockData';
import { Tag } from './shared';

function DiscountBadge({ discount }) {
  return (
    <span className="text-[13px] font-black text-white px-2 py-0.5"
      style={{ background: '#e8001c' }}>
      {discount}
    </span>
  );
}

function DealRow({ deal }) {
  return (
    <Link to={`/deals/${deal.id}`}
      className="flex gap-3 group p-3 hover:bg-white/[0.03] transition-colors duration-150"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="shrink-0 w-[100px] h-[68px] overflow-hidden bg-[#111]">
        <img src={deal.image} alt={deal.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Tag label={deal.tag} color={deal.tagColor} />
            <p className="text-[12px] font-bold text-[#c8c8d8] leading-snug mt-0.5 line-clamp-1 group-hover:text-white transition-colors">
              {deal.title}
            </p>
          </div>
          <DiscountBadge discount={deal.discount} />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[14px] font-black text-white">{deal.price}</span>
          <span className="text-[11px] text-[#555566] line-through">{deal.originalPrice}</span>
          <span className="text-[10px] text-[#666677] ml-auto">{deal.store}</span>
        </div>
      </div>
    </Link>
  );
}

export default function DealsSection() {
  const [featured, ...rest] = DEALS;

  return (
    <section className="py-12 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[22px] rounded-full bg-orange" />
            <div className="w-[2px] h-[14px] rounded-full bg-orange opacity-40" />
          </div>
          {/* <Zap size={16} className="text-orange" strokeWidth={2.5} /> */}
          <h2 className="text-[35px] font-black uppercase tracking-tighter text-white leading-none">
            Bons Plans High-Tech
          </h2>
        </div>
        <Link to="/deals"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
        >
          Voir tout <ChevronRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_540px] gap-2">
        {/* Featured deal */}
        <Link to={`/deals/${featured.id}`}
          className="relative block overflow-hidden group"
          // style={{ borderTop: '3px solid #e8001c' }}
        >
          <img src={featured.image} alt={featured.title}
            className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            style={{ minHeight: 280, aspectRatio: '16/9' }}
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.5) 50%, transparent 100%)' }}
          />
          {/* Discount badge */}
          <div className="absolute top-4 left-4">
            <span className="text-[28px] font-black text-white px-4 py-2 block"
              style={{ background: '#e8001c' }}>
              {featured.discount}
            </span>
          </div>
          {/* Tag */}
          <div className="absolute top-4 right-4">
            <Tag label={featured.tag} color={featured.tagColor} />
          </div>
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-white font-black text-[20px] leading-tight mb-2 line-clamp-2">
              {featured.title}
            </h3>
            <p className="text-[#9999b0] text-[13px] line-clamp-2 mb-3">{featured.excerpt}</p>
            <div className="flex items-center gap-3">
              <span className="text-[24px] font-black text-white">{featured.price}</span>
              <span className="text-[14px] text-[#666677] line-through">{featured.originalPrice}</span>
              <span className="text-[11px] text-[#888899] ml-1">{featured.store}</span>
              {/* <span
                className="ml-auto flex items-center gap-1.5 px-4 py-2 font-black text-[12px] uppercase tracking-wider text-white"
                style={{
                  background: 'linear-gradient(135deg, #FF6B00 0%, #e05500 100%)',
                  boxShadow: '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
                  transform: 'translateY(-3px)',
                  transition: 'transform 0.08s ease, box-shadow 0.08s ease',
                  borderRadius: 2,
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 0 #a33a00, 0 12px 24px rgba(255,107,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseDown={e  => { e.currentTarget.style.boxShadow = '0 2px 0 #a33a00, 0 4px 8px rgba(255,107,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0px)'; }}
                onMouseUp={e    => { e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              >
                Voir l'offre <ExternalLink size={12} />
              </span> */}
            </div>
          </div>
        </Link>

        {/* Smaller deals */}
        <div className="flex flex-col" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          {rest.map(d => <DealRow key={d.id} deal={d} />)}
          <div className="p-3 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Link to="/deals"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-[11px] font-black uppercase tracking-widest text-white"
              style={{
                background: 'linear-gradient(135deg, #FF6B00 0%, #e05500 100%)',
                boxShadow: '0 5px 0 #a33a00, 0 7px 14px rgba(255,107,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18)',
                transform: 'translateY(-3px)',
                transition: 'transform 0.08s ease, box-shadow 0.08s ease',
                borderRadius: 2,
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 7px 0 #a33a00, 0 10px 20px rgba(255,107,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 5px 0 #a33a00, 0 7px 14px rgba(255,107,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseDown={e  => { e.currentTarget.style.boxShadow = '0 2px 0 #a33a00, 0 3px 8px rgba(255,107,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0px)'; }}
              onMouseUp={e    => { e.currentTarget.style.boxShadow = '0 5px 0 #a33a00, 0 7px 14px rgba(255,107,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            >
              Tous les bons plans <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
