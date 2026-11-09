import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";
import {
  Reveal,
  SectionBar,
  SplitWords,
} from "@/components/Primitives";
import { contactChannels, identity } from "@/data/portfolio";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [channelMode, setChannelMode] = useState<"whatsapp" | "email">("whatsapp");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("gracaonesim@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim() || "Visiteur";
    const cleanMessage =
      message.trim() || "Bonjour Onesim, j'aimerais échanger autour d'un projet web.";
    if (channelMode === "whatsapp") {
      const text = `Bonjour Onesim Graça,\n\nJe m'appelle ${cleanName}${
        email.trim() ? ` (${email.trim()})` : ""
      }.\n\n${cleanMessage}`;
      window.open(
        `https://wa.me/2290141969208?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer",
      );
    } else {
      const subject = `Contact Portfolio — ${cleanName}`;
      window.location.href = `mailto:gracaonesim@gmail.com?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(cleanMessage)}`;
    }
  };

  return (
    <section id="contact" className="og-section-night" aria-labelledby="contact-title">
      <SectionBar index="05" label="Contact" meta={identity.location} dark />

      <div className="og-container">
        <div className="og-contact-grid">
          <div className="og-contact-left">
            <SplitWords
              id="contact-title"
              text="Et si on construisait"
              accent="quelque chose ensemble ?"
              className="og-display-xl is-light"
            />

            <Reveal delay={90}>
              <p className="og-contact-lead">
                Une application web à concevoir, un besoin Full Stack ou une collaboration
                technique ? Voici mes coordonnées directes.
              </p>
            </Reveal>

            <div className="og-channels-grid" role="list" aria-label="Canaux de contact">
              {contactChannels.map((channel, idx) => (
                <Reveal key={channel.id} delay={110 + idx * 60}>
                  <a
                    href={channel.href}
                    target={channel.id === "email" ? undefined : "_blank"}
                    rel={channel.id === "email" ? undefined : "noreferrer noopener"}
                    className="og-channel-card"
                    role="listitem"
                  >
                    <span className="og-channel-label">{channel.label}</span>
                    <strong className="og-channel-handle">{channel.handle}</strong>
                    <small className="og-channel-note">{channel.note}</small>
                    <ArrowUpRight size={16} aria-hidden="true" className="og-channel-arrow" />
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal delay={280}>
              <div className="og-contact-cta-row">
                <a
                  href="https://wa.me/2290141969208"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="og-btn-primary"
                >
                  <span>Entrer en contact</span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={copyEmail}
                  className="og-btn-glass"
                  aria-label="Copier l'adresse e-mail gracaonesim@gmail.com"
                >
                  {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                  <span>{copied ? "E-mail copié !" : "Copier gracaonesim@gmail.com"}</span>
                </button>
              </div>

              <p className="og-contact-loc">
                <MapPin size={15} aria-hidden="true" />
                {identity.location} · Disponible pour projets web & opportunités Full-Stack
              </p>
            </Reveal>
          </div>

          <Reveal delay={140} className="og-contact-right">
            <form
              className="og-contact-form"
              onSubmit={handleSubmit}
              aria-label="Formulaire de prise de contact"
            >
              <div className="og-form-head">
                <span className="og-eyebrow og-eyebrow-blue">Message direct</span>
                <h3>Parlez-moi de votre projet.</h3>
              </div>

              <div className="og-form-field">
                <label htmlFor="contact-name">Votre nom</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Comment vous appelez-vous ?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="og-form-field">
                <label htmlFor="contact-email">Votre e-mail (optionnel)</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="og-form-field">
                <label>Canal d'envoi</label>
                <div className="og-form-switch">
                  <button
                    type="button"
                    className="og-switch-btn"
                    aria-pressed={channelMode === "whatsapp"}
                    onClick={() => setChannelMode("whatsapp")}
                  >
                    <MessageCircle size={14} aria-hidden="true" />
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    className="og-switch-btn"
                    aria-pressed={channelMode === "email"}
                    onClick={() => setChannelMode("email")}
                  >
                    <Mail size={14} aria-hidden="true" />
                    E-mail
                  </button>
                </div>
              </div>

              <div className="og-form-field">
                <label htmlFor="contact-message">Votre message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  placeholder="Décrivez votre besoin, votre idée ou votre projet…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="og-btn-primary og-form-submit">
                <Send size={15} aria-hidden="true" />
                <span>
                  {channelMode === "whatsapp" ? "Continuer sur WhatsApp" : "Préparer l'e-mail"}
                </span>
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
