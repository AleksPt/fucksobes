/** Путь внутри сайта с учётом `base` (сайт на GitHub Pages живёт в /fucksobes/). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
