import { describe, expect, it } from 'vitest';
import { plainTitle, pluralize, splitInlineCode } from './text';

const forms: [string, string, string] = ['вопрос', 'вопроса', 'вопросов'];

describe('pluralize', () => {
  it.each([
    [1, 'вопрос'],
    [21, 'вопрос'],
    [2, 'вопроса'],
    [34, 'вопроса'],
    [5, 'вопросов'],
    [11, 'вопросов'],
    [12, 'вопросов'],
    [14, 'вопросов'],
    [111, 'вопросов'],
    [0, 'вопросов'],
  ])('%i → %s', (n, expected) => {
    expect(pluralize(n, forms)).toBe(expected);
  });
});

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
