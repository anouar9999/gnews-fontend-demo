import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/public/Navbar';
import BreakingTicker from '../components/public/BreakingTicker';
import Footer from '../components/public/Footer';
import CookieConsent from '../components/public/CookieConsent';
import NewsletterPopup from '../components/public/NewsletterPopup';

export default function GnewzLayout() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [cookieOpen,     setCookieOpen]     = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  // Restore saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('gnewz-theme') || 'dark';
    document.documentElement.classList.toggle('light', saved === 'light');
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.dir  = isRtl ? 'rtl' : 'ltr';
    html.lang = i18n.language;
  }, [i18n.language, isRtl]);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <BreakingTicker />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer
        onOpenCookie={() => setCookieOpen(true)}
        onOpenNewsletter={() => setNewsletterOpen(true)}
      />
      <CookieConsent
        forceOpen={cookieOpen}
        onForceClose={() => setCookieOpen(false)}
      />
      <NewsletterPopup
        forceOpen={newsletterOpen}
        onForceClose={() => setNewsletterOpen(false)}
      />
    </div>
  );
}
