import { describe, expect, it, vi } from 'vitest';
import { createQuestionLoader, pickRandom } from './random';

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

describe('createQuestionLoader', () => {
  const question = { id: 'a', title: 'A?', category: { id: 'swift', title: 'Swift' }, html: '<p>a</p>' };

  it('запрашивает random/<id>.json с учётом base', async () => {
    const load = vi.fn().mockResolvedValue(question);
    await createQuestionLoader(load)('a');
    expect(load).toHaveBeenCalledWith('/fucksobes/random/a.json');
  });

  it('кэширует успешную загрузку', async () => {
    const load = vi.fn().mockResolvedValue(question);
    const loader = createQuestionLoader(load);
    expect(await loader('a')).toBe(question);
    expect(await loader('a')).toBe(question);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('повторяет загрузку после ошибки', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(question);
    const loader = createQuestionLoader(load);
    await expect(loader('a')).rejects.toThrow('offline');
    expect(await loader('a')).toBe(question);
    expect(load).toHaveBeenCalledTimes(2);
  });
});
