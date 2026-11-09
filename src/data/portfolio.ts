import { MEDIA, type MediaKey } from "./media";

export const identity = {
  name: "ONESIM GRAÇA",
  fullName: "Graça Onesim Géraldo Ema-ayé",
  role: "Développeur Web Full Stack",
  badge: "Développeur web Junior · Full Stack",
  location: "Cotonou, Bénin",
  tagline: "Je donne vie aux idées à travers le code et la créativité.",
  presentation:
    "Développeur web Junior, passionné par la conception d'expériences numériques et la création de solutions innovantes.",
  aboutTitle: "Derrière chaque projet, une vision.",
  aboutText:
    "Je suis Onesim Graça, développeur web animé par la passion de la technologie, du design et de la création numérique. J'aime transformer des idées en expériences concrètes, concevoir des interfaces modernes et développer des solutions qui répondent à des besoins réels. Chaque projet représente une nouvelle occasion d'apprendre, d'expérimenter et de construire.",
  projectsTitle: "Un aperçu de mon univers.",
  projectsSubtitle: "Des idées, des expériences et des projets construits avec passion.",
  contactTitle: "Et si on construisait quelque chose ensemble ?",
  footerTagline: "Concevoir. Développer. Construire.",
  portrait: MEDIA.portrait,
  desk: MEDIA.desk,
};

export const navItems = [
  { n: "01", label: "Accueil", href: "#top" },
  { n: "02", label: "À propos", href: "#apropos" },
  { n: "03", label: "Mes projets", href: "#projets" },
  { n: "04", label: "Collaborations", href: "#collaborations" },
  { n: "05", label: "Technologies", href: "#technologies" },
  { n: "06", label: "Contact", href: "#contact" },
];

export const education = [
  {
    code: "01",
    period: "Octobre 2025 – Novembre 2026",
    title: "Développeur Web Full Stack",
    school: "FuturCraft Institut",
    detail: "1ère Année Achevée — Conception d'interfaces modernes, architecture API REST, bases de données et projets collaboratifs.",
  },
  {
    code: "02",
    period: "2022 – 2023",
    title: "Baccalauréat Série B – Économie",
    school: "CSP Mercur, Agla",
    detail: "Formation secondaire générale en sciences économiques et sociales.",
  },
];

export type ProjectStatus = "Terminé" | "En cours" | "Concept";

export interface PortfolioProject {
  id: string;
  number: string;
  name: string;
  category: "personal" | "collab";
  categoryLabel: string;
  status: ProjectStatus;
  description: string;
  longDescription: string;
  role: string;
  technologies: string[];
  image: string;
  mediaKey: MediaKey;
  liveUrl?: string;
  githubUrl?: string;
  /** Largeur sur la grille éditoriale 12 colonnes (7 = large, 5 = portrait/compact, 12 = panoramique). */
  span: 5 | 7 | 12;
  aspect: "wide" | "tall" | "cinema";
}

