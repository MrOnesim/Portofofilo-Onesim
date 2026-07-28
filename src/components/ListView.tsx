import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  PROJECTS_DATA, 
  EXPERIENCE_DATA, 
  SKILLS_DATA, 
  SOCIAL_LINKS,
  TESTIMONIALS_DATA,
  BLOG_POSTS,
  Project,
  BlogPost,
} from "../data/portfolioData";
import { BlogDetail } from "./BlogDetail";
import { 
  Search, 
  Briefcase, 
  Cpu, 
  Mail, 
  Sparkles, 
  Award, 
  Calendar,
  Gamepad2,
  BookOpen,
  Star,
  Send,
  MapPin,
  User,
  MessageCircle,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import sound from "../utils/SoundSystem";
import { sendContactEmail } from "../utils/emailjs";

const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/></svg>
);

interface ListViewProps {
  onSwitchToGame: () => void;
  onOpenProject: (project: Project) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const ListView: React.FC<ListViewProps> = ({ onSwitchToGame, onOpenProject }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  const isDark = darkMode;

  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter(project => {
      const catMap: Record<string, string> = { "Tous": "All", "Featured": "Featured", "Client": "Client Work", "Lab": "Lab & Experiments" };
      const matchesCategory = selectedCategory === "Tous" || project.category === catMap[selectedCategory];
      const matchesSearch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const handleProjectClick = (project: Project) => {
    sound.playClick();
    onOpenProject(project);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const [contactError, setContactError] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const ok = await sendContactEmail(contactForm);
    if (ok) {
      setContactSent(true);
      setContactError(false);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } else {
      setContactError(true);
      setContactSent(false);
    }
    setTimeout(() => { setContactSent(false); setContactError(false); }, 4000);
  };

  const bg = isDark ? "bg-gray-950 text-gray-100" : "bg-[#f7f2ea] text-[#2c2621]";
  const card = isDark ? "bg-gray-900 border-gray-800" : "bg-[#fffcf7] border-[#ebdccb]";
  const cardHover = isDark ? "hover:border-blue-500/40" : "hover:border-[#3b82f6]/40";
  const textPrimary = isDark ? "text-white" : "text-[#231a14]";
  const textSecondary = isDark ? "text-gray-400" : "text-[#6b584a]";
  const textMuted = isDark ? "text-gray-500" : "text-[#8c7460]";
  const textBody = isDark ? "text-gray-300" : "text-[#4a3e35]";
  const border = isDark ? "border-gray-800" : "border-[#ebdccb]";
  const borderLight = isDark ? "border-gray-700" : "border-[#ebdccb]/60";
  const inputBg = isDark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-[#f7f2ea] border-[#ebdccb] text-[#2c2621]";
  const tagBg = isDark ? "bg-gray-800 text-gray-300" : "bg-[#f0ebdf] text-[#4a3e35]";
  const tagBgMuted = isDark ? "bg-gray-800/50 text-gray-500" : "bg-[#ebdccb]/50 text-[#8c7460]";
  const sectionBg = isDark ? "bg-gray-900/50" : "bg-[#f0ebdf]/40";
  const categoryBg = isDark ? "bg-gray-800" : "bg-[#ebdccb]/40";
  const statBg = isDark ? "bg-gray-900" : "bg-[#fffcf7]";

  return (
    <div className={`min-h-screen ${bg} font-sans selection:bg-[#3b82f6] selection:text-white transition-colors duration-300`}>
      {/* HEADER */}
      <header className={`max-w-6xl mx-auto px-4 pt-12 pb-8 border-b ${border}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] rounded-full text-xs font-semibold uppercase tracking-wider">
                Developpeur Full-Stack
              </span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"} font-medium`}>Pret a jouer</span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-serif font-black tracking-tight ${textPrimary} mb-2`}>
              ONESIM
            </h1>
            <p className={`text-lg md:text-xl ${textSecondary} font-medium max-w-xl leading-relaxed`}>
              Je concois des applications web modernes qui resolvent de vrais problemes grace a des technologies robustes et evolutives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { sound.playClick(); setDarkMode(!darkMode); }}
              className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl border ${border} ${isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white text-[#2c2621] hover:bg-[#fcf8f2]"} transition-all active:scale-95 text-sm font-bold`}
              title="Mode sombre"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => { sound.playClick(); onSwitchToGame(); }}
              className="group flex items-center justify-center gap-3 bg-[#3b82f6] text-white hover:bg-[#2563eb] active:scale-95 transition-all px-8 py-5 rounded-2xl shadow-lg hover:shadow-xl shadow-[#3b82f6]/20 font-bold text-lg border-2 border-transparent hover:border-white/10"
            >
              <Gamepad2 className="w-6 h-6 animate-bounce" />
              <span className="flex flex-col items-start leading-none">
                <span className="text-xs text-white/80 font-normal uppercase tracking-wider mb-0.5">Explorer le mode interactif</span>
                <span className="text-base font-black">JOUER EN 3D</span>
              </span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[
            { icon: MapPin, label: "Localisation", value: "France" },
            { icon: Briefcase, label: "Statut", value: "Developpeur Full-Stack" },
            { icon: Cpu, label: "Projets", value: `${PROJECTS_DATA.length}+ Realises` },
            { icon: Award, label: "Formation", value: "FuturCraft Institut" },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className={`${statBg} p-4 rounded-xl border ${border}`}>
              <span className={`text-xs ${textMuted} block font-semibold uppercase mb-1`}>
                <stat.icon className="w-3 h-3 inline mr-1" />
                {stat.label}
              </span>
              <span className={`font-bold text-base ${textPrimary}`}>{stat.value}</span>
            </motion.div>
          ))}
        </motion.div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN: About + Projects */}
          <section className="lg:col-span-8 space-y-12">
            
