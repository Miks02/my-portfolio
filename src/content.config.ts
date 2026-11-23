import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
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
      /** Project start, shown as "Since …" (e.g. "Dec 2025"). */
      since: z.string().optional(),
      /** An older version that is no longer in use; shown with a "Legacy" marker. */
      legacy: z.boolean().default(false),
      caseStudy: z.boolean().default(false),
    }),
});

// One JSON file per language (`en.json`, `sr.json`); the entry id is the file name, i.e. the locale.
// Each file is `{ "items": [...] }`.
const experience = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/experience" }),
  schema: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        period: z.string(),
        title: z.string(),
        org: z.string(),
        detail: z.string().optional(),
        current: z.boolean().default(false),
        order: z.number(),
      }),
    ),
  }),
});

// Smaller/older projects shown as cards under the main projects. One file per language, like experience.
// `cover` is relative to the JSON file.
const otherProjects = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/other-projects" }),
  schema: ({ image }) =>
    z.object({
      items: z.array(
        z.object({
          id: z.string(),
          order: z.number(),
          title: z.string(),
          since: z.string().optional(),
          summary: z.string(),
          stack: z.array(z.string()),
          repoUrl: z.url().optional(),
          cover: image().optional(),
        }),
      ),
    }),
});

export const collections = { projects, experience, otherProjects };
