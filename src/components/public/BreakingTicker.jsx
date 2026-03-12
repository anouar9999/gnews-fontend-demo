const items = [
  "🔥 Casablanca Gaming Expo 2025 — inscriptions ouvertes dès maintenant",
  "⚡ ESL Pro League S22 — Team Liquid vs NAVI — EN DIRECT MAINTENANT",
  "🏆 GNEWZ Cup Maroc — Les qualifications débutent ce week-end à Rabat",
  "🎮 GTA VI PC : date de sortie confirmée — Mars 2026",
  "💻 L'équipe marocaine de e-sport 'Atlas Wolves' qualifiée pour la finale mondiale",
  "🎯 Valorant Champions 2025 — résultats de la phase de groupes disponibles",
  "📺 Xbox Series X — la prochaine génération confirmée pour 2026",
  "🌍 Maroc Esport Federation annonce un tournoi national de 500 000 MAD",
  "⚙️ RTX 5090 : test exclusif — benchmarks complets publiés demain",
  "🎮 AMD Ryzen 9 9950X3D surpasse Intel dans les nouveaux tests synthétiques",
];

export default function BreakingTicker() {
  const repeated = [...items, ...items];
  return (
    <div className="bg-[#FF6B00] overflow-hidden flex items-center h-8 sm:h-9 shrink-0">
      <div
        className="bg-black text-[#FF6B00] font-black text-[10px] sm:text-xs uppercase tracking-widest px-2 sm:px-3 h-full flex items-center shrink-0 z-10"
        style={{ minWidth: 'max-content' }}
      >
        BREAKING
      </div>
      <div className="overflow-hidden flex-1">
        <div className="ticker-track">
          {repeated.map((item, i) => (
            <span key={i} className="text-black font-semibold text-[11px] sm:text-xs px-6 sm:px-8 whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
