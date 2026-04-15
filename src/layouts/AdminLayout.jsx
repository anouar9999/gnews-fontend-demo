import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Bell, ExternalLink, Menu, LogOut, Sun, Moon } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import LanguageSwitch from '../components/LanguageSwitch';
import { useAuth } from '../context/AuthContext';
import { usePageTitle as usePageTitleCtx } from '../context/PageTitleContext';

const ROUTE_TITLES = {
  dashboard:      { label: 'Dashboard',     sub: 'Overview' },
  articles:       { label: 'Articles',      sub: 'Content library' },
  categories:     { label: 'Categories',    sub: 'Taxonomy' },
  tags:           { label: 'Tags',          sub: 'Labels' },
  sources:        { label: 'Sources',       sub: 'News sources' },
  media:          { label: 'Media',         sub: 'File library' },
  'raw-news':     { label: 'Raw News',      sub: 'Ingestion queue' },
  users:          { label: 'Users',         sub: 'Accounts' },
  settings:       { label: 'Settings',      sub: 'Configuration' },
  'ai-orchestration': { label: 'AI Orchestration', sub: 'Automation' },
  'site-pages':       { label: 'Site Pages',       sub: 'Public page content' },
};

function usePageTitle() {
  const { pathname } = useLocation();
  // strip /admin/ prefix, take the first segment
  const segment = pathname.replace(/^\/admin\/?/, '').split('/')[0] || 'dashboard';
  // detect sub-pages (new / edit / detail)
  const parts = pathname.replace(/^\/admin\/?/, '').split('/');
  let action = null;
  if (parts[1] === 'new')  action = 'New';
  else if (parts[2] === 'edit') action = 'Edit';
  else if (parts[1] && parts[1] !== 'new') action = 'Detail';
  const base = ROUTE_TITLES[segment] ?? { label: segment.charAt(0).toUpperCase() + segment.slice(1), sub: 'Admin' };
  return { ...base, action };
}

export default function AdminLayout() {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('gnewz-theme') || 'dark');
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('gnewz-theme', next);
    document.documentElement.classList.toggle('light', next === 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  const { label, sub, action } = usePageTitle();
  const { pageTitle } = usePageTitleCtx();

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="admin-root flex h-screen overflow-hidden font-[Montserrat,sans-serif]" style={{ background: 'var(--color-dark)' }}>

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
        <header className="gnewz-admin-chrome h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between shrink-0 gap-2" style={{ background: 'var(--color-surface)', borderBottom: '1px solid rgba(255,107,0,0.10)' }}>

          {/* Left: burger (mobile) + breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden text-gray-400 hover:text-white transition-colors p-1 shrink-0"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Accent bar */}
             
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-[15px] tracking-tight leading-none truncate max-w-[340px]">
                    {pageTitle ?? label}
                  </span>
                  {!pageTitle && action && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none shrink-0"
                      style={{
                        background: 'rgba(255,107,0,0.12)',
                        color: 'rgba(255,107,0,0.85)',
                        border: '1px solid rgba(255,107,0,0.2)',
                      }}
                    >
                      {action}
                    </span>
                  )}
                </div>
               
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-2 text-gray-400 text-xs">
              <Calendar size={14} />
              <span>{today}</span>
            </div>

            {/* <LanguageSwitch /> */}

            {/* <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange rounded-full" />
            </button> */}

            <Link
              to="/admin"
              className="hidden lg:flex items-center gap-1.5 text-gray-400 hover:text-orange text-xs transition-colors"
            >
              <ExternalLink size={13} />
              View Site
            </Link>

            {/* Theme toggle */}
            {/* <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-gray-400 hover:text-orange transition-colors p-1"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button> */}

            {/* Profile avatar */}
            {/* <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-white text-xs font-bold shrink-0">
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
            </div> */}
            {/* Logout button */}
        <div className="py-2">
          <button
            title="Logout"
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full rounded-xl text-sm font-medium transition-all duration-150 pl-3 py-2.5"
            style={{ color: "rgba(248,113,113,0.55)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.07)";
              e.currentTarget.style.color = "rgba(248,113,113,0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(248,113,113,0.55)";
            }}
          >
            <LogOut size={16} className="shrink-0" strokeWidth={1.8} />
          </button>
        </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-3 sm:p-5 lg:p-6" style={{ background: 'var(--color-dark)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
