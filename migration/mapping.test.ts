import { describe, expect, it } from 'vitest';
import { readCategories, validateMapping, type Mapping } from './mapping.ts';
import type { ParsedQuestion } from './parse.ts';

const questions: ParsedQuestion[] = [
  { number: 1, title: 'ARC', answer: '' },
  { number: 2, title: 'Как работает ARC', answer: 'Подсчёт ссылок' },
  { number: 3, title: 'Что такое UIView', answer: '' },
];
const categoryIds = ['memory', 'uikit'];

describe('readCategories', () => {
  it('читает id и title из categories.yaml', () => {
    const yaml = '- id: swift\n  title: Swift\n  description: x\n  order: 1\n- id: soft-skills\n  title: Soft skills\n  order: 2\n';
    expect(readCategories(yaml)).toEqual([
      { id: 'swift', title: 'Swift' },
      { id: 'soft-skills', title: 'Soft skills' },
    ]);
  });
});

describe('validateMapping', () => {
  const valid: Mapping = {
    entries: [
      { id: 'arc', category: 'memory', title: 'Как работает ARC', sources: [1, 2] },
      { id: 'uiview', category: 'uikit', title: 'Что такое UIView', sources: [3] },
    ],
  };

  it('корректная разметка — без ошибок', () => {
    expect(validateMapping(questions, valid, categoryIds)).toEqual([]);
  });

  it('находит неразмеченный и повторно размеченный вопрос', () => {
    const mapping: Mapping = {
      entries: [
        { id: 'arc', category: 'memory', title: 'ARC', sources: [1] },
        { id: 'arc-2', category: 'memory', title: 'ARC', sources: [1] },
      ],
    };
    const errors = validateMapping(questions, mapping, categoryIds);
    expect(errors).toContain('arc-2: вопрос №1 уже в arc');
    expect(errors).toContain('вопрос №2 не размечен: Как работает ARC');
    expect(errors).toContain('вопрос №3 не размечен: Что такое UIView');
  });

  it('проверяет id, категорию, номер и title', () => {
    const mapping: Mapping = {
      entries: [
        { id: 'Arc Bad', category: 'memory', title: 'ARC', sources: [1] },
        { id: 'arc', category: 'nope', title: 'Как работает ARC', sources: [2, 99] },
        { id: 'arc', category: 'uikit', title: 'Придуманный заголовок', sources: [3] },
      ],
    };
    expect(validateMapping(questions, mapping, categoryIds)).toEqual([
      'Arc Bad: id должен быть kebab-case латиницей',
      'arc: неизвестная категория "nope"',
      'arc: нет вопроса №99',
      'arc: id повторяется',
      'arc: title должен дословно совпадать с формулировкой одного из sources',
    ]);
  });
});
