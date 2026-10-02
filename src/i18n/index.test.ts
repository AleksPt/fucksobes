import { describe, expect, it } from 'vitest';
import { plural, ui } from './index';

describe('plural', () => {
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
  ])('ru: %i → %s', (n, expected) => {
    expect(plural('ru', n, ui.ru.question)).toBe(expected);
  });

  it.each([
    [1, 'question'],
    [0, 'questions'],
    [2, 'questions'],
    [21, 'questions'],
  ])('en: %i → %s', (n, expected) => {
    expect(plural('en', n, ui.en.question)).toBe(expected);
  });
});

describe('ui', () => {
  it('в обеих локалях заполнены все строки', () => {
    for (const key of Object.keys(ui.ru) as (keyof typeof ui.ru)[]) {
      expect(ui.en[key], key).toBeTruthy();
    }
  });
});
