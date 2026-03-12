import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Menu, X, Bell, LayoutDashboard } from 'lucide-react';
import GnewzLogo from './GnewzLogo';
import LanguageSwitch from '../LanguageSwitch';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: t('nav.home'),     to: '/' },
    { label: t('nav.gaming'),   to: '/gaming' },
    { label: t('nav.hardware'), to: '/hardware' },
    { label: t('nav.culture'),  to: '/culture' },
    { label: t('nav.esports'),  to: '/esports' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <GnewzLogo size={48} variant="dark" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, to }) => {
            const active = pathname === to || (to !== '/' && pathname.startsWith(to));
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
          <form onSubmit={handleSearch} className="relative flex items-center">
            {searchOpen && (
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="absolute right-8 w-52 bg-[#1A1A1A] border border-[#FF6B00] rounded text-white text-sm px-3 py-1.5 outline-none"
                placeholder={t('nav.search')}
                onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
              />
            )}
            <button
              type={searchOpen ? 'submit' : 'button'}
              onClick={() => !searchOpen && setSearchOpen(true)}
              className="text-white hover:text-[#FF6B00] transition-colors p-1"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Language switch */}
          <LanguageSwitch />

          {/* Notifications */}
          <button className="hidden md:flex text-white hover:text-[#FF6B00] transition-colors relative p-1">
            <Bell size={18} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF6B00] rounded-full" />
          </button>

          {/* Admin dashboard link (if logged in) */}
          {user && (
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-1.5 text-gray-400 hover:text-[#FF6B00] transition-colors text-xs font-semibold"
              title={t('nav.adminDashboard')}
            >
              <div className="w-7 h-7 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-xs font-bold">
                {user.username?.[0]?.toUpperCase() ?? 'A'}
              </div>
            </Link>
          )}

          {/* Admin icon for non-logged-in (link to admin login) */}
          {!user && (
            <Link
              to="/admin/login"
              className="hidden md:flex items-center gap-1.5 text-gray-500 hover:text-[#FF6B00] transition-colors p-1"
              title="Admin"
            >
              <LayoutDashboard size={16} />
            </Link>
          )}

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
            const active = pathname === to || (to !== '/' && pathname.startsWith(to));
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
          {/* Mobile lang + admin */}
          <div className="flex items-center gap-2 mt-2">
            <LanguageSwitch />
            <Link
              to={user ? '/admin' : '/admin/login'}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1.5 text-gray-400 text-xs px-3 py-1.5 border border-[#333] rounded"
            >
              <LayoutDashboard size={13} /> Admin
            </Link>
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
