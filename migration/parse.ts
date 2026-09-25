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
  let depth = 0;
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
    if (trimmed === '<details>') {
      depth++;
      continue;
    }
    if (trimmed === '</details>') {
      depth--;
      continue;
    }
    if (trimmed.startsWith('<callout')) {
      inCallout = true;
      continue;
    }
    if (trimmed === '</callout>') {
      inCallout = false;
      continue;
    }

    const summary = SUMMARY_RE.exec(trimmed);
    const text = cleanInline(summary ? `**${summary[1].trim()}**` : trimmed);
    if (text === '' || text === '****') continue;

    const quote = inCallout ? '> ' : '';
    if (LIST_ITEM_RE.test(text)) {
      const tabs = /^\t*/.exec(raw)![0].length;
      const base = 2 + depth + (inCallout ? 1 : 0);
      emit(quote + '    '.repeat(Math.max(0, tabs - base)) + text, true);
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
