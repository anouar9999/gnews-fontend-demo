import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

const COLS = [
  { title: 'Jeux Vidéo', links: ['Tests', 'Previews', 'News', 'Dossiers', 'Sorties', 'Agenda'] },
  { title: 'Esports',    links: ['League of Legends', 'CS2', 'Valorant', 'Fortnite', 'FIFA', 'Résultats'] },
  { title: 'Hardware',   links: ['PC Gaming', 'Consoles', 'Périphériques', 'Smartphones', 'Comparatifs', 'Bons plans'] },
  { title: 'Communauté', links: ['Forums', 'Wiki', 'Vidéos', 'Newsletter', 'Application', 'Boutique'] },
];

const SOCIALS = [
  { label: 'Facebook',    initial: 'f', color: '#1877f2' },
  { label: 'Twitter / X', initial: 'X', color: '#1da1f2' },
  { label: 'YouTube',     initial: '▶', color: '#ff0000' },
  { label: 'Instagram',   initial: '◎', color: '#e1306c' },
  { label: 'Twitch',      initial: '▸', color: '#9146ff' },
  { label: 'TikTok',      initial: '♪', color: '#69c9d0' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#080810] border-t border-[#1a1a28] pt-10 pb-6 mt-6">
      <div className="max-w-[1280px] mx-auto px-4">

        {/* Logo + social row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-8 border-b border-[#1a1a28]">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange flex items-center justify-center rounded-sm">
              <Gamepad2 size={20} className="text-white" />
            </div>
            <span className="text-white font-black text-[18px] tracking-tight">
              jeux<span className="text-orange">video</span>.com
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href="#"
                title={s.label}
                className="w-8 h-8 flex items-center justify-center rounded-sm text-[11px] font-black text-white border border-[#2a2a38] hover:border-transparent transition-all"
                style={{ background: `${s.color}22` }}
              >
                {s.initial}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {COLS.map(col => (
            <div key={col.title}>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-orange mb-3">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-[13px] text-[#666677] hover:text-white transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1a1a28] pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[12px] text-[#444455]">
            © {year} jeuxvideo.com — Tous droits réservés. Un site du groupe Webedia.
          </p>
          <div className="flex items-center gap-4 text-[12px] text-[#444455]">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">CGU</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
