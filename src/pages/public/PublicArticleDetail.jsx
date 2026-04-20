import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  Eye,
  MessageSquare,
  Share2,
  Facebook,
  Twitter,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Flag,
  CornerDownRight,
  Search,
  Bell,
  User,
  Gamepad2,
  Menu,
  X,
  Zap,
} from "lucide-react";

/* ─── FONT ─────────────────────────────────────────────────────────────────── */
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    * { font-family: 'Inter', sans-serif; }
    .ticker-wrap { overflow: hidden; }
    .ticker-inner { display: flex; gap: 48px; animation: ticker 28s linear infinite; white-space: nowrap; }
    @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    .prose p { margin-bottom: 1.1rem; line-height: 1.8; color: #ccccd8; font-size: 15px; }
    .prose h2 { font-size: 20px; font-weight: 800; color: #fff; margin: 1.8rem 0 0.7rem; line-height: 1.3; }
    .prose h3 { font-size: 16px; font-weight: 700; color: #e0e0ee; margin: 1.4rem 0 0.5rem; }
    .prose strong { color: #fff; font-weight: 700; }
    ::-webkit-scrollbar { width: 5px; background: #0a0a14; }
    ::-webkit-scrollbar-thumb { background: #2a2a38; border-radius: 3px; }
  `}</style>
);

/* ─── MOCK DATA ─────────────────────────────────────────────────────────────── */
const ARTICLE = {
  category: "CINÉMA",
  categoryColor: "#22c55e",
  tag: "NEWS",
  title:
    "Mauvaise nouvelle pour Avatar 4 et 5 : Disney sonne la fin de la récré pour James Cameron",
  subtitle:
    "James Cameron voulait tourner Avatar 4 et 5 en même temps. Disney en a décidé autrement.",
  author: {
    name: "Maxime Chao",
    avatar: "https://placehold.co/36x36/1a1a2e/ffffff?text=MC",
  },
  date: "16 avril 2026 à 22h15",
  readTime: "4 min",
  views: "24 817",
  comments: 143,
  image: "https://placehold.co/860x480/010b18/22d3ee?text=AVATAR+4+%26+5",
  tags: ["James Cameron", "Avatar", "Disney", "Cinéma", "Science-Fiction"],
};

const BODY_SECTIONS = [
  {
    type: "p",
    text: "Ce n'est pas une bonne nouvelle pour les fans d'Avatar. Alors que James Cameron espérait tourner Avatar 4 et Avatar 5 simultanément — comme il l'avait fait avec les deux premiers films de la franchise — Disney aurait mis le holà. Le studio souhaite d'abord s'assurer qu'Avatar 3 rencontre le succès escompté avant d'engager des dépenses supplémentaires colossales pour les suites.",
  },
  {
    type: "p",
    text: "Selon les informations rapportées par plusieurs sources proches du dossier, la direction de Disney a exprimé des réserves importantes quant à la stratégie de production en tandem. Après le résultat décevant d'Avatar : La Voie de l'eau par rapport à ses coûts de production astronomiques — estimés à plus de 350 millions de dollars —, le studio se veut plus prudent.",
  },
  {
    type: "h2",
    text: "Vers un tournage en deux temps pour Avatar 4 et 5 ?",
  },
  {
    type: "img",
    src: "https://placehold.co/820x420/010b18/06b6d4?text=Avatar+The+Way+of+Water",
    caption:
      "Avatar : La Voie de l'eau a été un succès commercial, mais ses coûts ont largement tempéré les ardeurs de Disney.",
  },
  {
    type: "p",
    text: "James Cameron, connu pour son perfectionnisme et ses budgets hors norme, avait prévu un tournage simultané afin d'optimiser la logistique — notamment l'utilisation des plateaux de capture de mouvement et des équipes techniques déjà mobilisées. Cette méthode lui avait permis de gagner un temps précieux lors de la production d'Avatar 2.",
  },
  {
    type: "p",
    text: "Mais Disney semble vouloir limiter les risques financiers. En exigeant un tournage séquentiel, le studio se donne le temps d'évaluer les performances d'Avatar 3 — attendu pour décembre 2025 — avant de lancer la machine pour les deux derniers volets de la saga Pandora.",
  },
  {
    type: "h2",
    text: "Disney joue la carte de la prudence",
  },
  {
    type: "p",
    text: "Cette décision n'est pas anodine. Elle témoigne d'un changement d'état d'esprit au sein du studio, qui a dû revoir sa politique en matière de blockbusters après plusieurs semi-échecs commerciaux. La franchise Avatar reste pourtant l'une des plus lucratives de l'histoire du cinéma : le premier film demeure le plus gros succès au box-office mondial avec plus de 2,9 milliards de dollars de recettes.",
  },
  {
    type: "aside",
    title: "À LIRE AUSSI",
    articles: [
      {
        id: "a1",
        tag: "NEWS",
        title:
          "Avatar 3 : la date de sortie officielle confirmée par Disney pour décembre 2025",
        image: "https://placehold.co/80x56/010b18/22d3ee?text=AV3",
      },
      {
        id: "a2",
        tag: "DOSSIER",
        title:
          "James Cameron : retour sur 40 ans de cinéma qui a repoussé les limites du possible",
        image: "https://placehold.co/80x56/010b18/f59e0b?text=JC",
      },
    ],
  },
  {
    type: "p",
    text: "Pour l'heure, James Cameron n'a pas commenté publiquement cette décision. Mais le réalisateur de Titanic et Terminator est connu pour ne jamais renoncer facilement à sa vision artistique. Il est probable que des négociations soient encore en cours entre le cinéaste et les dirigeants de Disney pour trouver un compromis acceptable.",
  },
  {
    type: "img",
    src: "https://placehold.co/820x380/010b18/3b82f6?text=James+Cameron+sur+le+plateau",
    caption:
      "James Cameron sur le plateau d'Avatar 2. Son perfectionnisme légendaire est à la fois sa force et sa contrainte.",
  },
  {
    type: "p",
    text: "En attendant, les fans d'Avatar devront patienter encore quelques années avant de retrouver les paysages lumineux de Pandora. Avatar 3, dont le titre officiel n'a pas encore été révélé, est prévu pour les fêtes de fin d'année 2025. Son succès sera déterminant pour la suite de la saga.",
  },
  {
    type: "h2",
    text: "Quelles conséquences sur le calendrier de la saga ?",
  },
  {
    type: "p",
    text: "Si le tournage d'Avatar 4 et 5 devait se faire en deux temps distincts, cela repousserait mécaniquement la sortie des deux derniers films. On pourrait envisager Avatar 4 pour 2028 ou 2029, et Avatar 5 pour 2031 ou 2032. Une attente considérable pour une franchise qui mise tout sur l'émerveillement visuel et les avancées technologiques.",
  },
];

const RELATED = [
  {
    id: "r1",
    tag: "NEWS",
    tagColor: "#22c55e",
    title: "Moana 2 : Disney annonce une suite en live-action pour 2027",
    image: "https://placehold.co/240x140/010b18/22c55e?text=MOANA+2",
    time: "Il y a 3h",
  },
  {
    id: "r2",
    tag: "TEST",
    tagColor: "#e8001c",
    title:
      "Thunderbolts* : Marvel réussit son pari avec ce film d'équipe explosif",
    image: "https://placehold.co/240x140/010b18/e8001c?text=THUNDERBOLTS",
    time: "Il y a 5h",
  },
  {
    id: "r3",
    tag: "DOSSIER",
    tagColor: "#f59e0b",
    title: "Les 15 films les plus attendus de 2026 — notre sélection complète",
    image: "https://placehold.co/240x140/010b18/f59e0b?text=TOP+FILMS+2026",
    time: "Il y a 8h",
  },
  {
    id: "r4",
    tag: "NEWS",
    tagColor: "#22c55e",
    title: "Zootopie 2 confirmé : premières images et date de sortie dévoilées",
    image: "https://placehold.co/240x140/010b18/16a34a?text=ZOOTOPIE+2",
    time: "Il y a 12h",
  },
  {
    id: "r5",
    tag: "PREVIEW",
    tagColor: "#8b5cf6",
    title:
      "Avengers : Doomsday — le making-of de la scène post-credits expliqué",
    image: "https://placehold.co/240x140/010b18/8b5cf6?text=AVENGERS",
    time: "Hier",
  },
];

const MOCK_COMMENTS = [
  {
    id: 1,
    author: "PandoraFan2154",
    avatar: "PF",
    date: "Il y a 2h",
    text: "Franchement c'était prévisible. Disney ne prend plus aucun risque depuis quelques années. Cameron va être furieux.",
    likes: 87,
    dislikes: 4,
  },
  {
    id: 2,
    author: "CinephileXL",
    avatar: "CX",
    date: "Il y a 3h",
    text: "Je comprends la position de Disney. Même si AV2 a fait 2,3 Mds, les coûts étaient dingues. Leur marge nette était quasi nulle.",
    likes: 134,
    dislikes: 12,
  },
  {
    id: 3,
    author: "NaViQueen",
    avatar: "NQ",
    date: "Il y a 4h",
    text: "En attendant Avatar 4 et 5 on va avoir le temps de mourir... 2032 ??",
    likes: 203,
    dislikes: 3,
  },
];

const TICKER = [
  "🟢 Cinéma — Avatar 3 : James Cameron et Disney en désaccord sur la production",
  "Disney valide Marvel Phase 6 : les titres officiels révélés",
  "Thunderbolts* explose le box-office américain en première semaine",
  "Moana 2 live-action : casting confirmé",
  "James Cameron : 'Avatar 3 sera le film le plus ambitieux de ma carrière'",
];
const NAV_CATS = [
  "JEUX",
  "VIDÉOS",
  "FORUMS",
  "WIKI",
  "PREVIEWS",
  "TESTS",
  "NEWS",
  "DOSSIERS",
  "HARDWARE",
];

/* ─── HELPERS ───────────────────────────────────────────────────────────────── */
function Tag({ label, color }) {
  return (
    <span
      className="text-[10px] font-black uppercase tracking-widest px-2 py-[3px] text-white inline-block"
      style={{ background: color || "#e8001c" }}
    >
      {label}
    </span>
  );
}

/* ─── TOPBAR ────────────────────────────────────────────────────────────────── */
function Topbar() {
  return (
    <div className="bg-[#080810] border-b border-[#1a1a28] text-[11px] text-[#888899] flex items-center justify-between px-4 py-1">
      <div className="flex items-center gap-3">
        {["Jeux vidéo", "Cinéma", "Séries", "Tech", "Manga"].map((s, i) => (
          <span key={s} className="flex items-center gap-3">
            {i > 0 && <span className="text-[#2a2a38]">•</span>}
            <a href="#" className="hover:text-white transition-colors">
              {s}
            </a>
          </span>
        ))}
      </div>
      <div className="hidden md:flex items-center gap-4">
        {["Newsletter", "Application", "Communauté"].map((s) => (
          <a key={s} href="#" className="hover:text-white transition-colors">
            {s}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── NAVBAR ────────────────────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-[#0e0e18] border-b border-[#1e1e2e] sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-[52px]">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-orange flex items-center justify-center rounded-sm">
            <Gamepad2 size={18} className="text-white" />
          </div>
          <span className="text-white font-black text-[17px] tracking-tight">
            jeux<span className="text-orange">video</span>.com
          </span>
        </Link>
        <div className="hidden lg:flex items-center gap-0">
          {NAV_CATS.map((c) => (
            <Link
              key={c}
              to="/"
              className="text-[11.5px] font-bold text-[#aaaabc] hover:text-white px-3 py-1.5 hover:bg-[#1a1a28] transition-colors tracking-wider"
            >
              {c}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center text-[#888899] hover:text-white hover:bg-[#1a1a28] rounded transition-colors">
            <Search size={15} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-[#888899] hover:text-white hover:bg-[#1a1a28] rounded transition-colors relative">
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-[6px] h-[6px] bg-orange rounded-full" />
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold text-[#aaaabc] hover:text-white hover:bg-[#1a1a28] rounded transition-colors">
            <User size={13} />
            <span className="hidden sm:inline">Connexion</span>
          </button>
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center text-[#888899]"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden bg-[#0e0e18] border-t border-[#1e1e2e] px-4 py-3 flex flex-col gap-1">
          {NAV_CATS.map((c) => (
            <Link
              key={c}
              to="/"
              className="text-[12px] font-bold text-[#aaaabc] py-2 border-b border-[#1a1a28]"
            >
              {c}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─── BREAKING TICKER ───────────────────────────────────────────────────────── */
function BreakingTicker() {
  const doubled = [...TICKER, ...TICKER];
  return (
    <div className="bg-[#0a0a14] border-b border-[#1a1a28] flex items-center overflow-hidden h-[34px]">
      <div className="shrink-0 bg-orange h-full flex items-center px-4">
        <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
          <Zap size={10} fill="white" /> ACTU
        </span>
      </div>
      <div className="ticker-wrap flex-1 overflow-hidden">
        <div className="ticker-inner">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="text-[11.5px] text-[#ccccdd] whitespace-nowrap cursor-pointer hover:text-white"
            >
              {item}
              <span className="mx-6 text-[#333344]">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── BREADCRUMB ────────────────────────────────────────────────────────────── */
function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-[11px] text-[#555566] mb-4 flex-wrap">
      {[
        ["Accueil", "/"],
        ["Cinéma", "/cinema"],
        ["News", "/news"],
      ].map(([label, href]) => (
        <span key={label} className="flex items-center gap-1.5">
          <Link to={href} className="hover:text-white transition-colors">
            {label}
          </Link>
          <ChevronRight size={10} className="text-[#333344]" />
        </span>
      ))}
      <span className="text-[#888899] truncate max-w-[300px]">
        Mauvaise nouvelle pour Avatar 4 et 5...
      </span>
    </nav>
  );
}

/* ─── ARTICLE BODY RENDERER ─────────────────────────────────────────────────── */
function ArticleBody({ sections }) {
  return (
    <div className="prose">
      {sections.map((s, i) => {
        if (s.type === "p") return <p key={i}>{s.text}</p>;

        if (s.type === "h2")
          return (
            <h2 key={i} className="flex items-start gap-3">
              <span className="mt-1 shrink-0 w-[3px] h-5 bg-orange rounded-full inline-block" />
              {s.text}
            </h2>
          );

        if (s.type === "img")
          return (
            <figure key={i} className="my-6">
              <img
                src={s.src}
                alt={s.caption}
                className="w-full rounded-sm object-cover"
              />
              {s.caption && (
                <figcaption className="text-[11px] text-[#555566] text-center mt-2 italic">
                  {s.caption}
                </figcaption>
              )}
            </figure>
          );

        if (s.type === "aside")
          return (
            <aside
              key={i}
              className="my-6 bg-[#111118] border-l-[3px] border-orange rounded-r-md overflow-hidden"
            >
              <div className="px-4 py-2 border-b border-[#1a1a28]">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange">
                  {s.title}
                </span>
              </div>
              <div className="divide-y divide-[#1a1a28]">
                {s.articles.map((a) => (
                  <Link
                    key={a.id}
                    to={`/articles/${a.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#1a1a28] transition-colors group"
                  >
                    <img
                      src={a.image}
                      alt={a.title}
                      className="w-16 h-11 object-cover shrink-0 rounded-sm"
                    />
                    <div>
                      <Tag label={a.tag} color="#22c55e" />
                      <p className="text-[12px] font-semibold text-[#ccccdd] leading-snug mt-1 line-clamp-2 group-hover:text-white transition-colors">
                        {a.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          );

        return null;
      })}
    </div>
  );
}

/* ─── AUTHOR BOX ────────────────────────────────────────────────────────────── */
function AuthorBox({ author }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-[#1c1c1e] border border-[#2a2a2a] rounded-md mt-8">
      <img
        src={author.avatar}
        alt={author.name}
        className="w-12 h-12 rounded-full object-cover shrink-0"
      />
      <div>
        <p className="text-[11px] text-[#555566] uppercase tracking-widest font-bold mb-0.5">
          Article rédigé par
        </p>
        <p className="text-white font-black text-[15px]">{author.name}</p>
        <p className="text-[12px] text-[#888899] mt-0.5 leading-snug">
          Journaliste cinéma & séries · jeuxvideo.com depuis 2019
        </p>
      </div>
    </div>
  );
}

/* ─── TAGS BAR ──────────────────────────────────────────────────────────────── */
function TagsBar({ tags }) {
  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {tags.map((t) => (
        <Link
          key={t}
          to={`/tag/${t}`}
          className="text-[11px] font-semibold text-[#888899] px-3 py-1.5 bg-[#1c1c1e] border border-[#2a2a2a] hover:border-orange hover:text-white transition-colors rounded-sm"
        >
          #{t}
        </Link>
      ))}
    </div>
  );
}

/* ─── COMMENT FORM ──────────────────────────────────────────────────────────── */
function CommentForm() {
  const [text, setText] = useState("");
  return (
    <div className="mt-4">
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Partagez votre avis..."
        className="w-full bg-[#232323] border border-[#2a2a2a] text-[13px] text-white px-4 py-3 outline-none focus:border-orange placeholder-[#555555] resize-none rounded-sm"
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-[#555566]">
          Vous devez être connecté pour commenter.
        </span>
        <button
          className="px-5 py-2 text-white font-black text-[12px] uppercase tracking-wider rounded-sm flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #e05500 100%)',
            boxShadow: '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
            transform: 'translateY(-3px)',
            transition: 'transform 0.08s ease, box-shadow 0.08s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 8px 0 #a33a00, 0 12px 24px rgba(255,107,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseDown={e => {
            e.currentTarget.style.boxShadow = '0 2px 0 #a33a00, 0 4px 8px rgba(255,107,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = 'translateY(0px)';
          }}
          onMouseUp={e => {
            e.currentTarget.style.boxShadow = '0 6px 0 #a33a00, 0 8px 16px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
        >
          Publier
        </button>
      </div>
    </div>
  );
}

/* ─── COMMENTS ──────────────────────────────────────────────────────────────── */
function CommentsSection({ comments }) {
  const [replyTo, setReplyTo] = useState(null);

  return (
    <section className="mt-10 pt-6 border-t border-[#1a1a28]">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-[3px] h-5 bg-orange rounded-full" />
        <h2 className="text-[15px] font-black uppercase tracking-widest text-white">
          Commentaires{" "}
          <span className="text-[#555566] ml-1">({comments.length})</span>
        </h2>
      </div>

      {/* Comment form */}
      <div className="mb-6 bg-[#1c1c1e] border border-[#2a2a2a] p-4 rounded-sm">
        <p className="text-[12px] font-bold text-white mb-3">
          Réagir à l'article
        </p>
        <CommentForm />
      </div>

      {/* Comment list */}
      <div className="flex flex-col gap-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="bg-[#1c1c1e] border border-[#2a2a2a] rounded-sm p-4"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[11px] font-black text-[#888899]">
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[13px] font-bold text-white">
                    {c.author}
                  </span>
                  <span className="text-[11px] text-[#555566]">{c.date}</span>
                </div>
                <p className="text-[13px] text-[#bbbbcc] leading-relaxed">
                  {c.text}
                </p>
                <div className="flex items-center gap-4 mt-2.5">
                  <button className="flex items-center gap-1.5 text-[11px] text-[#555566] hover:text-orange transition-colors">
                    <ThumbsUp size={12} /> {c.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-[11px] text-[#555566] hover:text-orange transition-colors">
                    <ThumbsDown size={12} /> {c.dislikes}
                  </button>
                  <button
                    className="flex items-center gap-1.5 text-[11px] text-[#555566] hover:text-white transition-colors"
                    onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                  >
                    <CornerDownRight size={12} /> Répondre
                  </button>
                  <button className="flex items-center gap-1.5 text-[11px] text-[#555566] hover:text-orange transition-colors ml-auto">
                    <Flag size={11} />
                  </button>
                </div>
                {replyTo === c.id && (
                  <div className="mt-3 pl-3 border-l-2 border-[#1e1e2e]">
                    <CommentForm />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-3 border border-[#1e1e2e] text-[12px] font-bold text-[#555566] hover:text-white hover:border-orange transition-colors rounded-sm">
        Voir plus de commentaires
      </button>
    </section>
  );
}

/* ─── SIDEBAR ───────────────────────────────────────────────────────────────── */
function Sidebar({ related }) {
  return (
    <aside className="flex flex-col gap-6">
      {/* A LIRE section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-[3px] h-5 bg-orange rounded-full" />
          <h3 className="text-[12px] font-black uppercase tracking-widest text-white">
            À lire aussi
          </h3>
        </div>
        <div className="flex flex-col gap-px bg-[#1a1a28]">
          {related.map((a) => (
            <Link
              key={a.id}
              to={`/articles/${a.id}`}
              className="flex gap-3 p-3 bg-[#0d0d18] hover:bg-[#12121e] transition-colors group"
            >
              <div className="shrink-0 w-[86px] h-[56px] overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="min-w-0">
                <Tag label={a.tag} color={a.tagColor} />
                <p className="text-[11.5px] font-semibold text-[#ccccdd] leading-snug mt-1 line-clamp-2 group-hover:text-white transition-colors">
                  {a.title}
                </p>
                <span className="text-[10px] text-[#555566] flex items-center gap-1 mt-1">
                  <Clock size={9} /> {a.time}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Ad placeholder */}
      <div className="bg-[#0d0d18] border border-[#1a1a28] flex items-center justify-center h-[250px] rounded-sm">
        <span className="text-[10px] text-[#2a2a38] uppercase tracking-widest font-bold">
          Publicité
        </span>
      </div>

      {/* More cinema */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-[3px] h-5 bg-orange rounded-full" />
            <h3 className="text-[12px] font-black uppercase tracking-widest text-white">
              Cinéma — à la une
            </h3>
          </div>
          <Link
            to="/cinema"
            className="text-[10px] text-[#555566] hover:text-white flex items-center gap-0.5 transition-colors"
          >
            Tout <ChevronRight size={10} />
          </Link>
        </div>
        <div className="flex flex-col gap-px bg-[#1a1a28]">
          {related.slice(0, 3).map((a) => (
            <Link
              key={a.id + "_m"}
              to={`/articles/${a.id}`}
              className="flex gap-3 p-3 bg-[#0d0d18] hover:bg-[#12121e] transition-colors group"
            >
              <div className="shrink-0 w-[72px] h-[48px] overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-[#ccccdd] leading-snug line-clamp-2 group-hover:text-white transition-colors">
                  {a.title}
                </p>
                <span className="text-[10px] text-[#555566]">{a.time}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Second ad */}
      <div className="bg-[#0d0d18] border border-[#1a1a28] flex items-center justify-center h-[200px] rounded-sm">
        <span className="text-[10px] text-[#2a2a38] uppercase tracking-widest font-bold">
          Publicité
        </span>
      </div>
    </aside>
  );
}

/* ─── SHARE BAR ─────────────────────────────────────────────────────────────── */
function ShareBar({ views, comments }) {
  return (
    <div className="flex items-center justify-between py-3 border-y border-[#1a1a28] my-4">
      <div className="flex items-center gap-4 text-[11px] text-[#555566]">
        <span className="flex items-center gap-1.5">
          <Eye size={12} /> {views}
        </span>
        <span className="flex items-center gap-1.5">
          <MessageSquare size={12} /> {comments} commentaires
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1877f2]/10 border border-[#1877f2]/20 text-[#1877f2] text-[11px] font-bold hover:bg-[#1877f2]/20 transition-colors rounded-sm">
          <Facebook size={12} /> Partager
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1da1f2]/10 border border-[#1da1f2]/20 text-[#1da1f2] text-[11px] font-bold hover:bg-[#1da1f2]/20 transition-colors rounded-sm">
          <Twitter size={12} /> Tweeter
        </button>
        <button className="w-7 h-7 flex items-center justify-center border border-[#1e1e2e] text-[#555566] hover:text-white hover:border-[#555566] transition-colors rounded-sm">
          <Bookmark size={13} />
        </button>
        <button className="w-7 h-7 flex items-center justify-center border border-[#1e1e2e] text-[#555566] hover:text-white hover:border-[#555566] transition-colors rounded-sm">
          <Share2 size={13} />
        </button>
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────────── */
export default function PublicArticleDetail() {
  return (
    <>
      <FontImport />
      <div className="min-h-screen bg-[#0d0d18] text-white">
        {/* <Topbar />
        <Navbar /> */}
        <BreakingTicker />

        <main className="max-w-[1280px] mx-auto px-22 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* ── Main article column ── */}
            <article>
              <Breadcrumb />

              {/* Category + title */}
              <div className="mb-4">
                <span
                  className="text-[11px] font-black uppercase tracking-widest px-2 py-1 text-white inline-block mb-3"
                  style={{ background: ARTICLE.categoryColor }}
                >
                  {ARTICLE.category}
                </span>
                <h1 className="text-[38px] font-black uppercase tracking-tighter text-white leading-none mb-2">
                  {ARTICLE.title}
                </h1>
                <p className="text-[#888899] text-[15px] leading-relaxed">
                  {ARTICLE.subtitle}
                </p>
              </div>

              {/* Author + date */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={ARTICLE.author.avatar}
                  alt={ARTICLE.author.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <span className="text-[13px] font-bold text-white">
                    {ARTICLE.author.name}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-[#555566]">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {ARTICLE.date}
                    </span>
                    <span>·</span>
                    <span>{ARTICLE.readTime} de lecture</span>
                  </div>
                </div>
              </div>

              {/* Share bar */}
              <ShareBar views={ARTICLE.views} comments={ARTICLE.comments} />

              {/* Featured image */}
              <figure className="mb-6">
                <div
                  className="overflow-hidden"
                >
                  <img
                    src={ARTICLE.image}
                    alt={ARTICLE.title}
                    className="w-full aspect-[16/9] object-cover"
                  />
                </div>
              </figure>

              {/* Body */}
              <ArticleBody sections={BODY_SECTIONS} />

              {/* Bottom share */}
              <ShareBar views={ARTICLE.views} comments={ARTICLE.comments} />

              {/* Author box */}
              <AuthorBox author={ARTICLE.author} />

              {/* Tags */}
              <TagsBar tags={ARTICLE.tags} />

              {/* Comments */}
              <CommentsSection comments={MOCK_COMMENTS} />
            </article>

            {/* ── Sidebar ── */}
            <div className="hidden lg:block">
              <div className="sticky top-[60px]">
                <Sidebar related={RELATED} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
