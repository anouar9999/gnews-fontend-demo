import { Zap } from 'lucide-react';
import { TICKER_ITEMS } from '../../../data/landingMockData';

export default function BreakingTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bg-[#0a0a0a] border-b border-[#1a1a28] flex items-center overflow-hidden h-[34px]">
      {/* BREAKING badge */}
      <div className="shrink-0 bg-[#e8001c] h-full flex items-center px-4">
        <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
          <Zap size={10} fill="white" /> BREAKING
        </span>
      </div>

      {/* Scrolling text */}
      <div className="ticker-wrap flex-1 overflow-hidden h-full flex items-center">
        <div className="ticker-inner">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="text-[12px] text-[#ccccdd] whitespace-nowrap cursor-pointer hover:text-white transition-colors"
            >
              {item}
              <span className="mx-6 text-[#2a2a38]">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
