import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const nullableUrl = z.url({ protocol: /^https$/ }).nullable();

const authorSchema = z.object({
  name: z.string().min(1),
  self: z.boolean(),
  equal_contribution: z.boolean(),
});

const publicationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  authors: z.array(authorSchema).min(1),
  venue: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  volume: z.string(),
  issue: z.string(),
  pages: z.string(),
  article_number: z.string(),
  doi: z.union([
    z.literal(""),
    z.string().regex(/^10\.\d{4,9}\/[\-._;()/:A-Za-z0-9]+$/),
  ]),
  status: z.enum([
    "Published",
    "Accepted",
    "In Press",
    "Preprint",
    "Under Review",
  ]),
  venue_metrics: z
    .object({
      badges_en: z.array(z.string().min(1)).min(1),
      badges_zh: z.array(z.string().min(1)).min(1),
      note_en: z.string().min(1),
      note_zh: z.string().min(1),
      sources: z.array(z.url({ protocol: /^https$/ })).min(1),
    })
    .nullable(),
  first_author: z.boolean(),
  co_first_author: z.boolean(),
  featured: z.boolean(),
  topics: z.array(z.string()).min(1),
  links: z.object({
    paper: nullableUrl,
    preprint: nullableUrl,
    code: nullableUrl,
    project: z.string().startsWith("/").nullable(),
  }),
  image: z.object({
    src: z.string().startsWith("/"),
    alt_en: z.string().min(1),
    alt_zh: z.string().min(1),
    label_en: z.string().min(1),
    label_zh: z.string().min(1),
  }),
  summary_en: z.string().min(1),
  summary_zh: z.string().min(1),
  bibtex: z.string().min(1),
});

const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  status: z.enum(["Ongoing", "Completed", "Published"]),
  featured: z.boolean(),
  summary_en: z.string().min(1),
  summary_zh: z.string().min(1),
  clinical_motivation_en: z.string().min(1),
  clinical_motivation_zh: z.string().min(1),
  technical_focus_en: z.string().min(1),
  technical_focus_zh: z.string().min(1),
  related_publications: z.array(z.string()),
  links: z.object({
    code: nullableUrl,
    paper: nullableUrl,
    data: nullableUrl,
  }),
  image: z.object({
    src: z.string().startsWith("/"),
    alt_en: z.string().min(1),
    alt_zh: z.string().min(1),
  }),
});

const publications = defineCollection({
  loader: file("src/data/publications.json"),
  schema: publicationSchema,
});

const projects = defineCollection({
  loader: file("src/data/projects.json"),
  schema: projectSchema,
});

export const collections = { publications, projects };
