import { describe, expect, it } from 'vitest';
import { url } from './url';

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
