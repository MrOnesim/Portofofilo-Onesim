import {
  Fragment,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { useInView } from "@/lib/hooks";

/* ---------------------------------------------------------- Reveal : seul effet de scroll */
export function Reveal({
  children,
  className,
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  const { ref, shown } = useInView<HTMLDivElement>(0.1, "0px 0px -36px 0px");
  return (
    <div
      ref={ref}
      className={cn("og-rise", shown && "og-rise-on", className)}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------- Titre révélé mot par mot */
export function SplitWords({
  text,
  accent,
  as = "h2",
  id,
  className,
  stagger = 40,
}: {
  text: string;
  accent?: string;
  as?: ElementType;
  id?: string;
  className?: string;
  stagger?: number;
}) {
  const { ref, shown } = useInView<HTMLElement>(0.18);
  const Tag = as;
  const mainWords = text.split(" ");
  const accentWords = accent ? accent.split(" ") : [];
  let idx = 0;

  return (
    <Tag ref={ref} id={id} className={cn("og-split-heading", shown && "is-visible", className)}>
      <span className="og-split-line">
        {mainWords.map((word, wIdx) => (
          <Fragment key={`m-${wIdx}`}>
            <span className="og-word-mask">
              <span
                className="og-word-inner"
                style={{ "--word-delay": `${idx++ * stagger}ms` } as CSSProperties}
              >
                {word}
              </span>
            </span>
            {wIdx < mainWords.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </span>
      {accentWords.length > 0 && (
        <span className="og-split-line og-split-accent">
          {accentWords.map((word, wIdx) => (
            <Fragment key={`a-${wIdx}`}>
              <span className="og-word-mask">
                <span
                  className="og-word-inner"
                  style={{ "--word-delay": `${idx++ * stagger}ms` } as CSSProperties}
                >
                  {word}
                </span>
              </span>
              {wIdx < accentWords.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </span>
      )}
    </Tag>
  );
}

/* ---------------------------------------------------------- Cartouche de section */
export function SectionBar({
  index,
  label,
  meta = "ONESIM GRAÇA · 2026",
  dark = false,
}: {
  index: string;
  label: string;
  meta?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn("og-section-bar", dark && "og-section-bar-dark")}>
      <span className="og-section-tag">{label}</span>
      <span className="og-section-code">(OG {index})</span>
      <span className="og-section-meta">{meta}</span>
    </div>
  );
}

/* ---------------------------------------------------------- Lien d'action discret */
export function ActionCircleLink({
  href,
  onClick,
  children,
  light = false,
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  light?: boolean;
}) {
  const inner = (
    <>
      <span className={cn("og-circle-badge", light && "is-light")}>
        <ArrowUpRight size={16} aria-hidden="true" />
      </span>
      <span>{children}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} onClick={onClick} className={cn("og-circle-link", light && "is-light")}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cn("og-circle-link", light && "is-light")}>
      {inner}
    </button>
  );
}
