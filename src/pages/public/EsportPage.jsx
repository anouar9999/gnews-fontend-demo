import { useState } from 'react';
import { Trophy, Swords, Calendar, DollarSign, ChevronRight, Users } from 'lucide-react';

const games = ['All', 'CS2', 'Valorant', 'LoL', 'Dota 2', 'Fortnite', 'Rocket League'];

const liveMatches = [
  { id: 1, t1: 'Team Liquid', t2: 'NAVI', s1: 16, s2: 9, game: 'CS2', event: 'ESL Pro League S22', map: 'Inferno', time: '2nd Map', viewers: '184K', logo1: 'TL', logo2: 'NV' },
  { id: 2, t1: 'T1', t2: 'Cloud9', s1: 2, s2: 1, game: 'Valorant', event: 'VCT Champions', map: 'Bind', time: 'OT', viewers: '310K', logo1: 'T1', logo2: 'C9' },
  { id: 3, t1: 'FaZe Clan', t2: 'G2 Esports', s1: 3, s2: 3, game: 'CS2', event: 'BLAST Premier', map: 'Mirage', time: 'Map 3', viewers: '97K', logo1: 'FZ', logo2: 'G2' },
];

const upcomingMatches = [
  { t1: 'ENCE', t2: 'Astralis', game: 'CS2', event: 'ESL Pro League', date: 'Today', time: '18:00 GMT' },
  { t1: 'Sentinels', t2: 'NRG', game: 'Valorant', event: 'VCT Americas', date: 'Today', time: '21:00 GMT' },
  { t1: 'Fnatic', t2: 'BIG', game: 'CS2', event: 'IEM Cologne', date: 'Tomorrow', time: '14:00 GMT' },
  { t1: 'Team Vitality', t2: '100 Thieves', game: 'Valorant', event: 'VCT EMEA', date: 'Tomorrow', time: '17:00 GMT' },
];

const tournaments = [
  {
    name: 'ESL Pro League Season 22',
    game: 'CS2',
    prize: '$850,000',
    status: 'LIVE',
    teams: 24,
    stage: 'Group Stage',
    image: 'https://picsum.photos/seed/esl22/600/300',
    top: [
      { pos: 1, team: 'Team Liquid', w: 5, l: 1 },
      { pos: 2, team: 'NAVI', w: 4, l: 2 },
      { pos: 3, team: 'FaZe Clan', w: 4, l: 2 },
      { pos: 4, team: 'G2 Esports', w: 3, l: 3 },
    ],
  },
  {
    name: 'VCT Champions 2025',
    game: 'Valorant',
    prize: '$2,250,000',
    status: 'LIVE',
    teams: 16,
    stage: 'Semi-Finals',
    image: 'https://picsum.photos/seed/vct2025/600/300',
    top: [
      { pos: 1, team: 'T1', w: 8, l: 0 },
      { pos: 2, team: 'Cloud9', w: 6, l: 2 },
      { pos: 3, team: 'Sentinels', w: 5, l: 3 },
      { pos: 4, team: 'NRG', w: 4, l: 4 },
    ],
  },
  {
    name: 'IEM Cologne 2025',
    game: 'CS2',
    prize: '$1,000,000',
    status: 'UPCOMING',
    teams: 16,
    stage: 'Starts in 3 days',
    image: 'https://picsum.photos/seed/iem2025/600/300',
    top: [],
  },
];

const bracket = [
  { round: 'Quarter-Finals', matches: [
    { t1: 'Team Liquid', t2: 'NAVI', s1: '2', s2: '1', done: true },
    { t1: 'FaZe Clan', t2: 'Astralis', s1: '2', s2: '0', done: true },
  ]},
  { round: 'Semi-Finals', matches: [
    { t1: 'Team Liquid', t2: 'FaZe Clan', s1: '-', s2: '-', done: false },
  ]},
  { round: 'Grand Final', matches: [
    { t1: 'TBD', t2: 'TBD', s1: '-', s2: '-', done: false },
  ]},
];

