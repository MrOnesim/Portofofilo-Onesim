import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Reveal, SectionBar, SplitWords } from "@/components/Primitives";
import { OgImage } from "@/components/OgImage";
import { allTechnologies, projects, stackUniverses } from "@/data/portfolio";
import { cn } from "@/utils/cn";

export function Stack() {
  const [openId, setOpenId] = useState<string>(stackUniverses[0].id);
  const [activeTech, setActiveTech] = useState<string | null>("React");

  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]/g, "").replace("nodejs", "node").replace("postgres", "postgresql");

  const matchingProjects = activeTech
    ? projects.filter((p) =>
        p.technologies.some(
          (t) =>
            normalize(t).includes(normalize(activeTech)) ||
            normalize(activeTech).includes(normalize(t)),
        ),
      )
    : [];

  return (
    <section id="technologies" className="og-section-paper og-stack-section" aria-labelledby="stack-title">
      <SectionBar index="04" label="Technologies" meta={`${allTechnologies.length} OUTILS`} />

      <div className="og-container">
        <div className="og-projects-intro">
          <div>
            <SplitWords
              id="stack-title"
              text="Du Front-End à la base"
              accent="de données."
              className="og-display-xl"
            />
          </div>
          <Reveal delay={90}>
            <p className="og-lead-text">
              Les langages, frameworks et outils utilisés sur mes projets personnels et lors des
              collaborations en équipe.
            </p>
          </Reveal>
        </div>

        <div className="og-cinema-accordion" role="group" aria-label="Domaines technologiques">
          {stackUniverses.map((universe) => {
            const isOpen = universe.id === openId;
            const panelId = `stack-panel-${universe.id}`;
            const triggerId = `stack-trigger-${universe.id}`;

            return (
              <article
                key={universe.id}
                className="og-cinema-panel"
                data-open={isOpen ? "true" : "false"}
              >
                <div className="og-cinema-bg" aria-hidden="true">
                  <OgImage src={universe.image} alt="" sizes="50vw" />
                </div>
                <div className="og-cinema-shade" aria-hidden="true" />

                {!isOpen ? (
                  <button
                    id={triggerId}
                    type="button"
                    className="og-cinema-closed"
                    onClick={() => setOpenId(universe.id)}
                    aria-expanded={false}
                    aria-controls={panelId}
                    aria-label={`Explorer ${universe.title}`}
                  >
                    <span className="og-cinema-num">{universe.number}</span>
                    <span className="og-cinema-vertical">{universe.shortTitle}</span>
                    <span className="og-cinema-plus">
                      <Plus size={17} aria-hidden="true" />
                    </span>
                  </button>
                ) : (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className="og-cinema-open"
                  >
                    <div className="og-cinema-topline">
                      <span id={triggerId} className="og-cinema-num">
                        {universe.number} · {universe.genre}
                      </span>
                      <button
                        type="button"
                        className="og-cinema-collapse"
                        aria-expanded={true}
                        aria-controls={panelId}
                        aria-label={`Réduire ${universe.title}`}
                        onClick={() => setOpenId("")}
                      >
                        <X size={15} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="og-cinema-body">
                      <h3>{universe.title}</h3>
                      <p>{universe.description}</p>
                      <div className="og-cinema-chips">
                        {universe.items.map((tech) => (
                          <button
                            key={tech}
                            type="button"
                            className="og-cinema-chip"
                            onClick={() => setActiveTech(tech)}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <Reveal delay={120}>
          <div className="og-tech-matrix">
            <div className="og-matrix-head">
              <div>
                <span className="og-eyebrow">Index complet · {allTechnologies.length} technologies</span>
                <h3>Filtrer les réalisations par technologie</h3>
              </div>
              {activeTech && (
                <span className="og-matrix-badge">
                  Technologie : <strong>{activeTech}</strong> ({matchingProjects.length}{" "}
                  {matchingProjects.length > 1 ? "projets" : "projet"})
                </span>
              )}
            </div>

            <div className="og-matrix-pills" role="group" aria-label="Toutes les technologies">
              {allTechnologies.map((tech, idx) => {
                const isSelected = activeTech === tech;
                return (
                  <button
                    key={tech}
                    type="button"
                    className={cn("og-matrix-pill", isSelected && "is-selected")}
                    aria-pressed={isSelected}
                    onClick={() => setActiveTech(isSelected ? null : tech)}
                  >
                    <small>{String(idx + 1).padStart(2, "0")}</small>
                    <span>{tech}</span>
                  </button>
                );
              })}
            </div>

            {activeTech && matchingProjects.length > 0 && (
              <div className="og-matrix-matches" aria-live="polite">
                <span className="og-matrix-matches-label">Projets utilisant {activeTech} :</span>
                <div className="og-matrix-matches-list">
                  {matchingProjects.map((p) => (
                    <a key={p.id} href="#projets" className="og-matrix-match-tag">
                      <span>{p.number}</span>
                      <strong>{p.name}</strong>
                      <small>{p.status}</small>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
