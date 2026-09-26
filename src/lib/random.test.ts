import { describe, expect, it } from 'vitest';
import { pickRandom } from './random';

describe('pickRandom', () => {
  it('возвращает undefined для пустого списка', () => {
    expect(pickRandom([])).toBeUndefined();
  });

  it('возвращает единственный элемент, даже если он исключён', () => {
    expect(pickRandom(['a'], 'a')).toBe('a');
  });

  it('не возвращает исключённый элемент', () => {
    const items = ['a', 'b', 'c'];
    for (const r of [0, 0.34, 0.67, 0.999]) {
      expect(pickRandom(items, 'b', () => r)).not.toBe('b');
    }
  });

  it('выбирает по значению генератора', () => {
    expect(pickRandom(['a', 'b', 'c'], undefined, () => 0)).toBe('a');
    expect(pickRandom(['a', 'b', 'c'], undefined, () => 0.999)).toBe('c');
  });
});
