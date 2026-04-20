/* ─── MOCK DATA — jeuxvideo.com landing page ──────────────────────────────── */

import { t } from "i18next";

export const HERO = {
  id: 1,
  tag: 'TEST',
  tagColor: '#e8001c',
  title: "TEST – Elden Ring : Nightreign — FromSoftware réinvente le roguelite avec une maestria déconcertante",
  excerpt: "Co-op, runs roguelite, boss géants et carte vivante : on a passé 40 heures sur le spin-off le plus ambitieux de FromSoftware. Notre verdict complet.",
  image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2622380/page_bg_raw.jpg',
  author: 'Réda B.',
  time: 'Il y a 1h',
  views: '112 K',
  score: '18/20',
};

export const SIDE_ARTICLES = [
  {
    id: 2, tag: 'NEWS', tagColor: '#e8001c',
    title: "GTA 6 : Rockstar confirme la date de sortie — tout ce qu'on sait",
    image: 'https://www.gtabase.com/igallery/gta-6-screens/vice-city-01-1080.jpg',
    time: 'Il y a 2h',
  },
  {
    id: 3, tag: 'PREVIEW', tagColor: '#8b5cf6',
    title: "The Witcher 4 — 3 heures de jeu, nos premières impressions exclusives",
    image: 'https://press.cdn.cdpr.app/news/e84f93bf4a4c3d451282614323ccc7942d0e5250_q90_900x900.jpeg',
    time: 'Il y a 3h',
  },
  {
    id: 4, tag: 'NEWS', tagColor: '#22d3ee',
    title: "Nintendo Switch 2 : tous les jeux de lancement confirmés à ce jour",
    image: 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/ccb3e8ca3c296e21a8c933e8369031511589d0ef6b079cf5bb3667b09893482c/index/index_soloProduct',
    time: 'Il y a 4h',
  },
  {
    id: 5, tag: 'DOSSIER', tagColor: '#f59e0b',
    title: "Final Fantasy VII Rebirth : le DLC Intermezzo est daté et chiffré",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2909400/header.jpg',
    time: 'Il y a 6h',
  },
  {
    id: 6, tag: 'TEST', tagColor: '#10b981',
    title: "Silent Hill 2 Remake reçoit un patch surprise qui change tout",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2124490/header.jpg',
    time: 'Il y a 8h',
  },
];

export const TICKER_ITEMS = [
  "🔴 EN DIRECT — GTA 6 : conférence Rockstar ce soir à 21h",
  "Switch 2 : rupture de stock chez la plupart des revendeurs",
  "Elden Ring Nightreign : patch day-one de 4,8 Go disponible",
  "Call of Duty BO7 : les serveurs tombent en pleine bêta",
  "Microsoft rachète un nouveau studio indépendant pour 1,2 Md$",
  "Steam : les meilleures ventes de la semaine — Palworld toujours en tête",
  "PS5 Pro : baisse de prix officielle en Europe dès mai",
];

export const GAMING_ARTICLES = [
  {
    id: 10, tag: 'TEST', tagColor: '#e8001c',
    title: "Monster Hunter Wilds — les meilleures builds pour débuter la chasse en ligne",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2246340/header.jpg',
    author: 'Karim D.', time: 'Il y a 1h', views: '31 K',
  },
  {
    id: 11, tag: 'PREVIEW', tagColor: '#8b5cf6',
    title: "Avowed : Obsidian livre-t-il un RPG à la hauteur de ses ambitions colossales ?",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2457220/ss_f00c83eaae2341a7bfa6e5ae6a76e4b99b4dfb72.1920x1080.jpg',
    author: 'Sophie L.', time: 'Il y a 3h', views: '44 K',
  },
  {
    id: 12, tag: 'NEWS', tagColor: '#c0392b',
    title: "Doom : The Dark Ages — nos impressions après la bêta fermée de 6 heures",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3017860/header.jpg',
    author: 'Julien T.', time: 'Il y a 5h', views: '67 K',
  },
  {
    id: 13, tag: 'GUIDE', tagColor: '#10b981',
    title: "Minecraft 2025 : tous les biomes secrets de la mise à jour Trailscraft",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1672970/header.jpg',
    author: 'Alex M.', time: 'Il y a 7h', views: '88 K',
  },
];

