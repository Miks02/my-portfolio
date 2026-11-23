# CLAUDE.md milan-portfolio

Personal portfolio of **Milan Nikolić**, software engineer (Angular + ASP.NET Core) from Belgrade.
A one-pager (Hero → Tech stack → About → Projects → Other projects → Experience/Education → Contact) plus
case-study pages per project, in English (`/`) and Serbian, Latin script (`/sr/`). Static site deployed to Cloudflare Workers (static assets) at https://milannikolic.dev.

Visual spec, tokens and component specs: @design.md

---

## Stack

- **Astro 7** (static output, no adapter), **TypeScript strict**
- **Tailwind CSS v4** via `@tailwindcss/vite`. Config lives in CSS (`@theme` in `src/styles/global.css`), so there is no `tailwind.config.js`
- **Content Collections** (`src/content.config.ts`, `glob()` loaders, Zod 4 schemas). Import `z` from `astro/zod` (the `astro:content` export is deprecated) and use `z.url()`, not `z.string().url()`
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
    ui/       Button.astro  TextLink.astro  SectionLabel.astro  PortraitRing.astro  LanguageSwitcher.astro
              ProjectRow.astro  OtherProjectCard.astro  TimelineItem.astro  FactList.astro
  content/
    projects/{en,sr}/*.md         # one file per project per language; frontmatter = card data, body = case study
    experience/{en,sr}.json       # { "items": [...] }, one file per language
    other-projects/{en,sr}.json   # { "items": [...] }, cards for older/smaller projects
  content.config.ts
  data/
    site.ts                   # non-translatable: name, email, URLs, socials, tech stack list, isPlaceholder()
    techIcons.ts              # devicon SVGs (?raw) + brand colors for the tech-stack strip
    collections.ts            # getProjects/getExperience/getOtherProjects(lang): the only place that reads collections
  i18n/
    ui.ts                     # languages (name, htmlLang, ogLocale) + all UI strings: { en: {...}, sr: {...} }
    utils.ts                  # getLang(), useTranslations(lang) → t(key), localizePath(), getAlternatePath()
  layouts/
    BaseLayout.astro          # <html lang>, meta/OG/hreflang, fonts, global.css, Navbar, Footer, reveal script
  views/
    HomePage.astro            # the home page, shared by both languages (reads the locale from the URL)
    NotFoundPage.astro
  pages/                      # thin route files, one per language, that render a view
    index.astro  404.astro
    sr/index.astro  sr/404.astro
    projects/[slug].astro     # case studies (not built yet: no project has caseStudy: true)
  scripts/
    navbar.ts  reveal.ts
  styles/
    global.css
public/
  Milan_Nikolic_CV.pdf (hero Resume button, `site.resumeUrl`)  og.png (1200×630)  favicon.svg / favicon.ico / apple-touch-icon.png (navy circle, coral MN)  robots.txt  _headers
```

Rules:
- **Sections get their data from outside.** No copy is hardcoded in `sections/*`. Strings come from `i18n/ui.ts`, data from content collections or `site.ts`.
- One component per file, PascalCase, typed `interface Props`, no `any`.
- Views (`views/*`) are the "smart" layer: they call `t()`, `site` and the collection helpers and pass plain props down. Sections and `ui/*` are presentational.
- Pages (`pages/*`, `pages/sr/*`) are thin: they only render a view, so each page exists once and the locale comes from the folder (`Astro.currentLocale`).
- Placeholders in `site.ts` start with `[`; filter them with `isPlaceholder()` so no broken links render.
- Large screens: from `3xl` (2560px) the whole page is zoomed 4/3 in `global.css` (see design.md, Layout). Don't add per-component `3xl:` sizes; do add the zoomed size to raster image `sizes`.
- Client JS stays tiny and colocated (a `<script>` in the component, or `src/scripts/*.ts` imported from it). No libraries for scroll, animation or DOM work.

### Content collections (`src/content.config.ts`)

- `projects`: `glob("**/*.md")` in `content/projects/`. Frontmatter: `title`, `kind`, `order`, `summary`, `stack`, optional `liveUrl`, `repoUrl`, `cover`, `coverAlt`, `since`, plus `legacy` and `caseStudy` (both default `false`).
- `experience` and `otherProjects`: `glob("*.json")`, one file per language (`en.json`, `sr.json`) shaped `{ "items": [...] }`. The entry id is the locale, so `getExperience(lang)` is a `getEntry("experience", lang)`. A missing language file throws, so the build fails instead of showing the wrong language.
- The collection helpers return plain interfaces (`ExperienceItem`, `OtherProject` in `collections.ts`) that TypeScript checks against the schemas.
- For projects, the locale is the first folder of the entry id (`en/codewithmixx`) and the slug is the rest. Keep this in one helper (`getProjects(lang)`), not repeated across pages.
- If `cover` is missing, render the empty 16:10 screenshot frame. A cover keeps its own aspect ratio, never `object-cover` (see design.md).
- If `liveUrl` or `repoUrl` is missing, don't render that link.

