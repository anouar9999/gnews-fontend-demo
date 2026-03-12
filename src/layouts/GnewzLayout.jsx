import { Outlet } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import BreakingTicker from '../components/public/BreakingTicker';
import Footer from '../components/public/Footer';

export default function GnewzLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <BreakingTicker />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
