import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const categories = defineCollection({
  loader: file('src/content/categories.yaml'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int(),
    // Название и описание английской версии (русские — в `title` и `description`).
    en: z.object({ title: z.string(), description: z.string() }),
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

// Туториалы лежат в папке темы: `<тема>/<id>.md`, где тема — slug из src/lib/tutorials.ts.
// `order` — номер раздела в теме (с 1), по нему страница привязывается к кнопке на странице темы.
const tutorials = defineCollection({
  loader: glob({ base: './src/content/tutorials', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int().positive(),
  }),
});

export const collections = { categories, questions, tutorials };
