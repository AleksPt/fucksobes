import type { Locale } from './locale';
import { url } from './url';

/** Случайный элемент списка, отличный от `exclude` (если есть из чего выбирать). */
export function pickRandom<T>(items: readonly T[], exclude?: T, random: () => number = Math.random): T | undefined {
  const pool = items.length > 1 ? items.filter((item) => item !== exclude) : items;
  return pool[Math.floor(random() * pool.length)];
}

/** Вопрос для страницы «Случайный вопрос»; отдаётся из `random/<id>.json`. */
export interface RandomQuestionData {
  id: string;
  title: string;
  category: { id: string; title: string };
  /** Отрендеренный Markdown ответа. */
  html: string;
}

export function randomQuestionUrl(id: string, locale: Locale): string {
  return url(`random/${id}.json`, locale);
}

async function fetchQuestion(path: string): Promise<RandomQuestionData> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

/** Загрузчик вопросов с кэшем: повторный запрос того же id не идёт в сеть, неудачный — повторяется. */
export function createQuestionLoader(load: (path: string) => Promise<RandomQuestionData> = fetchQuestion) {
  const cache = new Map<string, Promise<RandomQuestionData>>();
  return (id: string, locale: Locale): Promise<RandomQuestionData> => {
    const key = `${locale}/${id}`;
    let promise = cache.get(key);
    if (!promise) {
      promise = load(randomQuestionUrl(id, locale));
      promise.catch(() => cache.delete(key));
      cache.set(key, promise);
    }
    return promise;
  };
}