export const projects: PortfolioProject[] = [
  {
    id: "employra-rh",
    number: "01",
    name: "Employra RH",
    category: "personal",
    categoryLabel: "SaaS RH & Paie",
    status: "En cours",
    description: "Solution SaaS de gestion des ressources humaines et de la paie.",
    longDescription:
      "Plateforme SaaS tout-en-un pensée pour moderniser la gestion des ressources humaines : dossiers employés, calcul de la paie multi-devises, suivi des présences, gestion des talents et espace collaboratif au sein d'une application web progressive.",
    role: "Conception produit, architecture Full-Stack & développement (projet personnel)",
    technologies: ["React", "TypeScript", "NestJS", "Node.js", "PostgreSQL", "API-REST", "Authentification"],
    image: MEDIA.employra,
    mediaKey: "employra",
    liveUrl: "https://employra.vercel.app",
    githubUrl: "https://github.com/MrOnesim/EmployraRH",
    span: 7,
    aspect: "wide",
  },
  {
    id: "ocd",
    number: "02",
    name: "OCD",
    category: "personal",
    categoryLabel: "Plateforme & Visibilité",
    status: "Terminé",
    description:
      "Plateforme de promotion commerciale, de publicité et de visibilité des entrepreneurs à travers les réseaux sociaux.",
    longDescription:
      "Dispositif digital conçu pour rapprocher les entrepreneurs, commerçants et artisans des consommateurs grâce aux émissions en direct (Lives), à la mise en scène produit et à des formules de visibilité accessibles.",
    role: "Conception UX/UI, direction visuelle & développement Front-End (projet personnel)",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Lenis", "Lucide React"],
    image: MEDIA.ocd,
    mediaKey: "ocd",
    liveUrl: "https://ocd-bovan.vercel.app",
    githubUrl: "https://github.com/MrOnesim/bovan-platform-technical-specifications",
    span: 5,
    aspect: "tall",
  },
  {
    id: "gen3rvto",
    number: "03",
    name: "GEN3RVTO",
    category: "personal",
    categoryLabel: "Musique & Culture Urbaine",
    status: "Terminé",
    description: "Projet digital consacré à l'univers musical, au rap et à la culture urbaine.",
    longDescription:
      "Site officiel et univers visuel immersif consacrés au rap et à la culture urbaine : mise en avant des sorties musicales, galerie visuelle, identité graphique forte et accès direct au booking.",
    role: "Direction artistique & développement Front-End complet (projet personnel)",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion"],
    image: MEDIA.gen3rvto,
    mediaKey: "gen3rvto",
    liveUrl: "https://gen3rvto.vercel.app",
    githubUrl: "https://github.com/MrOnesim/gen3rvto",
    span: 5,
    aspect: "tall",
  },
  {
    id: "clinique-kpondehou",
    number: "04",
    name: "Clinique Kpondéhou",
    category: "personal",
    categoryLabel: "Santé & Gestion Clinique",
    status: "Terminé",
    description: "Projet de solution numérique pour la gestion d'une clinique.",
    longDescription:
      "Système de gestion médicale dédié à la Clinique Médicale Kpondéhou : authentification sécurisée du personnel, suivi des patients, organisation des consultations et centralisation des opérations quotidiennes.",
    role: "Conception & développement Full-Stack de l'application (projet personnel)",
    technologies: ["React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Authentification", "API-REST"],
    image: MEDIA.kpondehou,
    mediaKey: "kpondehou",
    liveUrl: "https://clinique-kpondehou.vercel.app",
    githubUrl: "https://github.com/MrOnesim/ai-healthcare-patient-portal",
    span: 12,
    aspect: "cinema",
  },
  {
    id: "hadibaba",
    number: "05",
    name: "HADIBABA",
    category: "personal",
    categoryLabel: "Marketplace & E-Commerce",
    status: "En cours",
    description: "Concept de marketplace destiné au commerce et aux échanges.",
    longDescription:
      "Conception d'une place de marché moderne permettant aux commerçants et particuliers de publier leurs offres, gérer leur catalogue et échanger directement avec les acheteurs dans une interface fluide.",
    role: "Conception produit, modélisation des données & développement (projet personnel)",
    technologies: ["React", "TypeScript", "Node.js", "MySQL", "API-REST", "Tailwind CSS"],
    image: MEDIA.hadibaba,
    mediaKey: "hadibaba",
    githubUrl: "https://github.com/MrOnesim/b-nin-supermarch",
    span: 5,
    aspect: "tall",
  },
  {
    id: "afrique-novatech",
    number: "06",
    name: "Afrique NovaTech",
    category: "personal",
    categoryLabel: "Studio & Solutions Digitales",
    status: "Terminé",
    description: "Projet de conception de solutions technologiques et numériques.",
    longDescription:
      "Vitrine d'un studio digital nouvelle génération à Cotonou : présentation des services de création web, méthode d'accompagnement, réalisations, grille tarifaire et demande de devis en ligne.",
    role: "Conception de l'identité, design d'interface & développement (projet personnel)",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Vercel"],
    image: MEDIA.novatech,
    mediaKey: "novatech",
    liveUrl: "https://afrique-novatech.vercel.app",
    githubUrl: "https://github.com/MrOnesim/Afrique-NovaTech",
    span: 7,
    aspect: "wide",
  },
  {
    id: "nounagnon-cyberlens",
    number: "07",
    name: "Nounagnon-Cyberlens",
    category: "personal",
    categoryLabel: "Portfolio Vidéaste & Photo",
    status: "Terminé",
    description: "Site vitrine professionnel pour un vidéaste et photographe.",
    longDescription:
      "Espace éditorial sur mesure mettant en scène le travail d'un photographe, vidéaste, graphiste et monteur vidéo : galeries visuelles, présentation des prestations et réservation directe.",
    role: "Conception visuelle & développement Front-End (projet personnel)",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "GSAP"],
    image: MEDIA.nounagnon,
    mediaKey: "nounagnon",
    liveUrl: "https://nounagnon-cyberlens.vercel.app",
    span: 7,
    aspect: "wide",
  },
  {
    id: "ong-cipbg-afrique",
    number: "08",
    name: "ONG-CIPBG-Afrique",
    category: "personal",
    categoryLabel: "Site Institutionnel ONG",
    status: "Terminé",
    description: "Site vitrine institutionnel de l'organisation.",
    longDescription:
      "Site officiel du Cercle International pour la Paix et la Bonne Gouvernance en Afrique (CIPBG-Afrique) : présentation des missions, actions de terrain, actualités, ressources documentaires et engagement citoyen.",
    role: "Conception & développement complet du site institutionnel (projet personnel)",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Vercel"],
    image: MEDIA.cipbg,
    mediaKey: "cipbg",
    liveUrl: "https://ong-cipbg-afrique.vercel.app",
    githubUrl: "https://github.com/MrOnesim/ONG-CIPBG-Afrique",
    span: 5,
    aspect: "tall",
  },
  {
    id: "global-business-center",
    number: "10",
    name: "Global Business Center",
    category: "personal",
    categoryLabel: "Recrutement & Services",
    status: "Terminé",
    description: "Plateforme de recrutement de personnel domestique et de services de proximité.",
    longDescription:
      "Site institutionnel de Global Business Center : mise en relation entre familles et professionnels qualifiés (aides ménagères, nounous, cuisinières, chauffeurs, gardiens), présentation des prestations, prise de rendez-vous en ligne, espace FAQ et actualités.",
    role: "Conception & développement complet du site vitrine (projet personnel)",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vercel"],
    image: MEDIA.gbc,
    mediaKey: "gbc",
    liveUrl: "https://global-business-center.vercel.app",
    span: 7,
    aspect: "wide",
  },
  {
    id: "futurcraft-institut",
    number: "01",
    name: "FuturCraft Institut",
    category: "collab",
    categoryLabel: "Collaboration · Centre de formation",
    status: "Terminé",
    description: "Participation à la création du site vitrine du centre de formation.",
    longDescription:
      "Projet collectif mené au sein de FuturCraft Institut pour présenter les filières de formation aux métiers du numérique, la vie de campus à Cotonou, les projets d'apprenants et le parcours d'admission.",
    role: "Contribution en équipe : intégration de sections Front-End, composants responsives et cohérence visuelle (projet collectif)",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Git", "GitHub", "Vercel"],
    image: MEDIA.futurcraft,
    mediaKey: "futurcraft",
    liveUrl: "https://futurcraft-institut.vercel.app",
    githubUrl: "https://github.com/MrOnesim/FuturCraft-Institut",
    span: 7,
    aspect: "wide",
  },
  {
    id: "vano-baby",
    number: "02",
    name: "Vano Baby",
    category: "collab",
    categoryLabel: "Challenge · FuturCraft Institut",
    status: "Terminé",
    description:
      "Participation à la réalisation d'un site web dans le cadre d'un challenge organisé au centre de formation.",
    longDescription:
      "Site événementiel « 10 Ans de Règne » dédié à l'artiste Vano Baby, réalisé en équipe lors d'un challenge pratique à FuturCraft Institut : biographie, discographie, vidéos, concerts et univers visuel.",
    role: "Participation en équipe au challenge : intégration de l'interface, mise en page responsive et animations (travail collectif)",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "Git"],
    image: MEDIA.vanobaby,
    mediaKey: "vanobaby",
    liveUrl: "https://vanobaby-pi.vercel.app",
    span: 5,
    aspect: "tall",
  },
  {
    id: "connex-don",
    number: "03",
    name: "Connex & Don",
    category: "collab",
    categoryLabel: "Challenge · Promotion d'artistes",
    status: "Concept",
    description:
      "Participation à la conception et au développement d'un site web dédié à la présentation et à la promotion d'artistes, dans le cadre d'un challenge organisé à FuturCraft Institut.",
    longDescription:
      "Plateforme imaginée en équipe lors d'un challenge à FuturCraft Institut pour offrir une vitrine aux artistes émergents, présenter leurs œuvres et faciliter le soutien du public.",
    role: "Participation collective : co-conception des pages artistes et développement de composants UI pendant le challenge",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Git", "GitHub"],
    image: MEDIA.connexdon,
    mediaKey: "connexdon",
    span: 12,
    aspect: "cinema",
  },
  {
    id: "ong-cdacs",
    number: "04",
    name: "ONG-CDACS",
    category: "collab",
    categoryLabel: "Collaboration · ONG",
    status: "Terminé",
    description: "Participation à la création du site vitrine institutionnel de l'ONG CDACS.",
    longDescription:
      "Projet collectif mené avec Ange Akonde pour présenter les missions, actions de terrain, actualités, ressources documentaires et engagement citoyen de l'ONG CDACS.",
    role: "Contribution en équipe : intégration de sections Front-End, composants responsives et cohérence visuelle (projet collectif)",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Git", "GitHub", "Vercel"],
    image: MEDIA.cdacs,
    mediaKey: "cdacs",
    liveUrl: "https://ong-cdacs.vercel.app",
    githubUrl: "https://github.com/ange918/ong-cdacs",
    span: 7,
    aspect: "wide",
  },
];

