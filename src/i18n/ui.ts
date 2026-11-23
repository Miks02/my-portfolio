// All user-facing UI strings, keyed by locale.

/**
 * Supported languages. The key is the locale used in URLs (`/sr/...`) and in astro.config.mjs.
 * - `name`: shown in the language switcher, in its own language
 * - `htmlLang`: `<html lang>` (BCP 47; `sr-Latn` = Serbian in Latin script, for screen readers)
 * - `ogLocale`: `og:locale` (Open Graph wants `language_TERRITORY`)
 */
export const languages = {
  en: { name: "English", htmlLang: "en", ogLocale: "en_US" },
  sr: { name: "Srpski", htmlLang: "sr-Latn", ogLocale: "sr_RS" },
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "en";

const en = {
  "meta.title": "Milan Nikolić | Software Engineer",
  "meta.description":
    "Software engineer from Belgrade building web applications end to end with Angular and ASP.NET Core.",
  "meta.jobTitle": "Software Engineer",

  "a11y.skip": "Skip to content",

  "nav.label": "Main",
  "nav.about": "About",
  "nav.projects": "Projects",
  "nav.experience": "Experience",
  "nav.contact": "Contact",
  "nav.open": "Open menu",
  "nav.close": "Close menu",

  "common.location": "Belgrade, Serbia",

  "hero.title": "Software Engineer",
  "hero.text":
    "I build full-stack web applications with Angular and ASP.NET Core. Sometimes i use traditional stacks like ASP.NET Razor Pages or MVC. For static sites i use Astro.",
  "hero.cta": "Get in touch",
  "hero.resume": "Resume",
  "hero.portraitAlt": "Portrait of Milan Nikolić",

  "stack.label": "Tech stack",

  "about.label": "About",
  "about.heading": "One developer, the whole stack",
  "about.lead":
    "I'm a software engineer from Belgrade who works across the whole stack with Angular and ASP.NET Core. Most of my projects use a feature-first or vertical slice architecture. It keeps the code easy to maintain, and it's a great fit for apps I build on my own.",
  "about.body":
    "I finished my Bachelor's degree in IT Engineering at ITS Belgrade in 2026 and I'm now doing a master's there. Alongside that I teach programming to other IT students via my own platform CodeWithMixx, which keeps me sharp on explaining why code is written the way it is.",
  "about.fact.basedIn.label": "Based in",
  "about.fact.basedIn.value": "Belgrade, Serbia",
  "about.fact.availability.label": "Availability",
  "about.fact.availability.value": "Remote or on-site",
  "about.fact.english.label": "English",
  "about.fact.english.value": "C1–C2",
  "about.fact.currently.label": "Currently",
  "about.fact.currently.value": "Master's in IT, ITS Belgrade",

  "projects.label": "Projects",
  "projects.heading": "Things I've built and shipped",
  "projects.note":
    "CodeWithMixx and MixxFit are deployed and in use, built on the same Angular + .NET foundation.",
  "projects.since": "Since",
  "projects.legacy": "Legacy",
  "projects.stack": "Stack",
  "projects.live": "Live site",
  "projects.repo": "GitHub",
  "projects.caseStudy": "Case study",
  "projects.screenshot": "{title} screenshot",
  "projects.back": "All projects",

  "otherProjects.label": "Other projects",
  "otherProjects.heading": "More things I've built",
  "otherProjects.note":
    "These are the projects that i used to work on while i was studying for my bachelor's degree. With Flower Shop being the most recent one.",

  "experience.label": "Experience & Education",
  "experience.heading": "Where I've been learning and working",

  "contact.label": "Contact",
  "contact.heading": "Have a role or a project in mind?",
  "contact.text":
    "I'm looking for a full-time role, remote or on-site if it means relocating. Email is the quickest way to reach me.",
  "contact.github": "GitHub",
  "contact.linkedin": "LinkedIn",
  "contact.codewithmixx": "CodeWithMixx",

  "notFound.title": "Page not found",
  "notFound.text": "This page doesn't exist or has moved.",
  "notFound.home": "Back to home",
} as const;

export type UIKey = keyof typeof en;

// Serbian strings come in a later step. Until then, missing keys fall back to English.
// Once it's filled in, this becomes `Record<UIKey, string>` so a missing key fails `npm run check`.
const sr: Partial<Record<UIKey, string>> = {};

export const ui: Record<Lang, Partial<Record<UIKey, string>>> = { en, sr };
export const defaultStrings: Record<UIKey, string> = en;
