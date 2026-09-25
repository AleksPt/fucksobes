# FuckSobes MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Статический сайт с вопросами к iOS-собеседованиям: главная с карточками категорий, страницы категорий с раскрывающимися ответами, страницы вопросов, поиск по формулировкам; контент перенесён из Notion.

**Architecture:** Astro 7 собирает статический сайт из Markdown-файлов (Content Collections). Разовый скрипт на Node (`migration/`) парсит экспорт Notion, применяет ручную разметку категорий и дублей (`mapping.json`) и генерирует `.md`-файлы. Поиск — React-остров с MiniSearch по JSON-индексу, собранному при билде. Деплой на GitHub Pages через Actions.

**Tech Stack:** Astro 7.3, React 19.3, TypeScript (strict), Tailwind CSS 4 + @tailwindcss/typography, Shiki (встроен), MiniSearch 7, Vitest, Playwright, Node 24+ (запуск `.ts` напрямую через type stripping).

**Spec:** `docs/superpowers/specs/2026-09-25-fucksobes-mvp-design.md`

## Global Constraints

- Сайт: `site: 'https://alekspt.github.io'`, `base: '/fucksobes'`. Все внутренние ссылки — только через `url()` из `src/lib/url.ts`.
- URL: `/<category>/` и `/<category>/<id>/`; `id` вопроса = имя файла, kebab-case латиницей, уникален глобально.
- Контент — чистый Markdown (без MDX). Frontmatter вопроса: `title`, `category`, `order`. Пустое тело = ответа нет.
- Поиск — **только по `title`** вопросов.
- Интерфейс только на русском. Уровней сложности нет.
- Ответы из Notion переносятся как есть (только конвертация разметки). Дубли сливаются, ответы дублей склеиваются через `---`.
- Интерактив — только React-компоненты (`.tsx`); логика — в `src/lib/*.ts`, по возможности без импортов из `astro:*`.
- `verbatimModuleSyntax` включён: типы импортировать через `import type`. В `migration/*.ts` импорты с расширением `.ts`, без `enum`/`namespace` (Node type stripping).
- Анимации уважают `prefers-reduced-motion`.
- Коммиты — Conventional Commits, в конце сообщения строка `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
- Работа идёт **четырьмя последовательными PR**, каждый в своей ветке от свежего `main`; в `main` попадает только через PR, push в `main` сразу деплоит сайт. Следующая группа задач начинается только после merge предыдущего PR.

  | PR | Ветка | Задачи | Что появляется на сайте |
  |---|---|---|---|
  | 1 | `feat/migration-content` | 1, 3, 4, 5 | все вопросы из Notion (на пока неоформленных страницах) |
  | 2 | `feat/design-pages` | 6, 7, 8 | дизайн: главная с карточками, страницы категорий и вопросов, 404 |
  | 3 | `feat/search-animations` | 9, 10 | поиск и переходы между страницами |
  | 4 | `feat/tests-docs` | 11, 12 | e2e-тесты в CI, README |

- Merge PR — только после явного «да» пользователя. Способ merge: `gh pr merge --rebase --delete-branch` (сохраняет отдельные коммиты задач в истории `main`).
- Каждый шаг «синхронизироваться с `main`» перед новой веткой: `git switch main && git pull --ff-only`.
- Id категорий (из `categories.yaml`): `swift`, `memory`, `concurrency`, `uikit`, `swiftui`, `architecture`, `algorithms`, `networking-storage`, `tooling`, `soft-skills`.

## Current State (что уже есть)

Репозиторий `AleksPt/fucksobes` (публичный) создан, `main` запушен, в него влит PR #1 (`chore: set up Astro project and content schema`). GitHub Pages включён (`build_type: workflow`), адрес `https://alekspt.github.io/fucksobes/`. Workflow `Deploy` запускается на push в `main`, `CI` — на PR в `main`.

В `main` уже есть:
- `astro.config.mjs` — site/base, интеграция React.
- `src/content.config.ts` — коллекции `categories` (file loader из `src/content/categories.yaml`: `title`, `description`, `order`) и `questions` (glob `src/content/questions/**/*.md`: `title`, `category: reference('categories')`, `order`). Пустое тело = ответа нет.
- `src/content/categories.yaml` — все 10 категорий с описаниями (id — см. Global Constraints).
- `src/lib/content.ts` — `getCategories()` (по `order`), `getQuestions(categoryId?)` (фильтр + сортировка по `order`), `hasAnswer(question: CollectionEntry<'questions'>): boolean`.
- `src/lib/url.ts` — `url(path)`.
- `src/layouts/Base.astro`, `src/pages/index.astro`, `src/pages/[category]/index.astro`, `src/pages/[category]/[id].astro` — неоформленные страницы, уже показывают описание категории и «Ответа пока нет».
- Три примера вопросов в `src/content/questions/` (удалятся при генерации контента).
- Спецификация `docs/superpowers/specs/2026-09-25-fucksobes-mvp-design.md`. Сам этот план в `main` не закоммичен (лежит неотслеживаемым файлом).

## File Structure

```
astro.config.mjs                  # + tailwind, shiki themes
vitest.config.ts                  # новый
playwright.config.ts              # новый
e2e/smoke.spec.ts                 # новый
migration/
  notion-export.md                # сырой экспорт страницы Notion (коммитим)
  parse.ts / parse.test.ts        # Notion-разметка → ParsedQuestion[]
  mapping.ts / mapping.test.ts    # типы mapping.json, чтение категорий, валидация
  generate.ts / generate.test.ts  # сборка .md-файлов и review.md
  cli.ts                          # parse | check | review | generate
  questions.json                  # результат parse (коммитим, для разметки)
  mapping.json                    # разметка категорий/дублей (делает агент)
  review.md                       # отчёт для проверки человеком
src/
  content.config.ts               # без изменений (уже в main)
  content/categories.yaml         # без изменений (уже в main)
  content/questions/*.md          # сгенерированный контент
  lib/url.ts (+ url.test.ts)
  lib/content.ts                  # без изменений: getCategories, getQuestions, hasAnswer
  lib/text.ts (+ test)            # pluralize, splitInlineCode, plainTitle
  lib/search.ts (+ test)          # MiniSearch-обёртка
  styles/global.css
  layouts/Base.astro
  components/Header.astro, CategoryCard.astro, QuestionItem.astro,
             QuestionTitle.astro, NoAnswer.astro, Search.tsx
  pages/index.astro, 404.astro, search-index.json.ts,
        [category]/index.astro, [category]/[id].astro
```

---

### Task 1: Ветка `feat/migration-content` и Vitest  (PR 1)

**Files:**
- Create: `vitest.config.ts`, `src/lib/url.test.ts`
- Modify: `package.json` (scripts)
- Add: `docs/superpowers/plans/2026-09-25-fucksobes-mvp.md` (этот план)

**Interfaces:**
- Consumes: `url(path?: string): string` из `src/lib/url.ts` (уже есть).
- Produces: `npm test` запускает Vitest по `src/**/*.test.ts` и `migration/**/*.test.ts`; в тестах доступен `import.meta.env.BASE_URL`.

- [ ] **Step 1: Создать ветку от актуального `main` и закоммитить план**

```bash
git switch main
git pull --ff-only
git switch -c feat/migration-content
npm ci
npm run build
git add docs/superpowers/plans/2026-09-25-fucksobes-mvp.md
git commit -m "docs: add MVP implementation plan

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```
Expected: сборка проходит (10 категорий, 3 примера вопросов), коммит создан.

- [ ] **Step 2: Установить Vitest и добавить конфиг**

```bash
npm install -D vitest
```

`vitest.config.ts`:
```ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts', 'migration/**/*.test.ts'],
  },
});
```

В `package.json` → `scripts` добавить:
```json
"check": "astro check",
"test": "vitest run",
"test:watch": "vitest",
"migrate": "node migration/cli.ts"
```

- [ ] **Step 3: Написать тест для `url()`**

`src/lib/url.test.ts`:
```ts
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
```

- [ ] **Step 4: Запустить тесты**

Run: `npm test`
Expected: 3 passed. Если `getViteConfig` несовместим с установленной версией Vitest (ошибка загрузки конфига), заменить конфиг на `import { defineConfig } from 'vitest/config'` с `define: { 'import.meta.env.BASE_URL': JSON.stringify('/fucksobes/') }` и тем же `test.include`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/url.test.ts
git commit -m "test: set up Vitest

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Категории, порядок и `hasAnswer` — ВЫПОЛНЕНО в PR #1

