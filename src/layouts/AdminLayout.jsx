import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Bell, ExternalLink, Menu } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import LanguageSwitch from '../components/LanguageSwitch';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="flex h-screen bg-[#0D0D0D] overflow-hidden font-[Montserrat,sans-serif]">

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static on desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-40 lg:static lg:z-auto
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onClose={() => setMobileOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-14 sm:h-16 bg-[#0A0A0A] border-b border-[#1A1A1A] px-3 sm:px-6 flex items-center justify-between shrink-0 gap-2">

          {/* Left: burger (mobile) + breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden text-gray-400 hover:text-white transition-colors p-1 shrink-0"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <span className="text-gray-500 text-sm truncate">{t('admin.dashboard')}</span>
              <span className="text-gray-600">/</span>
              <span className="text-white text-sm font-semibold truncate">{t('admin.overview')}</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-2 text-gray-400 text-xs">
              <Calendar size={14} />
              <span>{today}</span>
            </div>

            <LanguageSwitch />

            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF6B00] rounded-full" />
            </button>

            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 text-gray-400 hover:text-[#FF6B00] text-xs transition-colors"
            >
              <ExternalLink size={13} />
              View Site
            </Link>

            {/* Profile avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.username?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-xs font-semibold leading-none">
                  {user?.username ?? 'Admin'}
                </p>
                <p className="text-gray-500 text-[10px] mt-0.5 capitalize">
                  {user?.user_type ?? 'admin'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-3 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