export const ESPORTS_ARTICLES = [
  {
    id: 20, tag: 'LIVE',
    title: "Worlds 2025 : T1 vs G2 en finale mondiale — le résumé épique",
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/c0ae09d9938a420ee81a25d11cd3e82f2cccaf1e-3840x2160.jpg?accountingTag=lol_esports',
    author: 'Marc R.', time: 'Il y a 30 min', views: '203 K', live: true,
  },
  {
    id: 21, tag: 'MAJOR',
    title: "CS2 Major Paris : NAVI élimine Vitality dans un thriller à 5 rounds",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/header.jpg',
    author: 'Lina K.', time: 'Il y a 2h', views: '95 K',
  },
  {
    id: 22, tag: 'TRANSFER',
    title: "Karmine Corp signe la recrue la plus chère de l'histoire de la LEC",
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/633bd539d49a4e9bef4012f691d9c12867637fae-1600x900.jpg?accountingTag=lol_esports',
    author: 'David F.', time: 'Il y a 4h', views: '76 K',
  },
  {
    id: 23, tag: 'VALORANT',
    title: "VCT Champions 2025 : Sentinels remporte le titre dans une finale de légende",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/header.jpg',
    author: 'Sara M.', time: 'Il y a 6h', views: '118 K',
  },
  {
    id: 24, tag: 'DOTA 2',
    title: "The International 2025 : Team Spirit défend son titre contre toute attente",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/header.jpg',
    author: 'Alex T.', time: 'Il y a 8h', views: '87 K',
  },
  {
    id: 25, tag: 'ANALYSE',
    title: "Pourquoi le format des ligues régionales de LoL est à bout de souffle en Europe",
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/b3df3b2e3d4e4e9e3e3e3e3e3e3e3e3e3e3e3e3e-1600x900.jpg?accountingTag=lol_esports',
    author: 'Julie P.', time: 'Il y a 10h', views: '61 K',
  },
];

export const HARDWARE_ARTICLES = [
  {
    id: 30, tag: 'TEST', tagColor: '#3b82f6',
    title: "RTX 5090 — la carte graphique la plus puissante jamais testée vaut-elle son prix insensé ?",
    image: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/graphic-cards/50-series/rtx-5090/geforce-rtx-50-series-exploded-view-video-ari.jpg',
    author: 'Pierre G.', time: 'Il y a 2h', views: '92 K', score: '17/20',
    excerpt: "NVIDIA place la barre stratosphérique. Voici ce que nos benchmarks révèlent vraiment sur cette bête de course.",
    large: true,
  },
  {
    id: 31, tag: 'COMPARATIF', tagColor: '#06b6d4',
    title: "PS5 Pro vs PS5 Slim : lequel choisir en 2025 selon votre budget ?",
    image: 'https://sonyinteractive.com/tachyon/2024/09/SIE_PS5-Pro.jpg?fit=1024%2C1024',
    author: 'Nora S.', time: 'Il y a 5h', views: '76 K',
  },
  {
    id: 32, tag: 'GUIDE', tagColor: '#10b981',
    title: "Meilleur casque gaming 2025 : notre sélection des 10 modèles testés",
    image: 'https://assets2.razerzone.com/images/pnx.assets/16eac26cd230ce343f56af70ec49626a/razer-blackshark-v2-pro-black-2023-500x500.webp',
    author: 'Tom B.', time: 'Il y a 8h', views: '54 K',
  },
  {
    id: 33, tag: 'ACTU', tagColor: '#f59e0b',
    title: "Intel Arrow Lake : les Core Ultra 200 enfin à la hauteur face à AMD Ryzen 9000 ?",
    image: 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-10/rwd-core-ultra-processor-badge-rwd.png.rendition.intel.web.864.486.png',
    author: 'Marc D.', time: 'Il y a 11h', views: '38 K',
  },
  {
    id: 34, tag: 'TEST', tagColor: '#3b82f6',
    title: "SSD Samsung 990 Pro 4 To : le meilleur stockage NVMe pour PS5 et PC gamer",
    image: 'https://image-us.samsung.com/SamsungUS/home/computing/memory-storage/all-ssds/06202023/990-PRO/MZ-V9P4T0B/MZ-V9P4T0B_001_Front_Black.jpg',
    author: 'Lena V.', time: 'Il y a 13h', views: '29 K', score: '16/20',
  },
  {
    id: 35, tag: 'GUIDE', tagColor: '#10b981',
    title: "Monter son PC gamer à moins de 1000€ en 2025 : la config idéale composant par composant",
    image: 'https://cdn.mos.cms.futurecdn.net/buildapcguide-1200-80.jpg',
    author: 'Alex R.', time: 'Il y a 1j', views: '67 K',
  },
  {
    id: 36, tag: 'COMPARATIF', tagColor: '#06b6d4',
    title: "OLED vs Mini-LED : quel écran choisir pour le gaming en 2025 ?",
    image: 'https://cdn.mos.cms.futurecdn.net/oledvsminiledmonitor-1200-80.jpg',
    author: 'Sophie M.', time: 'Il y a 1j', views: '44 K',
  },
  {
    id: 37, tag: 'ACTU', tagColor: '#f59e0b',
    title: "AMD RX 9070 XT : la réponse à la RTX 5080 est enfin là — nos premiers benchmarks",
    image: 'https://cdn.mos.cms.futurecdn.net/amdradeonrx7900xtx-1200-80.jpg',
    author: 'Pierre G.', time: 'Il y a 2j', views: '81 K',
  },
  {
    id: 38, tag: 'TEST', tagColor: '#3b82f6',
    title: "Corsair K70 Max : le clavier mécanique magnétique qui redéfinit le gaming compétitif",
    image: 'https://www.corsair.com/medias/sys_master/images/images/h4e/hb3/9519366422558/CH-9109414-NA-Gallery-K70-MAX-RGB-Keyboard-01.png',
    author: 'Tom B.', time: 'Il y a 2j', views: '22 K', score: '15/20',
  },
];