Ничего делать не нужно. В `main` уже есть: 10 категорий с `description` в `categories.yaml`, поле `order` у вопросов, сортировка в `getQuestions`, `hasAnswer(question)` в `src/lib/content.ts`, состояние «Ответа пока нет» на страницах. Дальнейшие задачи используют именно эти имена:
- `hasAnswer(question: CollectionEntry<'questions'>): boolean` из `src/lib/content.ts` (принимает запись коллекции, а не `body`);
- id категории инструментов — `tooling`.

---

### Task 3: Парсер экспорта Notion

**Files:**
- Create: `migration/notion-export.md`, `migration/parse.ts`, `migration/parse.test.ts`

**Interfaces:**
- Produces:
  - `interface ParsedQuestion { number: number; title: string; answer: string }` (`answer === ''` — ответа нет)
  - `parseNotionExport(text: string): ParsedQuestion[]`
  - `convertAnswer(lines: string[]): string`
  - `cleanInline(text: string): string`, `cleanTitle(text: string): string`

**Формат экспорта** (то, что возвращает Notion MCP `notion-fetch` для страницы `17f5016f8db780f1af4bd7f9121018ea`, поле `text`):
- Вопрос — строка с колонки 0: `N. Формулировка`.
- Ответ (если есть) — сразу следом: `\t<details>`, `\t<summary>ответ</summary>`, строки ответа с отступом `\t\t`, закрывает `\t</details>`.
- Внутри ответа: списки `- ` / `1. ` (вложенность — дополнительные `\t`); блоки кода ```` ``` ```` (строки кода могут начинаться с колонки 0); вложенные toggle `<details><summary>X</summary>…</details>` (контент на +1 `\t`); `<callout …>…</callout>` (контент на +1 `\t`); `<mention-page url="…"/>` и `{color="…"}` — мусор; `<span underline="true">x</span>`; `<br>`; неразрывные пробелы ` `.
- Всего 717 вопросов, пронумерованы 1..717 подряд, у 374 есть ответ.

- [ ] **Step 1: Положить экспорт в репозиторий**

Декодированный экспорт уже сохранён в scratchpad-сессии планирования:
`/private/tmp/claude-501/-Users-alex-Library-Mobile-Documents-com-apple-CloudDocs-Developer-FuckSobes/9c38dd9d-fd70-419c-b56b-2edd0114318c/scratchpad/notion.md`

```bash
mkdir -p migration
cp "/private/tmp/claude-501/-Users-alex-Library-Mobile-Documents-com-apple-CloudDocs-Developer-FuckSobes/9c38dd9d-fd70-419c-b56b-2edd0114318c/scratchpad/notion.md" migration/notion-export.md
grep -cE '^[0-9]+\. ' migration/notion-export.md
```
Expected: `717`. Если файла нет — вызвать Notion MCP `notion-fetch` с `id: 17f5016f8db780f1af4bd7f9121018ea`; результат большой и сохраняется в файл как JSON `{"text": "..."}` — записать значение поля `text` в `migration/notion-export.md` (например, `node -e 'const fs=require("fs");fs.writeFileSync("migration/notion-export.md", JSON.parse(fs.readFileSync(process.argv[1],"utf8")).text)' <путь>`), затем снова проверить `717`.

- [ ] **Step 2: Написать падающие тесты**

`migration/parse.test.ts`:
```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { cleanTitle, convertAnswer, parseNotionExport } from './parse.ts';

const lines = (...l: string[]) => l.join('\n');

