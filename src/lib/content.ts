import { getCollection } from 'astro:content';

export async function getCategories() {
  const categories = await getCollection('categories');
  return categories.sort((a, b) => a.data.order - b.data.order);
}

export async function getQuestions(categoryId?: string) {
  const questions = await getCollection('questions');
  return categoryId ? questions.filter((q) => q.data.category.id === categoryId) : questions;
}