export const MOST_READ = [
  { id: 1, rank: 1, title: "GTA 6 : date officielle et trailer final dévoilés par Rockstar", views: '1,2 M' },
  { id: 2, rank: 2, title: "Nintendo Switch 2 : prix définitif et tous les jeux de lancement", views: '890 K' },
  { id: 3, rank: 3, title: "Elden Ring Nightreign : notre test complet — 18/20", views: '672 K' },
  { id: 4, rank: 4, title: "RTX 5090 en test : la carte la plus rapide de l'histoire", views: '541 K' },
  { id: 5, rank: 5, title: "Worlds 2025 : T1 champion du monde pour la 5ème fois", views: '498 K' },
];

export const LATEST_ARTICLES = [
  {
    id: 40, tag: 'NEWS', tagColor: '#e8001c',
    title: "Starfield : l'extension Shattered Space reçoit une note catastrophique",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg',
    time: 'Il y a 20 min',
  },
  {
    id: 41, tag: 'TEST', tagColor: '#9333ea',
    title: "Dragon Age : The Veilguard — un RPG Bioware solide mais sans génie",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1845910/header.jpg',
    time: 'Il y a 45 min',
  },
  {
    id: 42, tag: 'PREVIEW', tagColor: '#16a34a',
    title: "Fable 2025 : Microsoft mise tout sur ce reboot ambitieux et risqué",
    image: 'https://cms-assets.xboxservices.com/assets/1f/2d/1f2d6c0e-bcbb-49ed-8d98-19dc09f836ef.jpg?n=993888452001_GLP-Page-Hero-1084_1920x1080.jpg',
    time: 'Il y a 1h',
  },
  {
    id: 43, tag: 'NEWS', tagColor: '#e11d48',
    title: "Persona 6 : Atlus confirme l'annonce imminente lors du Tokyo Game Show",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1687950/header.jpg',
    time: 'Il y a 2h',
  },
  {
    id: 44, tag: 'DOSSIER', tagColor: '#d97706',
    title: "Les 20 meilleurs jeux PC de 2024 — notre palmarès définitif",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2379780/header.jpg',
    time: 'Il y a 3h',
  },
  {
    id: 45, tag: 'TEST', tagColor: '#2563eb',
    title: "Alan Wake 2 : Remedy repousse les limites du jeu narratif moderne",
    image: 'https://cdn.prod.website-files.com/64630b03551142e3347ae3da/6492b74f53eef670a1c040af_AlanWake2_00051.webp',
    time: 'Il y a 4h',
  },
];

export const VIDEOS = [
  {
    id: 50, title: "Elden Ring Nightreign — Gameplay 4K Ultra HD",
    duration: "14:32", views: "218 K",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2622380/header.jpg',
  },
  {
    id: 51, title: "GTA 6 Trailer Officiel — Analyse complète plan par plan",
    duration: "22:10", views: "1,4 M",
    image: 'https://www.gtabase.com/igallery/gta-6-screens/postcard-vicecity-1080.jpg',
  },
  {
    id: 52, title: "Switch 2 Unboxing & Premier Test : vaut-elle le prix ?",
    duration: "18:45", views: "654 K",
    image: 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/ccb3e8ca3c296e21a8c933e8369031511589d0ef6b079cf5bb3667b09893482c/index/index_soloProduct',
  },
  {
    id: 53, title: "RTX 5090 vs 4090 : Benchmarks dans 20 jeux en 4K",
    duration: "31:08", views: "412 K",
    image: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/graphic-cards/50-series/rtx-5090/geforce-rtx-50-series-exploded-view-video-ari.jpg',
  },
];

