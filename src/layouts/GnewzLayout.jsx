import { useEffect, useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/public/landing/Navbar';
import BreakingTicker from '../components/public/landing/BreakingTicker';
import Footer from '../components/public/Footer';
import CookieConsent from '../components/public/CookieConsent';
import NewsletterPopup from '../components/public/NewsletterPopup';

/* ── Subtle scattered gaming silhouettes ──────────────────────────────────── */
function GamingBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      }}
    >
      <svg
        width="100%" height="100%"
        viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <g fill="none" stroke="#1a1a2a" strokeWidth="1.4" opacity="0.9">

          {/* Gamepad 1 — top-left */}
          <g transform="translate(60, 100) rotate(-14) scale(1.15)">
            <path d="M30,44 C10,44 4,32 4,21 C4,8 14,2 25,2 L75,2 C86,2 96,8 96,21 C96,32 90,44 70,44 L65,60 C60,69 40,69 35,60 Z"/>
            <line x1="24" y1="17" x2="24" y2="32"/><line x1="17" y1="24" x2="31" y2="24"/>
            <circle cx="67" cy="13" r="3.5"/><circle cx="75" cy="21" r="3.5"/>
            <circle cx="67" cy="29" r="3.5"/><circle cx="59" cy="21" r="3.5"/>
            <circle cx="34" cy="38" r="5.5" strokeWidth="1.2"/>
            <circle cx="57" cy="44" r="5.5" strokeWidth="1.2"/>
            <rect x="42" y="6" width="16" height="5" rx="2.5"/>
          </g>

          {/* Mouse — top-right */}
          <g transform="translate(1280, 70) rotate(12) scale(1.1)">
            <path d="M16,4 C5,4 2,14 2,28 L2,60 C2,74 10,80 20,80 C30,80 38,74 38,60 L38,28 C38,14 35,4 24,4 Z"/>
            <line x1="20" y1="4" x2="20" y2="34"/><line x1="2" y1="34" x2="38" y2="34"/>
            <rect x="14" y="9" width="12" height="16" rx="3"/>
          </g>

          {/* Keyboard — bottom-left */}
          <g transform="translate(70, 720) rotate(6) scale(1.05)">
            <rect x="0" y="0" width="200" height="60" rx="6"/>
            {[8,28,48,68,88,108,128,148].map((x,i) => <rect key={i} x={x} y="8"  width="14" height="11" rx="2"/>)}
            {[8,28,48,68,88,108,128,148,168].map((x,i) => <rect key={i} x={x} y="25" width="14" height="11" rx="2"/>)}
            <rect x="8" y="42" width="22" height="11" rx="2"/>
            <rect x="36" y="42" width="112" height="11" rx="2"/>
            <rect x="154" y="42" width="22" height="11" rx="2"/>
          </g>

          {/* Gamepad 2 — center-right */}
          <g transform="translate(1150, 400) rotate(22) scale(0.85)">
            <path d="M30,44 C10,44 4,32 4,21 C4,8 14,2 25,2 L75,2 C86,2 96,8 96,21 C96,32 90,44 70,44 L65,60 C60,69 40,69 35,60 Z"/>
            <line x1="24" y1="17" x2="24" y2="32"/><line x1="17" y1="24" x2="31" y2="24"/>
            <circle cx="67" cy="13" r="3.5"/><circle cx="75" cy="21" r="3.5"/>
            <circle cx="67" cy="29" r="3.5"/><circle cx="59" cy="21" r="3.5"/>
            <circle cx="34" cy="38" r="5.5" strokeWidth="1.2"/>
            <circle cx="57" cy="44" r="5.5" strokeWidth="1.2"/>
          </g>

          {/* Mouse 2 — left-mid */}
          <g transform="translate(30, 420) rotate(-18) scale(0.78)">
            <path d="M16,4 C5,4 2,14 2,28 L2,60 C2,74 10,80 20,80 C30,80 38,74 38,60 L38,28 C38,14 35,4 24,4 Z"/>
            <line x1="20" y1="4" x2="20" y2="34"/><line x1="2" y1="34" x2="38" y2="34"/>
            <rect x="14" y="9" width="12" height="16" rx="3"/>
          </g>

          {/* Keyboard 2 — top-center */}
          <g transform="translate(520, 20) rotate(-4) scale(0.75)">
            <rect x="0" y="0" width="200" height="60" rx="6"/>
            {[8,28,48,68,88,108,128,148].map((x,i) => <rect key={i} x={x} y="8"  width="14" height="11" rx="2"/>)}
            {[8,28,48,68,88,108,128,148].map((x,i) => <rect key={i} x={x} y="25" width="14" height="11" rx="2"/>)}
            <rect x="8" y="42" width="22" height="11" rx="2"/>
            <rect x="36" y="42" width="90" height="11" rx="2"/>
          </g>

          {/* Gamepad 3 — bottom-right */}
          <g transform="translate(1300, 760) rotate(-9) scale(1)">
            <path d="M30,44 C10,44 4,32 4,21 C4,8 14,2 25,2 L75,2 C86,2 96,8 96,21 C96,32 90,44 70,44 L65,60 C60,69 40,69 35,60 Z"/>
            <line x1="24" y1="17" x2="24" y2="32"/><line x1="17" y1="24" x2="31" y2="24"/>
            <circle cx="67" cy="13" r="3.5"/><circle cx="75" cy="21" r="3.5"/>
            <circle cx="67" cy="29" r="3.5"/><circle cx="59" cy="21" r="3.5"/>
          </g>

          {/* Headset — center-left */}
          <g transform="translate(200, 450) rotate(8) scale(0.9)">
            <path d="M10,40 C10,18 22,4 40,4 C58,4 70,18 70,40"/>
            <rect x="2" y="36" width="14" height="22" rx="7"/>
            <rect x="64" y="36" width="14" height="22" rx="7"/>
          </g>

          {/* Headset 2 — right-mid */}
          <g transform="translate(1060, 250) rotate(-15) scale(0.8)">
            <path d="M10,40 C10,18 22,4 40,4 C58,4 70,18 70,40"/>
            <rect x="2" y="36" width="14" height="22" rx="7"/>
            <rect x="64" y="36" width="14" height="22" rx="7"/>
          </g>

          {/* Mouse 3 — bottom-center */}
          <g transform="translate(690, 810) rotate(5) scale(0.95)">
            <path d="M16,4 C5,4 2,14 2,28 L2,60 C2,74 10,80 20,80 C30,80 38,74 38,60 L38,28 C38,14 35,4 24,4 Z"/>
            <line x1="20" y1="4" x2="20" y2="34"/><line x1="2" y1="34" x2="38" y2="34"/>
          </g>

        </g>
      </svg>
    </div>
  );
}

