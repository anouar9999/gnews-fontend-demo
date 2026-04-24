import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { NAV_CATS } from '../../../data/landingMockData';
import GnewzLogo from '../GnewzLogo';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1a1a28]" style={{ background: '#000' }}>
      <div className="max-w-[1280px] mx-auto px-4 flex items-center h-[56px]">

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
            onClick={() => navigate('/search')}
            className="w-8 h-8 flex items-center justify-center text-[#666677] hover:text-white hover:bg-[#111118] rounded transition-colors"
            title="Search"
          >
            <Search size={15} />
          </button>

          {/* Language picker */}
          <button className="hidden md:flex items-center gap-1 pl-2 pr-1.5 py-1 text-[11px] font-bold text-[#888899] hover:text-white hover:bg-[#111118] rounded transition-colors">
            <span className="text-[13px]">🇺🇸</span>
            <span className="tracking-wider">EN</span>
            <ChevronDown size={10} strokeWidth={3} />
          </button>

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
    </nav>
  );
}
