export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Id записи контента вида `<локаль>/<путь>`: файл лежит в `src/content/<коллекция>/<локаль>/…`.
 * Одинаковый `<путь>` у файлов разных локалей связывает перевод с оригиналом.
 */
export function splitLocaleId(id: string): { locale: Locale; path: string } {
  const [locale, ...rest] = id.split('/');
  const path = rest.join('/');
  if (!locale || !path || !isLocale(locale)) {
    throw new Error(`Файл «${id}» должен лежать в папке локали (${locales.join(', ')}): src/content/<коллекция>/<локаль>/…`);
  }
  return { locale, path };
}
