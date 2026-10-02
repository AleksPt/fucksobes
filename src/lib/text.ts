export interface TitlePart {
  text: string;
  code: boolean;
}

/** Заголовок вопроса с inline-кодом в `обратных кавычках`. */
export function splitInlineCode(title: string): TitlePart[] {
  const parts = title.split('`');
  if (parts.length % 2 === 0) return [{ text: plainTitle(title), code: false }];
  return parts.map((text, i) => ({ text, code: i % 2 === 1 })).filter((p) => p.text !== '');
}

export function plainTitle(title: string): string {
  return title.replace(/`/g, '');
}
