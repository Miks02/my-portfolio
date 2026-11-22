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
