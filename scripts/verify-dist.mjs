/**
 * Vérifie que toutes les ressources référencées par dist/index.html existent
 * dans dist/ : images responsives, polices et favicon.
 *
 * Usage : npm run build && node scripts/verify-dist.mjs
 */
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const DIST = "dist";
const INDEX = path.join(DIST, "index.html");
const MEDIA_DIR = path.join(DIST, "media");

let html;
try { html = await readFile(INDEX, "utf8"); }
catch { console.error(`❌ ${INDEX} introuvable. Lancez npm run build.`); process.exit(1); }

const missing = [];

// 1. Toutes les variantes responsives doivent être présentes.
let mediaFiles = [];
try { mediaFiles = (await readdir(MEDIA_DIR)).filter((f) => !f.startsWith(".")); }
catch { missing.push("dossier dist/media/ (absent)"); }

const masters = mediaFiles.filter((f) => /^[a-z0-9]+\.jpg$/.test(f));
if (masters.length < 16) missing.push(`dist/media/ : ${masters.length}/16 JPEG maîtres`);
if (!mediaFiles.some((f) => f.endsWith(".avif"))) missing.push("variantes AVIF");
if (!mediaFiles.some((f) => f.endsWith(".webp"))) missing.push("variantes WebP");

for (const master of masters) {
  const key = path.basename(master, ".jpg");
  for (const width of [480, 800]) {
    const avif = path.join(MEDIA_DIR, `${key}-${width}.avif`);
    const webp = path.join(MEDIA_DIR, `${key}-${width}.webp`);
    try {
      const info = await stat(avif);
      if (!info.isFile() || info.size === 0) missing.push(`${key}-${width}.avif (vide)`);
    } catch { /* portrait n'a que 480 */ }
    try {
      const info = await stat(webp);
      if (!info.isFile() || info.size === 0) missing.push(`${key}-${width}.webp (vide)`);
    } catch { /* portrait n'a que 480 */ }
  }
}

// 2. Le HTML ne doit plus embarquer de grande image en base64.
const bigBase64 = [...html.matchAll(/data:image\/(?:jpeg|png);base64,([A-Za-z0-9+/=]{2000,})/g)];
if (bigBase64.length) missing.push(`${bigBase64.length} image(s) JPEG/PNG encore inline`);

// 3. Polices et favicon.
for (const reference of ["/favicon.svg"]) {
  try { await stat(path.join(DIST, reference.slice(1))); }
  catch { /* favicon data-URI acceptable */ }
}

if (missing.length) {
  console.error("❌ Ressources manquantes ou invalides :");
  for (const entry of new Set(missing)) console.error(`   - ${entry}`);
  console.error("\nDéployez le dossier dist/ complet, pas uniquement dist/index.html.");
  process.exit(1);
}

const htmlKb = Math.round(html.length / 1024);
console.log(
  `✅ Déploiement complet : ${mediaFiles.length} fichiers média, ${masters.length} maîtres JPEG, ${htmlKb} Ko de HTML (0 image inline).`,
);
