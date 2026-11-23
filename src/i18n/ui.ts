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
  "nav.language": "Language",

  "common.location": "Belgrade, Serbia",

  "hero.title": "Software Engineer",
  "hero.text":
    "I build full-stack web applications with Angular and ASP.NET Core. Sometimes I use traditional stacks like ASP.NET Razor Pages or MVC. For static sites I use Astro.",
  "hero.cta": "Get in touch",
  "hero.resume": "Resume",
  "hero.portraitAlt": "Portrait of Milan Nikolić",

  "stack.label": "Tech stack",

  "about.label": "About",
  "about.heading": "One developer, the whole stack",
  "about.lead":
    "Hi, my name is Milan. I build full-stack apps with Angular and ASP.NET Core. Most of my projects use a feature-first or vertical slice architecture. It keeps the code easy to maintain, which is a great fit for apps I build on my own.",
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
    "These are the projects that I used to work on while I was studying for my bachelor's degree. With Flower Shop being the most recent one.",

  "experience.label": "Experience & Education",
  "experience.heading": "Where I've been learning and working",

  "contact.label": "Contact",
  "contact.heading": "Have a role or a project in mind?",
  "contact.text":
    "I'm looking for a full-time role, remote or on-site if it means relocating. Email is the quickest way to reach me.",
  "contact.github": "GitHub",
  "contact.linkedin": "LinkedIn",

  "notFound.title": "Page not found",
  "notFound.text": "This page doesn't exist or has moved.",
  "notFound.home": "Back to home",
} as const;

export type UIKey = keyof typeof en;

// Must have every key that `en` has; a missing one fails `npm run check`.
const sr: Record<UIKey, string> = {
  "meta.title": "Milan Nikolić | Softverski inženjer",
  "meta.description":
    "Softverski inženjer iz Beograda koji pravi web aplikacije od početka do kraja uz Angular i ASP.NET Core.",
  "meta.jobTitle": "Softverski inženjer",

  "a11y.skip": "Preskoči na sadržaj",

  "nav.label": "Glavna",
  "nav.about": "O meni",
  "nav.projects": "Projekti",
  "nav.experience": "Iskustvo",
  "nav.contact": "Kontakt",
  "nav.open": "Otvori meni",
  "nav.close": "Zatvori meni",
  "nav.language": "Jezik",

  "common.location": "Beograd, Srbija",

  "hero.title": "Softverski inženjer",
  "hero.text":
    "Pravim full-stack web aplikacije uz Angular i ASP.NET Core. Ponekad koristim i klasičnije pristupe, kao što su ASP.NET Razor Pages ili MVC. Za statičke sajtove koristim Astro.",
  "hero.cta": "Javite se",
  "hero.resume": "CV",
  "hero.portraitAlt": "Portret Milana Nikolića",

  "stack.label": "Tehnologije",

  "about.label": "O meni",
  "about.heading": "Jedan developer, ceo stack",
  "about.lead":
    "Pozdrav, moje ime je Milan. Radim full-stack aplikacije uz Angular i ASP.NET Core. Većina mojih projekata koristi feature-first arhitekturu ili arhitekturu vertikalnih preseka. Tako kod ostaje lak za održavanje, što odlično odgovara aplikacijama koje pravim sam.",
  "about.body":
    "Osnovne studije IT inženjerstva na ITS-u u Beogradu završio sam 2026. godine, a sada sam tamo na master studijama. Paralelno predajem programiranje drugim studentima IT-a preko svoje platforme CodeWithMixx, što me tera da uvek umem da objasnim zašto se kod piše baš tako.",
  "about.fact.basedIn.label": "Lokacija",
  "about.fact.basedIn.value": "Beograd, Srbija",
  "about.fact.availability.label": "Dostupnost",
  "about.fact.availability.value": "Na daljinu ili u kancelariji",
  "about.fact.english.label": "Engleski",
  "about.fact.english.value": "C1–C2",
  "about.fact.currently.label": "Trenutno",
  "about.fact.currently.value": "Master iz IT-a, ITS Beograd",

  "projects.label": "Projekti",
  "projects.heading": "Ono što sam napravio i objavio",
  "projects.note":
    "CodeWithMixx i MixxFit su objavljeni i u upotrebi, a izgrađeni su na istoj Angular + .NET osnovi.",
  "projects.since": "Od",
  "projects.legacy": "Stara verzija",
  "projects.stack": "Tehnologije",
  "projects.live": "Sajt uživo",
  "projects.repo": "GitHub",
  "projects.caseStudy": "Studija slučaja",
  "projects.screenshot": "Snimak ekrana: {title}",
  "projects.back": "Svi projekti",

  "otherProjects.label": "Ostali projekti",
  "otherProjects.heading": "Još stvari koje sam napravio",
  "otherProjects.note":
    "Na ovim projektima sam radio tokom osnovnih studija. Najnoviji među njima je Flower Shop.",

  "experience.label": "Iskustvo i obrazovanje",
  "experience.heading": "Gde sam učio i radio",

  "contact.label": "Kontakt",
  "contact.heading": "Imate posao ili projekat na umu?",
  "contact.text":
    "Tražim posao sa punim radnim vremenom, na daljinu ili u kancelariji, čak i ako to znači preseljenje. Email je najbrži način da me kontaktirate.",
  "contact.github": "GitHub",
  "contact.linkedin": "LinkedIn",

  "notFound.title": "Stranica nije pronađena",
  "notFound.text": "Ova stranica ne postoji ili je premeštena.",
  "notFound.home": "Nazad na početnu",
};

export const ui: Record<Lang, Record<UIKey, string>> = { en, sr };
