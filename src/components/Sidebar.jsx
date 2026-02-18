import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderTree, Tags, Radio, Image, Inbox, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const allNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/articles', icon: FileText, label: 'Articles' },
  { to: '/categories', icon: FolderTree, label: 'Categories' },
  { to: '/tags', icon: Tags, label: 'Tags' },
  { to: '/raw-news', icon: Inbox, label: 'Raw News', adminOnly: true },
  { to: '/sources', icon: Radio, label: 'Sources', adminOnly: true },
  { to: '/media', icon: Image, label: 'Media', adminOnly: true },
  { to: '/users', icon: Users, label: 'Users', adminOnly: true },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { isAdmin } = useAuth();
  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && <span className="text-lg font-bold">GNews Admin</span>}
        <button onClick={onToggle} className="p-1 hover:bg-gray-800 rounded">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