export const stackUniverses = [
  {
    id: "frontend",
    number: "01",
    shortTitle: "Front-End",
    genre: "Interfaces & Expériences",
    title: "Front-End & Motion",
    description:
      "Concevoir des interfaces réactives, accessibles et fluides où chaque transition accompagne la lecture sans jamais l'alourdir.",
    tags: ["UI Moderne", "Animations", " Typage strict"],
    items: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
      "Lenis",
      "Lucide React",
    ],
    image: MEDIA.nounagnon,
  },
  {
    id: "backend",
    number: "02",
    shortTitle: "Back-End",
    genre: "Logique métier & Services",
    title: "Back-End & API-REST",
    description:
      "Structurer des architectures serveur modulaires, propres et maintenables pour alimenter des applications web complètes.",
    tags: ["Architecture", "REST", "Serveur"],
    items: ["PHP", "Node.js", "NestJS", "API-REST"],
    image: MEDIA.architect,
  },
  {
    id: "database",
    number: "03",
    shortTitle: "Données & Auth",
    genre: "Persistance & Sécurité",
    title: "Bases de données & Auth",
    description:
      "Modéliser des schémas relationnels fiables, gérer les sessions utilisateurs et sécuriser les accès aux données sensibles.",
    tags: ["SQL", "Cloud DB", "Sécurité"],
    items: ["MySQL", "PostgreSQL", "Supabase", "Neon", "Authentification"],
    image: MEDIA.kpondehou,
  },
  {
    id: "devops",
    number: "04",
    shortTitle: "Outils & Cloud",
    genre: "Versioning & Mise en ligne",
    title: "Outils & Déploiement",
    description:
      "Travailler proprement en équipe avec Git et déployer des applications rapides et disponibles sur des infrastructures modernes.",
    tags: ["Git", "CI/CD", "Hébergement"],
    items: ["Git", "GitHub", "Vercel", "Netlify", "Hostinger"],
    image: MEDIA.desk,
  },
];

export const allTechnologies = [
  "React",
  "TypeScript",
  "Vite",
  "Tailwind CSS",
  "Framer Motion",
  "GSAP",
  "Lenis",
  "Lucide React",
  "PHP",
  "NodeJS",
  "NestJS",
  "API-REST",
  "MySQL",
  "Postgres",
  "Supabase",
  "Neon",
  "Authentification",
  "Git",
  "GitHub",
  "Vercel",
  "Netlify",
  "Hostinger",
];

export const contactChannels = [
  {
    id: "github",
    label: "GitHub",
    handle: "github.com/MrOnesim",
    href: "https://github.com/MrOnesim",
    note: "Dépôts, code source & contributions",
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "Onesim Graça",
    href: "https://www.facebook.com/share/1E3rdKTXov/?mibextid=wwXIfr",
    note: "Actualités & prise de contact sur Facebook",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    handle: "+229 01 41 96 92 08",
    href: "https://wa.me/2290141969208",
    note: "Échange direct et rapide sur WhatsApp",
  },
  {
    id: "email",
    label: "Adresse e-mail",
    handle: "gracaonesim@gmail.com",
    href: "mailto:gracaonesim@gmail.com",
    note: "Pour les propositions de projet et collaborations",
  },
];
