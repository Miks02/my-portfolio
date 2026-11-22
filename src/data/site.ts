// Non-translatable site data. Translatable copy lives in src/i18n/ui.ts.

import type { TechIconKey } from "./techIcons";

export interface TechItem {
  name: string;
  icon: TechIconKey;
}

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
  // `icon` is a key in src/data/techIcons.ts (devicon SVGs, inlined at build time).
  techStack: [
    { name: "Angular", icon: "angular" },
    { name: "TypeScript", icon: "typescript" },
    { name: "Tailwind", icon: "tailwind" },
    { name: "C#", icon: "csharp" },
    { name: "ASP.NET Core", icon: "dotnet" },
    { name: "Entity Framework Core", icon: "efcore" },
    { name: "PostgreSQL", icon: "postgresql" },
    { name: "MySQL", icon: "mysql" },
    { name: "SQL Server", icon: "sqlserver" },
    { name: "Git", icon: "git" },
  ] satisfies readonly TechItem[],
} as const;
