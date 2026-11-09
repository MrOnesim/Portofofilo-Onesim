import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { identity, navItems } from "@/data/portfolio";
import { usePageProgress, useReducedMotion, useSmoothScroll } from "@/lib/hooks";
import { cn } from "@/utils/cn";

function CotonouClock() {
  const [time, setTime] = useState("UTC+1");

  useEffect(() => {
    const update = () => {
      try {
        const formatted = new Intl.DateTimeFormat("fr-FR", {
          timeZone: "Africa/Porto-Novo",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date());
        setTime(`COTONOU · ${formatted}`);
      } catch {
        setTime("COTONOU · UTC+1");
      }
    };
    update();
    const id = window.setInterval(update, 30000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="og-header-clock">{time}</span>;
}

export function SiteChrome() {
  const reduced = useReducedMotion();
  useSmoothScroll(!reduced);

  const progressRef = useRef<HTMLDivElement>(null);
  usePageProgress(progressRef);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#top");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveHref(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-28% 0px -55% 0px", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <div ref={progressRef} className="og-scroll-progress" aria-hidden="true" />

      <header className="og-header">
        <a href="#top" className="og-brand" aria-label={`${identity.name}, accueil`}>
          <span className="og-brand-text">{identity.name}</span>
        </a>

        <nav className="og-nav-pills" aria-label="Navigation principale">
          {navItems.slice(1).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn("og-nav-link", activeHref === item.href && "is-active")}
              aria-current={activeHref === item.href ? "location" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="og-header-right">
          <CotonouClock />
          <a href="#contact" className="og-header-cta">
            <span>Entrer en contact</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>

          <button
            type="button"
            className="og-menu-toggle"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? "site-menu" : undefined}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          id="site-menu"
          className="og-menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation principale"
          onClick={() => setMenuOpen(false)}
        >
          <div className="og-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="og-menu-drawer-top">
              <span className="og-eyebrow">Navigation · {identity.name}</span>
              <button
                type="button"
                className="og-menu-close"
                aria-label="Fermer le menu"
                onClick={() => setMenuOpen(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <ul className="og-menu-drawer-list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={() => setMenuOpen(false)}>
                    <span className="og-menu-num">{item.n}</span>
                    <span className="og-menu-label">{item.label}</span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>

            <p className="og-menu-drawer-foot">
              « {identity.footerTagline} » · {identity.location}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
