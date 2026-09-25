# FuckSobes

Вопросы и ответы для подготовки к iOS-собеседованиям. Статический сайт на Astro, хостинг — GitHub Pages: https://alekspt.github.io/fucksobes/

## Разработка

```sh
npm install
npm run dev        # http://localhost:4321/fucksobes/
npx astro check    # типы
npm run build      # сборка в dist/, валидирует контент
```

## Контент

- `src/content/categories.yaml` — список категорий (`id`, `title`, `description`, `order`). Значения с `: ` внутри брать в кавычки.
- `src/content/questions/*.md` — один вопрос на файл. Имя файла — id вопроса и часть URL.

```md
---
title: Текст вопроса
category: swift   # id из categories.yaml
order: 1          # порядок внутри категории
---

Ответ в markdown. Пустое тело — ответа пока нет.
```

## Git

GitHub Flow: `main` = прод (автодеплой), изменения только через PR с зелёным CI, squash merge. Ветки `feat/`, `fix/`, `content/`, `chore/`; заголовок PR — в формате Conventional Commits.
