// Non-translatable site data. Translatable copy lives in src/i18n/ui.ts.

export const PLACEHOLDER_PREFIX = "[";

/** True for values that are still `[PLACEHOLDER]`s and must not be rendered as real links. */
export function isPlaceholder(value: string): boolean {
  return value.startsWith(PLACEHOLDER_PREFIX);
}

export const site = {
  name: "Milan Nikolić",
  email: "[EMAIL]",
  resumeUrl: "/resume.pdf",
  socials: {
    github: "[GITHUB_URL]",
    linkedin: "[LINKEDIN_URL]",
    codewithmixx: "https://codewithmixx.com",
  },
  techStack: [
    "Angular",
    "TypeScript",
    "C#",
    "ASP.NET Core",
    "Entity Framework Core",
    "ASP.NET Identity",
    "JWT",
    "Domain-Driven Design",
    "SQL",
    "Git",
  ],
} as const;
