import type { CategoryInfo, Mapping } from './mapping.ts';
import type { ParsedQuestion } from './parse.ts';

export interface GeneratedFile {
  fileName: string;
  content: string;
}

/** Ответы слитых дублей: без пустых и повторов, через горизонтальную линию. */
export function mergeAnswers(answers: string[]): string {
  const unique: string[] = [];
  for (const answer of answers.map((a) => a.trim())) {
    if (answer && !unique.includes(answer)) unique.push(answer);
  }
  return unique.join('\n\n---\n\n');
}

export function buildQuestionFiles(questions: ParsedQuestion[], mapping: Mapping): GeneratedFile[] {
  const byNumber = new Map(questions.map((q) => [q.number, q]));
  const lastOrder = new Map<string, number>();

  return mapping.entries.map((entry) => {
    const order = (lastOrder.get(entry.category) ?? 0) + 1;
    lastOrder.set(entry.category, order);

    const answer = mergeAnswers(entry.sources.map((n) => byNumber.get(n)!.answer));
    // JSON-строка — валидный YAML-скаляр в двойных кавычках.
    const frontmatter = ['---', `title: ${JSON.stringify(entry.title)}`, `category: ${entry.category}`, `order: ${order}`, '---'].join('\n');

    return { fileName: `${entry.id}.md`, content: answer ? `${frontmatter}\n\n${answer}\n` : `${frontmatter}\n` };
  });
}

export function buildReview(questions: ParsedQuestion[], mapping: Mapping, categories: CategoryInfo[]): string {
  const byNumber = new Map(questions.map((q) => [q.number, q]));
  const merged = questions.length - mapping.entries.length;
  const out = [
    '# Разметка вопросов',
    '',
    `Исходных вопросов: ${questions.length}, итоговых: ${mapping.entries.length}, слито дублей: ${merged}.`,
  ];

  for (const category of categories) {
    const entries = mapping.entries.filter((e) => e.category === category.id);
    out.push('', `## ${category.title} (${entries.length})`, '');
    for (const entry of entries) {
      out.push(`- \`${entry.id}\` — ${entry.title}`);
      if (entry.sources.length > 1) {
        const sources = entry.sources.map((n) => `№${n} «${byNumber.get(n)!.title}»`).join(', ');
        out.push(`  - слиты: ${sources}`);
      }
    }
  }

  return out.join('\n') + '\n';
}
