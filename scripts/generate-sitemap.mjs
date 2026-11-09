/**
 * Génère public/sitemap.xml à partir de SITE_URL.
 * Usage : SITE_URL="https://portofofilo-onesim.vercel.app" node scripts/generate-sitemap.mjs
 */
import { writeFile } from "node:fs/promises";

const url = process.env.SITE_URL || "https://portofofilo-onesim.vercel.app";
const today = new Date().toISOString().slice(0, 10);

const sections = [
  { path: "", priority: "1.0" },
  { path: "#apropos", priority: "0.8" },
  { path: "#projets", priority: "0.9" },
  { path: "#collaborations", priority: "0.7" },
  { path: "#technologies", priority: "0.7" },
  { path: "#contact", priority: "0.8" },
];

const base = url.replace(/\/$/, "");
const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sections
  .map((s) => `  <url><loc>${base}/${s.path}</loc><lastmod>${today}</lastmod><priority>${s.priority}</priority></url>`)
  .join("\n")}\n</urlset>\n`;

await writeFile("public/sitemap.xml", body, "utf8");
console.log(`✅ public/sitemap.xml généré pour ${base}`);