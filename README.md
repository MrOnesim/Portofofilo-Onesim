# ONESIM GRAÇA — Portfolio « BLUEPRINT NOCTURNE »

Portfolio personnel de **Graça Onesim Géraldo Ema-ayé**, développeur web Full Stack.
React 19 · TypeScript · Vite · Tailwind CSS · Lenis · GSAP · lucide-react.

## Démarrage

```bash
npm install
npm run dev
npm run build
node scripts/verify-dist.mjs
```

> **Déploiement :** publier le dossier `dist/` **entier** (`index.html` + `media/`).
> `verify-dist.mjs` échoue si une variante d'image manque ou si une image est encore
> embarquée en base64 dans le HTML.

## Direction artistique — « Blueprint Nocturne »

Le portfolio comme un **plan d'architecte tracé la nuit** : document d'atelier
éditorial, pas simple carte de visite.

1. **Grille 12 colonnes + double rythme** — sections sur **encre profonde** (`#04070f`)
   alternées avec des **papier albâtre** (`#f2f0e9`), toutes deux structurées par un
   **quadrillage blueprint** subtil (pas de 28 px, renfort tous les 140 px).
2. **Trois voix typographiques, hiérarchisées** — Space Grotesk en display monumental
   (`clamp` fluide jusqu'à 10.5rem, tracking −0.05em), **Instrument Serif italique**
   pour les moments signature (accroche du héros, accents de titres, devise du footer),
   IBM Plex Mono pour les annotations (indices, cotes, coordonnées, colophon).
3. **Un signal rare, un accent rare** — bleu électrique (`#1d4ed8`) pour l'action et
   l'identité ; **ambre** (`#f0b429`) strictement réservé aux états « En cours » et aux
   annotations d'alerte ; sarcelle (`#2dd4bf`) pour « Terminé ».

Motifs récurrents : cotes et croix de repérage du portrait (« PLAN N°01 — COTONOU »),
coordonnées géographiques, cartouches de section `(OG — 02)`, bandeau catalogue en
défilement infini, pastilles d'état lumineuses, grain pellicule animé.

### Motion — GSAP + ScrollTrigger

- Timeline d'entrée du héros : signature (`ONESIM` plein / `GRAÇA` contourné), portrait
  qui se « développe » (clip-path + rim bleu), cote et badge « Disponible » en cascade.
- Révélations en cascade au scroll (IntersectionObserver maison, léger), titres révélés
  mot à mot derrière masques (`.og-word-mask`).
- Marquee infini du bandeau catalogue, parallax du portrait, retrait du contenu au scroll.
- `prefers-reduced-motion: reduce` neutralise **tout** le mouvement (dernier bloc CSS).

## Média — pipeline

Toutes les images sont de vrais fichiers dans `public/media/` :
AVIF → WebP → JPEG, variantes 480/800 px, dimensions intrinsèques,
chargement différé et miniature LQIP 24 px en fond flouté.
Le portrait du héros est le seul `fetchPriority="high"`.

```bash
node scripts/prepare-media.mjs   # public/images/ → public/media/ (recadre les
                                 # captures plein écran, génère les visuels de marque)
node scripts/extract-media.mjs   # génère variantes + LQIP + régénère src/data/media.ts
```

- `_sources-images/` conserve les fichiers sources originaux (captures, portraits,
  photos secteur) — ne pas les servir en production.
- 16 clés média : 9 captures réelles de sites déployés (OCD, Clinique Kpondéhou,
  GEN3RVTO, Afrique NovaTech, Nounagnon-Cyberlens, Connex & Don, FuturCraft Institut,
  Vano Baby, Global Business Center), le portrait et le bureau, et **4 visuels de marque**
  (Employra RH, HADIBABA, PickupAuth, ONG-CIPBG-Afrique) générés en attendant les
  captures officielles — remplacez-les en déposant `employra.jpg`, `hadibaba.jpg`, etc.
  dans `public/media/` puis en relancant `extract-media.mjs`.

`src/data/media.ts` et `src/styles/` sont générés ou structurés : ne pas éditer
`media.ts` à la main.

## Contenu

`src/data/portfolio.ts` centralise identité, navigation, parcours, les **13 projets**
(9 personnels + 4 collaborations), les 4 univers technologiques, les 22 outils et les
4 canaux de contact. Chaque projet porte statut, rôle personnel, technologies, capture,
lien live et/ou dépôt GitHub.

Trois vues pour les projets, sans duplication : **Grille éditoriale** (défaut),
**Aperçu 3D** (coverflow), **Index** (tableau dense `N° / Projet / Domaine / Statut / Lien`).

## Accessibilité

États explicites : `aria-current` sur la navigation, `aria-expanded` + `aria-controls`
sur l'accordéon, `aria-pressed` sur les filtres et la matrice, `aria-live` sur les
résultats, piège de focus et restauration du focus dans la modale, `focus-visible`
renforcé, lien d'évitement, survol neutralisé au toucher, contraste AA vérifié par axe
et `prefers-reduced-motion` intégré.

## Vérification

```bash
npx tsc --noEmit
npx playwright install --with-deps chromium
npx playwright test
```

6 tests : héros, à propos, 13 projets (filtres / vues / modale), technologies et
contact, responsive + images + WCAG A/AA (axe-core), et design system (média
responsives, voix typographique, états ARIA, détails humains).
