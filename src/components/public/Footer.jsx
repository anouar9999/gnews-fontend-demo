import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GnewzLogo from './GnewzLogo';
import { Twitter, Youtube, Twitch, Instagram, MessageCircle, Cookie, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const socials = [
  { icon: Twitter,       label: 'Twitter' },
  { icon: Youtube,       label: 'YouTube' },
  { icon: Twitch,        label: 'Twitch' },
  { icon: Instagram,     label: 'Instagram' },
  { icon: MessageCircle, label: 'Discord' },
];

export default function Footer({ onOpenCookie, onOpenNewsletter }) {
  const { t } = useTranslation();
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);

  const sections = [
    {
      titleKey: 'footer.sections.content',
      links: [
        { labelKey: 'footer.links.gamingNews', to: '/gaming' },
        { labelKey: 'footer.links.hardware',   to: '/hardware' },
        { labelKey: 'footer.links.culture',    to: '/culture' },
        { labelKey: 'footer.links.esports',    to: '/esports' },
      ],
    },
    {
      titleKey: 'footer.sections.company',
      links: [
        { labelKey: 'footer.links.aboutUs', to: '/about' },
        { labelKey: 'footer.links.contact', to: '/contact' },
      ],
    },
    {
      titleKey: 'footer.sections.legal',
      links: [
        { labelKey: 'footer.links.privacyPolicy', to: '/privacy-policy' },
        { labelKey: 'footer.links.termsOfUse',    to: '/terms-of-use' },
        { labelKey: 'footer.links.cookiePolicy',  to: '/cookie-policy' },
      ],
    },
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.post('/email/send/', { email: email.trim() });
      toast.success(t('footer.subscribeSuccess'));
      setEmail('');
    } catch {
      toast.error(t('footer.subscribeError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="gnewz-footer bg-[#0A0A0A] border-t border-[#1A1A1A] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <span className="logo-for-dark"><GnewzLogo size={100} variant="dark" /></span>
            <span className="logo-for-light"><GnewzLogo size={100} variant="light" /></span>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="mt-5">
              <p className="text-white text-sm font-700 mb-2">{t('footer.stayUpdated')}</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  required
                  className="flex-1 bg-[#1A1A1A] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-orange transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange hover:bg-orange-dim disabled:opacity-50 text-white text-xs font-700 uppercase px-4 py-2 rounded transition-colors"
                >
                  {loading ? t('footer.subscribing') : t('footer.subscribe')}
                </button>
              </form>
            </div>
          </div>

          {/* Links */}
          {sections.map((s) => (
            <div key={s.titleKey}>
              <h4 className="text-white font-800 text-sm uppercase tracking-wider mb-4">
                {t(s.titleKey)}
              </h4>
              <ul className="space-y-2">
                {s.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link to={link.to} className="text-gray-400 hover:text-orange text-sm transition-colors">
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-[#1A1A1A] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">{t('footer.copyright')}</p>
          <div className="flex items-center gap-4">
            {socials.map(({ icon: Icon, label }) => (
              <a key={label} href="#" aria-label={label} className="text-gray-500 hover:text-orange transition-colors">
                <Icon size={18} />
              </a>
            ))}

            {/* Demo shortcut buttons */}
            <div className="flex items-center gap-1 ml-2 pl-3 border-l border-[#2a2a2a]">
              <button
                onClick={onOpenCookie}
                title="Cookie Preferences"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-orange hover:bg-orange/10 transition-all"
              >
                <Cookie size={15} />
              </button>
              <button
                onClick={onOpenNewsletter}
                title="Newsletter"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-orange hover:bg-orange/10 transition-all"
              >
                <Mail size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
