import MiniSearch from 'minisearch';

export interface SearchDoc {
  id: string;
  title: string;
  categoryTitle: string;
  url: string;
}

export function normalizeTerm(term: string): string | null {
  const normalized = term.toLowerCase().replace(/ё/g, 'е').replace(/`/g, '');
  return normalized === '' ? null : normalized;
}

/** Поиск только по формулировкам вопросов: префикс, опечатки, все слова обязательны. */
export function createSearch(docs: SearchDoc[]): (query: string, limit?: number) => SearchDoc[] {
  const index = new MiniSearch<SearchDoc>({
    fields: ['title'],
    storeFields: ['title', 'categoryTitle', 'url'],
    processTerm: normalizeTerm,
    searchOptions: { prefix: true, fuzzy: 0.2, combineWith: 'AND' },
  });
  index.addAll(docs);

  return (query, limit = 20) =>
    index
      .search(query)
      .slice(0, limit)
      .map((hit) => ({ id: String(hit.id), title: hit.title, categoryTitle: hit.categoryTitle, url: hit.url }));
}
