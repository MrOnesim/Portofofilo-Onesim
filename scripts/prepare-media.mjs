/**
 * Prépare les JPEG sources de public/media avant extract-media.mjs :
 *  - convertit les captures / photos de public/images/ en JPEG nommés par clé MEDIA ;
 *  - recadre les captures plein écran (chrome navigateur + barre des tâches) ;
 *  - génère des visuels de marque pour les projets sans capture disponible.
 * Idempotent : peut être relancé sans risque.
 * Usage : node scripts/prepare-media.mjs
 */
import sharp from "sharp";
import { readdir, readFile, mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "public/images";
const OUT = "public/media";

await mkdir(OUT, { recursive: true });

/* --------------------------------------------------------- captures → clés */
// [préfixe de fichier, clé MEDIA, recadrage fenêtre ?]
const MAPPING = [
  ["Afrique-NovaTech", "novatech", true],
  ["Clinique-Kpond", "kpondehou", true],
  ["connex", "connexdon", true],
  ["futur-craft", "futurcraft", true],
  ["GEN3RVTO", "gen3rvto", true],
  ["Nounagnon", "nounagnon", true],
  ["ocd.png", "ocd", true],
  ["vano-baby", "vanobaby", true],
  ["global-bisness", "gbc", true],
  ["desk-blue", "desk", false],
  ["ma-photo", "portrait", false],
];

// Visuels de marque pour les projets sans capture : clé → (titre, sous-titre).
const PLACEHOLDERS = {
  employra: ["EMPLOYRA RH", "SaaS RH & Paie"],
  hadibaba: ["HADIBABA", "Marketplace & E-Commerce"],
  pickupauth: ["PICKUPAUTH", "Automatisation & Google"],
  cipbg: ["CIPBG-AFRIQUE", "Site Institutionnel ONG"],
};

const files = await readdir(SRC);

async function convertWindowCapture(buffer) {
  const meta = await sharp(buffer).metadata();
  const { width, height } = meta;
  // Capture Windows plein écran : on retire chrome navigateur (~12% haut) et barre des tâches.
  const isFullWindow = width >= 1400 && Math.abs(width / height - 16 / 9) < 0.12;
  if (!isFullWindow) return buffer;
  const left = Math.round(width * 0.044);
  const top = Math.round(height * 0.118);
  const cropWidth = width - left * 2;
  const cropHeight = height - top - Math.round(height * 0.045);
  return sharp(buffer).extract({ left, top, width: cropWidth, height: cropHeight }).toBuffer();
}

const escapeXml = (s) =>
  s.replace(/&/g, "&" + "amp;").replace(/</g, "&" + "lt;").replace(/>/g, "&" + "gt;");

function placeholderSvg(title, subtitle) {
  const titleSpaced = escapeXml(title.slice(0, 22));
  const sub = escapeXml(subtitle);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#13233f" stroke-width="1"/>
    </pattern>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#050b16"/>
      <stop offset="1" stop-color="#0c1930"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="750" fill="url(#bg)"/>
  <rect width="1200" height="750" fill="url(#grid)"/>
  <rect x="46" y="46" width="1108" height="658" fill="none" stroke="#1d4ed8" stroke-opacity="0.55" stroke-width="1.5"/>
  <circle cx="1120" cy="80" r="7" fill="#f0b429"/>
  <text x="80" y="120" font-family="monospace" font-size="20" letter-spacing="6" fill="#7dd3fc">PROJET — CAPTURE OFFICIELLE A VENIR</text>
  <text x="80" y="420" font-family="Georgia, serif" font-style="italic" font-size="92" fill="#f4f3ef">${titleSpaced}</text>
  <text x="80" y="480" font-family="monospace" font-size="24" letter-spacing="4" fill="#93a8c8">${sub}</text>
  <path d="M 80 520 H 420" stroke="#1d4ed8" stroke-width="3"/>
  <text x="80" y="660" font-family="monospace" font-size="18" letter-spacing="3" fill="#5b7397">ONESIM GRACA — PORTFOLIO 2026</text>
</svg>`;
}

let done = 0;

for (const [prefix, key, cropWindow] of MAPPING) {
  const file = files.find((f) => f.toLowerCase().startsWith(prefix.toLowerCase()));
  if (!file) {
    console.warn(`⚠ source introuvable pour « ${prefix} » — ignoré`);
    continue;
  }
  let buffer = await readFile(path.join(SRC, file));
  if (cropWindow) buffer = await convertWindowCapture(buffer);
  const meta = await sharp(buffer).metadata();
  const targetWidth = key === "portrait" ? Math.min(meta.width, 960) : 1200;
  await sharp(buffer)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .flatten({ background: "#0b1322" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(OUT, `${key}.jpg`));
  done += 1;
  console.log(`✓ ${key}.jpg ← ${file}`);
}

for (const [key, [title, subtitle]] of Object.entries(PLACEHOLDERS)) {
  await sharp(Buffer.from(placeholderSvg(title, subtitle)))
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(OUT, `${key}.jpg`));
  done += 1;
  console.log(`✓ ${key}.jpg ← visuel de marque généré`);
}

console.log(`\n${done} sources prêtes dans ${OUT}/ — lancez ensuite : node scripts/extract-media.mjs`);
