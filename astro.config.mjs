// @ts-check
import { rename, rmdir } from "node:fs/promises";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

/**
 * Astro writes src/pages/sr/404.astro to dist/sr/404/index.html, but Cloudflare looks for the
 * nearest `404.html` (wrangler.jsonc, not_found_handling: "404-page"). This moves it to
 * dist/sr/404.html after the build, so unknown /sr/... URLs get the Serbian 404 page.
 * @param {string[]} locales the non-default locales
 * @returns {import("astro").AstroIntegration}
 */
function localized404Pages(locales) {
  return {
    name: "localized-404-pages",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        for (const locale of locales) {
          await rename(
            new URL(`${locale}/404/index.html`, dir),
            new URL(`${locale}/404.html`, dir),
          );
          await rmdir(new URL(`${locale}/404/`, dir));
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // Production domain. Sitemap, canonical and OG URLs depend on it.
  site: "https://milannikolic.dev",
  i18n: {
    defaultLocale: "en",
    // Keep in sync with `languages` in src/i18n/ui.ts. English stays at "/", Serbian lives under "/sr/".
    locales: ["en", "sr"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // lastmod = build date, so search engines see when the site last changed.
      lastmod: new Date(),
      // 404 pages don't belong in the sitemap.
      filter: (page) => !page.endsWith("/404/"),
      // Adds <xhtml:link hreflang> to each URL, pointing to the same page in the other languages.
      i18n: { defaultLocale: "en", locales: { en: "en", sr: "sr" } },
    }),
    localized404Pages(["sr"]),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
