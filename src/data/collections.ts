import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/ui";

export type Project = CollectionEntry<"projects"> & { slug: string };

/**
 * Projects for a locale, sorted by `order`.
 * The locale is the first folder of the entry id (`en/codewithmixx`); the slug is the rest.
 */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const entries = await getCollection("projects", ({ id }) => id.startsWith(`${lang}/`));
  return entries
    .map((entry) => ({ ...entry, slug: entry.id.slice(lang.length + 1) }))
    .sort((a, b) => a.data.order - b.data.order);
}

/** Experience items sorted by `order`. Only English exists for now (experience/en.json). */
export async function getExperience(_lang: Lang): Promise<CollectionEntry<"experience">[]> {
  const entries = await getCollection("experience");
  return entries.sort((a, b) => a.data.order - b.data.order);
}
