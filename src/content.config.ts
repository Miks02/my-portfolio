import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
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

// Smaller/older projects shown as cards under the main projects. `cover` is relative to the JSON file.
const otherProjects = defineCollection({
  loader: file("./src/content/other-projects/en.json"),
  schema: ({ image }) =>
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
});

export const collections = { projects, experience, otherProjects };
