// Content collections configuration.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    role: z.string(),
    clientOrEntity: z.string(),
    stack: z.array(z.string()),
    metrics: z.array(z.string()).default([]),
    externalUrl: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };
