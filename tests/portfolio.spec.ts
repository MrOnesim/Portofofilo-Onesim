import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
});

test("hero section displays ONESIM GRAÇA, tagline, CTA and scroll indicator", async ({ page }) => {
  await expect(page).toHaveTitle(/ONESIM GRAÇA/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("ONESIM GRAÇA");
  await expect(page.locator(".og-hero-quote")).toContainText(
    "Je donne vie aux idées à travers le code et la créativité.",
  );
  await expect(page.locator(".og-hero-presentation")).toContainText("Développeur web Junior");
  await expect(page.getByRole("link", { name: "Explorer mes projets" })).toBeVisible();
});

test("about section displays vision text, studio visual and academic background", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /Derrière chaque projet/ })).toBeVisible();
  await expect(page.locator("#apropos")).toContainText(
    "Je suis Onesim Graça, développeur web animé par la passion de la technologie",
  );
  await expect(page.locator("#apropos")).toContainText("Baccalauréat Série B – Économie");
  await expect(page.locator("#apropos")).toContainText("CSP Mercur, Agla");
  await expect(page.locator("#apropos")).toContainText("FuturCraft Institut");
  await expect(page.locator("#apropos")).toContainText("Octobre 2025 – Novembre 2026");
});

test("all 13 projects render in 3D coverflow and editorial gallery with modal and filters", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /Un aperçu de/ })).toBeVisible();
  await expect(page.locator(".og-pcard")).toHaveCount(13);

  await page.getByRole("button", { name: /A\. Projets personnels/ }).click();
  await expect(page.locator(".og-pcard")).toHaveCount(9);

  await page.getByRole("button", { name: /B\. Collaborations & challenges/ }).click();
  await expect(page.locator(".og-pcard")).toHaveCount(4);
  await expect(page.locator("#collaborations")).toContainText("FuturCraft Institut");
  await expect(page.locator("#collaborations")).toContainText("Vano Baby");
  await expect(page.locator("#collaborations")).toContainText("Connex & Don");
  await expect(page.locator("#collaborations")).toContainText("ONG-CDACS");

  await page.getByRole("button", { name: /Tous les projets/ }).click();
  await expect(page.locator(".og-pcard")).toHaveCount(13);

  await page.getByRole("button", { name: /Index \(13\)/ }).click();
  await expect(page.locator(".og-index-row")).toHaveCount(13);
  await expect(page.locator(".og-pcard")).toHaveCount(0);
  await expect(page.locator(".og-colophon")).toContainText("13 projets répertoriés");
  await page.getByRole("button", { name: "Grille éditoriale" }).click();
  await expect(page.locator(".og-pcard")).toHaveCount(13);

  await page.locator(".og-discover-btn").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Employra RH");
  await expect(dialog.getByRole("button", { name: "Fermer la fenêtre du projet" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest(".og-modal-card")))).toBeTruthy();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();

  await expect(
    page.locator('a[href="https://github.com/MrOnesim/ONG-CIPBG-Afrique"]').first(),
  ).toBeVisible();
});

test("technologies accordion, 22-tech matrix and all 4 contact channels work", async ({ page }) => {
  await expect(page.locator(".og-cinema-panel")).toHaveCount(4);
  await page.getByRole("button", { name: /Back-End/ }).click();
  await expect(page.locator('.og-cinema-panel[data-open="true"]')).toContainText("NestJS");

  for (const tech of [
    "React",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "Framer Motion",
    "GSAP",
    "Lenis",
    "PHP",
    "NodeJS",
    "NestJS",
    "MySQL",
    "Postgres",
    "Supabase",
    "Neon",
    "Hostinger",
  ]) {
    await expect(page.locator("#technologies")).toContainText(tech);
  }

  await expect(page.getByRole("heading", { name: /Et si on construisait/ })).toBeVisible();
  await expect(page.locator('a[href="https://github.com/MrOnesim"]').first()).toBeVisible();
  await expect(page.locator('a[href*="facebook.com"]').first()).toBeVisible();
  await expect(page.locator('a[href*="wa.me/2290141969208"]').first()).toBeVisible();
  await expect(page.locator('a[href="mailto:gracaonesim@gmail.com"]').first()).toBeVisible();
  await expect(page.locator(".og-footer")).toContainText("Concevoir. Développer. Construire.");
});

test("responsive layouts, images and WCAG A/AA accessibility pass", async ({ page }) => {
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(250);
  for (const id of ["projets", "collaborations", "technologies", "contact"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(180);
  }
  await expect
    .poll(
      () =>
        page
          .locator(".og-pcard img, .og-hero-media img")
          .evaluateAll((imgs: HTMLImageElement[]) =>
            imgs.every((img) => img.complete && img.naturalWidth > 0),
          ),
      { timeout: 15000 },
    )
    .toBeTruthy();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("design system: responsive media, one typographic voice, explicit states and human details", async ({ page }) => {
  await expect(page.locator('picture source[type="image/avif"]').first()).toHaveCount(1);
  const html = await page.content();
  expect(/data:image\/jpeg;base64,[A-Za-z0-9+/=]{2000,}/.test(html)).toBeFalsy();

  await expect(page.locator(".serif-italic")).toHaveCount(1);
  await expect(page.locator(".og-hero-quote.serif-italic")).toHaveCount(1);

  await expect(page.locator('.og-cinema-panel[data-open="true"] .og-cinema-collapse')).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect(page.locator(".og-cinema-closed").first()).toHaveAttribute("aria-expanded", "false");
  await page.locator("#projets").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator(".og-nav-link[aria-current]").count()).toBeGreaterThan(0);

  await expect(page.locator(".og-margin-note")).toContainText("captures présentées proviennent");
  await expect(page.locator(".og-colophon")).toContainText("22 technologies");
  await expect(page.locator(".og-header-clock")).toContainText("COTONOU");

  await expect(page.locator(".og-hero-actions .og-btn-primary")).toHaveCount(1);
  await expect(page.locator(".og-hero-mega")).toHaveText("ONESIM GRAÇA");
});
