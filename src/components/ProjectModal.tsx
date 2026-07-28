import React, { useState, useCallback, useRef } from "react";
import { Project } from "../data/portfolioData";
import { 
  X, ExternalLink, Award, Calendar, ChevronLeft, ChevronRight 
} from "lucide-react";
import sound from "../utils/SoundSystem";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const touchStartX = useRef(0);
  const hasMultiple = project.images.length > 1;

  const prev = useCallback(() => {
    sound.playClick();
    setImgIndex((i) => (i - 1 + project.images.length) % project.images.length);
  }, [project.images.length]);

  const next = useCallback(() => {
    sound.playClick();
    setImgIndex((i) => (i + 1) % project.images.length);
  }, [project.images.length]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-[#fffcf7] rounded-3xl border border-[#ebdccb] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Banner block with gallery */}
        <div className="relative h-64 overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <img src={project.images[imgIndex]} alt={`${project.title} - Image ${imgIndex + 1}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {hasMultiple && (
            <>
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {project.images.map((_, i) => (
                  <button key={i} onClick={() => { sound.playClick(); setImgIndex(i); }}
                    className={`w-2 h-2 rounded-full transition-all ${i === imgIndex ? "bg-white scale-110" : "bg-white/40 hover:bg-white/60"}`}
                  />
                ))}
              </div>
            </>
          )}
          
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span 
              className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: project.color }}
            >
              {project.category === "Client Work" ? "Client" : project.category === "Lab & Experiments" ? "Lab" : "Featured"}
            </span>
            <h3 className="text-3xl font-serif font-black mt-2 text-white drop-shadow-sm leading-tight">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Content body */}
        <div className="p-8">
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <span className="text-sm font-semibold text-[#8c7460] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#8c7460]" />
              Periode: <span className="text-[#2c2621] font-bold">{project.year}</span>
            </span>
            {project.awards && project.awards.map((award) => (
              <span key={award}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-200"
              >
                <Award className="w-3.5 h-3.5 text-amber-600 fill-amber-100" />
                {award}
              </span>
            ))}
          </div>

          <div className="mb-6 text-[#2c2621]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c7460] mb-2 font-mono">Apercu du projet</h4>
            <p className="text-base text-[#4a3e35] leading-relaxed font-medium">
              {project.longDescription}
            </p>
          </div>

          <div className="mb-8 text-[#2c2621]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c7460] mb-2.5 font-mono">Technologies utilisees</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech}
                  className="px-3 py-1.5 bg-[#f0ebdf] text-[#4a3e35] rounded-xl text-xs font-bold border border-[#ebdccb]/60 hover:bg-[#ebdccb]/40 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#ebdccb]/60">
            <a href={project.projectUrl} target="_blank" rel="noreferrer" onClick={() => sound.playClick()}
              className="flex-1 flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] active:scale-95 transition-all text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-[#3b82f6]/15">
              <ExternalLink className="w-4 h-4" />
              Voir le projet
            </a>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" onClick={() => sound.playClick()}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2c2621] hover:bg-[#1a1613] active:scale-95 transition-all text-white py-3.5 rounded-xl text-sm font-bold">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                Code source
              </a>
            )}
            <button onClick={() => { sound.playClick(); onClose(); }}
              className="px-6 py-3.5 bg-[#f0ebdf] hover:bg-[#ebdccb] active:scale-95 transition-all text-[#2c2621] rounded-xl text-sm font-bold">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
