import { describe, expect, it } from 'vitest';
import { LOCALE_STORAGE_KEY, readLocalePreference, saveLocalePreference, shouldRedirectToPreferred, type RedirectContext } from './locale-preference';

const memory = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial));
  return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
};
const broken = {
  getItem: () => {
    throw new Error('blocked');
  },
  setItem: () => {
    throw new Error('blocked');
  },
};

describe('readLocalePreference', () => {
  it('читает известные локали', () => {
    expect(readLocalePreference(memory({ [LOCALE_STORAGE_KEY]: 'en' }))).toBe('en');
    expect(readLocalePreference(memory({ [LOCALE_STORAGE_KEY]: 'ru' }))).toBe('ru');
  });

  it('пусто, мусор и ошибки хранилища → undefined', () => {
    expect(readLocalePreference(memory())).toBeUndefined();
    expect(readLocalePreference(memory({ [LOCALE_STORAGE_KEY]: 'de' }))).toBeUndefined();
    expect(readLocalePreference(broken)).toBeUndefined();
    expect(readLocalePreference(undefined)).toBeUndefined();
  });
});

describe('saveLocalePreference', () => {
  it('сохраняет локаль, которую потом можно прочитать', () => {
    const storage = memory();
    saveLocalePreference(storage, 'en');
    expect(readLocalePreference(storage)).toBe('en');
  });

  it('не падает при недоступном хранилище', () => {
    expect(() => saveLocalePreference(broken, 'en')).not.toThrow();
    expect(() => saveLocalePreference(undefined, 'en')).not.toThrow();
  });
});

describe('shouldRedirectToPreferred', () => {
  const base: RedirectContext = { currentLocale: 'ru', path: '', preference: 'en', alreadyRedirected: false, isDocumentLoad: true };

  it('перебрасывает с корня русской главной при сохранённом en', () => {
    expect(shouldRedirectToPreferred(base)).toBe(true);
  });

  it.each([
    ['ничего не сохранено', { preference: undefined }],
    ['сохранён ru', { preference: 'ru' as const }],
    ['уже перебрасывали в этой вкладке', { alreadyRedirected: true }],
    ['клиентский переход, а не загрузка документа', { isDocumentLoad: false }],
    ['английская главная', { currentLocale: 'en' as const }],
    ['страница вопроса', { path: 'swift/optional/' }],
    ['категория', { path: 'swift/' }],
    ['случайный вопрос', { path: 'random/' }],
  ])('не перебрасывает: %s', (_, patch) => {
    expect(shouldRedirectToPreferred({ ...base, ...patch })).toBe(false);
  });
});
