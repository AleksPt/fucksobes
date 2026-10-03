import { defaultLocale, isLocale, type Locale } from './locale';

/** Ключ в `localStorage`: язык, который посетитель выбрал переключателем в хедере. */
export const LOCALE_STORAGE_KEY = 'fucksobes:locale';
/** Ключ в `sessionStorage`: в этой вкладке редирект на сохранённый язык уже срабатывал (защита от петли). */
export const REDIRECT_DONE_KEY = 'fucksobes:locale-redirected';

type ReadableStorage = Pick<Storage, 'getItem'>;
type WritableStorage = Pick<Storage, 'setItem'>;

/** Сохранённый язык; нет значения, неизвестное значение или недоступное хранилище → `undefined`. */
export function readLocalePreference(storage: ReadableStorage | undefined): Locale | undefined {
  try {
    const value = storage?.getItem(LOCALE_STORAGE_KEY);
    return value && isLocale(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

/** Запоминает выбор языка; ошибки хранилища (приватный режим, блокировка) молча игнорирует. */
export function saveLocalePreference(storage: WritableStorage | undefined, locale: Locale): void {
  try {
    storage?.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // без сохранения сайт работает как раньше
  }
}

export interface RedirectContext {
  currentLocale: Locale;
  /** Путь страницы без base и префикса локали; у главной он пустой */
  path: string;
  preference: Locale | undefined;
  /** Редирект уже срабатывал в этой вкладке */
  alreadyRedirected: boolean;
  /** Скрипт выполняется при загрузке документа, а не при подмене страницы клиентским роутером */
  isDocumentLoad: boolean;
}

/**
 * Нужно ли перебросить посетителя на сохранённый язык. Только с корня русской главной, только при загрузке
 * документа и только один раз за вкладку. Любые другие страницы открываются как есть.
 * Inline-скрипт в `Base.astro` повторяет это условие — держать синхронно.
 */
export function shouldRedirectToPreferred(ctx: RedirectContext): boolean {
  return (
    ctx.currentLocale === defaultLocale &&
    ctx.path === '' &&
    ctx.preference !== undefined &&
    ctx.preference !== defaultLocale &&
    !ctx.alreadyRedirected &&
    ctx.isDocumentLoad
  );
}
