import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, splitLocaleId, type Locale } from './locale';
import { parseTutorialId, type TutorialPage } from './tutorials';

export async function getCategories() {
  const categories = await getCollection('categories');
  return categories.sort((a, b) => a.data.order - b.data.order);
}

/** Slug вопроса без папки локали: часть URL и ключ, связывающий переводы */
export function questionSlug(question: CollectionEntry<'questions'>): string {
  return splitLocaleId(question.id).path;
}

export async function getQuestions(categoryId?: string, locale: Locale = defaultLocale) {
  const questions = await getCollection('questions', (q) => splitLocaleId(q.id).locale === locale);
  return questions
    .filter((q) => !categoryId || q.data.category.id === categoryId)
    .sort((a, b) => a.data.order - b.data.order);
}

export function hasAnswer(question: CollectionEntry<'questions'>): boolean {
  return Boolean(question.body?.trim());
}

export async function getTutorialPages(locale: Locale = defaultLocale) {
  const entries = await getCollection('tutorials', (e) => splitLocaleId(e.id).locale === locale);
  return entries.map((entry) => {
    const { topic, slug } = parseTutorialId(entry.id);
    const page: TutorialPage = { topic, slug, order: entry.data.order, title: entry.data.title };
    return { entry, page };
  });
}
