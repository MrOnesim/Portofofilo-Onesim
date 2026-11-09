import { SiteChrome } from "@/components/Chrome";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";
import { Hero } from "@/sections/Hero";
import { Projects } from "@/sections/Projects";
import { Stack } from "@/sections/Stack";

export default function App() {
  return (
    <div id="top" className="og-site-root">
      <div className="og-site-bg" aria-hidden="true" />
      <a className="og-skip-link" href="#projets">
        Aller aux projets
      </a>
      <SiteChrome />
      <main>
        <Hero />
        <About />
        <Projects />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
