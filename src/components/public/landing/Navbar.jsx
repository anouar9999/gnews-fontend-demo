import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { NAV_CATS } from '../../../data/landingMockData';
import GnewzLogo from '../GnewzLogo';
import { FontImport } from './shared';
import SearchModal from './SearchModal';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location  = useLocation();

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handler = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1a1a28]" style={{ background: '#000' }}>
      <div className="max-w-[1280px] mx-auto px-4 flex items-center h-[56px]">
      <FontImport />

        {/* ── Logo ── */}
        <Link to="/" className="shrink-0 mr-6">
          <GnewzLogo size={90} variant="dark" />
        </Link>

        {/* ── Desktop nav links (centred) ── */}
        <div className="hidden lg:flex items-center flex-1 justify-center gap-0">
          {NAV_CATS.map(c => {
            const active =
              location.pathname === c.href ||
              (c.href !== '/' && location.pathname.startsWith(c.href));
            return (
              <Link
                key={c.label}
                to={c.href}
                className={`
                  relative text-[12px] font-black uppercase tracking-widest px-4 py-1.5
                  transition-colors duration-150
                  ${active ? 'text-white' : 'text-[#888899] hover:text-white'}
                `}
              >
                {c.label}
                {active && (
                  <span
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px]"
                    style={{ background: '#e8001c' }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right controls ── */}
        <div className="flex items-center gap-1 ml-auto">

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 pl-2.5 pr-2 h-8 text-[#666677] hover:text-white hover:bg-[#111118] rounded transition-colors"
            title="Search  (Ctrl+K)"
          >
            <Search size={15} />
            <span className="hidden md:inline text-[11px] font-bold tracking-wider text-[#444455]">⌘K</span>
          </button>

          {/* Language picker */}
          {/* <button className="hidden md:flex items-center gap-1 pl-2 pr-1.5 py-1 text-[11px] font-bold text-[#888899] hover:text-white hover:bg-[#111118] rounded transition-colors">
            <span className="text-[13px]">🇺🇸</span>
            <span className="tracking-wider">EN</span>
            <ChevronDown size={10} strokeWidth={3} />
          </button> */}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden ml-1 w-8 h-8 flex items-center justify-center text-[#666677] hover:text-white"
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[#1a1a28] px-4 py-3 flex flex-col gap-1" style={{ background: '#000' }}>
          {NAV_CATS.map(c => (
            <Link
              key={c.label}
              to={c.href}
              className="text-[12px] font-black uppercase tracking-widest text-[#888899] hover:text-white py-2.5 border-b border-[#111118] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}

      {/* Search modal — rendered outside nav flow so it covers the full page */}
      {searchOpen && <SearchModal onClose={closeSearch} />}
    </nav>
  );
}
