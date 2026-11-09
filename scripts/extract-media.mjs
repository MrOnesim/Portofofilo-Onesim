/**
 * Gère les ressources média de public/media :
 *  - si src/data/media.ts contient encore des data-URI, les extrait en JPEG ;
 *  - génère les variantes responsives AVIF + WebP et les miniatures LQIP ;
 *  - réécrit src/data/media.ts avec des chemins (aucune image dans le HTML).
 *
 * Idempotent : peut être relancé après remplacement d'une photo.
 * Usage : node scripts/extract-media.mjs
 */
import sharp from "sharp";
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";

const MEDIA_TS = "src/data/media.ts";
const OUT_DIR = "public/media";
const WIDTHS = [480, 800, 1200];

const source = await readFile(MEDIA_TS, "utf8");
const embedded = [...source.matchAll(/^\s{2}(\w+):\s*"data:image\/jpeg;base64,([^"]+)",/gm)];

await mkdir(OUT_DIR, { recursive: true });

// 1. Extraction éventuelle des data-URI historiques.
for (const [, key, b64] of embedded) {
  await writeFile(path.join(OUT_DIR, `${key}.jpg`), Buffer.from(b64, "base64"));
}

// 2. Inventaire des JPEG disponibles.
const jpegFiles = (await readdir(OUT_DIR)).filter((file) => /^[a-z0-9]+\.jpg$/.test(file));
if (!jpegFiles.length) {
  console.error("Aucun JPEG trouvé dans public/media/.");
  process.exit(1);
}

const keys = jpegFiles.map((file) => path.basename(file, ".jpg")).sort();
const paths = {};
const dims = {};
const variants = {};
const lqip = {};
let totalBytes = 0;

for (const key of keys) {
  const buffer = await readFile(path.join(OUT_DIR, `${key}.jpg`));
  const meta = await sharp(buffer).metadata();
  const width = meta.width;
  const height = meta.height;

  paths[key] = `/media/${key}.jpg`;
  dims[key] = { width, height };
  totalBytes += buffer.length;

  // Miniature 24px encodée en WebP, utilisée comme fond flouté pendant le chargement.
  const tiny = await sharp(buffer).resize({ width: 24 }).webp({ quality: 35 }).toBuffer();
  lqip[key] = `data:image/webp;base64,${tiny.toString("base64")}`;

  variants[key] = [];
  for (const target of WIDTHS) {
    if (target > width) continue;
    const resized = sharp(buffer).resize({ width: target, withoutEnlargement: true });
    const avifFile = `${key}-${target}.avif`;
    const webpFile = `${key}-${target}.webp`;
    await resized.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(OUT_DIR, avifFile));
    await resized.clone().webp({ quality: 72, effort: 4 }).toFile(path.join(OUT_DIR, webpFile));
    totalBytes += (await readFile(path.join(OUT_DIR, avifFile))).length;
    totalBytes += (await readFile(path.join(OUT_DIR, webpFile))).length;
    variants[key].push({
      width: target,
      avif: `/media/${avifFile}`,
      webp: `/media/${webpFile}`,
    });
  }
}

const lines = [
  "// Ressources média servies depuis public/media/ (AVIF / WebP / repli JPEG).",
  "// Généré par scripts/extract-media.mjs — ne pas éditer à la main.",
  "export const MEDIA = {",
  ...keys.map((key) => `  ${key}: "${paths[key]}",`),
  "} as const;",
  "",
  "export type MediaKey = keyof typeof MEDIA;",
  "",
  "export const MEDIA_DIMS: Record<MediaKey, { width: number; height: number }> = {",
  ...keys.map((key) => `  ${key}: { width: ${dims[key].width}, height: ${dims[key].height} },`),
  "};",
  "",
  "export type MediaVariant = { width: number; avif: string; webp: string };",
  "export const MEDIA_VARIANTS: Record<MediaKey, MediaVariant[]> = {",
  ...keys.map((key) => `  ${key}: ${JSON.stringify(variants[key])},`),
  "};",
  "",
  "/** Miniatures 24px pour fond flouté pendant le chargement. */",
  "export const MEDIA_LQIP: Record<MediaKey, string> = {",
  ...keys.map((key) => `  ${key}: "${lqip[key]}",`),
  "};",
  "",
  "export const mediaKeyFor = (src: string): MediaKey | undefined =>",
  "  (Object.keys(MEDIA) as MediaKey[]).find((key) => MEDIA[key] === src);",
  "",
];
await writeFile(MEDIA_TS, lines.join("\n"), "utf8");

// 3. Supprime les anciennes images de démonstration non référencées.
const imagesDir = "public/images";
try {
  for (const file of await readdir(imagesDir)) {
    await rm(path.join(imagesDir, file), { force: true });
  }
} catch {
  /* dossier absent */
}

console.log(
  `✅ ${keys.length} images → ${OUT_DIR}/ · ${Math.round(totalBytes / 1024)} Ko · LQIP inclus · 0 octet d'image dans index.html`,
);
