import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { cleanTitle, convertAnswer, normalizeBold, parseNotionExport } from './parse.ts';

const lines = (...l: string[]) => l.join('\n');

describe('cleanTitle', () => {
  it('убирает жирный, неразрывные пробелы и <br>', () => {
    expect(cleanTitle('Чем отличается **Merge от Rebase**')).toBe('Чем отличается Merge от Rebase');
    expect(cleanTitle('И как<br>проходило код ревью? ')).toBe('И как проходило код ревью?');
  });

  it('сохраняет inline-код', () => {
    expect(cleanTitle('Ключевое слово `final`')).toBe('Ключевое слово `final`');
  });
});

describe('parseNotionExport', () => {
  it('вопросы без ответа', () => {
    expect(parseNotionExport(lines('### Навигация:', '1. ARC', '2. Runloop'))).toEqual([
      { number: 1, title: 'ARC', answer: '' },
      { number: 2, title: 'Runloop', answer: '' },
    ]);
  });

  it('вопрос с ответом: строки ответа становятся абзацами', () => {
    const text = lines(
      '1. Что такое UIView',
      '\t<details>',
      '\t<summary>ответ</summary>',
      '\t\tПервая строка',
      '\t\tВторая строка',
      '\t</details>',
      '2. Следующий',
    );
    expect(parseNotionExport(text)).toEqual([
      { number: 1, title: 'Что такое UIView', answer: 'Первая строка\n\nВторая строка' },
      { number: 2, title: 'Следующий', answer: '' },
    ]);
  });

  it('несколько toggle подряд: заголовки сохраняются, пустой toggle «ответ» — без ответа', () => {
    const text = lines(
      '1. DI',
      '\t<details>',
      '\t<summary>первый</summary>',
      '\t\tТекст один',
      '\t</details>',
      '\t<details>',
      '\t<summary>второй</summary>',
      '\t\tТекст два',
      '\t</details>',
      '2. Пусто',
      '\t<details>',
      '\t<summary>ответ</summary>',
      '\t</details>',
      '3. Дальше',
    );
    expect(parseNotionExport(text)).toEqual([
      { number: 1, title: 'DI', answer: '**первый**\n\nТекст один\n\n**второй**\n\nТекст два' },
      { number: 2, title: 'Пусто', answer: '' },
      { number: 3, title: 'Дальше', answer: '' },
    ]);
  });

  it('строки кода с колонки 0 не считаются вопросами', () => {
    const text = lines(
      '1. Optional',
      '\t<details>',
      '\t<summary>ответ</summary>',
      '\t\t```swift',
      '1. not a question',
      '\t\t```',
      '\t</details>',
    );
    expect(parseNotionExport(text)).toEqual([
      { number: 1, title: 'Optional', answer: '```swift\n1. not a question\n```' },
    ]);
  });
});

describe('convertAnswer', () => {
  it('списки идут без пустых строк, вложенность — 4 пробела', () => {
    expect(convertAnswer(['\t\tТекст', '\t\t- a', '\t\t- b', '\t\t\t- nested', '\t\tПосле'])).toBe(
      'Текст\n\n- a\n- b\n    - nested\n\nПосле',
    );
  });

  it('вложенность списка считается от первого пункта серии, а не от уровня абзаца', () => {
    // В Notion пункты могут быть дочерними у абзаца (глубже него), а не у пункта списка:
    // 4 пробела сразу после абзаца — это блок кода в CommonMark.
    expect(
      convertAnswer(['\t\tАбзац', '\t\t\t- a', '\t\t\t- b', '\t\t\t\t- nested', '\t\tЕщё абзац', '\t\t\t\t1. c']),
    ).toBe('Абзац\n\n- a\n- b\n    - nested\n\nЕщё абзац\n\n1. c');
  });

  it('пункт мельче начала серии начинает новую серию через пустую строку', () => {
    // Иначе «2.» сразу после «- x» — ленивое продолжение абзаца, а не пункт списка.
    expect(convertAnswer(['\t\t1. a', '\t\t\tАбзац', '\t\t\t- x', '\t\t\t- y', '\t\t2. b', '\t\t3. c'])).toBe(
      '1. a\n\nАбзац\n\n- x\n- y\n\n2. b\n3. c',
    );
  });

  it('блок кода сохраняется дословно', () => {
    expect(
      convertAnswer(['\t\tТекст', '\t\t```swift', 'enum Optional<Wrapped> {', '\t\tcase none', '}', '\t\t```']),
    ).toBe('Текст\n\n```swift\nenum Optional<Wrapped> {\n\t\tcase none\n}\n```');
  });

  it('вложенный toggle превращается в жирный заголовок', () => {
    expect(
      convertAnswer(['\t\t<details>', '\t\t<summary>SOLID</summary>', '\t\t\tТекст', '\t\t\t- пункт', '\t\t</details>']),
    ).toBe('**SOLID**\n\nТекст\n\n- пункт');
  });

  it('callout превращается в цитату', () => {
    expect(
      convertAnswer([
        '\t\tДо',
        '\t\t<callout icon="💡" color="gray_bg">',
        '\t\t\tВнутри',
        '\t\t\tЕщё',
        '\t\t</callout>',
        '\t\tПосле',
      ]),
    ).toBe('До\n\n> Внутри\n>\n> Ещё\n\nПосле');
  });

  it('убирает упоминания страниц, цвета и span', () => {
    expect(
      convertAnswer([
        '\t\t<span underline="true">важно</span> и всё',
        '\t\t<mention-page url="https://app.notion.com/p/abc"/>  {color="yellow_bg"}',
      ]),
    ).toBe('важно и всё');
  });
});