export const CULTURE_ARTICLES = [
  {
    id: 60, tag: 'CINÉMA', tagColor: '#a855f7',
    title: "Fallout Saison 2 : Amazon dévoile les premières images officielles — tout ce qu'on sait",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1151340/header.jpg',
    author: 'Clara P.', time: 'Il y a 1h', views: '78 K',
    excerpt: "La série post-apocalyptique revient avec une ambition décuplée. Décors inédits, nouveau casting et retour de Lucy MacLean.",
    large: true,
  },
  {
    id: 61, tag: 'SÉRIE', tagColor: '#ec4899',
    title: "The Last of Us S2 : HBO fixe la date de diffusion et lâche un trailer dévastateur",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/header.jpg',
    author: 'Léa D.', time: 'Il y a 3h', views: '134 K',
  },
  {
    id: 62, tag: 'FILM', tagColor: '#a855f7',
    title: "Film Minecraft : la bande-annonce explose tous les records de vues en 24h",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1672970/header.jpg',
    author: 'Tom R.', time: 'Il y a 5h', views: '210 K',
  },
  {
    id: 63, tag: 'MANGA', tagColor: '#f43f5e',
    title: "Solo Leveling : l'anime annonce une saison 3 avec un arc inédit jamais adapté",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2138710/header.jpg',
    author: 'Yasmin B.', time: 'Il y a 7h', views: '92 K',
  },
  {
    id: 64, tag: 'ANIMÉ', tagColor: '#f97316',
    title: "Dragon Ball Daima : le premier arc se termine sur un cliffhanger explosif",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/header.jpg',
    author: 'Karim S.', time: 'Il y a 9h', views: '61 K',
  },
  {
    id: 65, tag: 'FILM', tagColor: '#a855f7',
    title: "Avatar 3 : James Cameron confirme une sortie en décembre et dévoile le titre officiel",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2073850/header.jpg',
    author: 'Sophie M.', time: 'Il y a 11h', views: '155 K',
  },
  {
    id: 66, tag: 'SÉRIE', tagColor: '#ec4899',
    title: "Arcane Saison 3 : Netflix confirme la suite avec un teaser époustouflant",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1818750/header.jpg',
    author: 'Inès R.', time: 'Il y a 13h', views: '203 K',
  },
  {
    id: 67, tag: 'MANGA', tagColor: '#f43f5e',
    title: "One Piece : le chapitre 1120 enfin traduit — révélation sur le Fruit du Démon de Joy Boy",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1624340/header.jpg',
    author: 'Rayan T.', time: 'Il y a 15h', views: '88 K',
  },
  {
    id: 68, tag: 'CINÉMA', tagColor: '#a855f7',
    title: "Star Wars : Lucasfilm annonce deux films pour 2026 avec des réalisateurs surprise",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/32470/header.jpg',
    author: 'Alex B.', time: 'Il y a 18h', views: '120 K',
  },
];

/* ─── TRENDING NOW ──────────────────────────────────────────────────────────── */
export const TRENDING_NOW = [
  { id: 70, tag: 'TRENDING', tagColor: '#e8001c', rank: 1,
    title: "GTA 6 : Rockstar dévoile la map complète de Vice City et ses 4 îles",
    excerpt: "La plus grande map de l'histoire de la série est confirmée avec des détails stupéfiants.",
    image: 'https://www.gtabase.com/igallery/gta-6-screens/vice-city-01-1080.jpg',
    time: 'Il y a 30 min', views: '2,1 M' },
  { id: 71, tag: 'HOT', tagColor: '#f97316', rank: 2,
    title: "Elden Ring Nightreign : les 8 classes révélées avec leurs aptitudes uniques",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2622380/ss_0c36b7f49714a2a6ada71d0c0c7e42f8bf70fd54.1920x1080.jpg',
    time: 'Il y a 1h', views: '890 K' },
  { id: 72, tag: 'NEWS', tagColor: '#3b82f6', rank: 3,
    title: "Nintendo Switch 2 : prix, bundle et accessoires — tout est officiel",
    image: 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/ccb3e8ca3c296e21a8c933e8369031511589d0ef6b079cf5bb3667b09893482c/index/index_soloProduct',
    time: 'Il y a 2h', views: '1,3 M' },
  { id: 73, tag: 'ESPORTS', tagColor: '#f59e0b', rank: 4,
    title: "T1 Faker signe le plus grand contrat de l'histoire de l'esport mondial",
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/c0ae09d9938a420ee81a25d11cd3e82f2cccaf1e-3840x2160.jpg',
    time: 'Il y a 3h', views: '654 K' },
  { id: 74, tag: 'TEST', tagColor: '#10b981', rank: 5,
    title: "Baldur's Gate 3 : le patch 7 ajoute 12 fins inédites et rééquilibre tout",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg',
    time: 'Il y a 4h', views: '432 K' },
  { id: 75, tag: 'PREVIEW', tagColor: '#8b5cf6', rank: 6,
    title: "Cyberpunk 2077 Phantom Liberty 2 : CD Projekt annonce la suite en DLC",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
    time: 'Il y a 5h', views: '378 K' },
  { id: 76, tag: 'DEAL', tagColor: '#ec4899', rank: 7,
    title: "PS5 Pro à -30% : la meilleure offre Black Friday avant l'heure",
    image: 'https://sonyinteractive.com/tachyon/2024/09/SIE_PS5-Pro.jpg',
    time: 'Il y a 6h', views: '215 K' },
];

