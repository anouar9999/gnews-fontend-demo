import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Trophy, Calendar, DollarSign,
  ChevronRight, Eye, Radio, Swords,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toCard } from '../../utils/article';
import { useRefetchOnFocus } from '../../hooks/useRefetchOnFocus';

// ─── Static data ──────────────────────────────────────────────────────────────

const games = ['All', 'CS2', 'Valorant', 'LoL', 'Dota 2', 'Fortnite', 'Rocket League'];

const liveMatches = [
  { id: 2, t1: 'T1',          t2: 'Cloud9',     s1: 2,  s2: 1, game: 'Valorant', event: 'VCT Champions',     map: 'Bind',    time: 'OT',      viewers: '310K', logo1: 'T1', logo2: 'C9', leading: 1 },
  { id: 1, t1: 'Team Liquid', t2: 'NAVI',       s1: 16, s2: 9, game: 'CS2',      event: 'ESL Pro League S22',map: 'Inferno', time: '2nd Map', viewers: '184K', logo1: 'TL', logo2: 'NV', leading: 1 },
  { id: 3, t1: 'FaZe Clan',   t2: 'G2 Esports', s1: 3,  s2: 3, game: 'CS2',      event: 'BLAST Premier',     map: 'Mirage', time: 'Map 3',   viewers: '97K',  logo1: 'FZ', logo2: 'G2', leading: 0 },
];

const upcomingMatches = [
  { t1: 'ENCE',          t2: 'Astralis',    game: 'CS2',      event: 'ESL Pro League', date: 'Today',    time: '18:00' },
  { t1: 'Sentinels',     t2: 'NRG',         game: 'Valorant', event: 'VCT Americas',   date: 'Today',    time: '21:00' },
  { t1: 'Fnatic',        t2: 'BIG',         game: 'CS2',      event: 'IEM Cologne',    date: 'Tomorrow', time: '14:00' },
  { t1: 'Team Vitality', t2: '100 Thieves', game: 'Valorant', event: 'VCT EMEA',       date: 'Tomorrow', time: '17:00' },
];

const tournaments = [
  {
    name: 'ESL Pro League S22', game: 'CS2',      prize: '$850,000',   status: 'LIVE',
    teams: 24, stage: 'Group Stage',
    image: 'https://picsum.photos/seed/esl22/800/400',
    top: [
      { pos: 1, team: 'Team Liquid', w: 5, l: 1 },
      { pos: 2, team: 'NAVI',        w: 4, l: 2 },
      { pos: 3, team: 'FaZe Clan',   w: 4, l: 2 },
      { pos: 4, team: 'G2 Esports',  w: 3, l: 3 },
    ],
  },
  {
    name: 'VCT Champions 2025', game: 'Valorant', prize: '$2,250,000', status: 'LIVE',
    teams: 16, stage: 'Semi-Finals',
    image: 'https://picsum.photos/seed/vct2025/800/400',
    top: [
      { pos: 1, team: 'T1',          w: 8, l: 0 },
      { pos: 2, team: 'Cloud9',      w: 6, l: 2 },
      { pos: 3, team: 'Sentinels',   w: 5, l: 3 },
      { pos: 4, team: 'NRG',         w: 4, l: 4 },
    ],
  },
  {
    name: 'IEM Cologne 2025',   game: 'CS2',      prize: '$1,000,000', status: 'UPCOMING',
    teams: 16, stage: 'Starts in 3 days',
    image: 'https://picsum.photos/seed/iem2025/800/400',
    top: [],
  },
];

const bracket = [
  { roundKey: 'quarterFinals', matches: [
    { t1: 'Team Liquid', t2: 'NAVI',      s1: '2', s2: '1', done: true  },
    { t1: 'FaZe Clan',   t2: 'Astralis',  s1: '2', s2: '0', done: true  },
  ]},
  { roundKey: 'semiFinals', matches: [
    { t1: 'Team Liquid', t2: 'FaZe Clan', s1: '-', s2: '-', done: false },
  ]},
  { roundKey: 'grandFinal', matches: [
    { t1: 'TBD',         t2: 'TBD',       s1: '-', s2: '-', done: false },
  ]},
];

// ─── Divider label ────────────────────────────────────────────────────────────