describe('cleanTitle', () => {
  it('убирает жирный, неразрывные пробелы и <br>', () => {
    expect(cleanTitle('Чем отличается **Merge от Rebase**')).toBe('Чем отличается Merge от Rebase');
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

  it('374 вопроса с ответом', () => {
    expect(questions.filter((q) => q.answer !== '')).toHaveLength(374);
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
```

- [ ] **Step 3: Убедиться, что тесты падают**

Run: `npm test -- migration/parse.test.ts`
Expected: FAIL — `Failed to resolve import "./parse.ts"`.

- [ ] **Step 4: Реализация**

`migration/parse.ts`:
```ts
export interface ParsedQuestion {
  number: number;
  title: string;
  /** Ответ в Markdown; пустая строка — ответа нет. */
  answer: string;
}

const QUESTION_RE = /^(\d+)\. (.*)$/;
const LIST_ITEM_RE = /^([-*+]|\d+\.) /;
const FENCE_RE = /^\s*```/;
const SUMMARY_RE = /^<summary>(.*)<\/summary>$/;

/** Убирает служебную разметку Notion внутри строки. */
export function cleanInline(text: string): string {
  return text
    .replace(/<mention-page[^>]*\/>/g, '')
    .replace(/\s*\{color="[^"]*"\}/g, '')
    .replace(/<span[^>]*>(.*?)<\/span>/g, '$1')
    .replace(/ /g, ' ')
    .trim();
}

/** Формулировка вопроса: одна строка без жирного и переносов, inline-код сохраняется. */
export function cleanTitle(text: string): string {
  return cleanInline(text)
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Строки внутри toggle «ответ» (с исходными табами) → Markdown. */
export function convertAnswer(lines: string[]): string {
  const out: string[] = [];
  let prevListItem = false;
  let prevQuote = false;
  let depth = 0;
  let inCallout = false;
  let fence: string[] | null = null;

  // Каждый блок Notion — отдельный абзац; соседние пункты списка — без пустой строки.
  const emit = (block: string, listItem: boolean) => {
    if (out.length > 0 && !(listItem && prevListItem)) out.push(inCallout && prevQuote ? '>' : '');
    out.push(block);
    prevListItem = listItem;
    prevQuote = inCallout;
  };

  for (const raw of lines) {
    if (fence) {
      if (FENCE_RE.test(raw)) {
        fence.push('```');
        emit(fence.join('\n'), false);
        fence = null;
      } else {
        fence.push(raw);
      }
      continue;
    }

    const trimmed = raw.trim();
    if (FENCE_RE.test(raw)) {
      fence = [trimmed];
      continue;
    }
    if (trimmed === '<details>') {
      depth++;
      continue;
    }
    if (trimmed === '</details>') {
      depth--;
      continue;
    }
    if (trimmed.startsWith('<callout')) {
      inCallout = true;
      continue;
    }
    if (trimmed === '</callout>') {
      inCallout = false;
      continue;
    }

    const summary = SUMMARY_RE.exec(trimmed);
    const text = cleanInline(summary ? `**${summary[1].trim()}**` : trimmed);
    if (text === '' || text === '****') continue;

    const quote = inCallout ? '> ' : '';
    if (LIST_ITEM_RE.test(text)) {
      const tabs = /^\t*/.exec(raw)![0].length;
      const base = 2 + depth + (inCallout ? 1 : 0);
      emit(quote + '    '.repeat(Math.max(0, tabs - base)) + text, true);
    } else {
      emit(quote + text, false);
    }
  }

  if (fence) emit([...fence, '```'].join('\n'), false);
  return out.join('\n');
}

export function parseNotionExport(text: string): ParsedQuestion[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const questions: ParsedQuestion[] = [];

  for (let i = 0; i < lines.length; i++) {
    const match = QUESTION_RE.exec(lines[i]);
    if (!match) continue;

    const question: ParsedQuestion = { number: Number(match[1]), title: cleanTitle(match[2]), answer: '' };

    if (lines[i + 1] === '\t<details>') {
      const body: string[] = [];
      let j = i + 3; // пропускаем <details> и <summary>ответ</summary>
      let inFence = false;
      while (j < lines.length && (inFence || lines[j] !== '\t</details>')) {
        if (FENCE_RE.test(lines[j])) inFence = !inFence;
        body.push(lines[j]);
        j++;
      }
      question.answer = convertAnswer(body);
      i = j;
    }

    questions.push(question);
  }

  return questions;
}
```

- [ ] **Step 5: Запустить тесты**

Run: `npm test -- migration/parse.test.ts`
Expected: PASS (все). Если «374 вопроса с ответом» не проходит — найти расхождение (`grep -c $'^\t<details>$' migration/notion-export.md` должен дать 374), не подгонять ожидание.

- [ ] **Step 6: Commit**

```bash
git add migration/notion-export.md migration/parse.ts migration/parse.test.ts
git commit -m "feat(migration): parse Notion export into questions

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Разметка (mapping), генератор и CLI миграции

**Files:**
- Create: `migration/mapping.ts`, `migration/mapping.test.ts`, `migration/generate.ts`, `migration/generate.test.ts`, `migration/cli.ts`

**Interfaces:**
- Consumes: `ParsedQuestion`, `parseNotionExport` (Task 3).
- Produces:
  - `interface MappingEntry { id: string; category: string; title: string; sources: number[] }`
  - `interface Mapping { entries: MappingEntry[] }` — формат `migration/mapping.json`
  - `interface CategoryInfo { id: string; title: string }`
  - `readCategories(yaml: string): CategoryInfo[]`
  - `validateMapping(questions: ParsedQuestion[], mapping: Mapping, categoryIds: string[]): string[]` — список ошибок, пустой = ок
  - `mergeAnswers(answers: string[]): string`
  - `interface GeneratedFile { fileName: string; content: string }`
  - `buildQuestionFiles(questions: ParsedQuestion[], mapping: Mapping): GeneratedFile[]`
  - `buildReview(questions: ParsedQuestion[], mapping: Mapping, categories: CategoryInfo[]): string`
  - CLI: `npm run migrate -- parse|check|review|generate`

- [ ] **Step 1: Падающие тесты для mapping**

`migration/mapping.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { readCategories, validateMapping, type Mapping } from './mapping.ts';
import type { ParsedQuestion } from './parse.ts';

const questions: ParsedQuestion[] = [
  { number: 1, title: 'ARC', answer: '' },
  { number: 2, title: 'Как работает ARC', answer: 'Подсчёт ссылок' },
  { number: 3, title: 'Что такое UIView', answer: '' },
];
const categoryIds = ['memory', 'uikit'];

describe('readCategories', () => {
  it('читает id и title из categories.yaml', () => {
    const yaml = '- id: swift\n  title: Swift\n  description: x\n  order: 1\n- id: soft-skills\n  title: Soft skills\n  order: 2\n';
    expect(readCategories(yaml)).toEqual([
      { id: 'swift', title: 'Swift' },
      { id: 'soft-skills', title: 'Soft skills' },
    ]);
  });
});

describe('validateMapping', () => {
  const valid: Mapping = {
    entries: [
      { id: 'arc', category: 'memory', title: 'Как работает ARC', sources: [1, 2] },
      { id: 'uiview', category: 'uikit', title: 'Что такое UIView', sources: [3] },
    ],
  };

  it('корректная разметка — без ошибок', () => {
    expect(validateMapping(questions, valid, categoryIds)).toEqual([]);
  });

  it('находит неразмеченный и повторно размеченный вопрос', () => {
    const mapping: Mapping = {
      entries: [
        { id: 'arc', category: 'memory', title: 'ARC', sources: [1] },
        { id: 'arc-2', category: 'memory', title: 'ARC', sources: [1] },
      ],
    };
    const errors = validateMapping(questions, mapping, categoryIds);
    expect(errors).toContain('arc-2: вопрос №1 уже в arc');
    expect(errors).toContain('вопрос №2 не размечен: Как работает ARC');
    expect(errors).toContain('вопрос №3 не размечен: Что такое UIView');
  });

  it('проверяет id, категорию, номер и title', () => {
    const mapping: Mapping = {
      entries: [
        { id: 'Arc Bad', category: 'memory', title: 'ARC', sources: [1] },
        { id: 'arc', category: 'nope', title: 'Как работает ARC', sources: [2, 99] },
        { id: 'arc', category: 'uikit', title: 'Придуманный заголовок', sources: [3] },
      ],
    };
    expect(validateMapping(questions, mapping, categoryIds)).toEqual([
      'Arc Bad: id должен быть kebab-case латиницей',
      'arc: неизвестная категория "nope"',
      'arc: нет вопроса №99',
      'arc: id повторяется',
      'arc: title должен дословно совпадать с формулировкой одного из sources',
    ]);
  });
});
```

- [ ] **Step 2: Убедиться, что падает**

Run: `npm test -- migration/mapping.test.ts`
Expected: FAIL — `Failed to resolve import "./mapping.ts"`.

- [ ] **Step 3: Реализация mapping**

`migration/mapping.ts`:
```ts
import type { ParsedQuestion } from './parse.ts';

/** Один итоговый вопрос сайта; sources — номера исходных вопросов из Notion (дубли сливаются). */
export interface MappingEntry {
  id: string;
  category: string;
  /** Дословно формулировка одного из sources. */
  title: string;
  sources: number[];
}

export interface Mapping {
  entries: MappingEntry[];
}

export interface CategoryInfo {
  id: string;
  title: string;
}

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function readCategories(yaml: string): CategoryInfo[] {
  return [...yaml.matchAll(/^- id: (\S+)\n\s+title: (.+)$/gm)].map((m) => ({ id: m[1], title: m[2].trim() }));
}

export function validateMapping(questions: ParsedQuestion[], mapping: Mapping, categoryIds: string[]): string[] {
  const errors: string[] = [];
  const byNumber = new Map(questions.map((q) => [q.number, q]));
  const owner = new Map<number, string>();
  const ids = new Set<string>();

  for (const entry of mapping.entries) {
    if (!ID_RE.test(entry.id)) errors.push(`${entry.id}: id должен быть kebab-case латиницей`);
    if (!categoryIds.includes(entry.category)) errors.push(`${entry.id}: неизвестная категория "${entry.category}"`);
    if (entry.sources.length === 0) errors.push(`${entry.id}: пустой sources`);

    for (const n of entry.sources) {
      if (!byNumber.has(n)) errors.push(`${entry.id}: нет вопроса №${n}`);
      else if (owner.has(n)) errors.push(`${entry.id}: вопрос №${n} уже в ${owner.get(n)}`);
      else owner.set(n, entry.id);
    }

    if (ids.has(entry.id)) errors.push(`${entry.id}: id повторяется`);
    ids.add(entry.id);

    if (!entry.sources.some((n) => byNumber.get(n)?.title === entry.title)) {
      errors.push(`${entry.id}: title должен дословно совпадать с формулировкой одного из sources`);
    }
  }

  for (const q of questions) {
    if (!owner.has(q.number)) errors.push(`вопрос №${q.number} не размечен: ${q.title}`);
  }

  return errors;
}
```

- [ ] **Step 4: Запустить**

Run: `npm test -- migration/mapping.test.ts`
Expected: PASS.

- [ ] **Step 5: Падающие тесты для генератора**

`migration/generate.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { buildQuestionFiles, buildReview, mergeAnswers } from './generate.ts';
import type { Mapping } from './mapping.ts';
import type { ParsedQuestion } from './parse.ts';

const questions: ParsedQuestion[] = [
  { number: 1, title: 'ARC', answer: '' },
  { number: 2, title: 'Как работает "ARC"', answer: 'Подсчёт ссылок' },
  { number: 3, title: 'ARC', answer: 'Подсчёт ссылок' },
  { number: 4, title: 'Что такое UIView', answer: '' },
  { number: 5, title: 'weak ссылки', answer: 'Не увеличивают счётчик' },
];

const mapping: Mapping = {
  entries: [
    { id: 'arc', category: 'memory', title: 'Как работает "ARC"', sources: [1, 2, 3] },
    { id: 'weak', category: 'memory', title: 'weak ссылки', sources: [5] },
    { id: 'uiview', category: 'uikit', title: 'Что такое UIView', sources: [4] },
  ],
};

describe('mergeAnswers', () => {
  it('убирает пустые и одинаковые, склеивает через ---', () => {
    expect(mergeAnswers(['', 'A', ' A ', 'B'])).toBe('A\n\n---\n\nB');
    expect(mergeAnswers(['', ''])).toBe('');
  });
});

describe('buildQuestionFiles', () => {
  const files = buildQuestionFiles(questions, mapping);

  it('файл на запись mapping, order считается внутри категории', () => {
    expect(files.map((f) => f.fileName)).toEqual(['arc.md', 'weak.md', 'uiview.md']);
    expect(files[0].content).toBe(
      '---\ntitle: "Как работает \\"ARC\\""\ncategory: memory\norder: 1\n---\n\nПодсчёт ссылок\n',
    );
    expect(files[1].content).toContain('order: 2');
    expect(files[2].content).toContain('order: 1');
  });

  it('вопрос без ответа — пустое тело', () => {
    expect(files[2].content).toBe('---\ntitle: "Что такое UIView"\ncategory: uikit\norder: 1\n---\n');
  });
});

describe('buildReview', () => {
  it('показывает итоги и слитые дубли', () => {
    const review = buildReview(questions, mapping, [
      { id: 'memory', title: 'Память' },
      { id: 'uikit', title: 'UIKit' },
    ]);
    expect(review).toContain('Исходных вопросов: 5, итоговых: 3, слито дублей: 2.');
    expect(review).toContain('## Память (2)');
    expect(review).toContain('- `arc` — Как работает "ARC"');
    expect(review).toContain('  - слиты: №1 «ARC», №2 «Как работает "ARC"», №3 «ARC»');
    expect(review).toContain('## UIKit (1)');
  });
});
```

- [ ] **Step 6: Убедиться, что падает**

Run: `npm test -- migration/generate.test.ts`
Expected: FAIL — `Failed to resolve import "./generate.ts"`.

- [ ] **Step 7: Реализация генератора**

`migration/generate.ts`:
```ts
import type { CategoryInfo, Mapping } from './mapping.ts';
import type { ParsedQuestion } from './parse.ts';

export interface GeneratedFile {
  fileName: string;
  content: string;
}

/** Ответы слитых дублей: без пустых и повторов, через горизонтальную линию. */
export function mergeAnswers(answers: string[]): string {
  const unique: string[] = [];
  for (const answer of answers.map((a) => a.trim())) {
    if (answer && !unique.includes(answer)) unique.push(answer);
  }
  return unique.join('\n\n---\n\n');
}

export function buildQuestionFiles(questions: ParsedQuestion[], mapping: Mapping): GeneratedFile[] {
  const byNumber = new Map(questions.map((q) => [q.number, q]));
  const lastOrder = new Map<string, number>();

  return mapping.entries.map((entry) => {
    const order = (lastOrder.get(entry.category) ?? 0) + 1;
    lastOrder.set(entry.category, order);

    const answer = mergeAnswers(entry.sources.map((n) => byNumber.get(n)!.answer));
    // JSON-строка — валидный YAML-скаляр в двойных кавычках.
    const frontmatter = ['---', `title: ${JSON.stringify(entry.title)}`, `category: ${entry.category}`, `order: ${order}`, '---'].join('\n');

    return { fileName: `${entry.id}.md`, content: answer ? `${frontmatter}\n\n${answer}\n` : `${frontmatter}\n` };
  });
}

export function buildReview(questions: ParsedQuestion[], mapping: Mapping, categories: CategoryInfo[]): string {
  const byNumber = new Map(questions.map((q) => [q.number, q]));
  const merged = questions.length - mapping.entries.length;
  const out = [
    '# Разметка вопросов',
    '',
    `Исходных вопросов: ${questions.length}, итоговых: ${mapping.entries.length}, слито дублей: ${merged}.`,
  ];

  for (const category of categories) {
    const entries = mapping.entries.filter((e) => e.category === category.id);
    out.push('', `## ${category.title} (${entries.length})`, '');
    for (const entry of entries) {
      out.push(`- \`${entry.id}\` — ${entry.title}`);
      if (entry.sources.length > 1) {
        const sources = entry.sources.map((n) => `№${n} «${byNumber.get(n)!.title}»`).join(', ');
        out.push(`  - слиты: ${sources}`);
      }
    }
  }

  return out.join('\n') + '\n';
}
```

- [ ] **Step 8: Запустить**

Run: `npm test -- migration/`
Expected: PASS (parse, mapping, generate).

- [ ] **Step 9: CLI**

`migration/cli.ts`:
```ts
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildQuestionFiles, buildReview } from './generate.ts';
import { readCategories, validateMapping, type Mapping } from './mapping.ts';
import { parseNotionExport, type ParsedQuestion } from './parse.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const paths = {
  export: join(root, 'migration/notion-export.md'),
  questions: join(root, 'migration/questions.json'),
  mapping: join(root, 'migration/mapping.json'),
  review: join(root, 'migration/review.md'),
  categories: join(root, 'src/content/categories.yaml'),
  content: join(root, 'src/content/questions'),
};