export default function EsportPage() {
  const [activeGame, setActiveGame] = useState('All');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-[#FF6B00] rounded-full" />
        <h1 className="text-3xl font-900 text-white uppercase tracking-wide">Esports</h1>
        <span className="live-badge"><span className="live-dot" /> 3 Matches Live</span>
      </div>

      {/* Game filter */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {games.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGame(g)}
            className={`shrink-0 px-4 py-1.5 rounded text-xs font-700 uppercase tracking-wider transition-colors ${
              activeGame === g ? 'bg-[#FF6B00] text-white' : 'bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#2a2a2a]'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Live matches */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <Swords size={18} className="text-[#FF6B00]" />
          <h2 className="text-xl font-900 text-white uppercase tracking-wide">Live Now</h2>
          <span className="live-badge"><span className="live-dot" /> Live</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {liveMatches.map((m) => (
            <div key={m.id} className="gnewz-card p-5 border-[#FF6B00]/30 hover:border-[#FF6B00]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="gnewz-tag">{m.game}</span>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wide">{m.event}</p>
                  <p className="text-gray-600 text-[10px]">{m.map} · {m.time}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-center w-1/3">
                  <div className="w-14 h-14 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 mx-auto mb-2 flex items-center justify-center text-xl font-900 text-[#FF6B00]">
                    {m.logo1}
                  </div>
                  <p className="text-white text-xs font-700 truncate">{m.t1}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <span className="text-3xl font-900 text-white">{m.s1}</span>
                    <span className="text-[#FF6B00] font-900 text-xl">:</span>
                    <span className="text-3xl font-900 text-white">{m.s2}</span>
                  </div>
                  <span className="text-[10px] text-[#FF6B00] font-700 uppercase tracking-wider">Live</span>
                </div>
                <div className="text-center w-1/3">
                  <div className="w-14 h-14 rounded-full bg-[#2a2a2a] border border-[#2a2a2a] mx-auto mb-2 flex items-center justify-center text-xl font-900 text-gray-300">
                    {m.logo2}
                  </div>
                  <p className="text-white text-xs font-700 truncate">{m.t2}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2a2a2a] flex items-center justify-between">
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Users size={11} /> {m.viewers} watching
                </div>
                <button className="text-[#FF6B00] text-xs font-700 uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                  Watch <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tournaments + Bracket */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Tournaments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 mb-5">
            <Trophy size={18} className="text-[#FF6B00]" />
            <h2 className="text-xl font-900 text-white uppercase tracking-wide">Active Tournaments</h2>
          </div>
          {tournaments.map((t) => (
            <div key={t.name} className="gnewz-card overflow-hidden">
              <div className="relative" style={{ height: 100 }}>
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 flex items-center px-5 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-700 uppercase tracking-widest px-2 py-0.5 rounded ${t.status === 'LIVE' ? 'bg-[#FF6B00] text-white' : 'bg-[#2a2a2a] text-gray-300'}`}>
                        {t.status}
                      </span>
                      <span className="gnewz-tag">{t.game}</span>
                    </div>
                    <h3 className="text-white font-800 text-base">{t.name}</h3>
                    <p className="text-gray-400 text-xs">{t.stage} · {t.teams} Teams</p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="flex items-center gap-1 text-[#FF6B00]">
                      <DollarSign size={14} />
                      <span className="font-900 text-lg">{t.prize}</span>
                    </div>
                    <p className="text-gray-500 text-xs">Prize Pool</p>
                  </div>
                </div>
              </div>
              {t.top.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        <th className="px-4 py-2 text-left text-gray-600 font-600">#</th>
                        <th className="px-4 py-2 text-left text-gray-600 font-600">Team</th>
                        <th className="px-4 py-2 text-center text-gray-600 font-600">W</th>
                        <th className="px-4 py-2 text-center text-gray-600 font-600">L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.top.map((row) => (
                        <tr key={row.team} className="border-b border-[#1A1A1A] hover:bg-[#111] transition-colors">
                          <td className="px-4 py-2 text-[#FF6B00] font-800">{row.pos}</td>
                          <td className="px-4 py-2 text-white font-600">{row.team}</td>
                          <td className="px-4 py-2 text-center text-green-400 font-700">{row.w}</td>
                          <td className="px-4 py-2 text-center text-red-400 font-700">{row.l}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar: Bracket + Upcoming */}
        <aside className="space-y-5">
          {/* Bracket */}
          <div className="gnewz-card p-4">
            <h3 className="font-800 text-sm uppercase tracking-wider text-white mb-4">ESL S22 Bracket</h3>
            <div className="space-y-5">
              {bracket.map((round) => (
                <div key={round.round}>
                  <p className="text-[#FF6B00] text-[10px] font-700 uppercase tracking-widest mb-2">{round.round}</p>
                  <div className="space-y-2">
                    {round.matches.map((m, i) => (
                      <div key={i} className="bg-[#111] rounded-lg overflow-hidden border border-[#2a2a2a]">
                        <div className={`flex items-center justify-between px-3 py-1.5 border-b border-[#2a2a2a] ${m.done ? '' : 'opacity-50'}`}>
                          <span className="text-white text-xs font-600">{m.t1}</span>
                          <span className={`text-sm font-900 ${m.done ? 'text-[#FF6B00]' : 'text-gray-600'}`}>{m.s1}</span>
                        </div>
                        <div className={`flex items-center justify-between px-3 py-1.5 ${m.done ? '' : 'opacity-50'}`}>
                          <span className="text-white text-xs font-600">{m.t2}</span>
                          <span className={`text-sm font-900 ${m.done ? 'text-gray-400' : 'text-gray-600'}`}>{m.s2}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming matches */}
          <div className="gnewz-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} className="text-[#FF6B00]" />
              <h3 className="font-800 text-sm uppercase tracking-wider text-white">Upcoming</h3>
            </div>
            <div className="space-y-3">
              {upcomingMatches.map((m, i) => (
                <div key={i} className="pb-3 border-b border-[#1A1A1A] last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="gnewz-tag">{m.game}</span>
                    <span className="text-gray-600 text-[10px]">{m.date} · {m.time}</span>
                  </div>
                  <p className="text-white text-xs font-700">
                    {m.t1} <span className="text-gray-500 font-400">vs</span> {m.t2}
                  </p>
                  <p className="text-gray-600 text-[10px] mt-0.5">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
