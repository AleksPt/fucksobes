import { defaultLocale, isLocale, type Locale } from './locale';

const base = (): string => import.meta.env.BASE_URL.replace(/\/$/, '');

/** Путь внутри сайта с учётом `base` (сайт на GitHub Pages живёт в /fucksobes/) и локали: английская версия — под `/en/`. */
export function url(path = '', locale: Locale = defaultLocale): string {
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return `${base()}${prefix}/${path.replace(/^\//, '')}`;
}

/** Разбирает pathname страницы на локаль и путь без `base` и префикса локали: `/fucksobes/en/swift/` → `en`, `swift/`. */
export function parsePathname(pathname: string): { locale: Locale; path: string } {
  const rest = pathname.startsWith(base()) ? pathname.slice(base().length) : pathname;
  const [, first = '', ...tail] = rest.split('/');
  if (first !== defaultLocale && isLocale(first)) return { locale: first, path: tail.join('/') };
  return { locale: defaultLocale, path: rest.replace(/^\//, '') };
}