/* ─── DEALS ─────────────────────────────────────────────────────────────────── */
export const DEALS = [
  { id: 80, title: "PS5 Pro — Pack Spider-Man 2 + 2 manettes DualSense",
    image: 'https://sonyinteractive.com/tachyon/2024/09/SIE_PS5-Pro.jpg',
    originalPrice: '699,99 €', price: '489,99 €', discount: '-30%',
    store: 'Amazon', tag: 'CONSOLE', tagColor: '#e8001c', featured: true,
    excerpt: "La console next-gen de Sony à son prix le plus bas jamais atteint, avec le meilleur jeu de l'année inclus." },
  { id: 81, title: "ASUS ROG Swift OLED 27\" 240Hz",
    image: 'https://dlcdnwebimgs.asus.com/gain/49E5EF1C-7E28-4A3F-A44E-6FB6B67DC9D9/w717/h525',
    originalPrice: '899 €', price: '649 €', discount: '-28%',
    store: 'Fnac', tag: 'ÉCRAN', tagColor: '#3b82f6' },
  { id: 82, title: "Razer DeathAdder V3 HyperSpeed",
    image: 'https://assets2.razerzone.com/images/pnx.assets/16eac26cd230ce343f56af70ec49626a/razer-blackshark-v2-pro-black-2023-500x500.webp',
    originalPrice: '109,99 €', price: '69,99 €', discount: '-36%',
    store: 'Razer Store', tag: 'SOURIS', tagColor: '#10b981' },
  { id: 83, title: "Samsung 980 Pro 2To NVMe PCIe 4.0",
    image: 'https://image.samsung.com/us/computing/memory-storage/all-memory-storage/all-memory-storage/MZ-V8P2T0B/AM/MZ-V8P2T0B-AM-dynamic2-black-bg-zoom.jpg',
    originalPrice: '199,99 €', price: '119,99 €', discount: '-40%',
    store: 'Cdiscount', tag: 'STOCKAGE', tagColor: '#f59e0b' },
  { id: 84, title: "Corsair HS80 RGB Wireless",
    image: 'https://assets2.razerzone.com/images/pnx.assets/16eac26cd230ce343f56af70ec49626a/razer-blackshark-v2-pro-black-2023-500x500.webp',
    originalPrice: '129,99 €', price: '79,99 €', discount: '-38%',
    store: 'Ldlc', tag: 'CASQUE', tagColor: '#8b5cf6' },
];

/* ─── GAME NEWS ──────────────────────────────────────────────────────────────── */
export const GAME_NEWS = [
  { id: 90, tag: 'ANNONCE', tagColor: '#e8001c',
    title: "The Elder Scrolls VI : Bethesda montre enfin les premières images",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg',
    time: 'Il y a 1h', views: '1,8 M', featured: true,
    excerpt: "Après des années d'attente, Bethesda lève le voile sur son RPG le plus ambitieux." },
  { id: 91, tag: 'PATCH', tagColor: '#10b981',
    title: "Fortnite Chapitre 6 : la saison des ninjas apporte 40 nouvelles armes",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/header.jpg',
    time: 'Il y a 2h', views: '345 K' },
  { id: 92, tag: 'NEWS', tagColor: '#3b82f6',
    title: "Hogwarts Legacy 2 : Warner confirme le développement avec un studio agrandi",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/990080/header.jpg',
    time: 'Il y a 3h', views: '567 K' },
  { id: 93, tag: 'GUIDE', tagColor: '#f59e0b',
    title: "Monster Hunter Wilds : notre guide des 14 armes pour bien débuter",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2246340/header.jpg',
    time: 'Il y a 4h', views: '234 K' },
  { id: 94, tag: 'NEWS', tagColor: '#e8001c',
    title: "Diablo IV Saison 8 : les grandes nouveautés du prochain patch dévoilées",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2344520/header.jpg',
    time: 'Il y a 5h', views: '189 K' },
  { id: 95, tag: 'TEST', tagColor: '#8b5cf6',
    title: "Hades II : Early Access — FromSoftware a du souci à se faire",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145360/header.jpg',
    time: 'Il y a 6h', views: '412 K' },
];

