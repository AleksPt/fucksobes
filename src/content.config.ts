import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const categories = defineCollection({
  loader: file('src/content/categories.yaml'),
  schema: z.object({
    title: z.string(),
    // Моноширинный тег на карточке: идентификатор, по которому тему узнают с первого взгляда.
    tag: z.string(),
    description: z.string(),
    order: z.number().int(),
  }),
});

// Тело файла — ответ; пустое тело значит, что ответа пока нет.
const questions = defineCollection({
  loader: glob({ base: './src/content/questions', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    category: reference('categories'),
    order: z.number().int(),
  }),
});

export const collections = { categories, questions };
