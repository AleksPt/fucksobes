import { describe, expect, it } from 'vitest';
import { buildQuestionFiles, buildReview, mergeAnswers } from './generate.ts';
import type { Mapping } from './mapping.ts';
import type { ParsedQuestion } from './parse.ts';

const questions: ParsedQuestion[] = [
  { number: 1, title: 'ARC', answer: '' },
  { number: 2, title: 'Как работает "ARC"', answer: 'Подсчёт ссылок' },
  { number: 3, title: 'ARC', answer: 'Подсчёт ссылок' },
  { number: 4, title: 'Что такое UIView', answer: '' },
  { number: 5, title: 'weak ссылки', answer: 'Не увеличивают счётчик' },
];

const mapping: Mapping = {
  entries: [
    { id: 'arc', category: 'memory', title: 'Как работает "ARC"', sources: [1, 2, 3] },
    { id: 'weak', category: 'memory', title: 'weak ссылки', sources: [5] },
    { id: 'uiview', category: 'uikit', title: 'Что такое UIView', sources: [4] },
  ],
};

describe('mergeAnswers', () => {
  it('убирает пустые и одинаковые, склеивает через ---', () => {
    expect(mergeAnswers(['', 'A', ' A ', 'B'])).toBe('A\n\n---\n\nB');
    expect(mergeAnswers(['', ''])).toBe('');
  });
});

describe('buildQuestionFiles', () => {
  const files = buildQuestionFiles(questions, mapping);

  it('файл на запись mapping, order считается внутри категории', () => {
    expect(files.map((f) => f.fileName)).toEqual(['arc.md', 'weak.md', 'uiview.md']);
    expect(files[0].content).toBe(
      '---\ntitle: "Как работает \\"ARC\\""\ncategory: memory\norder: 1\n---\n\nПодсчёт ссылок\n',
    );
    expect(files[1].content).toContain('order: 2');
    expect(files[2].content).toContain('order: 1');
  });

  it('вопрос без ответа — пустое тело', () => {
    expect(files[2].content).toBe('---\ntitle: "Что такое UIView"\ncategory: uikit\norder: 1\n---\n');
  });
});

describe('buildReview', () => {
  it('показывает итоги и слитые дубли', () => {
    const review = buildReview(questions, mapping, [
      { id: 'memory', title: 'Память' },
      { id: 'uikit', title: 'UIKit' },
    ]);
    expect(review).toContain('Исходных вопросов: 5, итоговых: 3, слито дублей: 2.');
    expect(review).toContain('## Память (2)');
    expect(review).toContain('- `arc` — Как работает "ARC"');
    expect(review).toContain('  - слиты: №1 «ARC», №2 «Как работает "ARC"», №3 «ARC»');
    expect(review).toContain('## UIKit (1)');
  });
});
