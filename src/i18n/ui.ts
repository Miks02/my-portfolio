// All user-facing UI strings, keyed by locale. Add `sr` here when Serbian lands.

export const languages = {
  en: "English",
} as const;

export const defaultLang = "en" satisfies keyof typeof languages;

export const ui = {
  en: {
    "meta.title": "Milan Nikolić — Software Engineer",
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
      "I build web applications end to end: Angular on the front, ASP.NET Core behind it.",
    "hero.cta": "Get in touch",
    "hero.resume": "Resume",
    "hero.portraitAlt": "Portrait of Milan Nikolić",

    "stack.label": "Tech stack",

    "about.label": "About",
    "about.heading": "Full stack, with the backend done properly.",
    "about.lead":
      "I'm a software engineer from Belgrade working across the stack with Angular and ASP.NET Core. I tend to structure code for maintainability every time, meaning that 90% of my projects are written with 'feature-first' or 'vertical slice' architecture. A perfect combination for solo apps.",
    "about.body":
      "I finished my BSc in Information Technology at ITS Belgrade in 2026 and I'm now doing a master's there. Alongside that I teach programming one-on-one to IT students through codewithmixx, which keeps me sharp on explaining why code is written the way it is.",
    "about.fact.basedIn.label": "Based in",
    "about.fact.basedIn.value": "Belgrade, Serbia",
    "about.fact.availability.label": "Availability",
    "about.fact.availability.value": "Remote or relocation",
    "about.fact.english.label": "English",
    "about.fact.english.value": "C1–C2",
    "about.fact.currently.label": "Currently",
    "about.fact.currently.value": "Master's in IT, ITS Belgrade",

    "projects.label": "Projects",
    "projects.heading": "Things I've built and shipped",
    "projects.note":
      "Both are deployed and in use, built with the same Angular + .NET foundation.",
    "projects.live": "Live site",
    "projects.repo": "GitHub",
    "projects.caseStudy": "Case study",
    "projects.screenshot": "project screenshot",
    "projects.back": "All projects",

    "experience.label": "Experience & Education",
    "experience.heading": "Where I've been learning and working",

    "contact.label": "Contact",
    "contact.heading": "Have a role or a project in mind?",
    "contact.text":
      "I'm looking for a full-time role — remote, or on-site if it means relocating. Email is the quickest way to reach me.",
    "contact.github": "GitHub",
    "contact.linkedin": "LinkedIn",
    "contact.codewithmixx": "codewithmixx",

    "notFound.title": "Page not found",
    "notFound.text": "This page doesn't exist or has moved.",
    "notFound.home": "Back to home",
  },
} as const;

export type Lang = keyof typeof ui;
export type UIKey = keyof (typeof ui)[typeof defaultLang];
