import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const DEFAULT_SECTIONS = [
  { title: '1. Acceptance of Terms', body: 'By accessing or using GNEWZ, you agree to be bound by these Terms of Use. If you do not agree, please discontinue use of the site.' },
  { title: '2. Use of Content', body: 'All content on GNEWZ — including articles, images, videos, and graphics — is the property of GNEWZ or its content partners and is protected by copyright law.\n\nYou may share our content for non-commercial purposes with proper attribution and a link back to the original article. Republishing full articles without written permission is prohibited.' },
  { title: '3. User Comments', body: 'By submitting a comment, you grant GNEWZ a non-exclusive, royalty-free licence to publish and display that comment on our site.\n\nYou agree not to post content that is defamatory, harassing, unlawful, or spammy. We reserve the right to remove any comment at our discretion.' },
  { title: '4. Newsletter', body: 'By subscribing to our newsletter you consent to receive periodic emails from GNEWZ. You can unsubscribe at any time via the link in any of our emails.' },
  { title: '5. Disclaimer', body: 'GNEWZ provides content for informational and entertainment purposes. While we strive for accuracy, we make no warranties about the completeness or reliability of the information presented.' },
  { title: '6. Limitation of Liability', body: 'GNEWZ shall not be liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, this site or its content.' },
  { title: '7. External Links', body: 'Our site may contain links to third-party websites. We are not responsible for the content or privacy practices of those sites.' },
  { title: '8. Changes to Terms', body: 'We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of GNEWZ constitutes acceptance of the revised terms.' },
  { title: '9. Governing Law', body: 'These terms are governed by applicable law. Any disputes shall be resolved in the competent courts of the jurisdiction in which GNEWZ operates.' },
];

export default function TermsOfUsePage() {
  const { t } = useTranslation();
  const [sections, setSections] = useState(DEFAULT_SECTIONS);

  useEffect(() => {
    api.get('/pages/terms-of-use/')
      .then(r => { if (r.data.content?.sections) setSections(r.data.content.sections); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <p className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest mb-3">{t('legal.label')}</p>
        <h1 className="text-4xl font-black mb-2">{t('legal.terms.title')}</h1>
        <p className="text-gray-500 text-sm mb-12">{t('legal.lastUpdated')}</p>

        <p className="text-gray-300 leading-relaxed mb-10">
          {t('legal.terms.intro')}
        </p>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-white text-lg font-bold mb-3">{s.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{s.body}</p>
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
