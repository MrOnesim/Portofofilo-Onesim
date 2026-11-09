import { ArrowUp } from "lucide-react";
import { allTechnologies, contactChannels, identity, navItems, projects } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="og-footer">
      <div className="og-container">
        <div className="og-footer-top">
          <div className="og-footer-cols">
            <div>
              <span className="og-eyebrow og-eyebrow-blue">Navigation</span>
              <ul className="og-footer-list">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>
                      <span>{item.n}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="og-eyebrow og-eyebrow-blue">Réseaux & Contact</span>
              <ul className="og-footer-list">
                {contactChannels.map((c, idx) => (
                  <li key={c.id}>
                    <a
                      href={c.href}
                      target={c.id === "email" ? undefined : "_blank"}
                      rel={c.id === "email" ? undefined : "noreferrer noopener"}
                    >
                      <span>0{idx + 1}</span>
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="og-footer-quote-box">
            <p className="og-footer-motto">
              « {identity.footerTagline} »
            </p>
            <a href="#top" className="og-btn-glass" aria-label="Retourner en haut de page">
              <span>Haut de page</span>
              <ArrowUp size={15} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="og-footer-mega-wrap">
          <p className="og-footer-mega">{identity.name}</p>
        </div>

        <div className="og-footer-bottom">
          <span>© {new Date().getFullYear()} {identity.name} Tous droits réservés</span>
          <span>{identity.role} · {identity.location}</span>
        </div>

        <p className="og-colophon">
          Édition 2026 · {projects.length} projets répertoriés · {allTechnologies.length} technologies ·
          {" "}Typographies Space Grotesk, Instrument Serif & IBM Plex Mono ·
          {" "}Design et développement : Graça Onesim Géraldo Ema-ayé
        </p>
      </div>
    </footer>
  );
}
