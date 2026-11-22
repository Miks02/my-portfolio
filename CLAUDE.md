# CLAUDE.md milan-portfolio

Personal portfolio of **Milan Nikolić**, software engineer (Angular + ASP.NET Core) from Belgrade.
A one-pager (Hero → Tech stack → About → Projects → Other projects → Experience/Education → Contact) plus
case-study pages per project. Static site deployed to Cloudflare Pages.

Visual spec, tokens and component specs: @design.md

---

## Stack

- **Astro 7** (static output, no adapter), **TypeScript strict**
- **Tailwind CSS v4** via `@tailwindcss/vite`. Config lives in CSS (`@theme` in `src/styles/global.css`), so there is no `tailwind.config.js`
- **Content Collections** (`src/content.config.ts`, `glob()` / `file()` loaders, Zod 4 schemas). Import `z` from `astro/zod` (the `astro:content` export is deprecated) and use `z.url()`, not `z.string().url()`
- **No UI framework.** Interactivity is small vanilla TS `<script>`s in Astro components
- Tech-stack logos: `devicon` (devDependency, SVGs imported `?raw` and inlined at build time, no client JS)
- Fonts self-hosted via Fontsource: `@fontsource-variable/schibsted-grotesk`, `@fontsource-variable/jetbrains-mono`
- `@astrojs/sitemap`, `@astrojs/check`, Prettier (`prettier-plugin-astro`, `prettier-plugin-tailwindcss`)
- Package manager: **npm**. Node: 22 LTS (`.nvmrc`); Astro 7 needs ≥ 22.23.4 (`engines` in `package.json`)

## Commands

```bash
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve dist/
npm run check     # astro check (types + .astro diagnostics)
npm run format    # prettier --write .
```

Before calling a task done, `npm run check` and `npm run build` must both pass with zero errors.

For a dev server that keeps running in the background (e.g. for screenshots), use `npx astro dev --background`;
manage it with `astro dev stop | status | logs` (see AGENTS.md).

---

## Architecture

```
src/
  assets/
    milan.png                 # transparent B&W portrait (used via astro:assets)
    projects/*.png            # project covers (same size for all, currently 1914×965)
    projects/other/*.png      # covers for the Other projects cards
  components/
    layout/   Navbar.astro  Footer.astro  SkipLink.astro
    sections/ Hero.astro  TechStack.astro  About.astro  Projects.astro  OtherProjects.astro  Experience.astro  Contact.astro
    ui/       Button.astro  TextLink.astro  SectionLabel.astro  PortraitRing.astro
              ProjectRow.astro  OtherProjectCard.astro  TimelineItem.astro  FactList.astro
  content/
    projects/en/codewithmixx.md   # frontmatter = card data, body = case study
    projects/en/mixxfit.md
    experience/en.json
    other-projects/en.json        # cards for older/smaller projects (title, summary, stack, repoUrl, cover)
  content.config.ts
  data/
    site.ts                   # non-translatable: name, email, URLs, socials, tech stack list, isPlaceholder()
    techIcons.ts              # devicon SVGs (?raw) + brand colors for the tech-stack strip
    collections.ts            # getProjects(lang), getExperience(lang): the only place that reads collections
  i18n/
    ui.ts                     # all UI strings, keyed by locale: { en: {...} }
    utils.ts                  # getLang(), useTranslations(lang) → t(key), localizePath(lang, path)
  layouts/
    BaseLayout.astro          # <html lang>, meta/OG, fonts, global.css, Navbar, Footer, reveal script
  pages/
    index.astro
    projects/[slug].astro     # case studies (not built yet: no project has caseStudy: true)
    404.astro
  scripts/
    navbar.ts  reveal.ts
  styles/
    global.css
public/
  resume.pdf  og.png (1200×630)  favicon.svg / favicon.ico / apple-touch-icon.png (navy circle, coral MN)  robots.txt  _headers
```

Rules:
- **Sections get their data from outside.** No copy is hardcoded in `sections/*`. Strings come from `i18n/ui.ts`, data from content collections or `site.ts`.
- One component per file, PascalCase, typed `interface Props`, no `any`.
- Pages (`pages/*`) are the "smart" layer: they call `t()`, `site` and the collection helpers and pass plain props down. Sections and `ui/*` are presentational.
- Placeholders in `site.ts` start with `[`; filter them with `isPlaceholder()` so no broken links render.
- Large screens: from `3xl` (2560px) the whole page is zoomed 4/3 in `global.css` (see design.md, Layout). Don't add per-component `3xl:` sizes; do add the zoomed size to raster image `sizes`.
- Client JS stays tiny and colocated (a `<script>` in the component, or `src/scripts/*.ts` imported from it). No libraries for scroll, animation or DOM work.

### Content collections (`src/content.config.ts`)

```ts
import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      kind: z.string(),
      order: z.number(),
      summary: z.string(),
      stack: z.array(z.string()),
      liveUrl: z.url().optional(),
      repoUrl: z.url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      caseStudy: z.boolean().default(false),
    }),
});

const experience = defineCollection({
  loader: file("./src/content/experience/en.json"),
  schema: z.object({
    id: z.string(),
    period: z.string(),
    title: z.string(),
    org: z.string(),
    detail: z.string().optional(),
    current: z.boolean().default(false),
    order: z.number(),
  }),
});

export const collections = { projects, experience };
```

