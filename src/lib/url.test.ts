import { describe, expect, it } from 'vitest';
import { parsePathname, url } from './url';

describe('url', () => {
  it('возвращает корень сайта с base', () => {
    expect(url()).toBe('/fucksobes/');
  });

  it('добавляет base к относительному пути', () => {
    expect(url('swift/')).toBe('/fucksobes/swift/');
  });

  it('не дублирует ведущий слэш', () => {
    expect(url('/favicon.svg')).toBe('/fucksobes/favicon.svg');
  });
});

describe('url с локалью', () => {
  it('для русского без префикса', () => {
    expect(url('swift/', 'ru')).toBe('/fucksobes/swift/');
  });

  it('для английского под /en/', () => {
    expect(url('swift/', 'en')).toBe('/fucksobes/en/swift/');
    expect(url('', 'en')).toBe('/fucksobes/en/');
  });
});

describe('parsePathname', () => {
  it('русская страница', () => {
    expect(parsePathname('/fucksobes/swift/optional/')).toEqual({ locale: 'ru', path: 'swift/optional/' });
    expect(parsePathname('/fucksobes/')).toEqual({ locale: 'ru', path: '' });
  });

  it('английская страница', () => {
    expect(parsePathname('/fucksobes/en/swift/optional/')).toEqual({ locale: 'en', path: 'swift/optional/' });
    expect(parsePathname('/fucksobes/en/')).toEqual({ locale: 'en', path: '' });
  });
});