const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T;

function loadAndValidate() {
  const questions = readJson<ParsedQuestion[]>(paths.questions);
  const mapping = readJson<Mapping>(paths.mapping);
  const categories = readCategories(readFileSync(paths.categories, 'utf8'));
  const errors = validateMapping(questions, mapping, categories.map((c) => c.id));
  if (errors.length > 0) {
    console.error(`Ошибок в mapping.json: ${errors.length}`);
    for (const error of errors) console.error(`  ${error}`);
    process.exit(1);
  }
  return { questions, mapping, categories };
}

const command = process.argv[2];

switch (command) {
  case 'parse': {
    const questions = parseNotionExport(readFileSync(paths.export, 'utf8'));
    writeFileSync(paths.questions, JSON.stringify(questions, null, 2) + '\n');
    console.log(`Вопросов: ${questions.length}, с ответом: ${questions.filter((q) => q.answer).length}`);
    break;
  }
  case 'check': {
    const { mapping } = loadAndValidate();
    console.log(`OK: ${mapping.entries.length} вопросов`);
    break;
  }
  case 'review': {
    const { questions, mapping, categories } = loadAndValidate();
    writeFileSync(paths.review, buildReview(questions, mapping, categories));
    console.log(`Записан ${paths.review}`);
    break;
  }
  case 'generate': {
    const { questions, mapping } = loadAndValidate();
    mkdirSync(paths.content, { recursive: true });
    for (const file of readdirSync(paths.content)) {
      if (file.endsWith('.md')) rmSync(join(paths.content, file));
    }
    const files = buildQuestionFiles(questions, mapping);
    for (const file of files) writeFileSync(join(paths.content, file.fileName), file.content);
    console.log(`Сгенерировано файлов: ${files.length}`);
    break;
  }
  default:
    console.error('Использование: npm run migrate -- parse|check|review|generate');
    process.exit(1);
}
```

- [ ] **Step 10: Прогнать parse**

Run: `npm run migrate -- parse`
Expected: `Вопросов: 717, с ответом: 374`; создан `migration/questions.json`.

Run: `npm run check`
Expected: 0 errors (в т.ч. в `migration/*.ts`).

- [ ] **Step 11: Commit**

```bash
git add migration/ package.json
git commit -m "feat(migration): mapping validation, generator and CLI

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: Разметить категории и дубли, сгенерировать контент

Это задача на разметку данных, а не на код. Выполняет агент (Claude), читая `migration/questions.json`.

**Files:**
- Create: `migration/mapping.json`, `migration/review.md`
- Replace: `src/content/questions/*.md` (примеры удаляются генератором)

**Interfaces:**
- Consumes: формат `Mapping` (Task 4), категории из `src/content/categories.yaml` (Task 2).

**Правила разметки:**

| Категория | Что сюда |
|---|---|
| `swift` | Синтаксис и типы, value/reference, опционалы, протоколы, дженерики, замыкания (escaping, capture list), let/var, модификаторы (`final`, `static`, `mutating`, `inout`), диспетчеризация, Objective-C runtime, swizzling, KVC/KVO |
| `memory` | ARC, strong/weak/unowned, retain cycle, side table, autoreleasepool, стек/куча, copy-on-write, утечки |
| `concurrency` | Потоки, GCD, очереди, DispatchGroup/Barrier/Semaphore, OperationQueue, async/await, Task, акторы, Sendable, RunLoop, deadlock, race condition, примитивы синхронизации, атомики |
| `uikit` | UIView, CALayer, UIViewController и его жизненный цикл, frame/bounds, layout и Auto Layout, hitTest, Responder Chain, таблицы/коллекции, points/pixels, жизненный цикл приложения (AppDelegate/SceneDelegate) |
| `swiftui` | View, модификаторы, State/Binding/ObservedObject/StateObject/Environment, Observation, навигация, модальные окна, производительность SwiftUI |
| `architecture` | MVC/MVVM/VIPER/Clean, UDF, SOLID/DRY/KISS/YAGNI, ООП, DI, сервис-локатор, синглтон, паттерны проектирования, чистый код |
| `algorithms` | Сложность O(n), коллекции и их устройство, Hashable/хеш-таблицы, коллизии, сортировки, поиск, задачи на алгоритмы, числа/биты |
| `networking-storage` | HTTP, REST, URLSession, Codable, WebSocket, кеширование, Core Data, SwiftData, UserDefaults, Keychain, файловая система, базы данных |
| `tooling` | Xcode, сборка, линковка, SPM/CocoaPods, Git (merge/rebase), CI/CD, тесты (unit/UI, моки), отладка, Instruments, профилирование |
| `soft-skills` | Опыт, команда, процессы, код-ревью, конфликты, вопросы о себе |

- **Дубль** — вопрос спрашивает то же самое (другие слова, регистр, опечатки): «ARC» / «Как работает управление памятью в swift (ARC)» / «ARC». Узкий подвопрос дублем **не** является: «weak ссылки» и «куда сохраняются weak ссылки» — разные вопросы.
- `title` — дословно (копией из `questions.json`) самая полная и понятная формулировка из `sources`. Ничего не переписывать.
- `id` — короткий английский kebab-case по смыслу (`arc`, `retain-cycle-min-objects`, `frame-vs-bounds`), уникальный.
- Порядок записей внутри категории — от базовых тем к продвинутым, связанные вопросы рядом. `order` генератор проставит по этому порядку.
- Записи в `entries` сгруппированы по категориям в порядке `categories.yaml`.

- [ ] **Step 1: Разметить вопросы 1–240**

Прочитать `migration/questions.json` (поля `number`, `title`; `answer` смотреть, только если формулировка неоднозначна). Записать черновик `migration/mapping.json`:
```json
{
  "entries": [
    { "id": "arc", "category": "memory", "title": "Как работает управление памятью в swift (ARC)", "sources": [1, 15] }
  ]
}
```

- [ ] **Step 2: Разметить вопросы 241–480** — дополнить тот же файл; при нахождении дубля уже размеченного вопроса добавить номер в `sources` существующей записи.

- [ ] **Step 3: Разметить вопросы 481–717** — аналогично.

- [ ] **Step 4: Проверить разметку**

Run: `npm run migrate -- check`
Expected: `OK: N вопросов`. Пока есть ошибки — исправлять `mapping.json` и повторять.

- [ ] **Step 5: Построить отчёт и контент**

```bash
npm run migrate -- review
npm run migrate -- generate
npm run check && npm run build
```
Expected: `Сгенерировано файлов: N`; сборка без ошибок; примеры `value-vs-reference-types.md`, `view-lifecycle.md`, `protocol-oriented-programming.md` удалены (если их `id` не совпал с разметкой).

- [ ] **Step 6: Выборочная проверка**

Открыть 5 сгенерированных файлов с кодом или списками (`grep -l '```' src/content/questions/*.md | head -3`, `grep -l '^    - ' src/content/questions/*.md | head -2`) и убедиться, что Markdown корректен. Проверить, что вопрос `solid`/принципы (исходный №61) содержит заголовки `**SOLID**`, `**S - Single responsibility principle**`.

- [ ] **Step 7: Commit**

```bash
git add migration/mapping.json migration/review.md src/content/questions/
git commit -m "feat(content): import questions from Notion

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

После этой задачи Markdown в `src/content/questions/` — источник правды. `migrate -- generate` перезаписывает все `.md`; запускать повторно только до начала ручных правок.

- [ ] **Step 8: PR 1 — открыть, дождаться CI, merge (после «да» пользователя)**

```bash
npm test && npm run check && npm run build
git push -u origin feat/migration-content
gh pr create --base main --head feat/migration-content --title "feat: перенос вопросов из Notion" --body "$(cat <<'BODY'
- парсер экспорта Notion → Markdown (migration/parse.ts), проверка разметки, генератор файлов;
- вопросы размечены по 10 категориям, дубли слиты (отчёт migration/review.md);
- src/content/questions/ — все вопросы как Markdown-файлы;
- Vitest и юнит-тесты миграции.

План: docs/superpowers/plans/2026-09-25-fucksobes-mvp.md (PR 1 из 4).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
BODY
)"
gh pr checks --watch
```
Expected: CI зелёный. Показать пользователю ссылку на PR и `migration/review.md`, дождаться явного «да» и только тогда:
```bash
gh pr merge --rebase --delete-branch
gh run watch --exit-status $(gh run list --workflow=Deploy --branch main --limit 1 --json databaseId --jq '.[0].databaseId')
git switch main && git pull --ff-only
```
Expected: Deploy зелёный, `https://alekspt.github.io/fucksobes/` показывает все категории с реальным числом вопросов.

---

### Task 6: Стили, Tailwind, тёмная тема и базовый layout  (PR 2, ветка `feat/design-pages`)

**Files:**
- Modify: `astro.config.mjs`, `src/layouts/Base.astro`
- Create: `src/styles/global.css` (через `astro add`), `src/components/Header.astro`

**Interfaces:**
- Produces: `Base.astro` props `{ title: string; description?: string }`; `<main>` контейнер `max-w-4xl`; `Header.astro` без props. Классы `details.question`, `.chevron` для анимации раскрытия.

- [ ] **Step 1: Ветка `feat/design-pages` от свежего `main`**

```bash
git switch main && git pull --ff-only
git switch -c feat/design-pages
npm ci
```
Expected: `git log --oneline -3` показывает merge/коммиты предыдущего PR; `npm run build` проходит.

- [ ] **Step 2: Установить Tailwind и typography**

```bash
npx astro add tailwind --yes
npm install -D @tailwindcss/typography
```
Expected: в `astro.config.mjs` появился `vite: { plugins: [tailwindcss()] }`, создан `src/styles/global.css` с `@import "tailwindcss";`.

- [ ] **Step 3: Подсветка кода в светлой и тёмной теме**

`astro.config.mjs` итоговый:
```js
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://alekspt.github.io',
  base: '/fucksobes',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
```

- [ ] **Step 4: Глобальные стили**

`src/styles/global.css`:
```css
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

:root {
  interpolate-size: allow-keywords;
}

/* Shiki: вторая тема для тёмного режима */
@media (prefers-color-scheme: dark) {
  .astro-code,
  .astro-code span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
}

