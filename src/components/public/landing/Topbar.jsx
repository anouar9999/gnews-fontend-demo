export default function Topbar() {
  return (
    <div className="hidden md:flex bg-[#080810] border-b border-[#1a1a28] text-[12px] text-[#888899] items-center justify-between px-4 py-1">
      <div className="flex items-center gap-4">
        <span>Jeux vidéo</span>
        <span>•</span>
        <span>Cinéma</span>
        <span>•</span>
        <span>Séries</span>
        <span>•</span>
        <span>Tech</span>
        <span>•</span>
        <span>Manga</span>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <span className="cursor-pointer hover:text-white transition-colors">Newsletter</span>
        <span className="cursor-pointer hover:text-white transition-colors">Application</span>
        <span className="cursor-pointer hover:text-white transition-colors">Communauté</span>
      </div>
    </div>
  );
}