function Label({ icon: Icon, children, right }) {
  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon size={12} style={{ color: 'var(--color-orange)' }} />}
      <span className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {children}
      </span>
      {right && <span className="ml-auto">{right}</span>}
    </div>
  );
}

// ─── Featured match (hero) ────────────────────────────────────────────────────

function FeaturedMatch({ m }) {
  const tied = m.s1 === m.s2;
  return (
    <div
      className="gnewz-card relative overflow-hidden flex flex-col h-full"
      style={{
        backgroundImage: 'radial-gradient(rgba(255,107,0,0.05) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        minHeight: 280,
      }}
    >
      {/* Orange top scan line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--color-orange), rgba(254,107,0,0.2) 60%, transparent)', zIndex: 1 }} />

      {/* Top meta row */}
      <div className="flex items-center justify-between px-6 pt-5 pb-0 relative z-10">
        <div className="flex items-center gap-2">
          <span className="gnewz-tag">{m.game}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {m.event}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.22)' }}>{m.map} · {m.time}</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5" style={{ background: 'rgba(239,68,68,0.12)' }}>
            <span className="live-dot" style={{ width: 5, height: 5 }} />
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#f87171' }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Teams + score — main stage */}
      <div className="flex items-center justify-between flex-1 px-6 py-6 gap-4 relative z-10">

        {/* Team 1 */}
        <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
          <div
            className="w-20 h-20 flex items-center justify-center text-2xl font-black"
            style={{
              background: m.leading === 1 && !tied ? 'rgba(254,107,0,0.12)' : 'rgba(255,255,255,0.04)',
              color:      m.leading === 1 && !tied ? 'var(--color-orange)' : 'rgba(255,255,255,0.5)',
            }}
          >
            {m.logo1}
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-black leading-tight" style={{ letterSpacing: '-0.02em' }}>{m.t1}</p>
            {m.leading === 1 && !tied && (
              <p className="text-[9px] font-black uppercase tracking-widest mt-1" style={{ color: 'var(--color-orange)' }}>Leading</p>
            )}
          </div>
        </div>

        {/* Centre score */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="flex items-baseline gap-3">
            <span
              className="font-black leading-none"
              style={{
                fontSize: 64,
                letterSpacing: '-0.06em',
                color: m.leading === 1 && !tied ? '#fff' : 'rgba(255,255,255,0.3)',
              }}
            >{m.s1}</span>
            <span style={{ fontSize: 28, fontWeight: 900, color: 'rgba(254,107,0,0.4)', letterSpacing: '-0.04em' }}>:</span>
            <span
              className="font-black leading-none"
              style={{
                fontSize: 64,
                letterSpacing: '-0.06em',
                color: m.leading === 2 && !tied ? '#fff' : 'rgba(255,255,255,0.3)',
              }}
            >{m.s2}</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>SCORE</span>
        </div>

        {/* Team 2 */}
        <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
          <div
            className="w-20 h-20 flex items-center justify-center text-2xl font-black"
            style={{
              background: m.leading === 2 && !tied ? 'rgba(254,107,0,0.12)' : 'rgba(255,255,255,0.04)',
              color:      m.leading === 2 && !tied ? 'var(--color-orange)' : 'rgba(255,255,255,0.5)',
            }}
          >
            {m.logo2}
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-black leading-tight" style={{ letterSpacing: '-0.02em' }}>{m.t2}</p>
            {m.leading === 2 && !tied && (
              <p className="text-[9px] font-black uppercase tracking-widest mt-1" style={{ color: 'var(--color-orange)' }}>Leading</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-6 py-3 relative z-10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}
      >
        <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Eye size={12} />
          <span className="text-[11px] font-bold">{m.viewers} watching</span>
        </div>
        <button
          className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest"
          style={{ color: 'var(--color-orange)' }}
        >
          Watch Stream <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Compact live row (sidebar) ───────────────────────────────────────────────

function CompactLiveRow({ m, isLast }) {
  const tied = m.s1 === m.s2;
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Team 1 */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          className="w-8 h-8 shrink-0 flex items-center justify-center text-[10px] font-black"
          style={{
            background: m.leading === 1 && !tied ? 'rgba(254,107,0,0.12)' : 'rgba(255,255,255,0.05)',
            color:      m.leading === 1 && !tied ? 'var(--color-orange)' : 'rgba(255,255,255,0.45)',
          }}
        >
          {m.logo1}
        </div>
        <span className="text-[11px] font-black truncate" style={{ color: m.leading === 1 && !tied ? '#fff' : 'rgba(255,255,255,0.55)' }}>
          {m.t1}
        </span>
      </div>

      {/* Score */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-base font-black w-5 text-center" style={{ color: m.leading === 1 && !tied ? '#fff' : 'rgba(255,255,255,0.3)', letterSpacing: '-0.04em' }}>{m.s1}</span>
        <span className="text-xs font-black" style={{ color: 'rgba(254,107,0,0.4)' }}>:</span>
        <span className="text-base font-black w-5 text-center" style={{ color: m.leading === 2 && !tied ? '#fff' : 'rgba(255,255,255,0.3)', letterSpacing: '-0.04em' }}>{m.s2}</span>
      </div>

      {/* Team 2 */}
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className="text-[11px] font-black truncate" style={{ color: m.leading === 2 && !tied ? '#fff' : 'rgba(255,255,255,0.55)' }}>
          {m.t2}
        </span>
        <div
          className="w-8 h-8 shrink-0 flex items-center justify-center text-[10px] font-black"
          style={{
            background: m.leading === 2 && !tied ? 'rgba(254,107,0,0.12)' : 'rgba(255,255,255,0.05)',
            color:      m.leading === 2 && !tied ? 'var(--color-orange)' : 'rgba(255,255,255,0.45)',
          }}
        >
          {m.logo2}
        </div>
      </div>
    </div>
  );
}

// ─── Tournament column card ───────────────────────────────────────────────────

function TournamentCol({ tour, t }) {
  const isLive = tour.status === 'LIVE';
  return (
    <div className="gnewz-card overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative" style={{ height: 120 }}>
        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(26,26,26,1) 0%, rgba(26,26,26,0.5) 60%, transparent 100%)' }} />
        {isLive && <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: 'linear-gradient(90deg, var(--color-orange), transparent)' }} />}

        {/* Status badge overlaid */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {isLive ? (
            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-0.5" style={{ background: 'rgba(239,68,68,0.85)', color: '#fff' }}>
              <span className="live-dot" style={{ width: 4, height: 4, background: '#fff', boxShadow: 'none' }} />
              {t('esports.live')}
            </span>
          ) : (
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5" style={{ background: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.55)' }}>
              {t('esports.upcoming')}
            </span>
          )}
          <span className="gnewz-tag">{tour.game}</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 className="text-white text-[13px] font-black leading-tight mb-1" style={{ letterSpacing: '-0.02em' }}>{tour.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{tour.stage} · {tour.teams} {t('esports.teams')}</span>
          <div className="flex items-center gap-1" style={{ color: 'var(--color-orange)' }}>
            <DollarSign size={11} />
            <span className="text-[12px] font-black" style={{ letterSpacing: '-0.03em' }}>{tour.prize}</span>
          </div>
        </div>
      </div>

      {/* Standings */}
      {tour.top.length > 0 ? (
        <div className="flex-1">
          {tour.top.map((row, i) => (
            <div
              key={row.team}
              className="flex items-center gap-3 px-4 py-2"
              style={{ borderBottom: i < tour.top.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              <span className="text-[10px] font-black w-4 shrink-0" style={{ color: i === 0 ? 'var(--color-orange)' : 'rgba(255,255,255,0.2)' }}>
                {i === 0 ? '①' : row.pos}
              </span>
              <span className="text-[11px] font-bold flex-1 truncate" style={{ color: i === 0 ? '#fff' : 'rgba(255,255,255,0.6)' }}>{row.team}</span>
              <span className="text-[10px] font-black" style={{ color: '#4ade80' }}>{row.w}W</span>
              <span className="text-[10px] font-black" style={{ color: '#f87171' }}>{row.l}L</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center py-6">
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Draw on {tour.stage}</span>
        </div>
      )}
    </div>
  );
}

// ─── Horizontal bracket ───────────────────────────────────────────────────────

function HorizontalBracket({ bracket, t }) {
  return (
    <div>
      <div className="flex items-stretch gap-0">
        {bracket.map((round, ri) => (
          <div key={round.roundKey} className="flex items-center gap-0 flex-1">
            {/* Round column */}
            <div className="flex-1 flex flex-col gap-2">
              {/* Round label */}
              <div className="pb-2" style={{ borderBottom: '1px solid rgba(254,107,0,0.2)' }}>
                <span className="text-[9px] font-black uppercase tracking-[0.15em]" style={{ color: 'var(--color-orange)' }}>
                  {t(`esports.${round.roundKey}`)}
                </span>
              </div>

              {/* Matches */}
              <div className="flex flex-col gap-2" style={{ justifyContent: 'center', flex: 1 }}>
                {round.matches.map((m, mi) => {
                  const t1won = m.done && parseInt(m.s1) > parseInt(m.s2);
                  const t2won = m.done && parseInt(m.s2) > parseInt(m.s1);
                  return (
                    <div
                      key={mi}
                      style={{
                        background: m.done ? 'rgba(254,107,0,0.04)' : 'rgba(255,255,255,0.02)',
                        border: m.done ? '1px solid rgba(254,107,0,0.15)' : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {[
                        { name: m.t1, score: m.s1, won: t1won, lost: m.done && !t1won },
                        { name: m.t2, score: m.s2, won: t2won, lost: m.done && !t2won },
                      ].map((team, ti) => (
                        <div
                          key={ti}
                          className="flex items-center justify-between px-3 py-1.5"
                          style={{
                            borderBottom: ti === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                            opacity: team.lost ? 0.4 : 1,
                          }}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            {team.won && <div style={{ width: 3, height: 3, background: 'var(--color-orange)', flexShrink: 0 }} />}
                            <span className="text-[11px] font-bold truncate" style={{ color: team.won ? '#fff' : 'rgba(255,255,255,0.65)' }}>
                              {team.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-black ml-3 shrink-0" style={{ color: team.won ? 'var(--color-orange)' : 'rgba(255,255,255,0.2)' }}>
                            {team.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Connector arrow between rounds */}
            {ri < bracket.length - 1 && (
              <div className="flex items-center justify-center w-6 shrink-0">
                <ChevronRight size={12} style={{ color: 'rgba(254,107,0,0.3)' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Editorial news card (matches screenshot layout) ─────────────────────────

function EditorialCard({ article }) {
  const { title, category, tag, image, time, views, slug } = article;
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/articles/${slug}`}
      className="group flex flex-col overflow-hidden"
      style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: 10,
        transition: 'border-color .2s, transform .2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        borderColor: hovered ? 'var(--color-orange)' : '#2a2a2a',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="overflow-hidden" style={{ height: 200, flexShrink: 0 }}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          style={{ transition: 'transform .5s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Category tag */}
        <span
          className="text-[10px] font-black uppercase tracking-widest w-fit"
          style={{ color: 'var(--color-orange)' }}
        >
          {tag || category}
        </span>

        {/* Title — dominant */}
        <h3
          className="font-black leading-snug line-clamp-3 flex-1"
          style={{
            fontSize: 15,
            color: hovered ? 'var(--color-orange)' : '#fff',
            letterSpacing: '-0.02em',
            transition: 'color .15s',
          }}
        >
          {title}
        </h3>

        {/* Meta row — author avatar + time */}
        <div className="flex items-center gap-2.5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {/* Author avatar placeholder */}
          <div
            className="w-7 h-7 shrink-0 flex items-center justify-center text-[9px] font-black"
            style={{ background: 'rgba(254,107,0,0.15)', color: 'var(--color-orange)', borderRadius: '50%' }}
          >
            {(tag || category || 'E').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-white truncate">{tag || category}</div>
            <div className="flex items-center gap-2 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <Eye size={9} />
              <span>{views}</span>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
              <span>{time}</span>
            </div>
          </div>
          <ChevronRight
            size={14}
            style={{
              color: hovered ? 'var(--color-orange)' : 'rgba(255,255,255,0.2)',
              transition: 'color .15s, transform .15s',
              transform: hovered ? 'translateX(3px)' : 'none',
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </Link>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function EsportPage() {
  const { t } = useTranslation();
  const [activeGame, setActiveGame]   = useState('All');
  const [esportsNews, setEsportsNews] = useState([]);

  const fetchData = useCallback(() => {
    api.get('/articles/', {
      params: { status: 'publie', category__slug: 'esports', ordering: '-published_at' },
    })
      .then(({ data }) => setEsportsNews((data.results || []).slice(0, 6).map(toCard)))
      .catch(() => {});
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useRefetchOnFocus(fetchData);

  const featured   = liveMatches[0];
  const otherLive  = liveMatches.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* ══════════════════════════════════════════════════════════════════
          COMMAND BAR — title · live count · filter pills in one strip
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="flex items-center gap-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 20 }}
      >
        {/* Title block */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-[3px] h-9" style={{ background: 'var(--color-orange)', boxShadow: '0 0 10px var(--color-orange)' }} />
          <h1 className="text-[40px] font-black uppercase leading-none text-white" style={{ letterSpacing: '-0.04em' }}>
            {t('esports.title')}
          </h1>
        </div>

        {/* Live badge */}
        <span className="live-badge shrink-0">
          <span className="live-dot" />
          {t('esports.matchesLive', { count: 3 })}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Filter pills inline */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {games.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGame(g)}
              className="shrink-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all duration-100"
              style={{
                background: activeGame === g ? 'var(--color-orange)' : 'rgba(255,255,255,0.04)',
                color:      activeGame === g ? '#fff' : 'rgba(255,255,255,0.35)',
                boxShadow:  activeGame === g ? '0 0 14px rgba(254,107,0,0.4)' : 'none',
              }}
              onMouseEnter={e => { if (activeGame !== g) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (activeGame !== g) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; } }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          HERO SPLIT — featured match (left 60%) · live sidebar (right 40%)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" style={{ minHeight: 300 }}>

        {/* Featured match — 3/5 */}
        <div className="lg:col-span-3">
          <div className="mb-3">
            <Label icon={Radio}>Featured Match</Label>
          </div>
          <FeaturedMatch m={featured} />
        </div>

        {/* Live sidebar — 2/5 */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Other live matches */}
          <div className="gnewz-card">
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Label icon={Swords}>Also Live</Label>
              <div className="flex items-center gap-1.5 px-2 py-0.5" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <span className="live-dot" style={{ width: 4, height: 4 }} />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#f87171' }}>Live</span>
              </div>
            </div>
            <div className="px-4">
              {otherLive.map((m, i) => (
                <CompactLiveRow key={m.id} m={m} isLast={i === otherLive.length - 1} />
              ))}
            </div>
          </div>

          {/* Upcoming schedule */}
          <div className="gnewz-card flex-1">
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Label icon={Calendar}>{t('esports.upcomingTitle')}</Label>
            </div>
            <div className="px-4">
              {upcomingMatches.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2.5"
                  style={{ borderBottom: i < upcomingMatches.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  {/* Time column */}
                  <div className="shrink-0 w-16">
                    <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: m.date === 'Today' ? 'var(--color-orange)' : 'rgba(255,255,255,0.25)' }}>
                      {m.date}
                    </div>
                    <div className="text-[11px] font-black text-white">{m.time}</div>
                  </div>
                  {/* Match */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black text-white truncate" style={{ letterSpacing: '-0.01em' }}>
                      {m.t1} <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>vs</span> {m.t2}
                    </div>
                    <div className="text-[9px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.22)' }}>{m.event}</div>
                  </div>
                  {/* Game tag */}
                  <span className="gnewz-tag shrink-0">{m.game}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          TOURNAMENTS — equal 3-column horizontal grid
      ══════════════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center gap-3 mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
          <Trophy size={14} style={{ color: 'var(--color-orange)' }} />
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white">{t('esports.activeTournaments')}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tournaments.map((tour) => (
            <TournamentCol key={tour.name} tour={tour} t={t} />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          BRACKET — full-width horizontal
      ══════════════════════════════════════════════════════════════════ */}
      <div className="gnewz-card">
        <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Trophy size={12} style={{ color: 'var(--color-orange)' }} />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">{t('esports.bracketTitle')}</span>
        </div>
        <div className="p-5">
          <HorizontalBracket bracket={bracket} t={t} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LATEST NEWS — 3-column editorial card grid
      ══════════════════════════════════════════════════════════════════ */}
      {esportsNews.length > 0 && (
        <div>
          <div
            className="flex items-center gap-3 mb-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 14 }}
          >
            <Radio size={14} style={{ color: 'var(--color-orange)' }} />
            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white">
              {t('esports.latestNews')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {esportsNews.map((a) => (
              <EditorialCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
