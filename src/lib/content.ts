import { getCollection, type CollectionEntry } from 'astro:content';

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
