import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GameCanvas } from "./components/GameCanvas";
import { ListView } from "./components/ListView";
import { ProjectModal } from "./components/ProjectModal";
import { ParticleCanvas } from "./components/ParticleCanvas";
import { Project } from "./data/portfolioData";
import {
  Gamepad2,
  List,
  Volume2,
  VolumeX,
  Sparkles,
  Smartphone,
} from "lucide-react";
import sound from "./utils/SoundSystem";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
};

export default function App() {
  const [viewMode, setViewMode] = useState<"intro" | "game" | "classic">(
    "intro"
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMuted, setIsMuted] = useState(sound.getMuteState());

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const handleStartGame = () => {
    sound.playClick();
    sound.playCoin();
    setViewMode("game");
  };

  const handleStartClassic = () => {
    sound.playClick();
    setViewMode("classic");
  };

  const toggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-[#f7f2ea] text-[#2c2621] relative overflow-x-hidden select-none font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                name: "Graça Onesim Géraldo Ema-ayé",
                givenName: "Onesim Géraldo Ema-ayé",
                jobTitle: "Développeur Full-Stack",
                url: "https://onesim.vercel.app",
                sameAs: [
                  "https://github.com/MrOnesim",
                  "https://linkedin.com/in/onesim",
                  "https://x.com/_onesim",
                ],
                knowsAbout: [
                  "React",
                  "TypeScript",
                  "NestJS",
                  "PostgreSQL",
                  "Tailwind CSS",
                  "Next.js",
                  "Node.js",
                ],
              },
              {
                "@type": "WebSite",
                name: "Onesim - Développeur Full-Stack",
                url: "https://onesim.vercel.app",
                description:
                  "Portfolio de Onesim, développeur Full-Stack spécialisé en applications web modernes.",
                inLanguage: "fr-FR",
              },
            ],
          }),
        }}
      />
      <AnimatePresence mode="wait">
        {viewMode === "intro" && (
          <motion.div
            key="intro"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen flex items-center justify-center p-4 relative bg-radial from-[#fffcf7] to-[#ebdccb]/60"
          >
            <ParticleCanvas />

            {/* Grid decoration */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-0 opacity-15 pointer-events-none">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border-r border-b border-[#2c2621]/25" />
              ))}
            </div>

            <div className="relative max-w-2xl w-full bg-[#fffcf7] border-4 border-[#2c2621] rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl z-10 text-center flex flex-col items-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex items-center gap-2 mb-4"
              >
                <span className="w-3 h-3 rounded-full bg-[#3b82f6] animate-ping" />
                <span className="px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-xs font-black uppercase tracking-widest rounded-full border border-[#3b82f6]/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Portfolio
                </span>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-5xl md:text-7xl font-serif font-black tracking-tight text-[#231a14] mb-2 leading-none"
              >
                ONESIM
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-xs md:text-sm font-bold font-mono text-[#3b82f6] uppercase tracking-widest mb-8 border-b-2 border-[#ebdccb] pb-4 w-full max-w-md"
              >
                Développeur Full-Stack
              </motion.p>

              {/* Car preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="w-40 h-20 relative bg-[#ebdccb]/20 border-2 border-dashed border-[#8c7460] rounded-2xl flex items-center justify-center mb-8 group overflow-hidden"
              >
                <div className="w-16 h-10 bg-[#3b82f6] rounded-lg shadow-md flex items-center justify-center relative animate-bounce duration-1000">
                  <div className="absolute -top-1 left-2 w-3 h-2 bg-gray-900 rounded-xs" />
                  <div className="absolute -top-1 right-2 w-3 h-2 bg-gray-900 rounded-xs" />
                  <div className="absolute -bottom-1 left-2 w-3 h-2 bg-gray-900 rounded-xs" />
                  <div className="absolute -bottom-1 right-2 w-3 h-2 bg-gray-900 rounded-xs" />
                  <div className="w-6 h-5 bg-[#38bdf8] rounded-xs absolute right-1 top-2.5" />
                  <div className="text-[10px] text-white font-black">GO!</div>
                </div>
                <div className="absolute bottom-2 text-[9px] text-[#8c7460] font-mono uppercase tracking-wider">
                  Bac à sable interactif
                </div>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="text-base md:text-lg text-[#6b584a] font-medium max-w-lg mb-8 leading-relaxed"
              >
                Je conçois des applications web modernes qui résolvent de vrais
                problèmes grâce à des technologies robustes et évolutives.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8"
              >
                {/* Game mode button — visible on all screens, touch controls available */}
                <button
                  onClick={handleStartGame}
                  className="group flex flex-col items-center justify-center gap-2 bg-[#3b82f6] text-white hover:bg-[#2563eb] active:scale-95 transition-all p-6 rounded-2xl border-2 border-transparent hover:border-white/10 shadow-lg shadow-[#3b82f6]/25 font-bold"
                >
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-6 h-6 animate-pulse" />
                    <span className="text-xl font-black">MODE INTERACTIF</span>
                  </div>
                  <span className="text-[11px] text-white/80 font-normal uppercase tracking-wider leading-none">
                    {isTouchDevice
                      ? "Conduis avec les boutons tactiles"
                      : "Conduis, percute & explore"}
                  </span>
                  {/* Touch badge — hidden on desktop */}
                  {isTouchDevice && (
                    <span className="flex items-center gap-1 mt-1 px-2 py-0.5 bg-white/15 rounded-full text-[10px] font-semibold">
                      <Smartphone className="w-3 h-3" />
                      Contrôles tactiles inclus
                    </span>
                  )}
                </button>

                <button
                  onClick={handleStartClassic}
                  className="group flex flex-col items-center justify-center gap-2 bg-white text-[#2c2621] hover:bg-[#fcf8f2] active:scale-95 transition-all p-6 rounded-2xl border-2 border-[#2c2621] shadow-md font-bold"
                >
                  <div className="flex items-center gap-2">
                    <List className="w-6 h-6" />
                    <span className="text-xl font-black">PORTFOLIO CLASSIQUE</span>
                  </div>
                  <span className="text-[11px] text-[#8c7460] font-normal uppercase tracking-wider leading-none">
                    Projets, compétences & contact
                  </span>
                </button>
              </motion.div>

              {/* Controls hint — hidden on mobile (touch uses on-screen buttons) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="hidden sm:flex bg-[#f0ebdf]/75 border border-[#ebdccb] rounded-2xl p-4 w-full text-left justify-between gap-4 items-center"
              >
                <div className="text-xs text-[#6b584a]">
                  <strong className="text-[#2c2621]">WASD</strong> ou{" "}
                  <strong className="text-[#2c2621]">Flèches</strong> pour
                  conduire,{" "}
                  <strong className="text-[#2c2621]">ESPACE</strong> pour
                  dérapage,{" "}
                  <strong className="text-[#2c2621]">SHIFT</strong> pour turbo,{" "}
                  <strong className="text-[#2c2621]">R</strong> pour reset.
                </div>
                <button
                  onClick={toggleMute}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[#ebdccb] text-xs font-bold hover:bg-[#fffcf7] transition-all text-[#4a3e35] pointer-events-auto shrink-0"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-[#ff3e00]" /> Muet
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-600" /> Audio
                    </>
                  )}
                </button>
              </motion.div>

              {/* Mobile audio toggle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex sm:hidden mt-2"
              >
                <button
                  onClick={toggleMute}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[#ebdccb] text-xs font-bold hover:bg-[#fffcf7] transition-all text-[#4a3e35]"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-[#ff3e00]" /> Muet
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-600" /> Audio
                    </>
                  )}
                </button>
              </motion.div>

              <div className="text-[10px] text-gray-400 font-bold font-mono tracking-wider mt-8">
                CONÇU AVEC SOIN · REACT + TAILWIND + CANVAS 2025–2026
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === "game" && (
          <motion.div
            key="game"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen"
          >
            <GameCanvas
              onSwitchToClassic={() => setViewMode("classic")}
              onOpenProject={(project) => setSelectedProject(project)}
            />
          </motion.div>
        )}

        {viewMode === "classic" && (
          <motion.div
            key="classic"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ListView
              onSwitchToGame={() => setViewMode("game")}
              onOpenProject={(project) => setSelectedProject(project)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