### i18n (English + Serbian)

- Locales: `en` (default, at `/`) and `sr` (Serbian, Latin script, at `/sr/`). `astro.config.mjs`: `locales: ["en", "sr"]`, `prefixDefaultLocale: false`. Keep it in sync with `languages` in `ui.ts`.
- Every user-facing UI string lives in `src/i18n/ui.ts`. `sr` is typed `Record<UIKey, string>`, so a key that exists in `en` but not in `sr` fails `npm run check`. There is no silent English fallback.
- Translatable text (including the location, key `common.location`) goes in `ui.ts`; only non-translatable data goes in `site.ts`.
- Content per language: `content/projects/<lang>/*.md`, `experience/<lang>.json`, `other-projects/<lang>.json`. Dates in content are written per language (`Dec 2025` / `dec 2025`; Serbian months are lowercase and abbreviated, which avoids grammatical cases after "Od").
- Serbian copy addresses the reader formally ("Vi"). Common dev terms stay in English (full-stack, stack, frontend, feature-first).
- Internal links that depend on the locale go through `localizePath(lang, path)`. The same page in another language comes from `getAlternatePath(pathname, lang)` (used by hreflang and the language switcher).
- A new page means a view in `views/` plus a thin route file in `pages/` and in `pages/sr/`. For a dynamic route (case studies), each route file has its own `getStaticPaths` calling `getProjects("en")` / `getProjects("sr")`.
- `BaseLayout` sets `<html lang>` (`sr-Latn` for Serbian), `og:locale` (`en_US` / `sr_RS`) plus `og:locale:alternate`, and `<link rel="alternate" hreflang>` for every language plus `x-default` (English). Pages with `noindex` (404) skip canonical and hreflang.
- No automatic redirect by browser language: every URL always shows one language, and visitors switch with the `EN / SR` switcher in the navbar (see design.md).
- The Serbian 404: Astro writes `pages/sr/404.astro` to `dist/sr/404/index.html`, and the small `localized404Pages` integration in `astro.config.mjs` moves it to `dist/sr/404.html`, where Cloudflare's `404-page` handling finds it for unknown `/sr/...` URLs.
- Adding another language: add it to `languages` and `ui` in `ui.ts`, `locales` (and the sitemap `i18n` map and `localized404Pages`) in `astro.config.mjs`, its content files, and `pages/<lang>/`. No component changes.

### Case studies (`/projects/[slug]`)

- `getStaticPaths` returns only projects with `caseStudy: true`, for that route file's language.
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
- The sitemap leaves out 404 pages and lists the language versions of each URL (`i18n` option of `@astrojs/sitemap`).
- Add JSON-LD `Person` on the home page (name, jobTitle, url, sameAs), using real data only.

## Performance

- Ship no framework JS. Client JS should stay at a few KB (navbar + reveal).
- All images go through `astro:assets`. The portrait is served as AVIF/WebP with an explicit width, `loading="eager"`, `fetchpriority="high"`.
- Project covers are UI screenshots: WebP at `quality={90}`, widths up to the original, accurate `sizes` (including the 3xl zoom). Low quality or upscaling makes their text look pixelated.
- Load only the font weights that are used.

## Deployment (Cloudflare Workers, static assets)

- Hosted as the Worker **`my-portfolio`** with Git integration (Workers Builds): every push to `main` runs `npm run build` and deploys `dist/`. Node 22 or newer.
- Config lives in `wrangler.jsonc` at the repo root:
  - `name` must match the Worker's name in the dashboard (`my-portfolio`), or a new Worker gets created instead of updating this one.
  - `assets.directory` is `./dist`.
  - `assets.not_found_handling: "404-page"` makes unknown URLs return `dist/404.html` (from `src/pages/404.astro`) with a 404 status (unknown `/sr/...` URLs get `dist/sr/404.html`). Without it they return an empty 404.
- Static output only. No Worker script (`main`) and no `@astrojs/cloudflare` adapter unless server features are needed.
- Domains (Worker → Settings → Domains & Routes): `milannikolic.dev` and `www.milannikolic.dev` are Custom Domains; the DNS zone is on Cloudflare. The canonical host is `milannikolic.dev`; `www` should 301 to it via a Cloudflare Redirect Rule ("Redirect from WWW to root"), which is dashboard config, not code. The `*.workers.dev` URL can stay on; canonical tags point to the domain.
- `public/_headers` (Workers static assets apply it):
  ```
  /_astro/*
    Cache-Control: public, max-age=31536000, immutable
  /*
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    X-Frame-Options: DENY
  ```
- After deploying, check: home 200, `/og.png` 200, an unknown URL renders the 404 page, `og:image` points to `https://milannikolic.dev/og.png`. To refresh link previews, use LinkedIn's Post Inspector.
- Test deploys on Vercel also work with zero config (framework preset Astro, output `dist`). Vercel ignores `public/_headers` and `wrangler.jsonc`.

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

- Case studies: none written yet (`caseStudy: false` on both projects)
