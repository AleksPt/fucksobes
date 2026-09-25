import type { APIRoute } from 'astro';
import { getCategories, getQuestions } from '../lib/content';
import type { SearchDoc } from '../lib/search';
import { plainTitle } from '../lib/text';
import { url } from '../lib/url';

export const GET: APIRoute = async () => {
  const categoryTitles = new Map((await getCategories()).map((c) => [c.id, c.data.title]));
  const docs: SearchDoc[] = (await getQuestions()).map((q) => ({
    id: q.id,
    title: plainTitle(q.data.title),
    categoryTitle: categoryTitles.get(q.data.category.id) ?? '',
    url: url(`${q.data.category.id}/${q.id}/`),
  }));
  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json' } });
};
