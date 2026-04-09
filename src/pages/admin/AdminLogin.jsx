import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import GnewzLogo from '../../components/public/GnewzLogo';
import LanguageSwitch from '../../components/LanguageSwitch';

export default function AdminLogin() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      {/* Top language switch */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitch />
      </div>

      {/* True center wrapper */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <GnewzLogo size={100} variant="dark" />
          </div>

          {/* Card */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-8">
          <div className="mb-6">
            <p className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest mb-1">
              {t('admin.adminConsole')}
            </p>
            <h1 className="text-white text-2xl font-bold">{t('admin.signIn')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {t('admin.username')}
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-[#FF6B00] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {t('admin.password')}
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-[#FF6B00] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#FF6B00] hover:bg-[#cc5500] disabled:opacity-50 text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-colors mt-2"
            >
              {loading ? t('admin.signingIn') : t('admin.signInBtn')}
            </button>
          </form>
        </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            © 2025 GNEWZ. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
