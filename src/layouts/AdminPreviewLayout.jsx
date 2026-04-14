import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/public/Navbar';
import BreakingTicker from '../components/public/BreakingTicker';
import Footer from '../components/public/Footer';
import { LayoutDashboard } from 'lucide-react';

export default function AdminPreviewLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <BreakingTicker />
      <Navbar basePath="/admin" />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Floating admin badge */}
      <Link
        to="/admin/dashboard"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-orange hover:bg-orange-dim text-white text-sm font-bold px-4 py-3 rounded-full shadow-2xl shadow-orange-900/50 transition-all hover:scale-105"
      >
        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-orange text-xs font-bold shrink-0">
          {user?.username?.[0]?.toUpperCase() ?? 'A'}
        </div>
        <span className="hidden sm:inline">Admin Dashboard</span>
        <LayoutDashboard size={16} className="sm:hidden" />
      </Link>
    </div>
  );
}