describe('реальный экспорт', () => {
  const questions = parseNotionExport(readFileSync('migration/notion-export.md', 'utf8'));

  it('717 вопросов, номера 1..717 подряд', () => {
    expect(questions).toHaveLength(717);
    expect(questions.map((q) => q.number)).toEqual(Array.from({ length: 717 }, (_, i) => i + 1));
  });

  // В экспорте 374 строки `\t<details>`, но: три toggle «ответ» пустые (№199, №619, №620),
  // а у №204 их два подряд (dependency injection / dependency inversion) — итого 373 вопроса с toggle, 370 с текстом.
  it('370 вопросов с непустым ответом (пустые toggle — без ответа)', () => {
    expect(questions.filter((q) => q.answer !== '')).toHaveLength(370);
    expect([199, 619, 620].map((n) => questions[n - 1].answer)).toEqual(['', '', '']);
  });

  it('вопрос №204: оба toggle сохранены с заголовками', () => {
    const { answer } = questions[203];
    expect(answer).toMatch(/^\*\*dependency injection\*\*/);
    expect(answer).toContain('**dependency inversion**');
  });

  it('вопрос №21 разобран правильно', () => {
    expect(questions[20]).toEqual({
      number: 21,
      title: 'retain cycle (и сколько минимум объектов нужно для его создания?)',
      answer: 'минимум 1',
    });
  });

  it('в ответах не осталось служебных тегов Notion', () => {
    const all = questions.map((q) => q.answer).join('\n');
    expect(all).not.toMatch(/<\/?(details|summary|callout|mention-page|span)\b/);
    expect(all).not.toMatch(/\{color="/);
  });
});

describe('normalizeBold', () => {
  it('переносит <br> за закрывающий маркер', () => {
    expect(normalizeBold('1. **Наследование:<br>**Классы поддерживают наследование, структуры — нет.')).toBe(
      '1. **Наследование:**<br>Классы поддерживают наследование, структуры — нет.',
    );
  });

  it('выносит пробел из-под закрывающего маркера', () => {
    expect(normalizeBold('**Dependency Injection **(внедрение зависимостей) — это паттерн')).toBe(
      '**Dependency Injection** (внедрение зависимостей) — это паттерн',
    );
  });

  it('склеивает соседние жирные span\'ы', () => {
    expect(normalizeBold('- **Мьютексы (****`NSLock`****):** Для обеспечения доступа')).toBe(
      '- **Мьютексы (`NSLock`):** Для обеспечения доступа',
    );
  });

  it('не трогает обычный жирный и inline-код с звёздочками', () => {
    expect(normalizeBold('Просто **жирный** текст и `a ** b` в коде')).toBe('Просто **жирный** текст и `a ** b` в коде');
  });

  it('оставляет одиночный непарный маркер как есть', () => {
    expect(normalizeBold('a ** b')).toBe('a ** b');
  });

  it('не ломает жирный с кодом внутри', () => {
    expect(normalizeBold('**`weak` **ссылка')).toBe('**`weak`** ссылка');
  });
});

describe('convertAnswer и жирный', () => {
  it('нормализует текст, но не блок кода', () => {
    const out = convertAnswer(['**Foo **bar', '```swift', 'let a = "****" ', '```']);
    expect(out).toBe('**Foo** bar\n\n```swift\nlet a = "****" \n```');
  });
});