/* Раскрытие ответа: плавно там, где браузер поддерживает ::details-content */
details.question::details-content {
  block-size: 0;
  overflow-y: clip;
  transition:
    block-size 250ms ease,
    content-visibility 250ms allow-discrete;
}
details.question[open]::details-content {
  block-size: auto;
}
details.question > summary {
  list-style: none;
}
details.question > summary::-webkit-details-marker {
  display: none;
}
details.question .chevron {
  transition: transform 200ms ease;
}
details.question[open] .chevron {
  transform: rotate(90deg);
}

@media (prefers-reduced-motion: reduce) {
  details.question::details-content,
  details.question .chevron {
    transition: none;
  }
}
```

- [ ] **Step 5: Шапка**

`src/components/Header.astro`:
```astro
---
import { url } from '../lib/url';
---

<header
  class="sticky top-0 z-10 border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80"
>
  <div class="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3 sm:px-6">
    <a href={url()} class="shrink-0 font-semibold tracking-tight">FuckSobes</a>
    <slot />
  </div>
</header>
```

- [ ] **Step 6: Базовый layout**

`src/layouts/Base.astro`:
```astro
---
import Header from '../components/Header.astro';
import { url } from '../lib/url';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Вопросы и ответы для подготовки к iOS-собеседованиям' } = Astro.props;
---

<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href={url('favicon.svg')} />
    <link rel="icon" href={url('favicon.ico')} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content={Astro.generator} />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body class="min-h-dvh bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
    <Header />
    <main class="mx-auto max-w-4xl px-4 pt-8 pb-24 sm:px-6">
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 7: Проверить**

Run: `npm run check && npm run build`
Expected: 0 errors. Затем `npx astro dev --background`, открыть `http://localhost:4321/fucksobes/` в браузере: шапка липкая, фон меняется с системной темой. `npx astro dev stop`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(ui): Tailwind, dark theme and base layout

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: Текстовые хелперы и главная с карточками

