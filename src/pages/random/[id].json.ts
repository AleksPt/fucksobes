import type { APIRoute, GetStaticPaths } from 'astro';
import { getEntry } from 'astro:content';
import { getQuestions, hasAnswer } from '../../lib/content';
import type { RandomQuestionData } from '../../lib/random';

// Ответы для «Случайного вопроса» грузятся по одному, чтобы страница не весила мегабайты.
export const getStaticPaths = (async () => {
  const questions = (await getQuestions()).filter(hasAnswer);
  return questions.map((question) => ({ params: { id: question.id }, props: { question } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { question } = props as Awaited<ReturnType<typeof getStaticPaths>>[number]['props'];
  const category = await getEntry(question.data.category);
  const data: RandomQuestionData = {
    id: question.id,
    title: question.data.title,
    category: { id: category.id, title: category.data.title },
    html: question.rendered?.html ?? '',
  };
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};
