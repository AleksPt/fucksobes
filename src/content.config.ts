import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const categories = defineCollection({
  loader: file('src/content/categories.yaml'),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
  }),
});

const questions = defineCollection({
  loader: glob({ base: './src/content/questions', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    category: reference('categories'),
  }),
});

export const collections = { categories, questions };
