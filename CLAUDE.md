# CLAUDE.md milan-portfolio

Personal portfolio of **Milan Nikolić**, software engineer (Angular + ASP.NET Core) from Belgrade.
A one-pager (Hero → Tech stack → About → Projects → Experience/Education → Contact) plus
case-study pages per project. Static site deployed to Cloudflare Pages.

Visual spec, tokens and component specs: @design.md

---

## Stack

- **Astro 6** (static output, no adapter), **TypeScript strict**
- **Tailwind CSS v4** via `@tailwindcss/vite`. Config lives in CSS (`@theme` in `src/styles/global.css`), so there is no `tailwind.config.js`
- **Content Collections** (`src/content.config.ts`, `glob()` / `file()` loaders, Zod schemas)
- **No UI framework.** Interactivity is small vanilla TS `<script>`s in Astro components
- Tech-stack logos: `devicon` (devDependency, SVGs imported `?raw` and inlined at build time, no client JS)
- Fonts self-hosted via Fontsource: `@fontsource-variable/schibsted-grotesk`, `@fontsource-variable/jetbrains-mono`
- `@astrojs/sitemap`, `@astrojs/check`, Prettier (`prettier-plugin-astro`, `prettier-plugin-tailwindcss`)
- Package manager: **npm**. Node: 22 LTS (`.nvmrc`)

## Commands

```bash
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve dist/
npm run check     # astro check (types + .astro diagnostics)
npm run format    # prettier --write .
```

Before calling a task done, `npm run check` and `npm run build` must both pass with zero errors.

Known issue: if `npm run build` fails with `Missing field 'tsconfigPaths'`, npm has hoisted Vite 8
next to Astro's Vite 7. Add `"overrides": { "vite": "^7" }` to `package.json` and reinstall.

---

## Architecture

```
src/
  assets/
    milan.png                 # transparent B&W portrait (used via astro:assets)
  components/
    layout/   Navbar.astro  Footer.astro  SkipLink.astro
    sections/ Hero.astro  TechStack.astro  About.astro  Projects.astro  Experience.astro  Contact.astro
    ui/       Button.astro  TextLink.astro  SectionLabel.astro  PortraitRing.astro
              ProjectRow.astro  TimelineItem.astro  FactList.astro
  content/
    projects/en/codewithmixx.md   # frontmatter = card data, body = case study
    projects/en/mixxfit.md
    experience/en.json
  content.config.ts
  data/
    site.ts                   # non-translatable: name, email, URLs, socials, tech stack list
  i18n/
    ui.ts                     # all UI strings, keyed by locale: { en: {...} }
    utils.ts                  # getLang(), useTranslations(lang) → t(key)
  layouts/
    BaseLayout.astro          # <html lang>, meta/OG, fonts, global.css, Navbar, Footer, reveal script
  pages/
    index.astro
    projects/[slug].astro     # case studies
    404.astro
  scripts/
    navbar.ts  reveal.ts
  styles/
    global.css
public/
  resume.pdf  favicon.svg  og.png  robots.txt  _headers
```

Rules:
- **Sections get their data from outside.** No copy is hardcoded in `sections/*`. Strings come from `i18n/ui.ts`, data from content collections or `site.ts`.
- One component per file, PascalCase, typed `interface Props`, no `any`.
- Client JS stays tiny and colocated (a `<script>` in the component, or `src/scripts/*.ts` imported from it). No libraries for scroll, animation or DOM work.

### Content collections (`src/content.config.ts`)

```ts
import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    kind: z.string(),               
    order: z.number(),
    summary: z.string(),              
    stack: z.array(z.string()),
    liveUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
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
- If `cover` is missing, render the empty screenshot frame (see design.md).
- If `liveUrl` or `repoUrl` is missing, don't render that link.

### i18n (English only for now, ready for Serbian)

- `astro.config.mjs`: `i18n: { defaultLocale: "en", locales: ["en"], routing: { prefixDefaultLocale: false } }`.
- Every user-facing UI string lives in `src/i18n/ui.ts`.
- Adding Serbian later means: add `"sr"` to locales, `sr` keys in `ui.ts`, `content/projects/sr/*`, `experience/sr.json` and `src/pages/sr/…`. It should need no component changes.
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
- Set `site: "[SITE_URL]"` in `astro.config.mjs`; sitemap, canonical and absolute OG URLs depend on it.
- Include canonical, OG + Twitter tags, `theme-color` `#11161E`, `@astrojs/sitemap`, and a `public/robots.txt` that points to the sitemap.
- Add JSON-LD `Person` on the home page (name, jobTitle, url, sameAs), using real data only.

## Performance

- Ship no framework JS. Client JS should stay at a few KB (navbar + reveal).
- All images go through `astro:assets`. The portrait is served as AVIF/WebP with an explicit width, `loading="eager"`, `fetchpriority="high"`.
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

---

## Working in this repo

- For UI work, follow design.md exactly. Don't add visual decoration that isn't specified there.
- Plan briefly before multi-file changes and keep each change scoped to the task.
- Ask before adding dependencies beyond the stack above.
- Never invent content (features, dates, metrics). Use `[PLACEHOLDER]` and list it in the summary.
- Check every component at 375px and at ≥ 1280px.
- After changes, run `npm run check`, `npm run build` and the design lint from design.md.
- Commits use Conventional Commits (`feat():`, `fix():`, `style():`, `content():`, `chore():`). Only commit when asked.
- If a decision here turns out to be wrong, propose an update to this file instead of quietly working around it.

## Open placeholders

- `[SITE_URL]` (production domain)
- Contact email, GitHub URL, LinkedIn URL
- `repoUrl` for codewithmixx and mixxfit, `liveUrl` for mixxfit
- `public/resume.pdf`, `public/og.png` (1200×630)
- Project screenshots (`cover`)

---

## Seed content (temporary: delete this section once the content files exist)

**site.ts.** Name "Milan Nikolić", location "Belgrade, Serbia". Stack: Angular, TypeScript, C#, ASP.NET Core, Entity Framework Core, ASP.NET Identity, JWT, Domain-Driven Design, SQL, Git.

**Hero line:** "I build web applications end to end: Angular on the front, ASP.NET Core with a clean domain model behind it."

**About.** H2: "Full stack, with the backend done properly."
- Lead: "I'm a software engineer from Belgrade working across the stack with Angular and ASP.NET Core. On the backend I structure code around the domain with DDD, and I handle auth with ASP.NET Identity and my own JWT + refresh-token flow — the same setup that runs in my production apps."
- Second paragraph: "I finished my BSc in Information Technology at ITS Belgrade in 2026 and I'm now doing a master's there. Alongside that I teach programming one-on-one to IT students through codewithmixx, which keeps me sharp on explaining why code is written the way it is."
- Facts: Based in — Belgrade, Serbia · Availability — Remote or relocation · English — C1–C2 · Currently — Master's in IT, ITS Belgrade

**Projects.** H2: "Things I've built and shipped". Note: "Both are deployed and in use, built with the same Angular + .NET foundation."
1. **codewithmixx**, kind "Tutoring platform", liveUrl https://codewithmixx.com, stack Angular, ASP.NET Core, EF Core, DDD, JWT.
   Summary: "The platform behind my 1-on-1 online programming lessons for IT students. An Angular front end on an ASP.NET Core API, modelled with DDD, with ASP.NET Identity and JWT + refresh tokens handling accounts and sessions."
2. **mixxfit**, kind "Fitness app", stack Angular, ASP.NET Core, EF Core, ASP.NET Identity.
   Summary: "A fitness app I designed and built end to end — Angular on the client, ASP.NET Core on the server, on the same DDD and token-auth foundation. Deployed and live; a native Android client in Kotlin is next."

**Experience.** H2: "Where I've been learning and working". Items, top to bottom:
1. Nov 2026 — present · Master's studies, Information Technology · ITS Belgrade · current
2. Ongoing · Programming tutor · codewithmixx · One-on-one online lessons for IT students
3. Oct 2026 · BSc, Information Technology · ITS Belgrade · Thesis graded 10
4. May — Jun 2025 · Software Engineering Intern · Comtrade · Angular + .NET

**Contact.** H2: "Have a role or a project in mind?" Text: "I'm looking for a full-time role — remote, or on-site if it means relocating. Email is the quickest way to reach me."
