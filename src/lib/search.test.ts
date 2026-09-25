import { describe, expect, it } from 'vitest';
import { createSearch, normalizeTerm, type SearchDoc } from './search';

const doc = (id: string, title: string): SearchDoc => ({ id, title, categoryTitle: 'Память', url: `/fucksobes/memory/${id}/` });

const search = createSearch([
  doc('arc', 'Как работает ARC'),
  doc('retain-cycle', 'Что такое retain cycle'),
  doc('main-thread', 'Почему UI обновляется в главном потоке'),
  doc('capacity', 'Что такое ёмкость массива'),
]);
const ids = (query: string) => search(query).map((h) => h.id);

describe('normalizeTerm', () => {
  it('нижний регистр, ё → е, без обратных кавычек', () => {
    expect(normalizeTerm('`Ёмкость`')).toBe('емкость');
    expect(normalizeTerm('`')).toBeNull();
  });
});

describe('createSearch', () => {
  it('находит по слову без учёта регистра', () => {
    expect(ids('arc')).toEqual(['arc']);
  });

  it('ищет по префиксу', () => {
    expect(ids('ret')).toEqual(['retain-cycle']);
  });

  it('прощает опечатку', () => {
    expect(ids('retan cycle')).toEqual(['retain-cycle']);
  });

  it('е и ё — одно и то же', () => {
    expect(ids('емкость')).toEqual(['capacity']);
  });

  it('все слова запроса должны совпасть', () => {
    expect(ids('главном потоке')).toEqual(['main-thread']);
    expect(ids('главном arc')).toEqual([]);
  });

  it('возвращает сохранённые поля и уважает limit', () => {
    expect(search('что', 1)).toEqual([
      expect.objectContaining({ categoryTitle: 'Память', url: expect.stringMatching(/^\/fucksobes\/memory\//) }),
    ]);
  });
});