/* ─── ANTICIPATED GAMES ──────────────────────────────────────────────────────── */
export const ANTICIPATED_GAMES = [
  { id: 100, title: "GTA VI", release: "Automne 2025", score: 98,
    image: 'https://www.gtabase.com/igallery/gta-6-screens/vice-city-01-1080.jpg' },
  { id: 101, title: "The Elder Scrolls VI", release: "2026 ?", score: 96,
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg' },
  { id: 102, title: "Elden Ring Nightreign", release: "Mai 2025", score: 94,
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2622380/header.jpg' },
  { id: 103, title: "The Witcher 4", release: "2026", score: 93,
    image: 'https://press.cdn.cdpr.app/news/e84f93bf4a4c3d451282614323ccc7942d0e5250_q90_900x900.jpeg' },
  { id: 104, title: "Fable", release: "2025", score: 91,
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1085660/header.jpg' },
  { id: 105, title: "Doom: The Dark Ages", release: "Mai 2025", score: 90,
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3017860/header.jpg' },
  { id: 106, title: "Hollow Knight: Silksong", release: "TBA", score: 89,
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg' },
  { id: 107, title: "Assassin's Creed Shadows", release: "Nov 2025", score: 87,
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2971380/header.jpg' },
  { id: 108, title: "Death Stranding 2", release: "2025", score: 85,
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1190460/header.jpg' },
];

/* ─── LATEST REVIEW ──────────────────────────────────────────────────────────── */
export const LATEST_REVIEW = {
  id: 110, tag: 'TEST', tagColor: '#e8001c',
  title: "Elden Ring Nightreign — Notre test complet : FromSoftware réinvente le roguelite avec une maestria absolue",
  excerpt: "Co-op de 3 joueurs, runs roguelite de 2 heures, boss colossaux et carte qui change à chaque partie. On a passé 60 heures sur le jeu le plus ambitieux de FromSoftware, et on ressort bluffé. Notre verdict.",
  image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2622380/ss_0c36b7f49714a2a6ada71d0c0c7e42f8bf70fd54.1920x1080.jpg',
  score: '18/20', scoreColor: '#e8001c',
  author: 'Réda B.', time: 'Il y a 2h', views: '112 K',
  pros: ["Boucle de gameplay addictive", "Direction artistique de génie", "Co-op sans friction"],
  cons: ["Solo moins riche", "Quelques bugs réseaux"],
  supportingReviews: [
    { id: 111, title: "Monster Hunter Wilds", score: '16/20', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2246340/header.jpg', tag: 'TEST', tagColor: '#f59e0b' },
    { id: 112, title: "Avowed", score: '15/20', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2457220/header.jpg', tag: 'TEST', tagColor: '#10b981' },
    { id: 113, title: "Doom: The Dark Ages", score: '17/20', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3017860/header.jpg', tag: 'TEST', tagColor: '#e8001c' },
  ],
};

/* ─── POPULAR GAMES ──────────────────────────────────────────────────────────── */
export const POPULAR_GAMES = [
  { id: 120, title: "Elden Ring", players: "12,4 M", trend: '+8%',
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg' },
  { id: 121, title: "Baldur's Gate 3", players: "9,8 M", trend: '+3%',
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg' },
  { id: 122, title: "Cyberpunk 2077", players: "8,2 M", trend: '+12%',
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg' },
  { id: 123, title: "Red Dead Redemption 2", players: "7,1 M", trend: '+1%',
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg' },
  { id: 124, title: "God of War", players: "6,7 M", trend: '+5%',
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg' },
  { id: 125, title: "Hades", players: "5,9 M", trend: '+22%',
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145360/header.jpg' },
  { id: 126, title: "Monster Hunter Wilds", players: "5,2 M", trend: '+45%',
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2246340/header.jpg' },
  { id: 127, title: "Control", players: "4,8 M", trend: '+7%',
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/870780/header.jpg' },
  { id: 128, title: "Death Stranding", players: "4,2 M", trend: '+2%',
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1190460/header.jpg' },
];

/* ─── GENERAL ARTICLES ───────────────────────────────────────────────────────── */
export const GENERAL_ARTICLES = [
  { id: 130, tag: 'DOSSIER', tagColor: '#e8001c',
    title: "Les 50 meilleurs jeux de la décennie : notre classement définitif",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
    author: 'Rédaction', time: 'Il y a 1h', views: '340 K' },
  { id: 131, tag: 'GUIDE', tagColor: '#10b981',
    title: "Comment optimiser son PC pour les jeux en 4K en 2025",
    image: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/graphic-cards/50-series/rtx-5090/geforce-rtx-50-series-exploded-view-video-ari.jpg',
    author: 'Pierre G.', time: 'Il y a 2h', views: '189 K' },
  { id: 132, tag: 'NEWS', tagColor: '#3b82f6',
    title: "Xbox Game Pass Ultimate : tous les jeux ajoutés en mai 2025",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg',
    author: 'Marc R.', time: 'Il y a 3h', views: '234 K' },
  { id: 133, tag: 'TEST', tagColor: '#f59e0b',
    title: "Hollow Knight Silksong — nos 4 heures de jeu, impressions exclusives",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg',
    author: 'Julie T.', time: 'Il y a 4h', views: '456 K' },
  { id: 134, tag: 'DOSSIER', tagColor: '#8b5cf6',
    title: "Histoire du jeu vidéo : les 10 moments qui ont tout changé",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg',
    author: 'Alex M.', time: 'Il y a 5h', views: '178 K' },
  { id: 135, tag: 'NEWS', tagColor: '#ec4899',
    title: "Steam Deck 2 : Valve confirme le successeur avec OLED 90Hz",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg',
    author: 'Tom B.', time: 'Il y a 6h', views: '521 K' },
  { id: 136, tag: 'GUIDE', tagColor: '#06b6d4',
    title: "Meilleure config gaming 2025 pour 800€ : notre sélection testée",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
    author: 'Nora S.', time: 'Il y a 7h', views: '312 K' },
  { id: 137, tag: 'PREVIEW', tagColor: '#16a34a',
    title: "Indiana Jones : notre preview après 3h de jeu — du génie ?",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/870780/header.jpg',
    author: 'Karim D.', time: 'Il y a 8h', views: '267 K' },
];

/* ─── JVTECH ARTICLES ────────────────────────────────────────────────────────── */
export const JVTECH_ARTICLES = [
  { id: 140, tag: 'TEST', tagColor: '#3b82f6',
    title: "Intel Core Ultra 9 285K — le meilleur processeur gaming de 2025 ?",
    image: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/graphic-cards/50-series/rtx-5090/geforce-rtx-50-series-exploded-view-video-ari.jpg',
    author: 'Pierre G.', time: 'Il y a 1h', views: '98 K', score: '16/20',
    excerpt: "Arrow Lake s'améliore significativement. Notre analyse complète des benchmarks sur 30 jeux.", featured: true },
  { id: 141, tag: 'COMPARATIF', tagColor: '#06b6d4',
    title: "RTX 5080 vs RX 9070 XT : duel au sommet en 4K gaming",
    image: 'https://sonyinteractive.com/tachyon/2024/09/SIE_PS5-Pro.jpg',
    author: 'Tom B.', time: 'Il y a 3h', views: '134 K' },
  { id: 142, tag: 'GUIDE', tagColor: '#10b981',
    title: "Setup gaming 2025 : les composants indispensables pour chaque budget",
    image: 'https://assets2.razerzone.com/images/pnx.assets/16eac26cd230ce343f56af70ec49626a/razer-blackshark-v2-pro-black-2023-500x500.webp',
    author: 'Nora S.', time: 'Il y a 4h', views: '234 K' },
  { id: 143, tag: 'NEWS', tagColor: '#8b5cf6',
    title: "DDR6 : les premières specs officielles sont là — doublement des vitesses",
    image: 'https://image.samsung.com/us/computing/memory-storage/all-memory-storage/all-memory-storage/MZ-V8P2T0B/AM/MZ-V8P2T0B-AM-dynamic2-black-bg-zoom.jpg',
    author: 'Alex K.', time: 'Il y a 5h', views: '187 K' },
];

/* ─── BUYING GUIDES ──────────────────────────────────────────────────────────── */
export const BUYING_GUIDES = [
  { id: 150, tag: 'GUIDE ACHAT', tagColor: '#f59e0b',
    title: "Meilleure carte graphique 2025 : notre sélection de la RTX 4060 à la RTX 5090",
    image: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/graphic-cards/50-series/rtx-5090/geforce-rtx-50-series-exploded-view-video-ari.jpg',
    subtitle: 'GPU', icon: '🎮', featured: true,
    excerpt: "Du petit budget à l'ultra-haut de gamme, on a testé 12 cartes pour trouver le meilleur rapport prix/performances." },
  { id: 151, tag: 'GUIDE ACHAT', tagColor: '#3b82f6',
    title: "Meilleur PC gamer complet 2025 : les 7 meilleures configs testées",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1093600/header.jpg',
    subtitle: 'PC Gaming', icon: '🖥️' },
  { id: 152, tag: 'GUIDE ACHAT', tagColor: '#10b981',
    title: "Meilleur moniteur gaming 2025 : OLED, IPS ou VA — notre comparatif",
    image: 'https://dlcdnwebimgs.asus.com/gain/49E5EF1C-7E28-4A3F-A44E-6FB6B67DC9D9/w717/h525',
    subtitle: 'Écrans', icon: '🖥' },
  { id: 153, tag: 'GUIDE ACHAT', tagColor: '#e8001c',
    title: "Meilleure console 2025 : PS5 Pro, Xbox Series X ou Switch 2 ?",
    image: 'https://sonyinteractive.com/tachyon/2024/09/SIE_PS5-Pro.jpg',
    subtitle: 'Consoles', icon: '🎮' },
  { id: 154, tag: 'GUIDE ACHAT', tagColor: '#8b5cf6',
    title: "Meilleur casque gaming 2025 : notre top 10 après 200 heures de tests",
    image: 'https://assets2.razerzone.com/images/pnx.assets/16eac26cd230ce343f56af70ec49626a/razer-blackshark-v2-pro-black-2023-500x500.webp',
    subtitle: 'Audio', icon: '🎧' },
];

/* ─── VIDEO OF THE MOMENT ────────────────────────────────────────────────────── */
export const VIDEO_OF_MOMENT = {
  id: 160,
  title: "GTA VI — Trailer 2 Officiel : analyse complète plan par plan",
  description: "On décortique les 4 minutes du trailer 2 de GTA VI : nouvelles zones, personnages, mécaniques et Easter eggs. Tout ce que vous avez manqué dans la bande-annonce la plus attendue de l'histoire du jeu vidéo.",
  duration: "24:18", views: "4,2 M", likes: "312 K",
  image: 'https://www.gtabase.com/igallery/gta-6-screens/postcard-vicecity-1080.jpg',
  channel: 'GNEWZ TV', channelAvatar: 'G',
  relatedVideos: [
    { id: 161, title: "Elden Ring Nightreign — Gameplay 4K 60fps", duration: "18:42", views: "890 K",
      image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2622380/header.jpg' },
    { id: 162, title: "Switch 2 : test complet après 40h de jeu", duration: "31:05", views: "1,1 M",
      image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145360/header.jpg' },
    { id: 163, title: "RTX 5090 : benchmarks 4K dans 25 jeux", duration: "22:33", views: "654 K",
      image: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/graphic-cards/50-series/rtx-5090/geforce-rtx-50-series-exploded-view-video-ari.jpg' },
    { id: 164, title: "The Witcher 4 : analyse du trailer", duration: "15:17", views: "432 K",
      image: 'https://press.cdn.cdpr.app/news/e84f93bf4a4c3d451282614323ccc7942d0e5250_q90_900x900.jpeg' },
  ],
};

/* ─── SHOWS ──────────────────────────────────────────────────────────────────── */
export const SHOWS = [
  { id: 170, title: "JV Le Podcast", episode: "Épisode 312",
    description: "GTA VI, Elden Ring Nightreign, Nintendo Switch 2 — le récap de la semaine en 90 minutes",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2622380/header.jpg',
    duration: "1h28", date: "17 avr. 2025", featured: true,
    host: 'Réda, Sophie, Karim' },
  { id: 171, title: "Hardware Show", episode: "Épisode 89",
    description: "RTX 5090, DDR6 et setup tour : toute l'actu hardware de la semaine",
    image: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/graphic-cards/50-series/rtx-5090/geforce-rtx-50-series-exploded-view-video-ari.jpg',
    duration: "52 min", date: "15 avr. 2025" },
  { id: 172, title: "Esports Weekly", episode: "Épisode 207",
    description: "T1 vs G2, résultats LEC et transferts — la semaine esport complète",
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/c0ae09d9938a420ee81a25d11cd3e82f2cccaf1e-3840x2160.jpg',
    duration: "45 min", date: "14 avr. 2025" },
  { id: 173, title: "Culture Geek", episode: "Épisode 156",
    description: "Fallout S2, The Last of Us, films d'animation et manga — la culture de la semaine",
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1151340/header.jpg',
    duration: "1h05", date: "13 avr. 2025" },
];

/* ─── FORUMS ─────────────────────────────────────────────────────────────────── */
export const FORUMS = {
  tabs: ['Gaming', 'Hardware', 'Esports', 'Culture', 'Aide'],
  threads: [
    { id: 180, category: 'Gaming', title: "GTA VI : vos prédictions sur la date de sortie exacte ?",
      author: 'GamerXL', replies: 1247, views: '89 K', time: 'Il y a 12 min', hot: true,
      avatar: 'G' },
    { id: 181, category: 'Hardware', title: "RTX 5090 — vaut-elle vraiment son prix de 2299€ ?",
      author: 'TechMaster', replies: 892, views: '54 K', time: 'Il y a 34 min', hot: true,
      avatar: 'T' },
    { id: 182, category: 'Gaming', title: "Vos jeux préférés de 2025 — le bilan à mi-année",
      author: 'JVFan2025', replies: 634, views: '41 K', time: 'Il y a 1h',
      avatar: 'J' },
    { id: 183, category: 'Esports', title: "T1 peut-il gagner les Worlds 2025 avec ce roster ?",
      author: 'FakerFanatic', replies: 567, views: '38 K', time: 'Il y a 2h',
      avatar: 'F' },
    { id: 184, category: 'Culture', title: "Fallout S2 vs The Last of Us S2 : laquelle est meilleure ?",
      author: 'SerieAddict', replies: 445, views: '29 K', time: 'Il y a 3h',
      avatar: 'S' },
    { id: 185, category: 'Aide', title: "Problème de lag sur PS5 en WiFi — solutions ?",
      author: 'NoobGamer', replies: 89, views: '12 K', time: 'Il y a 4h',
      avatar: 'N' },
  ],
};

export const NAV_CATS = [
  { label: t('nav.home'),     to:  '/'  },
    { label: t('nav.gaming'),   to: `/gaming` },
    { label: t('nav.hardware'), to: `/hardware` },
    { label: t('nav.culture'),  to: `/culture` },
    { label: t('nav.esports'),  to: `/esports` },

];