            {/* ABOUT SECTION */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={`${card} p-6 md:p-8 rounded-2xl border ${border}`}>
              <h2 className={`text-3xl font-serif font-black ${textPrimary} mb-6 flex items-center gap-2`}>
                <User className="w-7 h-7 text-[#3b82f6]" />
                A propos de moi
              </h2>
              
              <div className={`space-y-4 ${textBody} leading-relaxed`}>
                <p>Je suis <strong className={textPrimary}>Graça Onesim Géraldo Ema-ayé</strong>, developpeur Full-Stack passionne par la creation d'applications web modernes et performantes.</p>
                <p>Ma philosophie : transformer des idees en produits numeriques concrets qui apportent une reelle valeur ajoutee. Chaque projet est une opportunite d'apprendre, d'innover et de repousser mes limites.</p>
              </div>

              {/* Timeline */}
              <div className="mt-8">
                <h3 className={`text-lg font-black ${textPrimary} mb-4`}>Mon Parcours</h3>
                <div className="relative border-l-2 border-[#3b82f6]/30 pl-6 space-y-6">
                  {[
                    { year: "2025", title: "Objectif : Creer une entreprise SaaS internationale", desc: "Vision a long terme pour developper des solutions innovantes." },
                    { year: "2025", title: "Developpement de projets personnels", desc: "Employra RH, GEN3RVTO, Ayiha-Boost, Vano-Baby." },
                    { year: "2025", title: "Stage Programme Futur", desc: "Developpeur Full-Stack Stagiaire, participation a des solutions web." },
                    { year: "2025", title: "Formation Full-Stack", desc: "FuturCraft Institut - HTML, CSS, JS, React, Git, API, Tailwind, NestJS." },
                    { year: "2024", title: "Baccalaureat", desc: "Obtention du diplome." }
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#3b82f6] border-2 border-white" />
                      <span className="text-xs font-bold text-[#3b82f6]">{item.year}</span>
                      <h4 className={`text-sm font-bold ${textPrimary}`}>{item.title}</h4>
                      <p className={`text-xs ${textSecondary}`}>{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* PROJECTS */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className={`text-3xl font-serif font-black ${textPrimary} flex items-center gap-2`}>
                  <Sparkles className="w-7 h-7 text-[#3b82f6]" />
                  Projets & Realisations
                </h2>

                <div className={`flex flex-wrap gap-1 ${categoryBg} p-1 rounded-xl`}>
                  {[
                    { label: "Tous", key: "Tous" },
                    { label: "Featured", key: "Featured" },
                    { label: "Client", key: "Client" },
                    { label: "Lab", key: "Lab" }
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => { sound.playClick(); setSelectedCategory(cat.label); }}
                      className={"px-3 py-1.5 rounded-lg text-xs font-bold transition-all " + (selectedCategory === cat.label ? "bg-[#3b82f6] text-white shadow-sm" : `${isDark ? "text-gray-400 hover:bg-gray-700" : "text-[#6b584a] hover:bg-white/50"}`)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative mb-8">
                <Search className={`absolute left-4 top-3.5 w-5 h-5 ${textMuted}`} />
                <input
                  type="text"
                  placeholder="Rechercher un projet, une technologie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full ${card} pl-12 pr-4 py-3.5 rounded-xl border ${border} focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] ${textPrimary} font-medium`}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="absolute right-4 top-4 text-xs font-semibold text-[#3b82f6] hover:underline">Effacer</button>
                )}
              </div>

              {filteredProjects.length > 0 ? (
                <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={fadeUp}
                      onClick={() => handleProjectClick(project)}
                      className={`group ${card} rounded-2xl border ${border} ${cardHover} overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: project.color }}>
                            {project.category === "Client Work" ? "Client" : project.category === "Lab & Experiments" ? "Lab" : "Featured"}
                          </span>
                          <h3 className="text-xl font-bold text-white mt-1">{project.title}</h3>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <p className={`text-sm ${textBody} line-clamp-3 mb-4 leading-relaxed flex-grow`}>{project.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <span key={tech} className={`px-2 py-0.5 ${tagBg} rounded-md text-[11px] font-semibold`}>{tech}</span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className={`px-2 py-0.5 ${tagBgMuted} rounded-md text-[11px] font-semibold`}>+{project.technologies.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className={`text-center py-16 ${card} rounded-2xl border border-dashed ${border}`}>
                  <p className={`${textSecondary} font-medium text-lg mb-2`}>Aucun projet trouve</p>
                  <p className={`text-sm ${textMuted}`}>Essayez d'autres termes de recherche.</p>
                </div>
              )}
            </motion.div>
          </section>

          {/* RIGHT COLUMN */}
          <aside className="lg:col-span-4 flex flex-col gap-10">
            
            {/* SKILLS */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={`${card} p-6 rounded-2xl border ${border}`}>
              <h2 className={`text-2xl font-serif font-black ${textPrimary} mb-6 flex items-center gap-2 pb-3 border-b ${border}`}>
                <Cpu className="w-6 h-6 text-[#3b82f6]" />
                Competences
              </h2>
              <div className="flex flex-col gap-6">
                {SKILLS_DATA.map((cat) => (
                  <div key={cat.category}>
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-3`}>{cat.category}</h3>
                    <div className="space-y-3">
                      {cat.items.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className={textPrimary}>{skill.name}</span>
                            <span className={textMuted}>{skill.level}%</span>
                          </div>
                          <div className={`h-2 ${isDark ? "bg-gray-700" : "bg-[#f0ebdf]"} rounded-full overflow-hidden`}>
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: skill.level + "%" }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: skill.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* EXPERIENCE */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={`${card} p-6 rounded-2xl border ${border}`}>
              <h2 className={`text-2xl font-serif font-black ${textPrimary} mb-6 flex items-center gap-2 pb-3 border-b ${border}`}>
                <Briefcase className="w-6 h-6 text-[#3b82f6]" />
                Experiences
              </h2>
              <div className={`relative border-l ${border} pl-4 ml-2 space-y-8`}>
                {EXPERIENCE_DATA.map((exp) => (
                  <motion.div key={exp.id} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="relative group">
                    <span className={`absolute -left-[25px] top-1.5 w-4.5 h-4.5 rounded-full border-2 border-[#3b82f6] ${isDark ? "bg-gray-900" : "bg-white"} group-hover:bg-[#3b82f6] transition-colors`} />
                    <span className="text-[11px] font-bold text-[#3b82f6] flex items-center gap-1 mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.period}
                    </span>
                    <h3 className={`text-base font-black ${textPrimary}`}>{exp.role}</h3>
                    <p className={`text-xs font-bold ${textMuted} mb-2 flex items-center gap-1`}>
                      <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                      {exp.company}
                    </p>
                    <p className={`text-xs ${textBody} leading-relaxed mb-2`}>{exp.description}</p>
                    <ul className={`list-disc list-inside text-[11px] ${textMuted} space-y-1 mt-1 pl-1`}>
                      {exp.achievements.slice(0, 2).map((ach, idx) => (
                        <li key={idx} className="leading-snug">{ach}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* BLOG */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={`${card} p-6 rounded-2xl border ${border}`}>
              <h2 className={`text-2xl font-serif font-black ${textPrimary} mb-6 flex items-center gap-2 pb-3 border-b ${border}`}>
                <BookOpen className="w-6 h-6 text-[#3b82f6]" />
                Blog Technique
              </h2>
              <div className="space-y-4">
                  {BLOG_POSTS.slice(0, 3).map((post) => (
                  <motion.div key={post.id} whileHover={{ x: 4 }} onClick={() => { sound.playClick(); setSelectedPost(post); }} className={`group cursor-pointer p-3 rounded-xl ${isDark ? "hover:bg-gray-800/50" : "hover:bg-[#f0ebdf]/50"} transition-colors -mx-3`}>
                    <h3 className={`text-sm font-bold ${textPrimary} group-hover:text-[#3b82f6] transition-colors`}>{post.title}</h3>
                    <p className={`text-xs ${textSecondary} mt-1 line-clamp-2`}>{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] ${textMuted}`}>{post.date}</span>
                      <span className={`text-[10px] ${textMuted}`}>·</span>
                      <span className={`text-[10px] ${textMuted}`}>{post.readTime}</span>
                      <div className="flex gap-1 ml-auto">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className={`px-1.5 py-0.5 ${tagBgMuted} rounded text-[9px] font-semibold ${textMuted}`}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* TESTIMONIALS */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={`${card} p-6 rounded-2xl border ${border}`}>
              <h2 className={`text-2xl font-serif font-black ${textPrimary} mb-6 flex items-center gap-2 pb-3 border-b ${border}`}>
                <Star className="w-6 h-6 text-[#3b82f6]" />
                Temoignages
              </h2>
              <div className="space-y-4">
                {TESTIMONIALS_DATA.map((t) => (
                  <motion.div key={t.id} whileHover={{ scale: 1.01 }} className={`${sectionBg} p-4 rounded-xl border ${borderLight}`}>
                    <p className={`text-xs ${textBody} italic leading-relaxed mb-3`}>"{t.content}"</p>
                    <div>
                      <p className={`text-sm font-bold ${textPrimary}`}>{t.name}</p>
                      <p className={`text-[10px] ${textMuted}`}>{t.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CERTIFICATIONS PLACEHOLDER */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={`${card} p-6 rounded-2xl border ${border}`}>
              <h2 className={`text-2xl font-serif font-black ${textPrimary} mb-4 flex items-center gap-2 pb-2 border-b ${border}`}>
                <Award className="w-6 h-6 text-[#3b82f6]" />
                Certifications
              </h2>
              <div className="flex flex-wrap gap-2">
                {["OpenAI", "Google", "freeCodeCamp", "Meta", "Microsoft"].map((cert) => (
                  <span key={cert} className={`px-3 py-1.5 ${tagBg} rounded-lg text-xs font-bold border ${borderLight} ${isDark ? "hover:bg-gray-700" : "hover:bg-[#ebdccb]/40"} transition-colors cursor-default`}>{cert}</span>
                ))}
                <span className="px-3 py-1.5 bg-[#3b82f6]/10 text-[#3b82f6] rounded-lg text-xs font-bold border border-[#3b82f6]/20">Prochainement...</span>
              </div>
            </motion.div>

            {/* CONTACT FORM */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={`${card} p-6 rounded-2xl border ${border}`} id="contact">
              <h2 className={`text-2xl font-serif font-black ${textPrimary} mb-4 flex items-center gap-2 pb-2 border-b ${border}`}>
                <Send className="w-6 h-6 text-[#3b82f6]" />
                Me Contacter
              </h2>
              
              {contactSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm font-bold text-center">Message envoye avec succes !</div>
              ) : contactError ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-bold text-center">Erreur d envoi. Configure EmailJS dans src/utils/emailjs.ts ou reessaye.</div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`text-xs font-bold ${textMuted} block mb-1`}>Nom</label>
                      <input type="text" name="name" value={contactForm.name} onChange={handleContactChange} required className={`w-full ${inputBg} px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]`} />
                    </div>
                    <div>
                      <label className={`text-xs font-bold ${textMuted} block mb-1`}>Email</label>
                      <input type="email" name="email" value={contactForm.email} onChange={handleContactChange} required className={`w-full ${inputBg} px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]`} />
                    </div>
                  </div>
                  <div>
                    <label className={`text-xs font-bold ${textMuted} block mb-1`}>Sujet</label>
                    <input type="text" name="subject" value={contactForm.subject} onChange={handleContactChange} required className={`w-full ${inputBg} px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]`} />
                  </div>
                  <div>
                    <label className={`text-xs font-bold ${textMuted} block mb-1`}>Message</label>
                    <textarea name="message" value={contactForm.message} onChange={handleContactChange} required rows={4} className={`w-full ${inputBg} px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] resize-none`} />
                  </div>
                  <button type="submit" className="w-full bg-[#3b82f6] hover:bg-[#2563eb] active:scale-95 transition-all text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-[#3b82f6]/20 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Envoyer le message
                  </button>
                </form>
              )}
            </motion.div>

            {/* SOCIAL & CONTACT INFOS */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={`${card} p-6 rounded-2xl border ${border}`}>
              <h2 className={`text-2xl font-serif font-black ${textPrimary} mb-4 flex items-center gap-2 pb-2 border-b ${border}`}>
                <Globe className="w-6 h-6 text-[#3b82f6]" />
                Reseaux & Contact
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" onClick={() => sound.playClick()}
                  className={`flex items-center justify-center gap-2 ${sectionBg} ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-[#ebdccb] text-[#2c2621]"} py-2.5 rounded-xl text-xs font-bold transition-all border border-transparent ${isDark ? "hover:border-gray-700" : "hover:border-[#ebdccb]"}`}>
                  <GithubIcon /> GitHub
                </a>
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" onClick={() => sound.playClick()}
                  className={`flex items-center justify-center gap-2 ${sectionBg} ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-[#ebdccb] text-[#2c2621]"} py-2.5 rounded-xl text-xs font-bold transition-all border border-transparent ${isDark ? "hover:border-gray-700" : "hover:border-[#ebdccb]"}`}>
                  <LinkedinIcon /> LinkedIn
                </a>
                <a href={SOCIAL_LINKS.email} onClick={() => sound.playClick()}
                  className="flex items-center justify-center gap-2 bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-[#3b82f6] py-2.5 rounded-xl text-xs font-bold transition-all">
                  <Mail className="w-4 h-4" /> Email
                </a>
                <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noreferrer" onClick={() => sound.playClick()}
                  className="flex items-center justify-center gap-2 bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#25d366] py-2.5 rounded-xl text-xs font-bold transition-all">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>

              <div className={`text-center pt-3 border-t ${borderLight}`}>
                <p className={`text-[10px] ${textMuted} font-medium`}>© 2025-2026 Onesim · Concu avec soin en React & Canvas</p>
              </div>
            </motion.div>
          </aside>
        </div>
      </main>

      <AnimatePresence>
        {selectedPost && (
          <BlogDetail post={selectedPost} onBack={() => setSelectedPost(null)} isDark={isDark} />
        )}
      </AnimatePresence>
    </div>
  );
};