/* ── Newsletter delay after cookie consent ─────────────────────────────────
   60 s after cookie is handled (either this session or a prior one),
   show the newsletter popup — unless the user already subscribed/dismissed.  */
const NEWSLETTER_DELAY = 60_000; // 60 seconds

export default function GnewzLayout() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  // Manually-forced opens from Footer buttons
  const [cookieOpen,     setCookieOpen]     = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gnewz-theme') || 'dark';
    document.documentElement.classList.toggle('light', saved === 'light');
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.dir  = isRtl ? 'rtl' : 'ltr';
    html.lang = i18n.language;
  }, [i18n.language, isRtl]);

  // Schedule newsletter popup (only if not already handled)
  const scheduleNewsletter = useCallback(() => {
    if (localStorage.getItem('gnewz_newsletter')) return;
    const t = setTimeout(() => setNewsletterOpen(true), NEWSLETTER_DELAY);
    return t;
  }, []);

  // If cookie consent was already given in a previous session, schedule newsletter on mount
  useEffect(() => {
    if (!localStorage.getItem('gnewz_cookie_consent')) return;
    const t = scheduleNewsletter();
    return () => clearTimeout(t);
  }, [scheduleNewsletter]);

  // Called by CookieConsent when the user makes a choice this session
  const handleCookieDone = useCallback(() => {
    const t = scheduleNewsletter();
    // No cleanup needed — the user just made their choice and the layout stays mounted
    return () => clearTimeout(t);
  }, [scheduleNewsletter]);

  return (
    <div style={{ background: '#000', color: 'white', position: 'relative', minHeight: '100vh' }}>
      <GamingBackground />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
          onDone={handleCookieDone}
        />
        <NewsletterPopup
          forceOpen={newsletterOpen}
          onForceClose={() => setNewsletterOpen(false)}
        />
      </div>
    </div>
  );
}
