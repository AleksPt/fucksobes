# FuckSobes

Вопросы и ответы для подготовки к iOS-собеседованиям. Статический сайт на Astro, хостинг — GitHub Pages: https://alekspt.github.io/fucksobes/

## Разработка

```sh
npm install
npm run dev        # http://localhost:4321/fucksobes/
npm run build      # сборка в dist/, валидирует контент
npm test           # юнит-тесты (Vitest)
npm run test:e2e   # e2e smoke (Playwright, сам собирает сайт и поднимает preview)
npm run check      # типы и .astro-файлы (astro check)
```

Если на порту 4321 остался старый `astro preview`, перед `npm run test:e2e` выполните `npx astro preview stop`: preview Astro может работать в фоне, и Playwright локально переиспользует старую сборку.

## Как устроен сайт

- Astro 7, статическая сборка; сайт отдаётся под базовым путём `/fucksobes/`.
- Tailwind 4 для стилей, тёмная и светлая темы.
- Интерактив (например, поиск по ⌘K) — React-острова.
- Поиск — MiniSearch по заголовкам вопросов; индекс собирается на этапе сборки и отдаётся как `/fucksobes/search-index.json`.

## Контент

- `src/content/categories.yaml` — список категорий (`id`, `title`, `description`, `order`). Значения с `: ` внутри брать в кавычки.
- `src/content/questions/*.md` — один вопрос на файл. Имя файла — id вопроса и часть URL.

### Как добавить или изменить вопрос

Каждый вопрос — файл `src/content/questions/<id>.md`:

```md
---
title: "Что такое retain cycle?"
category: memory  # id из categories.yaml
order: 12         # порядок внутри категории
---

Текст ответа в Markdown. Пустое тело — «Ответа пока нет».
```

- `id` (имя файла без `.md`) — kebab-case латиницей, уникальный; попадает в URL `/<category>/<id>/`.
- `category` — `id` из `src/content/categories.yaml`.
- `order` — порядок внутри категории.

После слияния в `main` сайт пересобирается и публикуется автоматически.

## Миграция из Notion

`migration/` — разовый инструмент переноса из Notion в Markdown: `npm run migrate -- parse|check|review|generate`.

- `parse` разбирает локальный `migration/notion-export.md` в `migration/questions.json`. Этого файла нет в репозитории (он в `.gitignore`: в экспорте были id страниц Notion), а результат разбора — `migration/questions.json` — закоммичен;
- `check` валидирует `migration/mapping.json`;
- `review` пишет `migration/review.md`;
- `generate` создаёт файлы вопросов в `src/content/questions/`.

`migration/mapping.json` — разметка: какие исходные вопросы слиты в один итоговый (id, категория, заголовок, номера источников). `migration/review.md` — читаемый отчёт по этой разметке (итоговые вопросы по категориям и слитые дубли) для ручной проверки.

Контент уже сгенерирован. **`generate` перезаписывает все файлы вопросов — после ручных правок его не запускать.**

## Тесты и CI

- На PR (workflow `CI`): `astro check`, юнит-тесты, e2e smoke.
- При пуше в `main` (workflow `Deploy`): юнит-тесты, сборка и публикация на GitHub Pages.

## Git

GitHub Flow: `main` = прод (автодеплой), изменения только через PR с зелёным CI, squash merge, заголовки PR — Conventional Commits на русском. Полные правила — в разделе «Git workflow» в [AGENTS.md](AGENTS.md).
