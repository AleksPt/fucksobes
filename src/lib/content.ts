import { getCollection, type CollectionEntry } from 'astro:content';
import { parseTutorialId, type TutorialPage } from './tutorials';

export async function getCategories() {
  const categories = await getCollection('categories');
  return categories.sort((a, b) => a.data.order - b.data.order);
}

export async function getQuestions(categoryId?: string) {
  const questions = await getCollection('questions');
  return questions
    .filter((q) => !categoryId || q.data.category.id === categoryId)
    .sort((a, b) => a.data.order - b.data.order);
}

export function hasAnswer(question: CollectionEntry<'questions'>): boolean {
  return Boolean(question.body?.trim());
}

export async function getTutorialPages() {
  const entries = await getCollection('tutorials');
  return entries.map((entry) => {
    const page: TutorialPage = { ...parseTutorialId(entry.id), order: entry.data.order, title: entry.data.title };
    return { entry, page };
  });
}
