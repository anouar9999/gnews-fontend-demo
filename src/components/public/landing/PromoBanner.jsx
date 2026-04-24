import { useState } from 'react';
import { Flame, Mail } from 'lucide-react';

export default function PromoBanner() {
  const [email, setEmail] = useState('');

  return (
    <section className="relative overflow-hidden   rounded-sm">
      <img
        src="https://placehold.co/1280x300/080810/111122?text="
        alt="banner"
        className="w-full h-[260px] sm:h-[220px] object-cover"
      />
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0e0e18 0%, rgba(14,14,24,0.92) 60%, rgba(232,0,28,0.15) 100%)',
        }}
      />
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(232,0,28,0.3) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <div className="flex items-center gap-2 mb-2">
          <Flame size={18} className="text-orange" fill="#e8001c" />
          <span className="text-[12px] font-black uppercase tracking-widest text-orange">
            Newsletter
          </span>
        </div>
        <h2 className="text-white font-black text-[20px] md:text-[26px] leading-tight mb-1">
          Ne ratez plus aucune actu gaming
        </h2>
        <p className="text-[#888899] text-[13px] sm:text-[15px] mb-4 px-2">
          Recevez chaque jour le meilleur du jeu vidéo directement dans votre boîte mail.
        </p>
        <form
          className="flex gap-2 w-full sm:w-3/4 md:w-1/2 max-w-[420px] px-4 sm:px-0"
          onSubmit={e => e.preventDefault()}
        >
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 bg-[#1a1a28] border border-[#2a2a38] text-white text-[14px] px-4 py-2.5 outline-none focus:border-orange placeholder-[#444455]"
          />
          <button
            type="submit"
            className="bg-orange hover:bg-[#cc0018] text-white font-black text-[13px] uppercase tracking-wider px-5 py-2.5 transition-colors flex items-center gap-2 shrink-0"
          >
            <Mail size={13} /> S'abonner
          </button>
        </form>
      </div>
    </section>
  );
}
