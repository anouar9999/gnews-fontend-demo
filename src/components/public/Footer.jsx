import { Link } from 'react-router-dom';
import GnewzLogo from './GnewzLogo';
import { Twitter, Youtube, Twitch, Instagram, MessageCircle } from 'lucide-react';

const sections = [
  {
    title: 'Content',
    links: ['Gaming News', 'Hardware', 'Culture', 'Esports', 'Reviews', 'Guides'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press Kit', 'Advertise', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'DMCA'],
  },
];

const socials = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Twitch, label: 'Twitch' },
  { icon: Instagram, label: 'Instagram' },
  { icon: MessageCircle, label: 'Discord' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1A1A1A] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <GnewzLogo size={100} variant="dark" />
            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-xs">
              The premier destination for gaming news, hardware reviews, esports coverage, and gaming culture.
            </p>
            {/* Newsletter */}
            <div className="mt-5">
              <p className="text-white text-sm font-700 mb-2">Stay Updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-[#1A1A1A] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-orange transition-colors"
                />
                <button className="bg-orange hover:bg-orange-dim text-white text-xs font-700 uppercase px-4 py-2 rounded transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="text-white font-800 text-sm uppercase tracking-wider mb-4">{s.title}</h4>
              <ul className="space-y-2">
                {s.links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-gray-400 hover:text-orange text-sm transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-[#1A1A1A] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © 2025 GNEWZ. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="text-gray-500 hover:text-orange transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
