import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const DEFAULT_SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `We collect information you provide directly, such as when you subscribe to our newsletter, submit a comment, or contact us. This includes your name, email address, and any content you submit.\n\nWe also automatically collect certain technical data when you visit GNEWZ, including your IP address, browser type, device information, pages visited, and time spent on the site. This data is collected through cookies and similar technologies.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use the information we collect to:\n• Send you newsletters and content updates you have subscribed to\n• Respond to your comments and inquiries\n• Analyse site traffic and improve our content\n• Detect and prevent fraud or abuse\n• Comply with legal obligations\n\nWe do not sell your personal information to third parties.`,
  },
  {
    title: '3. Cookies',
    body: `GNEWZ uses cookies to enhance your browsing experience and analyse site usage. You can manage your cookie preferences through the cookie consent banner displayed on your first visit, or through your browser settings. For more details, please see our Cookie Policy.`,
  },
  {
    title: '4. Third-Party Services',
    body: `We may use third-party services such as analytics providers and advertising networks. These services may collect information about your online activities over time and across different websites. We encourage you to review their privacy policies.`,
  },
  {
    title: '5. Data Retention',
    body: `We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by law. Newsletter subscribers may unsubscribe at any time via the link included in every email.`,
  },
  {
    title: '6. Your Rights',
    body: `Depending on your location, you may have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@gnewz.com.`,
  },
  {
    title: '7. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our site. Continued use of GNEWZ after changes constitutes your acceptance of the updated policy.`,
  },
];

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const [sections, setSections] = useState(DEFAULT_SECTIONS);

  useEffect(() => {
    api.get('/pages/privacy-policy/')
      .then(r => { if (r.data.content?.sections) setSections(r.data.content.sections); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <p className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest mb-3">{t('legal.label')}</p>
        <h1 className="text-4xl font-black mb-2">{t('legal.privacy.title')}</h1>
        <p className="text-gray-500 text-sm mb-12">{t('legal.lastUpdated')}</p>

        <p className="text-gray-300 leading-relaxed mb-10">
          {t('legal.privacy.intro')}
        </p>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-white text-lg font-bold mb-3">{s.title}</h2>
              <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{s.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#1f1f1f] text-gray-600 text-xs">
          {t('legal.questions')} <Link to="/contact" className="text-[#FF6B00] hover:underline">{t('legal.contactUs')}</Link>
        </div>
      </div>
    </div>
  );
}
