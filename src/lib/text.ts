/** Русское склонение после числа: forms = [один, два, пять]. */
export function pluralize(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

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
