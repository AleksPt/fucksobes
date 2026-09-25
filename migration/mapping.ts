import type { ParsedQuestion } from './parse.ts';

/** Один итоговый вопрос сайта; sources — номера исходных вопросов из Notion (дубли сливаются). */
export interface MappingEntry {
  id: string;
  category: string;
  /** Дословно формулировка одного из sources. */
  title: string;
  sources: number[];
}

export interface Mapping {
  entries: MappingEntry[];
}

export interface CategoryInfo {
  id: string;
  title: string;
}

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function readCategories(yaml: string): CategoryInfo[] {
  return [...yaml.matchAll(/^- id: (\S+)\n\s+title: (.+)$/gm)].map((m) => ({ id: m[1], title: m[2].trim() }));
}

export function validateMapping(questions: ParsedQuestion[], mapping: Mapping, categoryIds: string[]): string[] {
  const errors: string[] = [];
  const byNumber = new Map(questions.map((q) => [q.number, q]));
  const owner = new Map<number, string>();
  const ids = new Set<string>();

  for (const entry of mapping.entries) {
    if (!ID_RE.test(entry.id)) errors.push(`${entry.id}: id должен быть kebab-case латиницей`);
    if (!categoryIds.includes(entry.category)) errors.push(`${entry.id}: неизвестная категория "${entry.category}"`);
    if (entry.sources.length === 0) errors.push(`${entry.id}: пустой sources`);

    for (const n of entry.sources) {
      if (!byNumber.has(n)) errors.push(`${entry.id}: нет вопроса №${n}`);
      else if (owner.has(n)) errors.push(`${entry.id}: вопрос №${n} уже в ${owner.get(n)}`);
      else owner.set(n, entry.id);
    }

    if (ids.has(entry.id)) errors.push(`${entry.id}: id повторяется`);
    ids.add(entry.id);

    if (!entry.sources.some((n) => byNumber.get(n)?.title === entry.title)) {
      errors.push(`${entry.id}: title должен дословно совпадать с формулировкой одного из sources`);
    }
  }

  for (const q of questions) {
    if (!owner.has(q.number)) errors.push(`вопрос №${q.number} не размечен: ${q.title}`);
  }

  return errors;
}
