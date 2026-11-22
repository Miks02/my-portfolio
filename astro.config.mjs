// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Production domain. Sitemap, canonical and OG URLs depend on it.
  site: "https://milannikolic.dev",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    routing: { prefixDefaultLocale: false },
  },
  // lastmod = build date, so search engines see when the site last changed.
  integrations: [sitemap({ lastmod: new Date() })],
  vite: {
    plugins: [tailwindcss()],
  },
});
