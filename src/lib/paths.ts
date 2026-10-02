import type { APIRoute } from 'astro';
import type { SearchDoc } from './search';
import {
  categoryText,
  getCategories,
  getCategory,
  getCategoriesWithQuestions,
  getQuestions,
  getTutorialPages,
  hasAnswer,
  questionSlug,
} from './content';
import type { Locale } from './locale';
import type { RandomQuestionData } from './random';
import { plainTitle } from './text';
import { tutorials } from './tutorials';
import { url } from './url';

// getStaticPaths и обработчики страниц, общие для обеих локалей: страницы ru и en — тонкие обёртки над одними и теми же views.

export async function categoryPaths(locale: Locale) {
  const categories = await getCategoriesWithQuestions(locale);
  return categories.map((category) => ({ params: { category: category.id }, props: { category } }));
}

export async function questionPaths(locale: Locale) {
  const questions = await getQuestions(undefined, locale);
  return questions.map((question) => ({
    params: { category: question.data.category.id, id: questionSlug(question) },
    props: { question },
  }));
}

/** Темы, у которых на этом языке есть хотя бы одна страница (для русского — все темы). */
export async function tutorialTopicPaths(locale: Locale) {
  const pages = await getTutorialPages(locale);
  return tutorials
    .filter((tutorial) => locale === 'ru' || pages.some(({ page }) => page.topic === tutorial.slug))
    .map((tutorial) => ({ params: { slug: tutorial.slug }, props: { tutorial } }));
}

export async function tutorialPagePaths(locale: Locale) {
  const items = await getTutorialPages(locale);
  return items.map(({ entry, page }) => ({ params: { slug: page.topic, id: page.slug }, props: { entry, page } }));
}

// Ответы для «Случайного вопроса» грузятся по одному, чтобы страница не весила мегабайты.
export async function randomPaths(locale: Locale) {
  const questions = (await getQuestions(undefined, locale)).filter(hasAnswer);
  return questions.map((question) => ({ params: { id: questionSlug(question) }, props: { question } }));
}

export const randomQuestionResponse: APIRoute = async ({ props }) => {
  const { question } = props as Awaited<ReturnType<typeof randomPaths>>[number]['props'];
  const locale = question.id.split('/')[0] as Locale;
  const category = await getCategory(question.data.category.id);
  const data: RandomQuestionData = {
    id: questionSlug(question),
    title: question.data.title,
    category: { id: category.id, title: categoryText(category, locale).title },
    html: question.rendered?.html ?? '',
  };
  return json(data);
};

export const searchIndexResponse =
  (locale: Locale): APIRoute =>
  async () => {
    const categoryTitles = new Map((await getCategories()).map((c) => [c.id, categoryText(c, locale).title]));
    const docs: SearchDoc[] = (await getQuestions(undefined, locale)).map((q) => ({
      id: questionSlug(q),
      title: plainTitle(q.data.title),
      categoryTitle: categoryTitles.get(q.data.category.id) ?? '',
      url: url(`${q.data.category.id}/${questionSlug(q)}/`, locale),
    }));
    return json(docs);
  };

const json = (data: unknown) => new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
