export interface ParsedQuestion {
  number: number;
  title: string;
  /** Ответ в Markdown; пустая строка — ответа нет. */
  answer: string;
}

const QUESTION_RE = /^(\d+)\. (.*)$/;
const LIST_ITEM_RE = /^([-*+]|\d+\.) /;
const FENCE_RE = /^\s*```/;
const SUMMARY_RE = /^<summary>(.*)<\/summary>$/;

/** Убирает служебную разметку Notion внутри строки. */
export function cleanInline(text: string): string {
  return text
    .replace(/<mention-page[^>]*\/>/g, '')
    .replace(/\s*\{color="[^"]*"\}/g, '')
    .replace(/<span[^>]*>(.*?)<\/span>/g, '$1')
    .replace(/ /g, ' ')
    .trim();
}

/**
 * Чинит жирный из Notion: склеивает соседние span'ы (`****`), выносит `<br>` и пробелы
 * из-под границ `**…**`. Inline-код не меняется, непарный `**` остаётся как есть.
 */
export function normalizeBold(text: string): string {
  const code: string[] = [];
  const masked = text.replace(/`[^`]*`/g, (m) => `\u0000${code.push(m) - 1}\u0000`);
  const fixed = masked.replace(/\*{4}/g, '').replace(/\*\*(.+?)\*\*/g, (whole, inner: string) => {
    const m = /^(\s*)(.*?)((?:\s|<br\s*\/?>)*)$/.exec(inner)!;
    if (m[2] === '') return whole;
    return `${m[1]}**${m[2]}**${m[3]}`;
  });
  return fixed.replace(/\u0000(\d+)\u0000/g, (_, i) => code[Number(i)]);
}

/** Формулировка вопроса: одна строка без жирного и переносов, inline-код сохраняется. */
export function cleanTitle(text: string): string {
  return cleanInline(text)
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Строки внутри toggle «ответ» (с исходными табами) → Markdown. */
export function convertAnswer(lines: string[]): string {
  const out: string[] = [];
  let prevListItem = false;
  let prevQuote = false;
  // Табы первого пункта текущей серии списка: вложенность считается от него.
  let listBase = 0;
  let inCallout = false;
  let fence: string[] | null = null;

  // Каждый блок Notion — отдельный абзац; соседние пункты списка — без пустой строки.
  const emit = (block: string, listItem: boolean) => {
    if (out.length > 0 && !(listItem && prevListItem)) out.push(inCallout && prevQuote ? '>' : '');
    out.push(block);
    prevListItem = listItem;
    prevQuote = inCallout;
  };

  for (const raw of lines) {
    if (fence) {
      if (FENCE_RE.test(raw)) {
        fence.push('```');
        emit(fence.join('\n'), false);
        fence = null;
      } else {
        fence.push(raw);
      }
      continue;
    }

    const trimmed = raw.trim();
    if (FENCE_RE.test(raw)) {
      fence = [trimmed];
      continue;
    }
    if (trimmed === '<details>' || trimmed === '</details>') continue;
    if (trimmed.startsWith('<callout')) {
      inCallout = true;
      continue;
    }
    if (trimmed === '</callout>') {
      inCallout = false;
      continue;
    }

    const summary = SUMMARY_RE.exec(trimmed);
    const text = normalizeBold(cleanInline(summary ? `**${summary[1].trim()}**` : trimmed)).trim();
    if (text === ''|| text === '****') continue;

    const quote = inCallout ? '> ' : '';
    if (LIST_ITEM_RE.test(text)) {
      const tabs = /^\t*/.exec(raw)![0].length;
      // Новая серия начинается после любого не-пункта (или при входе/выходе из callout):
      // в Notion пункт бывает глубже предыдущего абзаца, но в Markdown это не вложенность.
      if (!prevListItem || prevQuote !== inCallout) {
        listBase = tabs;
      } else if (tabs < listBase) {
        // Пункт мельче начала серии (например, «5.» после пунктов абзаца под «4.»):
        // новая серия через пустую строку, иначе «5.» станет ленивым продолжением абзаца.
        listBase = tabs;
        prevListItem = false;
      }
      emit(quote + '    '.repeat(Math.max(0, tabs - listBase)) + text, true);
    } else {
      emit(quote + text, false);
    }
  }

  if (fence) emit([...fence, '```'].join('\n'), false);
  return out.join('\n');
}

export function parseNotionExport(text: string): ParsedQuestion[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const questions: ParsedQuestion[] = [];

  for (let i = 0; i < lines.length; i++) {
    const match = QUESTION_RE.exec(lines[i]);
    if (!match) continue;

    const question: ParsedQuestion = { number: Number(match[1]), title: cleanTitle(match[2]), answer: '' };

    if (lines[i + 1] === '\t<details>') {
      const body: string[] = [];
      let j = i + 1;
      // Обычно один toggle «ответ»; но бывает несколько подряд с собственными заголовками (например, №204).
      while (lines[j] === '\t<details>') {
        const heading = SUMMARY_RE.exec((lines[j + 1] ?? '').trim())?.[1].trim();
        if (heading && heading !== 'ответ') body.push(`\t\t**${heading}**`);
        j += 2; // пропускаем <details> и <summary>
        let inFence = false;
        while (j < lines.length && (inFence || lines[j] !== '\t</details>')) {
          if (FENCE_RE.test(lines[j])) inFence = !inFence;
          body.push(lines[j]);
          j++;
        }
        j++; // закрывающий </details>
      }
      question.answer = convertAnswer(body);
      i = j - 1;
    }

    questions.push(question);
  }

  return questions;
}
