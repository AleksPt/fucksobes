import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { defaultLocale, splitLocaleId, type Locale } from './locale';
import { parseTutorialId, type TutorialPage } from './tutorials';

export async function getCategories() {
  const categories = await getCollection('categories');
  return categories.sort((a, b) => a.data.order - b.data.order);
}

export async function getCategory(id: string) {
  const category = await getEntry('categories', id);
  if (!category) throw new Error(`Категория «${id}» не найдена в categories.yaml`);
  return category;
}

/** Название и описание категории на нужном языке. */
export function categoryText(category: CollectionEntry<'categories'>, locale: Locale): { title: string; description: string } {
  return locale === 'ru' ? category.data : category.data.en;
}

/** Категории, в которых на этом языке есть хотя бы один вопрос (непереведённые не показываем). */
export async function getCategoriesWithQuestions(locale: Locale) {
  const used = new Set((await getQuestions(undefined, locale)).map((q) => q.data.category.id));
  return (await getCategories()).filter((category) => used.has(category.id));
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
