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
    <footer className="pt-12" style={{ background: '#000' }}>
      <div className="max-w-[1280px] mx-auto px-4 pt-10 pb-3">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-8">

          {/* Brand column */}
          <div className="md:col-span-2">
            <span className="logo-for-dark"><GnewzLogo size={90} variant="dark" /></span>
            <span className="logo-for-light"><GnewzLogo size={90} variant="light" /></span>
            <p className="mt-4 text-[12px] leading-relaxed max-w-xs" style={{ color: '#888899' }}>
              {t('footer.tagline')}
            </p>
            {/* <div className="mt-5">
              <p className="text-[11px] font-black uppercase tracking-widest text-white mb-3">
                {t('footer.stayUpdated')}
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  required
                  className="flex-1 text-[12px] text-white placeholder-[#444455] outline-none transition-colors"
                  style={{
                    background: '#111118',
                    border: '1px solid #1a1a28',
                    padding: '8px 12px',
                  }}
                  onFocus={e  => (e.currentTarget.style.borderColor = 'rgba(232,0,28,0.5)')}
                  onBlur={e   => (e.currentTarget.style.borderColor = '#1a1a28')}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="text-[11px] font-black uppercase tracking-widest text-white px-4 disabled:opacity-40 transition-colors shrink-0"
                  style={{ background: '#e8001c' }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.background = '#c4001a')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#e8001c')}
                >
                  {loading ? t('footer.subscribing') : t('footer.subscribe')}
                </button>
              </form>
            </div> */}
          </div>

          {/* Link sections */}
          {sections.map(s => (
            <div key={s.titleKey}>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-4">
                {t(s.titleKey)}
              </h4>
              <ul className="space-y-3">
                {s.links.map(link => (
                  <li key={link.labelKey}>
                    <Link
                      to={link.to}
                      className="text-[12px] font-semibold uppercase transition-colors duration-150"
                      style={{ color: '#888899' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#888899')}
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar — mirrors navbar height/structure */}
        <div className="border-t border-[#1a1a28] pt-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#444455' }}>
            {t('footer.copyright')}
          </p>

          <div className="flex items-center gap-4">
            {socials.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="transition-colors duration-150"
                style={{ color: '#888899' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888899')}
              >
                <Icon size={16} />
              </a>
            ))}

            <div className="flex items-center gap-1 pl-4 border-l border-[#1a1a28]">
              <button
                onClick={onOpenCookie}
                title="Cookie Preferences"
                className="w-7 h-7 flex items-center justify-center rounded transition-colors duration-150"
                style={{ color: '#888899' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888899')}
              >
                <Cookie size={14} />
              </button>
              <button
                onClick={onOpenNewsletter}
                title="Newsletter"
                className="w-7 h-7 flex items-center justify-center rounded transition-colors duration-150"
                style={{ color: '#888899' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888899')}
              >
                <Mail size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
