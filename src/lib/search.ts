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

const WORD_SEPARATOR = /[\n\r\p{Z}\p{P}]+/u;
const CAMEL_BOUNDARY = /(?<=[\p{Ll}\p{N}])(?=\p{Lu})|(?<=\p{Lu})(?=\p{Lu}\p{Ll})/u;

/**
 * Слово, а для camelCase ещё и его части и «хвосты»: ViewDidAppear → viewdidappear, view, did, appear,
 * didappear. Регистр сохраняется — его снимает processTerm.
 */
export function tokenize(text: string): string[] {
  const tokens = new Set<string>();
  for (const word of text.split(WORD_SEPARATOR)) {
    if (word === '') continue;
    tokens.add(word);
    const parts = word.split(CAMEL_BOUNDARY);
    if (parts.length < 2) continue;
    parts.forEach((part, i) => {
      tokens.add(part);
      tokens.add(parts.slice(i).join(''));
    });
  }
  return [...tokens];
}

/** Поиск только по формулировкам вопросов: префикс, опечатки, все слова обязательны. */
export function createSearch(docs: SearchDoc[]): (query: string, limit?: number) => SearchDoc[] {
  const index = new MiniSearch<SearchDoc>({
    fields: ['title'],
    storeFields: ['title', 'categoryTitle', 'url'],
    tokenize,
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

/** Следующий индекс подсвеченного результата: не выходит за [0, count - 1], при пустом списке — 0. */
export function stepIndex(current: number, delta: number, count: number): number {
  return Math.max(0, Math.min(current + delta, count - 1));
}
