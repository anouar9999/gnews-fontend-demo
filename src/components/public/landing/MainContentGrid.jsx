import { Link } from 'react-router-dom';
import { Gamepad2, Trophy, TrendingUp, Eye } from 'lucide-react';
import { Tag, Meta, SectionHeader } from './shared';
import { GAMING_ARTICLES, ESPORTS_ARTICLES, MOST_READ } from '../../../data/landingMockData';

function ArticleRow({ article }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="flex gap-3 group hover:bg-[#12121e] -mx-2 px-2 py-2 transition-colors rounded"
    >
      <div className="shrink-0 w-[120px] h-[75px] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="min-w-0">
        <Tag label={article.tag} color={article.tagColor} />
        <p className="text-[14px] font-semibold text-[#ccccdd] leading-snug mt-1 line-clamp-2 group-hover:text-white transition-colors">
          {article.title}
        </p>
        <Meta time={article.time} views={article.views} />
      </div>
    </Link>
  );
}

function MostRead() {
  return (
    <aside>
      <SectionHeader title="Les + Lus" icon={TrendingUp} href="/news" color="#e8001c" />
      <div className="flex flex-col divide-y divide-[#1a1a28]">
        {MOST_READ.map(a => (
          <Link
            key={a.id}
            to={`/articles/${a.id}`}
            className="flex items-start gap-3 py-3 hover:bg-[#12121e] group -mx-3 px-3 transition-colors"
          >
            <span
              className="text-[26px] font-black leading-none shrink-0 w-8 text-center"
              style={{ color: a.rank <= 3 ? '#e8001c' : '#2a2a38' }}
            >
              {a.rank}
            </span>
            <div>
              <p className="text-[13px] text-[#aaaabc] font-semibold leading-snug line-clamp-2 group-hover:text-white transition-colors">
                {a.title}
              </p>
              <span className="text-[10px] text-[#555566] flex items-center gap-1 mt-0.5">
                <Eye size={9} /> {a.views}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default function MainContentGrid() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_260px] gap-8 py-8 border-b border-[#1a1a28]">

      {/* Gaming column */}
      <div>
        <SectionHeader title="Jeux Vidéo" icon={Gamepad2} href="/gaming" color="#e8001c" />
        <div className="flex flex-col gap-1">
          {GAMING_ARTICLES.map(a => <ArticleRow key={a.id} article={a} />)}
        </div>
      </div>

      {/* Esports column */}
      <div>
        <SectionHeader title="Esports" icon={Trophy} href="/esports" color="#f59e0b" />
        <div className="flex flex-col gap-1">
          {ESPORTS_ARTICLES.map(a => (
            <Link
              key={a.id}
              to={`/articles/${a.id}`}
              className="flex gap-3 group hover:bg-[#12121e] -mx-2 px-2 py-2 transition-colors rounded"
            >
              <div className="shrink-0 w-[120px] h-[75px] overflow-hidden relative">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {a.live && (
                  <span className="absolute top-1 left-1 bg-orange text-white text-[9px] font-black px-1.5 py-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <Tag label={a.tag} color={a.tagColor} />
                <p className="text-[14px] font-semibold text-[#ccccdd] leading-snug mt-1 line-clamp-2 group-hover:text-white transition-colors">
                  {a.title}
                </p>
                <Meta time={a.time} views={a.views} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Most-read sidebar */}
      <div className="lg:border-l border-[#1a1a28] lg:pl-6">
        <MostRead />
      </div>
    </section>
  );
}