- The locale is the first folder of the entry id (`en/codewithmixx`) and the slug is the rest. Keep this in one helper (`getProjects(lang)`), not repeated across pages.
- If `cover` is missing, render the empty 16:10 screenshot frame. A cover keeps its own aspect ratio, never `object-cover` (see design.md).
- If `liveUrl` or `repoUrl` is missing, don't render that link.

### i18n (English only for now, ready for Serbian)

- `astro.config.mjs`: `i18n: { defaultLocale: "en", locales: ["en"], routing: { prefixDefaultLocale: false } }`.
- Every user-facing UI string lives in `src/i18n/ui.ts`.
- Adding Serbian later means: add `"sr"` to locales, `sr` keys in `ui.ts`, `content/projects/sr/*`, `experience/sr.json` and `src/pages/sr/…`. It should need no component changes. The `experience` collection uses `file()`, which reads one file, so `content.config.ts` and `getExperience()` need a small change to load `sr.json` too.
- Translatable text (including the location "Belgrade, Serbia", key `common.location`) goes in `ui.ts`; only non-translatable data goes in `site.ts`.
- Internal links that depend on the locale go through `localizePath(lang, path)`.
- `<html lang>` comes from the current locale.

### Case studies (`/projects/[slug]`)

- `getStaticPaths` returns only projects with `caseStudy: true`.
- The home-page `ProjectRow` links to the case study only when it exists.

---

## Accessibility

- A skip link to `#main` is the first focusable element.
- Landmarks: `header`, `nav[aria-label="Main"]`, `main#main`, `footer`. One H1 per page, headings in order.
- External links: `target="_blank" rel="noopener noreferrer"`, and the "↗" glyph is `aria-hidden`.
- Decorative elements (ring, glow, markers) are `aria-hidden="true"`.
- The mobile menu is fully keyboard-operable (see the Navbar spec in design.md).

## SEO & meta

- `BaseLayout` takes `title`, `description` and an optional `ogImage`. Default title: "Milan Nikolić | Software Engineer". No em dashes anywhere in copy.
- Production domain: **https://milannikolic.dev** (`site` in `astro.config.mjs`). Sitemap, canonical, absolute OG URLs and `public/robots.txt` depend on it. `BaseLayout` falls back to the request URL if `site` is ever missing.
- Include canonical, OG + Twitter tags, `theme-color` `#11161E`, `@astrojs/sitemap`, and a `public/robots.txt` that points to the sitemap.
- Add JSON-LD `Person` on the home page (name, jobTitle, url, sameAs), using real data only.

## Performance

- Ship no framework JS. Client JS should stay at a few KB (navbar + reveal).
- All images go through `astro:assets`. The portrait is served as AVIF/WebP with an explicit width, `loading="eager"`, `fetchpriority="high"`.
- Project covers are UI screenshots: WebP at `quality={90}`, widths up to the original, accurate `sizes` (including the 3xl zoom). Low quality or upscaling makes their text look pixelated.
- Load only the font weights that are used.

## Deployment (Cloudflare Pages)

- Git integration. Build command `npm run build`, output directory `dist`, env `NODE_VERSION=22`.
- Static output. Don't add the `@astrojs/cloudflare` adapter unless server features are needed.
- `public/_headers`:
  ```
  /_astro/*
    Cache-Control: public, max-age=31536000, immutable
  /*
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    X-Frame-Options: DENY
  ```
- 404 is handled by `src/pages/404.astro`, which builds to `404.html`.
- Test deploys on Vercel also work with zero config (framework preset Astro, output `dist`, Node 22.x). Vercel ignores `public/_headers` (headers would go in `vercel.json`), which is fine for a test.

---

## Working in this repo

- For UI work, follow design.md exactly. Don't add visual decoration that isn't specified there.
- Plan briefly before multi-file changes and keep each change scoped to the task.
- Ask before adding dependencies beyond the stack above.
- Never invent content (features, dates, metrics). Use `[PLACEHOLDER]` and list it in the summary.
- Check every component at 375px and at ≥ 1280px.
- After changes, run `npm run check`, `npm run build` and the design lint from design.md.
- Use Tailwind's canonical class names (what IntelliSense's "suggestCanonicalClasses" suggests): spacing-scale values like `max-w-300`, `pt-18`, `-left-26` instead of `max-w-[1200px]`, `pt-[72px]`, `left-[-104px]`. Arbitrary values stay only where there's no scale equivalent (e.g. `text-[17px]`, `tracking-[-0.03em]`).
- Commits use Conventional Commits (`feat():`, `fix():`, `style():`, `content():`, `chore():`). Only commit when asked.
- If a decision here turns out to be wrong, propose an update to this file instead of quietly working around it.

## Open placeholders

- `public/resume.pdf` (the hero Resume button 404s until it exists)
- Case studies: none written yet (`caseStudy: false` on both projects)
