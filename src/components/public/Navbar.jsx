import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Menu, X } from 'lucide-react';
import GnewzLogo from './GnewzLogo';
import LanguageSwitch from '../LanguageSwitch';

export default function Navbar({ basePath = '' }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: t('nav.home'),     to: basePath === '' ? '/' : basePath },
    { label: t('nav.gaming'),   to: `${basePath}/gaming` },
    { label: t('nav.hardware'), to: `${basePath}/hardware` },
    { label: t('nav.culture'),  to: `${basePath}/culture` },
    { label: t('nav.esports'),  to: `${basePath}/esports` },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`${basePath}/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <GnewzLogo size={100} variant="dark" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, to }) => {
            const isHome = to === '/' || to === basePath;
            const active = isHome ? pathname === to : pathname === to || pathname.startsWith(to + '/');
            return (
              <Link
                key={to}
                to={to}
                className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded transition-colors ${
                  active
                    ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]'
                    : 'text-white hover:text-[#FF6B00]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
            {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 bg-[#1A1A1A] border border-[#333] focus:border-[#FF6B00] text-white text-sm rounded-lg pl-8 pr-3 py-1.5 outline-none transition-colors"
                  placeholder={t('nav.search')}
                />
              </div>
              <button type="submit" className="px-3 py-1.5 bg-[#FF6B00] hover:bg-[#cc5500] text-white text-xs font-bold rounded-lg transition-colors">
                Go
              </button>
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-gray-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-white hover:text-[#FF6B00] transition-colors p-1"
            >
              <Search size={18} />
            </button>
          )}

          {/* Language switch */}
          <LanguageSwitch />

          {/* Live Now CTA */}
          <Link
            to="/esports"
            className="hidden md:flex items-center gap-2 bg-[#FF6B00] hover:bg-[#cc5500] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {t('nav.liveNow')}
          </Link>

          {/* Mobile burger */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111] border-t border-[#1A1A1A] px-4 py-4 flex flex-col gap-1">
          {navLinks.map(({ label, to }) => {
            const isHome = to === '/' || to === basePath;
            const active = isHome ? pathname === to : pathname === to || pathname.startsWith(to + '/');
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`py-3 px-3 text-sm font-bold uppercase tracking-wider border-b border-[#1A1A1A] ${
                  active ? 'text-[#FF6B00]' : 'text-white'
                }`}
              >
                {label}
              </Link>
            );
          })}

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="flex gap-2 mt-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.search')}
              className="flex-1 bg-[#1A1A1A] border border-[#333] text-white text-sm px-3 py-2 rounded outline-none"
            />
            <button type="submit" className="bg-[#FF6B00] text-white px-3 py-2 rounded">
              <Search size={16} />
            </button>
          </form>

          {/* Mobile lang switch */}
          <div className="flex items-center gap-2 mt-2">
            <LanguageSwitch />
          </div>

          <Link
            to="/esports"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 bg-[#FF6B00] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {t('nav.liveNow')}
          </Link>
        </div>
      )}
    </header>
  );
}
