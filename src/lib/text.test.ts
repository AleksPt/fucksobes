import { describe, expect, it } from 'vitest';
import { plainTitle, splitInlineCode } from './text';

describe('splitInlineCode', () => {
  it('разбивает по обратным кавычкам', () => {
    expect(splitInlineCode('Ключевые слова `static` и `class`')).toEqual([
      { text: 'Ключевые слова ', code: false },
      { text: 'static', code: true },
      { text: ' и ', code: false },
      { text: 'class', code: true },
    ]);
  });

  it('непарная кавычка — весь заголовок текстом', () => {
    expect(splitInlineCode('Что такое `final')).toEqual([{ text: 'Что такое final', code: false }]);
  });
});

describe('plainTitle', () => {
  it('убирает обратные кавычки', () => {
    expect(plainTitle('Модификатор `inout`')).toBe('Модификатор inout');
  });
});