**Files:**
- Create: `src/lib/text.ts`, `src/lib/text.test.ts`, `src/components/CategoryCard.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `getCategories`, `getQuestions` (`src/lib/content.ts`), `hasAnswer` (Task 2), `url`.
- Produces:
  - `pluralize(n: number, forms: [string, string, string]): string` — `[один, два, пять]`
  - `interface TitlePart { text: string; code: boolean }`, `splitInlineCode(title: string): TitlePart[]`
  - `plainTitle(title: string): string`
  - `CategoryCard.astro` props `{ category: CollectionEntry<'categories'>; total: number; answered: number }`; на заголовке `transition:name={`category-${id}`}`.

- [ ] **Step 1: Падающий тест**

`src/lib/text.test.ts`:
```ts
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
```

- [ ] **Step 2: Убедиться, что падает**

Run: `npm test -- src/lib/text.test.ts`
Expected: FAIL — `Failed to resolve import "./text"`.

- [ ] **Step 3: Реализация**

`src/lib/text.ts`:
```ts
/** Русское склонение после числа: forms = [один, два, пять]. */
export function pluralize(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export interface TitlePart {
  text: string;
  code: boolean;
}

/** Заголовок вопроса с inline-кодом в `обратных кавычках`. */
export function splitInlineCode(title: string): TitlePart[] {
  const parts = title.split('`');
  if (parts.length % 2 === 0) return [{ text: plainTitle(title), code: false }];
  return parts.map((text, i) => ({ text, code: i % 2 === 1 })).filter((p) => p.text !== '');
}

export function plainTitle(title: string): string {
  return title.replace(/`/g, '');
}
```

- [ ] **Step 4: Запустить**

Run: `npm test -- src/lib/text.test.ts`
Expected: PASS.

- [ ] **Step 5: Карточка категории**

`src/components/CategoryCard.astro`:
```astro
---
import type { CollectionEntry } from 'astro:content';
import { pluralize } from '../lib/text';
import { url } from '../lib/url';

interface Props {
  category: CollectionEntry<'categories'>;
  total: number;
  answered: number;
}

const { category, total, answered } = Astro.props;
---

<a
  href={url(`${category.id}/`)}
  class="block h-full rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
>
  <h2 class="text-lg font-semibold tracking-tight" transition:name={`category-${category.id}`}>
    {category.data.title}
  </h2>
  <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{category.data.description}</p>
  <p class="mt-4 text-xs font-medium text-zinc-500">
    {total}
    {pluralize(total, ['вопрос', 'вопроса', 'вопросов'])} · с ответом {answered}
  </p>
</a>
```

- [ ] **Step 6: Главная**

`src/pages/index.astro`:
```astro
---
import CategoryCard from '../components/CategoryCard.astro';
import Base from '../layouts/Base.astro';
import { getCategories, getQuestions, hasAnswer } from '../lib/content';
import { pluralize } from '../lib/text';

const categories = await getCategories();
const questions = await getQuestions();
const stats = categories.map((category) => {
  const inCategory = questions.filter((q) => q.data.category.id === category.id);
  return { category, total: inCategory.length, answered: inCategory.filter(hasAnswer).length };
});
---

<Base title="FuckSobes — вопросы к iOS-собеседованиям">
  <section class="mb-10">
    <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Вопросы к iOS-собеседованиям</h1>
    <p class="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
      {questions.length}
      {pluralize(questions.length, ['вопрос', 'вопроса', 'вопросов'])} с реальных собеседований. Выберите тему
      и проверьте себя.
    </p>
  </section>
  <ul class="grid gap-4 sm:grid-cols-2">
    {
      stats.map(({ category, total, answered }) => (
        <li>
          <CategoryCard category={category} total={total} answered={answered} />
        </li>
      ))
    }
  </ul>
</Base>
```

- [ ] **Step 7: Проверить**

Run: `npm test && npm run check && npm run build`
Expected: всё зелёное. В dev-сервере на главной 10 карточек в 2 колонки (1 колонка на узком экране), hover приподнимает карточку.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(ui): home page with category cards

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: Страница категории, страница вопроса и 404

**Files:**
- Create: `src/components/QuestionTitle.astro`, `src/components/NoAnswer.astro`, `src/components/QuestionItem.astro`, `src/pages/404.astro`
- Modify: `src/pages/[category]/index.astro`, `src/pages/[category]/[id].astro`

**Interfaces:**
- Consumes: `splitInlineCode`, `plainTitle`, `pluralize` (Task 7), `hasAnswer` (Task 2), `getCategories`, `getQuestions`, `url`.
- Produces: `QuestionItem.astro` props `{ id: string; title: string; href: string; answered: boolean }` + slot (ответ); элемент `<details class="question" id={id}>`. `QuestionTitle.astro` props `{ title: string }`. На `h1` категории `transition:name={`category-${id}`}`.

- [ ] **Step 1: Компоненты**

`src/components/QuestionTitle.astro`:
```astro
---
import { splitInlineCode } from '../lib/text';

interface Props {
  title: string;
}

const { title } = Astro.props;
---

{
  splitInlineCode(title).map((part) =>
    part.code ? (
      <code class="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.9em] dark:bg-zinc-800">{part.text}</code>
    ) : (
      part.text
    ),
  )
}
```

`src/components/NoAnswer.astro`:
```astro
<p class="text-zinc-500 italic">Ответа пока нет — скоро добавим.</p>
```

`src/components/QuestionItem.astro`:
```astro
---
import NoAnswer from './NoAnswer.astro';
import QuestionTitle from './QuestionTitle.astro';

interface Props {
  id: string;
  title: string;
  href: string;
  answered: boolean;
}

const { id, title, href, answered } = Astro.props;
---

<details id={id} class="question">
  <summary
    class="flex cursor-pointer items-start gap-3 py-4 font-medium transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
  >
    <svg class="chevron mt-1 size-4 shrink-0 text-zinc-400" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
      ></path>
    </svg>
    <span class="flex-1"><QuestionTitle title={title} /></span>
    {
      !answered && (
        <span class="mt-0.5 shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-normal text-zinc-500 dark:bg-zinc-800">
          без ответа
        </span>
      )
    }
  </summary>
  <div class="pb-6 pl-7">
    {
      answered ? (
        <div class="prose prose-zinc max-w-none dark:prose-invert">
          <slot />
        </div>
      ) : (
        <NoAnswer />
      )
    }
    <a href={href} class="mt-4 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
      Открыть отдельно →
    </a>
  </div>
</details>
```

- [ ] **Step 2: Страница категории**

`src/pages/[category]/index.astro`:
```astro
---
import type { GetStaticPaths } from 'astro';
import { render } from 'astro:content';
import QuestionItem from '../../components/QuestionItem.astro';
import Base from '../../layouts/Base.astro';
import { getCategories, getQuestions, hasAnswer } from '../../lib/content';
import { pluralize } from '../../lib/text';
import { url } from '../../lib/url';

export const getStaticPaths = (async () => {
  const categories = await getCategories();
  return categories.map((category) => ({ params: { category: category.id }, props: { category } }));
}) satisfies GetStaticPaths;

const { category } = Astro.props;
const questions = await Promise.all(
  (await getQuestions(category.id)).map(async (q) => ({ q, Content: (await render(q)).Content })),
);
---

<Base title={`${category.data.title} — FuckSobes`} description={category.data.description}>
  <a href={url()} class="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">← Все категории</a>
  <h1 class="mt-3 text-3xl font-bold tracking-tight" transition:name={`category-${category.id}`}>
    {category.data.title}
  </h1>
  <p class="mt-2 text-zinc-600 dark:text-zinc-400">
    {questions.length}
    {pluralize(questions.length, ['вопрос', 'вопроса', 'вопросов'])}
  </p>
  <div class="mt-8 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
    {
      questions.map(({ q, Content }) => (
        <QuestionItem
          id={q.id}
          title={q.data.title}
          href={url(`${category.id}/${q.id}/`)}
          answered={hasAnswer(q)}
        >
          <Content />
        </QuestionItem>
      ))
    }
  </div>
</Base>
```

- [ ] **Step 3: Страница вопроса**

`src/pages/[category]/[id].astro`:
```astro
---
import type { GetStaticPaths } from 'astro';
import { getEntry, render } from 'astro:content';
import NoAnswer from '../../components/NoAnswer.astro';
import QuestionTitle from '../../components/QuestionTitle.astro';
import Base from '../../layouts/Base.astro';
import { getQuestions, hasAnswer } from '../../lib/content';
import { plainTitle } from '../../lib/text';
import { url } from '../../lib/url';

export const getStaticPaths = (async () => {
  const questions = await getQuestions();
  return questions.map((question) => ({
    params: { category: question.data.category.id, id: question.id },
    props: { question },
  }));
}) satisfies GetStaticPaths;

const { question } = Astro.props;
const category = await getEntry(question.data.category);
const { Content } = await render(question);
---

<Base title={`${plainTitle(question.data.title)} — FuckSobes`}>
  <nav class="text-sm text-zinc-500">
    <a href={url()} class="hover:text-zinc-900 dark:hover:text-zinc-100">Категории</a>
    <span class="mx-1">/</span>
    <a href={url(`${category.id}/`)} class="hover:text-zinc-900 dark:hover:text-zinc-100">{category.data.title}</a>
  </nav>
  <h1 class="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"><QuestionTitle title={question.data.title} /></h1>
  <div class="mt-6">
    {
      hasAnswer(question) ? (
        <div class="prose prose-zinc max-w-none dark:prose-invert">
          <Content />
        </div>
      ) : (
        <NoAnswer />
      )
    }
  </div>
</Base>
```

- [ ] **Step 4: 404**

`src/pages/404.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import { url } from '../lib/url';
---

<Base title="Страница не найдена — FuckSobes">
  <h1 class="text-3xl font-bold tracking-tight">Страница не найдена</h1>
  <p class="mt-3 text-zinc-600 dark:text-zinc-400">
    <a href={url()} class="underline underline-offset-4">Вернуться к категориям</a>
  </p>
</Base>
```

- [ ] **Step 5: Проверить**

Run: `npm run check && npm run build`
Expected: 0 errors. В dev-сервере: страница «Память» — список, клик по вопросу плавно раскрывает ответ (Chrome), шеврон поворачивается; вопрос без ответа помечен «без ответа»; код в ответе подсвечен в обеих темах; «Открыть отдельно →» ведёт на страницу вопроса; `/fucksobes/nope/` показывает 404.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(ui): category and question pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

- [ ] **Step 7: PR 2 — открыть, дождаться CI, merge (после «да» пользователя)**

```bash
npm test && npm run check && npm run build
git push -u origin feat/design-pages
gh pr create --base main --head feat/design-pages --title "feat: дизайн — главная, категории, вопросы" --body "$(cat <<'BODY'
- Tailwind 4, тёмная тема, подсветка Swift в обеих темах, базовый layout;
- главная с карточками категорий и счётчиками;
- страница категории с плавным раскрытием ответов, страница вопроса, 404.

План: docs/superpowers/plans/2026-09-25-fucksobes-mvp.md (PR 2 из 4).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
BODY
)"
gh pr checks --watch
```
Expected: CI зелёный. Показать пользователю ссылку на PR, дождаться явного «да» и только тогда:
```bash
gh pr merge --rebase --delete-branch
gh run watch --exit-status $(gh run list --workflow=Deploy --branch main --limit 1 --json databaseId --jq '.[0].databaseId')
git switch main && git pull --ff-only
```
Expected: Deploy зелёный, оформленный сайт открывается по `https://alekspt.github.io/fucksobes/`; стили и ссылки работают под `/fucksobes/`.

---

### Task 9: Поиск по вопросам  (PR 3, ветка `feat/search-animations`)

**Files:**
- Create: `src/lib/search.ts`, `src/lib/search.test.ts`, `src/pages/search-index.json.ts`, `src/components/Search.tsx`
- Modify: `src/components/Header.astro`

**Interfaces:**
- Consumes: `getCategories`, `getQuestions`, `plainTitle`, `url`.
- Produces:
  - `interface SearchDoc { id: string; title: string; categoryTitle: string; url: string }`
  - `normalizeTerm(term: string): string | null`
  - `createSearch(docs: SearchDoc[]): (query: string, limit?: number) => SearchDoc[]`
  - Статический файл `/fucksobes/search-index.json` — `SearchDoc[]`
  - `Search.tsx` default export, props `{ indexUrl: string }`; input с `role="combobox"`, результаты `role="option"`.

- [ ] **Step 1: Ветка `feat/search-animations` от свежего `main`**

```bash
git switch main && git pull --ff-only
git switch -c feat/search-animations
npm ci
```
Expected: `git log --oneline -3` показывает merge/коммиты предыдущего PR; `npm run build` проходит.

- [ ] **Step 2: Установить MiniSearch**

```bash
npm install minisearch
```

- [ ] **Step 3: Падающий тест**

`src/lib/search.test.ts`:
```ts
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
```

- [ ] **Step 4: Убедиться, что падает**

Run: `npm test -- src/lib/search.test.ts`
Expected: FAIL — `Failed to resolve import "./search"`.

- [ ] **Step 5: Реализация**

`src/lib/search.ts`:
```ts
import MiniSearch from 'minisearch';

export interface SearchDoc {
  id: string;
  title: string;
  categoryTitle: string;
  url: string;
}

export function normalizeTerm(term: string): string | null {
  const normalized = term.toLowerCase().replace(/ё/g, 'е').replace(/`/g, '');
  return normalized === '' ? null : normalized;
}

/** Поиск только по формулировкам вопросов: префикс, опечатки, все слова обязательны. */
export function createSearch(docs: SearchDoc[]): (query: string, limit?: number) => SearchDoc[] {
  const index = new MiniSearch<SearchDoc>({
    fields: ['title'],
    storeFields: ['title', 'categoryTitle', 'url'],
    processTerm: normalizeTerm,
    searchOptions: { prefix: true, fuzzy: 0.2, combineWith: 'AND' },
  });
  index.addAll(docs);

  return (query, limit = 20) =>
    index
      .search(query)
      .slice(0, limit)
      .map((hit) => ({ id: String(hit.id), title: hit.title, categoryTitle: hit.categoryTitle, url: hit.url }));
}
```

- [ ] **Step 6: Запустить**

Run: `npm test -- src/lib/search.test.ts`
Expected: PASS. Если «прощает опечатку» не проходит из-за порога — поднять `fuzzy` до `0.25` и перезапустить; остальные тесты должны остаться зелёными.

- [ ] **Step 7: Индекс при сборке**

`src/pages/search-index.json.ts`:
```ts
import type { APIRoute } from 'astro';
import { getCategories, getQuestions } from '../lib/content';
import type { SearchDoc } from '../lib/search';
import { plainTitle } from '../lib/text';
import { url } from '../lib/url';

export const GET: APIRoute = async () => {
  const categoryTitles = new Map((await getCategories()).map((c) => [c.id, c.data.title]));
  const docs: SearchDoc[] = (await getQuestions()).map((q) => ({
    id: q.id,
    title: plainTitle(q.data.title),
    categoryTitle: categoryTitles.get(q.data.category.id) ?? '',
    url: url(`${q.data.category.id}/${q.id}/`),
  }));
  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json' } });
};
```

- [ ] **Step 8: React-компонент поиска**

`src/components/Search.tsx`:
```tsx
import { navigate } from 'astro:transitions/client';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { createSearch, type SearchDoc } from '../lib/search';

interface Props {
  indexUrl: string;
}

export default function Search({ indexUrl }: Props) {
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useMemo(() => (docs ? createSearch(docs) : null), [docs]);
  const hits = useMemo(() => (search && query.trim() ? search(query) : []), [search, query]);

  // Индекс грузится при первом фокусе, а не при загрузке страницы.
  function loadIndex() {
    if (docs || failed) return;
    fetch(indexUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<SearchDoc[]>;
      })
      .then(setDocs)
      .catch(() => setFailed(true));
  }

  useEffect(() => {
    function onGlobalKey(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onGlobalKey);
    return () => window.removeEventListener('keydown', onGlobalKey);
  }, []);

  function go(url: string) {
    setQuery('');
    inputRef.current?.blur();
    navigate(url);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, hits.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter' && hits[active]) {
      event.preventDefault();
      go(hits[active].url);
    } else if (event.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
    }
  }

  const open = focused && query.trim() !== '';
  const status = failed ? 'Не удалось загрузить поиск' : !docs ? 'Загрузка…' : hits.length === 0 ? 'Ничего не найдено' : null;

  return (
    <div className="relative ml-auto w-full max-w-sm">
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-label="Поиск по вопросам"
        aria-expanded={open}
        aria-controls="search-results"
        aria-autocomplete="list"
        aria-activedescendant={open && hits[active] ? `search-hit-${active}` : undefined}
        placeholder="Поиск по вопросам  ⌘K"
        value={query}
        onFocus={() => {
          setFocused(true);
          loadIndex();
        }}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-600 dark:focus:bg-zinc-950"
      />
      {open && (
        <ul
          id="search-results"
          role="listbox"
          className="absolute right-0 mt-2 max-h-[70vh] w-full overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-xl shadow-zinc-900/10 sm:w-[28rem] dark:border-zinc-800 dark:bg-zinc-900"
        >
          {status ? (
            <li className="px-3 py-2 text-sm text-zinc-500">{status}</li>
          ) : (
            hits.map((hit, i) => (
              <li key={hit.id} id={`search-hit-${i}`} role="option" aria-selected={i === active}>
                <a
                  href={hit.url}
                  onMouseDown={(event) => {
                    event.preventDefault(); // не терять фокус до перехода
                    go(hit.url);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`block rounded-lg px-3 py-2 text-sm ${i === active ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
                >
                  <span className="block">{hit.title}</span>
                  <span className="block text-xs text-zinc-500">{hit.categoryTitle}</span>
                </a>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 9: Подключить в шапку**

`src/components/Header.astro` — заменить `<slot />` на остров и добавить импорт:
```astro
---
import { url } from '../lib/url';
import Search from './Search.tsx';
---

<header
  class="sticky top-0 z-10 border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80"
>
  <div class="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3 sm:px-6">
    <a href={url()} class="shrink-0 font-semibold tracking-tight">FuckSobes</a>
    <Search client:idle transition:persist indexUrl={url('search-index.json')} />
  </div>
</header>
```

- [ ] **Step 10: Проверить**

Run: `npm test && npm run check && npm run build && ls dist/search-index.json`
Expected: всё зелёное, файл индекса существует. В dev-сервере: ⌘K фокусирует поиск, «arc» показывает результаты с категориями, стрелки + Enter и клик мышью открывают страницу вопроса, Esc очищает.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(search): client-side search by question titles

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 10: Переходы между страницами (View Transitions)

**Files:**
- Modify: `src/layouts/Base.astro`

**Interfaces:**
- Consumes: `transition:name={`category-${id}`}` на карточке (Task 7) и `h1` категории (Task 8); `transition:persist` на поиске (Task 9); `navigate` в `Search.tsx` (Task 9).

- [ ] **Step 1: Подключить ClientRouter**

В `src/layouts/Base.astro` во frontmatter добавить `import { ClientRouter } from 'astro:transitions';`, в `<head>` после `<title>` — `<ClientRouter />`.

- [ ] **Step 2: Проверить**

Run: `npm run check && npm run build`
Expected: 0 errors. В dev-сервере: переход с главной в категорию — заголовок карточки плавно «перелетает» в `h1`; поиск в шапке не мигает при переходах; назад/вперёд браузера работают; при включённом «Уменьшить движение» в системе анимации нет (Astro учитывает `prefers-reduced-motion` сам). Раскрытие `<details>` после клиентского перехода продолжает работать.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat(ui): view transitions between pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

- [ ] **Step 4: PR 3 — открыть, дождаться CI, merge (после «да» пользователя)**

```bash
npm test && npm run check && npm run build
git push -u origin feat/search-animations
gh pr create --base main --head feat/search-animations --title "feat: поиск и переходы между страницами" --body "$(cat <<'BODY'
- поиск по формулировкам вопросов (MiniSearch, префиксы, опечатки, ё = е, ⌘K, навигация стрелками);
- индекс собирается при билде (search-index.json);
- View Transitions между страницами, поиск не перерисовывается при переходах.

План: docs/superpowers/plans/2026-09-25-fucksobes-mvp.md (PR 3 из 4).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
BODY
)"
gh pr checks --watch
```
Expected: CI зелёный. Показать пользователю ссылку на PR, дождаться явного «да» и только тогда:
```bash
gh pr merge --rebase --delete-branch
gh run watch --exit-status $(gh run list --workflow=Deploy --branch main --limit 1 --json databaseId --jq '.[0].databaseId')
git switch main && git pull --ff-only
```
Expected: Deploy зелёный; на `https://alekspt.github.io/fucksobes/` работает поиск (индекс грузится из `/fucksobes/search-index.json`).

---

### Task 11: E2E smoke-тест и CI  (PR 4, ветка `feat/tests-docs`)

**Files:**
- Create: `playwright.config.ts`, `e2e/smoke.spec.ts`
- Modify: `package.json`, `.gitignore`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: всё UI из Tasks 7–10 (`details.question`, `role="combobox"`, `role="option"`, `h2` на карточках).

- [ ] **Step 1: Ветка `feat/tests-docs` от свежего `main`**

```bash
git switch main && git pull --ff-only
git switch -c feat/tests-docs
npm ci
```
Expected: `git log --oneline -3` показывает merge/коммиты предыдущего PR; `npm run build` проходит.

- [ ] **Step 2: Установить Playwright**

```bash
npm install -D @playwright/test
npx playwright install chromium
```
В `package.json` → `scripts`: `"test:e2e": "playwright test"`. В `.gitignore` добавить:
```
# playwright
test-results/
playwright-report/
```

- [ ] **Step 3: Конфиг**

`playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:4321/fucksobes/' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321',
    url: 'http://localhost:4321/fucksobes/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
```

- [ ] **Step 4: Тесты**

`e2e/smoke.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('главная → категория → раскрытие ответа', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 2 })).toHaveCount(10);

  await page.getByRole('link', { name: /Память/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Память' })).toBeVisible();

  const first = page.locator('details.question').first();
  await first.locator('summary').click();
  await expect(first).toHaveAttribute('open', '');
});

test('поиск находит вопрос и открывает его страницу', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('combobox', { name: 'Поиск по вопросам' }).fill('ARC');

  const option = page.getByRole('option').first();
  await expect(option).toBeVisible();
  await option.click();

  await expect(page).toHaveURL(/\/fucksobes\/[a-z-]+\/[a-z0-9-]+\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
```

- [ ] **Step 5: Запустить**

Run: `npm run test:e2e`
Expected: 2 passed.

- [ ] **Step 6: CI**

`.github/workflows/ci.yml` — после шага `npx astro check` добавить:
```yaml
      # Юнит-тесты (миграция, поиск, хелперы)
      - run: npm test

      - run: npx playwright install --with-deps chromium

      # Сборка + e2e smoke (Playwright сам запускает build и preview)
      - run: npm run test:e2e
```
и удалить отдельный шаг `- run: npm run build` с его комментарием (сборку делает e2e).

`.github/workflows/deploy.yml` — перед `- run: npm run build` добавить `- run: npm test`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "test: e2e smoke tests and CI steps

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 12: Документация и PR 4  (ветка `feat/tests-docs`, продолжение Task 11)

**Files:**
- Modify: `README.md`, `AGENTS.md`

- [ ] **Step 1: README**

`README.md` (полностью заменить):
````md
# FuckSobes

Вопросы и ответы для подготовки к iOS-собеседованиям: https://alekspt.github.io/fucksobes/

## Разработка

```sh
npm install
npm run dev        # http://localhost:4321/fucksobes/
npm test           # юнит-тесты
npm run test:e2e   # e2e smoke (собирает сайт)
npm run check      # типы и .astro
```

## Как добавить или изменить вопрос

Каждый вопрос — файл `src/content/questions/<id>.md`:

```md
---
title: "Что такое retain cycle?"
category: memory
order: 12
---
Текст ответа в Markdown. Пустое тело — «ответа пока нет».
```

- `id` (имя файла) — kebab-case латиницей, уникальный, попадает в URL `/<category>/<id>/`.
- `category` — `id` из `src/content/categories.yaml`.
- `order` — порядок внутри категории.

После пуша в `main` сайт пересобирается и публикуется автоматически.

## Миграция из Notion

`migration/` — разовый перенос из Notion (`npm run migrate -- parse|check|review|generate`). Контент уже сгенерирован; `generate` перезапишет все файлы вопросов, поэтому после ручных правок его не запускать.
````

- [ ] **Step 2: AGENTS.md**

В конец `AGENTS.md` добавить:
```md
## Project

- Content: one Markdown file per question in `src/content/questions/<id>.md` (frontmatter `title`, `category`, `order`; empty body = no answer). Categories: `src/content/categories.yaml`.
- Always build internal links with `url()` from `src/lib/url.ts` (site is served under `/fucksobes/`).
- Interactive UI only as React islands (`.tsx`); keep logic in `src/lib/*.ts` with unit tests.
- Search indexes question titles only (`src/lib/search.ts`, `src/pages/search-index.json.ts`).
- Do not run `npm run migrate -- generate` — it overwrites all question files.
- Tests: `npm test` (Vitest), `npm run test:e2e` (Playwright), `npm run check`.
```

- [ ] **Step 3: Финальная проверка и коммит**

```bash
npm test && npm run check && npm run test:e2e
git add README.md AGENTS.md
git commit -m "docs: README and agent notes

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```
Expected: всё зелёное, коммит создан.

- [ ] **Step 4: Открыть PR в `main`**

Репозиторий `AleksPt/fucksobes` и GitHub Pages уже настроены — ничего создавать не нужно.

```bash
git push -u origin feat/tests-docs
gh pr create --base main --head feat/tests-docs --title "test: e2e smoke в CI и документация" --body "$(cat <<'BODY'
- Playwright smoke-тесты (навигация, раскрытие ответа, поиск);
- CI и Deploy запускают юнит-тесты, CI — ещё и e2e;
- README и AGENTS.md.

План: docs/superpowers/plans/2026-09-25-fucksobes-mvp.md (PR 4 из 4).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
BODY
)"
```
Expected: PR создан, workflow `CI` на PR зелёный. Если CI красный — чинить в `feat/tests-docs` и пушить.

- [ ] **Step 5: Merge и проверка деплоя — СПРОСИТЬ ПОЛЬЗОВАТЕЛЯ ПЕРЕД MERGE**

Это последний PR. Merge в `main` сразу публикует сайт. Показать пользователю ссылку на PR и дождаться явного «да», затем:
```bash
gh pr merge --rebase --delete-branch
gh run watch --exit-status $(gh run list --workflow=Deploy --branch main --limit 1 --json databaseId --jq '.[0].databaseId')
```
Expected: workflow `Deploy` зелёный; `https://alekspt.github.io/fucksobes/` открывается, работают карточки, раскрытие ответов, поиск и ссылки (проверить в браузере, что стили и `search-index.json` грузятся из `/fucksobes/`).
