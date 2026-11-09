import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { identity } from "@/data/portfolio";
import { clamp, prefersReducedMotion, useScrollFrame } from "@/lib/hooks";

const MARQUEE_ITEMS = [
  "React",
  "TypeScript",
  "Node.js",
  "NestJS",
  "PostgreSQL",
  "Tailwind CSS",
  "GSAP",
  "API REST",
  "Accessibilité",
  "Vercel",
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* Chorégraphie d'entrée — signature qui monte, portrait qui se développe. */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = heroRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });
      timeline
        .from(".og-hero-signature-row", { y: -24, opacity: 0, duration: 0.9 })
        .from(".og-hero-mega .line-solid", { y: 110, autoAlpha: 0, duration: 1.05 }, "-=0.55")
        .from(".og-hero-mega .line-hollow", { y: 110, autoAlpha: 0, duration: 1.05 }, "-=0.84")
        .from(".og-hero-quote", { y: 44, opacity: 0, duration: 0.95 }, "-=0.62")
        .from(".og-hero-presentation", { y: 28, opacity: 0, duration: 0.8 }, "-=0.66")
        .from(".og-hero-actions", { y: 20, opacity: 0, duration: 0.7 }, "-=0.55")
        .from(".og-hero-bottom", { opacity: 0, y: 12, duration: 0.6 }, "-=0.45")
        .from(".og-marquee", { opacity: 0, duration: 0.8 }, "-=0.4");
    }, root);

    return () => ctx.revert();
  }, []);

  /* Retrait au défilement. */
  useScrollFrame(() => {
    if (prefersReducedMotion()) return;
    const p = clamp(window.scrollY / (window.innerHeight || 1));
    if (contentRef.current) {
      contentRef.current.style.opacity = `${clamp(1 - p * 1.15)}`;
    }
  });

  return (
    <section
      ref={heroRef}
      className="og-hero-sticky"
      aria-label="Présentation d'Onesim Graça"
    >
      <div ref={contentRef} className="og-hero-content">
        <header className="og-hero-signature-row">
          <span className="og-hero-kicker">Développeur Web Full Stack · Cotonou, Bénin</span>
        </header>

        <div className="og-hero-stage-grid">
          <div className="og-hero-upper">
            <h1 className="og-hero-mega">
              <span className="line-solid">ONESIM</span>
              {" "}
              <span className="line-hollow">GRAÇA</span>
            </h1>
            <p className="og-hero-quote serif-italic">
              «&nbsp;{identity.tagline}&nbsp;»
            </p>
            <p className="og-hero-presentation">{identity.presentation}</p>
            <div className="og-hero-actions">
              <a href="#projets" className="og-btn-primary">
                <span>Explorer mes projets</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a href="#contact" className="og-btn-glass">
                <MessageCircle size={15} aria-hidden="true" />
                <span>Écrire un message</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="og-marquee" aria-hidden="true">
        <div className="og-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span key={`${item}-${idx}`} className="og-marquee-item">
              <b>{item}</b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
