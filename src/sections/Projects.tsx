import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  X,
} from "lucide-react";
import { ActionCircleLink, Reveal, SectionBar, SplitWords } from "@/components/Primitives";
import { OgImage } from "@/components/OgImage";
import { identity, projects, type PortfolioProject } from "@/data/portfolio";
import { cn } from "@/utils/cn";

type FilterKey = "all" | "personal" | "collab" | "progress";
type ViewMode = "editorial" | "coverflow" | "index";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.99 5.24.99 11.5c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53v-1.86c-3.06.67-3.7-1.48-3.7-1.48-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.22.7-1.5-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.19 1.13-2.96-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.4 10.4 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.76 1.13 2.96 0 4.23-2.58 5.15-5.03 5.43.4.34.75 1.02.75 2.06v3.05c0 .29.2.64.76.53A11.02 11.02 0 0 0 23 11.5C23 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

function getHostname(url?: string) {
  if (!url) return "Dépôt local";
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/* ---------------------------------------------------------- Index d'ingénierie */
function ProjectIndex({
  items,
  onOpenProject,
}: {
  items: PortfolioProject[];
  onOpenProject: (project: PortfolioProject) => void;
}) {
  return (
    <div className="og-index-wrap" role="region" aria-label="Index des réalisations">
      <div className="og-index-head">
        <span>N°</span>
        <span>Projet</span>
        <span>Domaine</span>
        <span>Statut</span>
        <span>Lien</span>
      </div>
      {items.map((project, idx) => (
        <div className="og-index-row" key={project.id}>
          <span className="og-index-no">
            {project.category === "collab" ? `B${project.number}` : String(idx + 1).padStart(2, "0")}
          </span>
          <span className="og-index-name">
            <button type="button" onClick={() => onOpenProject(project)}>
              {project.name}
            </button>
            <small>{project.role}</small>
          </span>
          <span className="og-index-domain">{project.categoryLabel}</span>
          <span className="og-index-status" data-status={project.status}>
            {project.status}
          </span>
          <span className="og-index-link">
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noreferrer noopener">
                {getHostname(project.liveUrl)} ↗
              </a>
            ) : project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noreferrer noopener">
                GitHub ↗
              </a>
            ) : (
              "—"
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- Aperçu 3D optionnel */
function CoverflowTheater({
  items,
  onOpenProject,
}: {
  items: PortfolioProject[];
  onOpenProject: (project: PortfolioProject) => void;
}) {
  const [active, setActive] = useState(0);
  const count = items.length;
  const current = items[active] ?? items[0];
  const prev = () => setActive((i) => (i - 1 + count) % count);
  const next = () => setActive((i) => (i + 1) % count);

  return (
    <div
      className="og-coverflow-theater"
      role="region"
      aria-roledescription="carrousel"
      aria-label="Exploration 3D des réalisations"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          prev();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          next();
        }
      }}
    >
      <div className="og-theater-top">
        <span className="og-theater-tag">INDEX 3D · Flèches ←/→ ou clic</span>
        <span className="og-theater-counter">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>

      <div className="og-coverflow-stage">
        <div className="og-coverflow-track">
          {items.map((item, idx) => {
            let offset = idx - active;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;
            const abs = Math.abs(offset);
            const visible = abs <= 2;
            return (
              <div
                key={item.id}
                className="og-coverflow-slide"
                style={{
                  transform: `translate3d(${offset * 54}%, 0, ${-abs * 145}px) rotateY(${offset * -26}deg)`,
                  zIndex: 20 - abs,
                  opacity: visible ? (abs === 0 ? 1 : abs === 1 ? 0.65 : 0.28) : 0,
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                <button
                  type="button"
                  className="og-coverflow-btn"
                  onClick={() => (idx === active ? onOpenProject(item) : setActive(idx))}
                  aria-label={
                    idx === active
                      ? `Découvrir le projet ${item.name}`
                      : `Afficher l'aperçu de ${item.name}`
                  }
                >
                  <OgImage
                    src={item.image}
                    alt={`Aperçu du projet ${item.name}`}
                    sizes="(min-width: 980px) 40vw, 90vw"
                  />
                  <span className="og-coverflow-shade" aria-hidden="true" />
                  <span className="og-coverflow-badge">
                    {item.category === "collab" ? `B.${item.number}` : `A.${item.number}`} · {item.status}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="og-theater-bar">
        <div className="og-theater-info" aria-live="polite" aria-atomic="true">
          <span className="og-theater-cat">{current.categoryLabel} · {current.status}</span>
          <h3>{current.name}</h3>
          <p>{current.description}</p>
        </div>
        <div className="og-theater-controls">
          <button type="button" className="og-theater-arrow" onClick={prev} aria-label="Projet précédent">
            <ArrowLeft size={17} aria-hidden="true" />
          </button>
          <button type="button" className="og-theater-open" onClick={() => onOpenProject(current)}>
            Étude de cas <ArrowUpRight size={15} aria-hidden="true" />
          </button>
          <button type="button" className="og-theater-arrow" onClick={next} aria-label="Projet suivant">
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- Carte unique */
function ProjectCard({
  project,
  onInspect,
  dark = false,
}: {
  project: PortfolioProject;
  onInspect: (project: PortfolioProject) => void;
  dark?: boolean;
}) {
  return (
    <Reveal
      className="og-pcard-cell"
      style={{ "--col-span": project.span } as CSSProperties}
    >
      <article className={cn("og-pcard", dark && "og-pcard-dark")} data-aspect={project.aspect}>
        <div className="og-pcard-inner" data-aspect={project.aspect}>
          <button
            type="button"
            className="og-pcard-media"
            onClick={() => onInspect(project)}
            aria-label={`Voir l'étude de cas de ${project.name}`}
          >
            <div className="og-pcard-img-wrap">
              <OgImage
                src={project.image}
                alt={`Capture d'écran du projet ${project.name}`}
                sizes="(min-width: 980px) 45vw, 100vw"
              />
            </div>
          </button>

          <div className="og-pcard-body">
            <div className="og-pcard-topline">
              <span className="og-pcard-index">
                {project.category === "collab" ? `COLLAB ${project.number}` : `PROJET ${project.number}`}
              </span>
              <span className="og-pcard-cat">{project.categoryLabel}</span>
            </div>

            <h3 className="og-pcard-title">
              <button type="button" onClick={() => onInspect(project)}>
                {project.name}
              </button>
            </h3>
            <p className="og-pcard-desc">{project.description}</p>

            <p className="og-pcard-meta-line">
              <span>{getHostname(project.liveUrl)}</span>
              <span aria-hidden="true">·</span>
              <span>{project.technologies.slice(0, 3).join(", ")}</span>
              <span aria-hidden="true">·</span>
              <span className="og-status-chip" data-status={project.status}>
                {project.status}
              </span>
            </p>

            <p className="og-pcard-role">
              <strong>Rôle :</strong> {project.role}
            </p>

            <div className="og-pcard-footer">
              <button
                type="button"
                className="og-discover-btn"
                onClick={() => onInspect(project)}
              >
                <span>Découvrir le projet</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="og-ghost-link"
                  aria-label={`Site en ligne de ${project.name}`}
                >
                  <span>Site en ligne</span>
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="og-github-pill"
                  aria-label={`Code source GitHub de ${project.name}`}
                >
                  <GithubIcon />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ---------------------------------------------------------- Étude de cas (piège de focus) */
function ProjectModal({
  project,
  onClose,
}: {
  project: PortfolioProject;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div
      className="og-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Détails du projet ${project.name}`}
    >
      <div ref={dialogRef} className="og-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="og-modal-visual">
          <OgImage src={project.image} alt={`Capture d'écran de ${project.name}`} eager />
          <button
            ref={closeRef}
            type="button"
            className="og-modal-close"
            onClick={onClose}
            aria-label="Fermer la fenêtre du projet"
            autoFocus
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="og-modal-body">
          <div className="og-modal-meta">
            <span className="og-eyebrow">
              {project.category === "collab"
                ? `B.${project.number} · Collaboration & Challenge`
                : `A.${project.number} · Projet personnel`}
            </span>
            <span className="og-status-chip" data-status={project.status}>
              {project.status}
            </span>
          </div>

          <h2>{project.name}</h2>
          <p className="og-modal-lead">{project.longDescription}</p>

          <div className="og-modal-role">
            <strong>Rôle personnel d'Onesim Graça</strong>
            <p>{project.role}</p>
          </div>

          <div className="og-pcard-techs">
            {project.technologies.map((tech) => (
              <span key={tech} className="og-tech-pill">
                {tech}
              </span>
            ))}
          </div>

          <div className="og-modal-actions">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer noopener" className="og-discover-btn">
                <span>Ouvrir le site en direct</span>
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer noopener" className="og-github-pill">
                <GithubIcon />
                <span>Code source GitHub</span>
              </a>
            )}
            <button type="button" className="og-ghost-link" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- Section principale */
export function Projects() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("editorial");
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const personalProjects = projects.filter((p) => p.category === "personal");
  const collabProjects = projects.filter((p) => p.category === "collab");
  const inProgressCount = projects.filter((p) => p.status === "En cours").length;

  const filteredPersonal =
    filter === "collab"
      ? []
      : filter === "progress"
        ? personalProjects.filter((p) => p.status === "En cours")
        : personalProjects;

  const filteredCollab =
    filter === "personal"
      ? []
      : filter === "progress"
        ? collabProjects.filter((p) => p.status === "En cours")
        : collabProjects;

  const filterOptions: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "Tous les projets", count: projects.length },
    { key: "personal", label: "A. Projets personnels", count: personalProjects.length },
    { key: "collab", label: "B. Collaborations & challenges", count: collabProjects.length },
    { key: "progress", label: "En cours", count: inProgressCount },
  ];

  const viewOptions: { key: ViewMode; label: string }[] = [
    { key: "editorial", label: "Grille éditoriale" },
    { key: "coverflow", label: `Aperçu 3D (${projects.length})` },
    { key: "index", label: `Index (${projects.length})` },
  ];

  return (
    <section id="projets" className="og-section-paper og-projects-section" aria-labelledby="work-title">
      <SectionBar index="03" label="Mes projets" meta={`${projects.length} RÉALISATIONS`} />

      <div className="og-container">
        <div className="og-projects-intro">
          <div>
            <SplitWords
              id="work-title"
              text="Un aperçu de"
              accent="mon univers."
              className="og-display-xl"
            />
          </div>
          <Reveal delay={100}>
            <p className="og-lead-text">{identity.projectsSubtitle}</p>
          </Reveal>
        </div>

        <div className="og-toolbar-row">
          <div className="og-filter-bar" role="group" aria-label="Filtrer les réalisations">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className="og-filter-pill"
                aria-pressed={filter === option.key}
                onClick={() => setFilter(option.key)}
              >
                {option.label}<sup>{option.count}</sup>
              </button>
            ))}
          </div>

          <div className="og-view-toggle" role="group" aria-label="Mode d'affichage">
            {viewOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className="og-view-btn"
                aria-pressed={viewMode === option.key}
                onClick={() => setViewMode(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {viewMode === "coverflow" && (
          <CoverflowTheater items={projects} onOpenProject={setSelectedProject} />
        )}

        {viewMode === "index" && (
          <ProjectIndex
            items={[...filteredPersonal, ...filteredCollab]}
            onOpenProject={setSelectedProject}
          />
        )}

        {viewMode !== "index" && filteredPersonal.length > 0 && (
          <div className="og-category-block">
            <div className="og-category-head">
              <div>
                <span className="og-eyebrow">Catégorie A · Réalisations individuelles</span>
                <h3>Projets personnels et réalisations</h3>
              </div>
              <span className="og-category-count">01 / {String(filteredPersonal.length).padStart(2, "0")}</span>
            </div>
            <div className="og-editorial-grid">
              {filteredPersonal.map((project) => (
                <ProjectCard key={project.id} project={project} onInspect={setSelectedProject} />
              ))}
            </div>
          </div>
        )}

        {viewMode !== "index" && filteredCollab.length > 0 && (
          <div id="collaborations" className="og-collab-showcase">
            <div className="og-collab-header">
              <div>
                <span className="og-eyebrow og-eyebrow-blue">
                  Catégorie B · Travaux collectifs & Challenges
                </span>
                <h3>Projets réalisés en collaboration et challenges</h3>
                <p>
                  Expériences collectives et challenges menés au sein de{" "}
                  <strong>FuturCraft Institut</strong>. Le rôle personnel est indiqué sur chaque fiche
                  sans attribuer individuellement l'ensemble du travail d'équipe.
                </p>
              </div>
              <ActionCircleLink href="#contact" light>
                Proposer une collaboration
              </ActionCircleLink>
            </div>
            <div className="og-editorial-grid">
              {filteredCollab.map((project) => (
                <ProjectCard key={project.id} project={project} onInspect={setSelectedProject} dark />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
