import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { TRENDING_NOW } from "../../../data/landingMockData";

const CARD_W = 300;
const GAP = 12;
const SCROLL_BY = (CARD_W + GAP) * 2;

function RankBadge({ rank }) {
  const colors = [
    "#e8001c",
    "#e8001c",
    "#f97316",
    "#f97316",
    "#555566",
    "#555566",
    "#555566",
  ];
  return (
    <span
      className="text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-sm shrink-0"
      style={{ background: colors[rank - 1] || "#333", color: "#fff" }}
    >
      {String(rank).padStart(2, "0")}
    </span>
  );
}

export default function TrendingNow() {
  const scrollRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }

  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -SCROLL_BY, behavior: "smooth" });
  }

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: SCROLL_BY, behavior: "smooth" });
  }

  return (
    <section className="py-12 border-b border-[#1a1a28]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex gap-[3px] items-center">
            <div className="w-[4px] h-[32px] rounded-full bg-orange" />
            <div className="w-[2px] h-[16px] rounded-full bg-orange opacity-60" />
          </div>
          <h2 className="text-[35px] font-black uppercase tracking-tight text-white leading-none">
            En ce moment
          </h2>
        </div>

      </div>

      {/* Carousel wrapper — relative so arrows can sit on the edges */}
      <div className="relative">

        {/* LEFT arrow */}
        <button
          onClick={scrollLeft}
          disabled={atStart}
          className="absolute left-0 top-1/2 rounded -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 flex items-center justify-center mx-2 disabled:opacity-0 disabled:pointer-events-none transition-all duration-150"
          style={{
            background: "linear-gradient(135deg, #FF6B00 0%, #e05500 100%)",
            boxShadow: "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)",
            transform: "translateY(-50%) translateX(-50%) translateY(-3px)",
            color: "#fff",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = "0 8px 0 #a33a00, 0 12px 24px rgba(255,107,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18)";
            e.currentTarget.style.transform = "translateY(-50%) translateX(-50%) translateY(-5px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)";
            e.currentTarget.style.transform = "translateY(-50%) translateX(-50%) translateY(-3px)";
          }}
          onMouseDown={e => {
            e.currentTarget.style.boxShadow = "0 2px 0 #a33a00, 0 4px 8px rgba(255,107,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)";
            e.currentTarget.style.transform = "translateY(-50%) translateX(-50%) translateY(0px)";
          }}
          onMouseUp={e => {
            e.currentTarget.style.boxShadow = "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)";
            e.currentTarget.style.transform = "translateY(-50%) translateX(-50%) translateY(-3px)";
          }}
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>

        {/* RIGHT arrow */}
        <button
          onClick={scrollRight}
          disabled={atEnd}
          className="absolute right-0 top-1/2 rounded -translate-y-1/2 mx-2 translate-x-1/2 z-10 w-10 h-10 flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none transition-all duration-150"
          style={{
            background: "linear-gradient(135deg, #FF6B00 0%, #e05500 100%)",
            boxShadow: "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)",
            transform: "translateY(-50%) translateX(50%) translateY(-3px)",
            color: "#fff",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = "0 8px 0 #a33a00, 0 12px 24px rgba(255,107,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18)";
            e.currentTarget.style.transform = "translateY(-50%) translateX(50%) translateY(-5px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)";
            e.currentTarget.style.transform = "translateY(-50%) translateX(50%) translateY(-3px)";
          }}
          onMouseDown={e => {
            e.currentTarget.style.boxShadow = "0 2px 0 #a33a00, 0 4px 8px rgba(255,107,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)";
            e.currentTarget.style.transform = "translateY(-50%) translateX(50%) translateY(0px)";
          }}
          onMouseUp={e => {
            e.currentTarget.style.boxShadow = "0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)";
            e.currentTarget.style.transform = "translateY(-50%) translateX(50%) translateY(-3px)";
          }}
        >
          <ChevronRight size={20} strokeWidth={3} />
        </button>

        {/* Scroll track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto pb-2"
          style={{
            scrollSnapType: "x mandatory",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
        <style>{`.trending-scroll::-webkit-scrollbar { display: none; }`}</style>
        {TRENDING_NOW.map((article) => (
          <Link
            key={article.id}
            to={`/articles/${article.id}`}
            className="trending-scroll group rounded relative shrink-0 overflow-hidden block"
            style={{
              width: CARD_W,
              height: 210,
              scrollSnapAlign: "start",
            }}
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(5,5,15,0.95) 0%, rgba(5,5,15,0.4) 55%, transparent 100%)",
              }}
            />
            {/* <div className="absolute top-3 left-3">
              <RankBadge rank={article.rank} />
            </div> */}
            <span
              className="absolute rounded top-3 right-3 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5"
              style={{ background: article.tagColor, color: "#fff" }}
            >
              {article.tag}
            </span>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-[16px] font-bold text-white leading-snug line-clamp-2 mb-1.5">
                {article.title}
              </p>
              <div className="flex items-center gap-2.5 text-[10px] text-[#666677]">
                <span className="flex items-center gap-1">
                  <Clock size={9} />
                  {article.time}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={9} />
                  {article.views}
                </span>
              </div>
            </div>
          </Link>
        ))}
        </div>{/* end scroll track */}
      </div>{/* end relative wrapper */}

      {/* Scroll indicator dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {TRENDING_NOW.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: i === 0 ? "#FF6B00" : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
