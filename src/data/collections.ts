import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/ui";

export type Project = CollectionEntry<"projects"> & { slug: string };

/**
 * Projects for a locale, sorted by `order`.
 * The locale is the first folder of the entry id (`en/codewithmixx`); the slug is the rest.
 */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const entries = await getCollection("projects", ({ id }) =>
    id.startsWith(`${lang}/`),
  );
  return entries
    .map((entry) => ({ ...entry, slug: entry.id.slice(lang.length + 1) }))
    .sort((a, b) => a.data.order - b.data.order);
}

// Same fields as the schemas in content.config.ts; TypeScript errors below if they drift apart.
export interface ExperienceItem {
  id: string;
  period: string;
  title: string;
  org: string;
  detail?: string;
  current: boolean;
  order: number;
}

export interface OtherProject {
  id: string;
  order: number;
  title: string;
  since?: string;
  summary: string;
  stack: string[];
  repoUrl?: string;
  cover?: ImageMetadata;
}

/**
 * Experience items for a locale (`experience/<lang>.json`), sorted by `order`.
 * Throws if the file is missing, so an untranslated page fails the build instead of showing English.
 */
export async function getExperience(lang: Lang): Promise<ExperienceItem[]> {
  const entry = await getEntry("experience", lang);
  if (!entry) throw new Error(`Missing src/content/experience/${lang}.json`);
  return [...entry.data.items].sort((a, b) => a.order - b.order);
}

/** Other (smaller/older) projects for a locale (`other-projects/<lang>.json`), sorted by `order`. */
export async function getOtherProjects(lang: Lang): Promise<OtherProject[]> {
  const entry = await getEntry("otherProjects", lang);
  if (!entry)
    throw new Error(`Missing src/content/other-projects/${lang}.json`);
  return [...entry.data.items].sort((a, b) => a.order - b.order);
}
