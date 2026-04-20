import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Gamepad2, Menu, X } from 'lucide-react';
import { NAV_CATS } from '../../../data/landingMockData';
import GnewzLogo from '../GnewzLogo';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#0e0e18] border-b border-[#1e1e2e] sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-[52px]">

        {/* Logo */}
        {/* <Link to="/" className="flex items-center gap-2 shrink-0">
         
        </Link> */}
 <Link to="/" className="shrink-0">
          <span className="logo-for-dark"><GnewzLogo size={100} variant="dark" /></span>
          <span className="logo-for-light"><GnewzLogo size={100} variant="light" /></span>
        </Link>
        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-0.5">
          {NAV_CATS.map(c => (
            <Link
              key={c.label}
              to={c.href}
              className="text-[13px] font-bold text-[#aaaabc] hover:text-white px-3 py-1.5 hover:bg-[#1a1a28] transition-colors tracking-wider"
            >
              {c.label}
            </Link>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center text-[#888899] hover:text-white hover:bg-[#1a1a28] rounded transition-colors">
            <Search size={15} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-[#888899] hover:text-white hover:bg-[#1a1a28] rounded transition-colors relative">
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-[6px] h-[6px] bg-orange rounded-full" />
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] font-bold text-[#aaaabc] hover:text-white hover:bg-[#1a1a28] rounded transition-colors">
            <User size={13} />
            <span className="hidden sm:inline">Connexion</span>
          </button>
          <button
            className="lg:hidden ml-1 w-8 h-8 flex items-center justify-center text-[#888899] hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0e0e18] border-t border-[#1e1e2e] px-4 py-3 flex flex-col gap-1">
          {NAV_CATS.map(c => (
            <Link
              key={c.label}
              to={c.href}
              className="text-[12px] font-bold text-[#aaaabc] hover:text-white py-2 border-b border-[#1a1a28]"
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
