import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Newspaper, Cpu, Users, Settings,
  LogOut, ChevronLeft, ChevronRight, BarChart3,
  Database, Tag, Radio, Image, FolderTree, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GnewzLogo from './public/GnewzLogo';
import toast from 'react-hot-toast';

export default function AdminSidebar({ collapsed, onToggle, onClose }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin',           icon: LayoutDashboard, label: t('admin.dashboard'),       end: true },
    { to: '/admin/raw-news',  icon: Newspaper,        label: t('admin.rawNews') },
    { to: '/admin/articles',  icon: BarChart3,        label: t('admin.articles') },
    { to: '/admin/categories',icon: FolderTree,       label: t('admin.categories') },
    { to: '/admin/tags',      icon: Tag,              label: t('admin.tags') },
    { to: '/admin/sources',   icon: Radio,            label: t('admin.sources') },
    { to: '/admin/media',     icon: Image,            label: t('admin.media') },
    { to: '/admin/users',     icon: Users,            label: t('admin.users') },
    { to: '/admin/ai',        icon: Cpu,              label: t('admin.aiOrchestration') },
    { to: '/admin/settings',  icon: Settings,         label: t('admin.settings') },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  const handleNavClick = () => {
    // Close mobile drawer when a nav item is clicked
    onClose?.();
  };

  // On desktop: respect collapsed state. On mobile: always show full labels
  const showLabels = !collapsed; // mobile is never collapsed (always full)

  return (
    <aside className={`
      h-full bg-[#0A0A0A] border-r border-[#1A1A1A] flex flex-col transition-all duration-300
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Logo + close/toggle */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#1A1A1A] h-14 sm:h-16 shrink-0">
        {!collapsed && <GnewzLogo size={44} variant="dark" />}

        {/* Mobile: X to close drawer */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded hover:bg-[#1A1A1A] text-gray-400 hover:text-white transition-colors ml-auto"
        >
          <X size={18} />
        </button>

        {/* Desktop: collapse toggle */}
        <button
          onClick={onToggle}
          className="hidden lg:flex p-1.5 rounded hover:bg-[#1A1A1A] text-gray-400 hover:text-white transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Console label */}
      {!collapsed && (
        <div className="px-4 pt-5 pb-2">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            {t('admin.adminConsole')}
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-0.5 transition-all text-sm font-medium
              ${isActive
                ? 'bg-[#FF6B00] text-white shadow-lg shadow-orange-900/30'
                : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-white'
              }
              ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* API Usage widget — hide when collapsed */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 bg-[#111] border border-[#222] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">API Usage</span>
            <span className="text-xs text-[#FF6B00] font-bold">75%</span>
          </div>
          <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden mb-1.5">
            <div className="h-full w-3/4 bg-[#FF6B00] rounded-full" />
          </div>
          <span className="text-xs text-white font-bold">$120.50</span>
        </div>
      )}

      {/* Logout */}
      <div className="border-t border-[#1A1A1A] p-2 shrink-0">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors
            ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? t('admin.logout') : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>{t('admin.logout')}</span>}
        </button>
      </div>
    </aside>
  );
}
