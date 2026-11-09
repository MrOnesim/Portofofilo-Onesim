import { ActionCircleLink, Reveal, SectionBar, SplitWords } from "@/components/Primitives";
import { education, identity, projects } from "@/data/portfolio";

const engineeringPillars = [
  {
    code: "01",
    title: "Architecture Front-End & Interfaces",
    detail:
      "Composants React typés en TypeScript, états prévisibles, animations mesurées et accessibilité clavier.",
  },
  {
    code: "02",
    title: "Back-End, API-REST & Authentification",
    detail:
      "API modulaires avec NestJS, Node.js et PHP, gestion des sessions, contrôle des rôles et validation des entrées.",
  },
  {
    code: "03",
    title: "Données & Mise en Production",
    detail:
      "Schémas PostgreSQL et MySQL (Supabase, Neon), versioning Git en équipe et déploiement sur Vercel, Netlify et Hostinger.",
  },
];

export function About() {
  return (
    <section id="apropos" className="og-section-paper" aria-labelledby="about-title">
      <SectionBar index="02" label="À propos" meta="PARCOURS & APPROCHE" />

      <div className="og-container">
        <div className="og-about-header">
          <SplitWords
            id="about-title"
            text="Derrière chaque projet,"
            accent="une vision."
            className="og-display-xl"
          />
          <Reveal delay={80}>
            <p className="og-about-text">{identity.aboutText}</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="og-about-cta-row">
              <ActionCircleLink href="#projets">
                Voir les {projects.length} réalisations
              </ActionCircleLink>
              <ActionCircleLink href="#contact">Discuter d'un projet</ActionCircleLink>
            </div>
          </Reveal>
        </div>

        <div className="og-about-bento">
          <Reveal className="og-about-visual-card">
            <div className="og-engineering-sheet">
              <div className="og-sheet-header">
                <span className="og-eyebrow">Méthode d'ingénierie</span>
                <span className="og-sheet-meta">FULL STACK · COTONOU</span>
              </div>
              <h3 className="og-sheet-title">
                Du cahier des charges au <em>produit déployé.</em>
              </h3>
              <div className="og-sheet-pillars">
                {engineeringPillars.map((pillar) => (
                  <div key={pillar.code} className="og-sheet-pillar">
                    <span className="og-sheet-code">{pillar.code}</span>
                    <div>
                      <strong>{pillar.title}</strong>
                      <p>{pillar.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="og-about-education">
            <Reveal delay={80}>
              <div className="og-edu-head">
                <span className="og-eyebrow">Formation & Parcours académique</span>
                <h3>Une progression construite par la pratique.</h3>
              </div>
            </Reveal>

            <div className="og-edu-timeline">
              {education.map((item, idx) => (
                <Reveal key={item.title} delay={120 + idx * 90}>
                  <article className="og-edu-card">
                    <div className="og-edu-top">
                      <span className="og-edu-period">{item.period}</span>
                      <span className="og-edu-school">{item.school}</span>
                    </div>
                    <h4 className="og-edu-title">{item.title}</h4>
                    <p className="og-edu-detail">{item.detail}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <p className="og-margin-note">
              Note de marge : Les captures présentées proviennent des sites déployés ; les projets
              encore en développement sont signalés comme tels.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
