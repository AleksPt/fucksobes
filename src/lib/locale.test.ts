import { describe, expect, it } from 'vitest';
import { isLocale, splitLocaleId, toLocale } from './locale';

describe('splitLocaleId', () => {
  it('отделяет локаль от пути', () => {
    expect(splitLocaleId('ru/optional')).toEqual({ locale: 'ru', path: 'optional' });
    expect(splitLocaleId('en/swift/optional')).toEqual({ locale: 'en', path: 'swift/optional' });
  });

  it('падает, если файл лежит вне папки локали', () => {
    expect(() => splitLocaleId('optional')).toThrow(/папке локали/);
    expect(() => splitLocaleId('de/optional')).toThrow(/ru, en/);
  });
});

describe('isLocale', () => {
  it('узнаёт только поддерживаемые локали', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('de')).toBe(false);
  });
});

describe('toLocale', () => {
  it('известную локаль возвращает, остальное сводит к русской', () => {
    expect(toLocale('en')).toBe('en');
    expect(toLocale('de')).toBe('ru');
    expect(toLocale(undefined)).toBe('ru');
  });
});
