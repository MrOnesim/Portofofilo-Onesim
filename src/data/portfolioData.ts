export interface Project {
  id: string;
  title: string;
  category: "Client Work" | "Lab & Experiments" | "Featured";
  description: string;
  longDescription: string;
  technologies: string[];
  images: string[];
  projectUrl: string;
  githubUrl?: string;
  year: string;
  awards?: string[];
  color: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface SkillCategory {
  category: string;
  items: { name: string; level: number; color: string }[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const PROJECTS_DATA: Project[] = [
  {
    id: "gen3rvto",
    title: "GEN3RVTO",
    category: "Client Work",
    description: "Site officiel d'artiste avec une identite visuelle unique et une experience immersive.",
    longDescription: "Site web officiel pour l'artiste GEN3RVTO, concu pour refleter son univers creatif. Interface moderne avec presentation des oeuvres, galerie multimedia, calendrier d'evenements et boutique integree.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "Framer Motion"],
    images: ["/images/GEN3RVTO.png"],
    projectUrl: "https://gen3rvto.vercel.app",
    year: "2025",
    color: "#a855f7"
  },
  {
    id: "ayiha-boost",
    title: "Ayiha-Boost",
    category: "Client Work",
    description: "Plateforme web associative pour la gestion et la promotion d'activites communautaires.",
    longDescription: "Ayiha-Boost est une plateforme dediee a une association, permettant la gestion des membres, la publication d'evenements, le suivi des projets collaboratifs et la communication interne. L'objectif est de faciliter l'engagement communautaire et la coordination des benevoles.",
    technologies: ["React", "TypeScript", "NestJS", "PostgreSQL", "Tailwind CSS"],
    images: ["/images/AYIHA-Boost.png"],
    projectUrl: "https://ayiha-psi.vercel.app",
    year: "2025",
    color: "#10b981"
  },
  {
    id: "vano-baby",
    title: "Vano-Baby",
    category: "Lab & Experiments",
    description: "Site officiel de Vano-Baby, projet realise durant la formation Full-Stack.",
    longDescription: "Site web officiel pour la marque Vano-Baby, developpe dans le cadre de la formation Full-Stack. Projet d'application des competences en developpement web moderne : interface responsive, composants reutilisables et bonnes pratiques.",
    technologies: ["React", "JavaScript", "CSS", "HTML"],
    images: ["/images/Vano-Baby.png"],
    projectUrl: "https://vanobaby-pi.vercel.app",
    year: "2025",
    color: "#ec4899"
  },
  {
    id: "ubiri",
    title: "Ubiri",
    category: "Featured",
    description: "Plateforme web innovante offrant des solutions numeriques modernes et intuitives.",
    longDescription: "Ubiri est une plateforme web concue pour offrir des solutions numeriques modernes et intuitives. Le projet met l'accent sur la performance, l'experience utilisateur et l'accessibilite, en utilisant les meilleures pratiques du developpement web contemporain.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    images: ["/images/Ubiri.png"],
    projectUrl: "https://ubiri-nine.vercel.app",
    githubUrl: "https://github.com/MrOnesim/ubiri",
    year: "2025",
    color: "#f59e0b"
  },
  {
    id: "ong-cdacs",
    title: "ONG CDACS",
    category: "Client Work",
    description: "Site web institutionnel pour l'ONG CDACS, presentant ses missions, projets et actions humanitaires.",
    longDescription: "Site web institutionnel pour l'ONG CDACS (Centre de Developpement des Actions Communautaires et Sociales). La plateforme presente les missions de l'organisation, ses projets en cours, ses actions humanitaires et permet aux visiteurs de s'informer et de soutenir les initiatives.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    images: ["/images/C-DACS-ong.png"],
    projectUrl: "https://ong-cdacs.vercel.app",
    year: "2025",
    color: "#06b6d4"
  }
];

export const EXPERIENCE_DATA: Experience[] = [
  {
    id: "exp-stage",
    role: "Developpeur Full-Stack Stagiaire",
    company: "Programme Futur",
    period: "2025",
    description: "Participation au developpement de solutions web et montee en competences Full-Stack au sein d'une equipe dynamique.",
    achievements: [
      "Contribution au developpement de fonctionnalites back-end et front-end",
      "Travail sur des projets concrets avec des technologies modernes",
      "Collaboration en equipe avec utilisation de Git et GitHub"
    ]
  },
  {
    id: "exp-formation",
    role: "Formation Developpeur Full-Stack",
    company: "FuturCraft Institut",
    period: "2025",
    description: "Formation intensive au developpement web full-stack couvrant les technologies front-end et back-end modernes.",
    achievements: [
      "Acquisition de competences en HTML, CSS, JavaScript, React, TypeScript",
      "Maitrise de Git, GitHub, API REST, Tailwind CSS et NestJS",
      "Realisation de projets pratiques dont Vano-Baby et Ayiha-Boost"
    ]
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    category: "Front-End",
    items: [
      { name: "HTML", level: 90, color: "#e34f26" },
      { name: "CSS", level: 85, color: "#1572b6" },
      { name: "Tailwind CSS", level: 85, color: "#38bdf8" },
      { name: "JavaScript", level: 80, color: "#f7df1e" },
      { name: "TypeScript", level: 75, color: "#3178c6" },
      { name: "React", level: 80, color: "#61dafb" },
      { name: "Three.js", level: 55, color: "#049ef4" },
      { name: "Next.js", level: 70, color: "#000000" },
      { name: "Vite", level: 75, color: "#646cff" },
      { name: "Responsive Design", level: 85, color: "#10b981" }
    ]
  },
  {
    category: "Back-End",
    items: [
      { name: "NestJS", level: 70, color: "#e0234e" },
      { name: "Node.js", level: 75, color: "#339933" },
      { name: "Prisma", level: 70, color: "#2d3748" },
      { name: "PostgreSQL", level: 70, color: "#4169e1" },
      { name: "REST API", level: 80, color: "#ff6c37" },
      { name: "JWT", level: 75, color: "#000000" },
      { name: "Better Auth", level: 70, color: "#e11d48" }
    ]
  },
  {
    category: "DevOps & Outils",
    items: [
      { name: "Git", level: 80, color: "#f05032" },
      { name: "GitHub", level: 80, color: "#181717" },
      { name: "Vercel", level: 75, color: "#000000" },
      { name: "Docker", level: 30, color: "#2496ed" },
      { name: "CI/CD", level: 30, color: "#00c7b7" }
    ]
  },
  {
    category: "Design & Productivite",
    items: [
      { name: "VS Code", level: 90, color: "#007acc" },
      { name: "Figma", level: 65, color: "#f24e1e" },
      { name: "Canva", level: 70, color: "#00c4cc" },
      { name: "Postman", level: 70, color: "#ff6c37" }
    ]
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "test-1",
    name: "Encadreur Programme Futur",
    role: "Superviseur de stage",
    content: "Onesim a fait preuve d'une grande capacite d'adaptation et d'une volonte d'apprentissage remarquable. Son implication dans les projets et sa rigueur technique sont des atouts precieux.",
    avatar: ""
  },
  {
    id: "test-2",
    name: "Formateur FuturCraft",
    role: "Formateur Full-Stack",
    content: "Un etudiant motive qui a su rapidement monter en competence. Ses projets temoignent de sa capacite a concevoir des solutions completes et fonctionnelles.",
    avatar: ""
  },
  {
    id: "test-3",
    name: "Ange Akonde",
    role: "Développeur Web & Partenaire",
    content: "Collaborer avec Onesim sur le projet ONG CDACS a ete une experience enrichissante. Sa maitrise technique et sa vision produit ont permis de livrer une solution fiable et impactante pour notre client.",
    avatar: ""
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Comment construire un SaaS RH avec Next.js et NestJS",
    excerpt: "Retour d'experience sur le developpement d'une plateforme SaaS, de la conception a la mise en production.",
    content: "Apres plusieurs mois de travail sur une plateforme SaaS, j'aimerais partager les enseignements cles que j'ai tires de cette experience. Le choix de Next.js pour le front-end etait une evidence : ses capacites de rendu hybride offrent une flexibilite incomparable. Pour le back-end, NestJS apporte une architecture modulaire et testable. L'authentification multi-entreprise a ete le defi le plus complexe. La mise en place de JSON Web Tokens avec des claims personnalises a permis de resoudre ce probleme elegantement. La planification en amont est cruciale : un bon schema de base de donnees evite des migrations douloureuses plus tard.",
    date: "2025",
    readTime: "8 min",
    tags: ["Next.js", "NestJS", "SaaS"]
  },
  {
    id: "blog-2",
    title: "Pourquoi choisir NestJS pour votre prochain projet Back-End",
    excerpt: "Les avantages de NestJS pour le developpement d'applications backend robustes et evolutives.",
    content: "NestJS s'est impose comme mon framework back-end de predilection. Ecrit en TypeScript, il garantit une excellente integration avec l'ecosysteme front-end moderne. Son systeme de modules permet de decouper l'application en domaines fonctionnels independants. Le conteneur IoC simplifie la gestion des dependances. NestJS est un choix solide pour des applications backend de taille moyenne a grande, avec une courbe d'apprentissage raisonnable pour des developpeurs familiers avec la programmation modulaire.",
    date: "2025",
    readTime: "5 min",
    tags: ["NestJS", "Backend"]
  },
  {
    id: "blog-3",
    title: "Mon apprentissage chez FuturCraft Institut",
    excerpt: "Parcours, defis et acquis de ma formation intensive au developpement Full-Stack.",
    content: "Ma formation chez FuturCraft Institut a ete un tournant dans ma carriere. Le programme couvrait l'ensemble de la pile web : HTML, CSS, JavaScript, React, TypeScript, Git, API REST, Tailwind CSS et NestJS. Le rythme etait intense mais enrichissant. J'ai acquis une maitrise de React avec les hooks et le Context API, la conception d'API REST avec NestJS et Prisma, l'utilisation professionnelle de Git, et le deploiement sur Vercel. Cette formation m'a donne les bases solides pour continuer a apprendre en autonomie.",
    date: "2025",
    readTime: "6 min",
    tags: ["Formation", "Full-Stack"]
  },
  {
    id: "blog-4",
    title: "Comment organiser un projet React pour qu'il soit maintenable",
    excerpt: "Bonnes pratiques de structure de projet, gestion d'etat et separation des preoccupations.",
    content: "Apres plusieurs projets React, voici les principes que j'applique pour garder une codebase saine. Une structure de dossiers claire (components/, data/, utils/, hooks/) facilite la navigation. Chaque composant a une responsabilite unique. Pour la gestion d'etat, le Context API combine a useReducer suffit pour des applications de taille moyenne. Ecrire des tests pour les cas critiques permet d'eviter des regressions. Une bonne organisation des le debut du projet evite des heures de refactoring.",
    date: "2025",
    readTime: "7 min",
    tags: ["React", "Architecture"]
  },
  {
    id: "blog-5",
    title: "Les erreurs que j'ai commises en tant que developpeur debutant",
    excerpt: "Lecons apprises et conseils pour les aspirants developpeurs qui debutent leur carriere.",
    content: "En tant que jeune developpeur, j'ai commis pas mal d'erreurs. J'ai commence par reinventer la roue au lieu d'utiliser des bibliotheques eprouvees. Je codais vite sans documenter, et quelques semaines plus tard je ne comprenais plus mon propre code. J'ai aussi ignore les tests, ce qui rendait chaque modification risquee. Enfin, j'essayais d'implementer toutes les fonctionnalites d'un coup au lieu de livrer un MVP fonctionnel. Chaque erreur est une lecon : l'important est d'apprendre et de continuer a coder.",
    date: "2025",
    readTime: "4 min",
    tags: ["Developpement", "Carriere"]
  }
];

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/1HkPgBdAkq/?mibextid=wwXIfr",
  github: "https://github.com/MrOnesim",
  twitter: "https://x.com/_onesim",
  email: "mailto:gracaonesim@gmail.com",
  whatsapp: "https://wa.me/24141969208"
};
