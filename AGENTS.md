## Development

Dev-сервер запускать в фоне: `astro dev --background`. Управление: `astro dev stop`, `astro dev status`, `astro dev logs`.

Документация Astro: https://docs.astro.build (routing, astro-components, framework-components, content-collections, styling, i18n).

## Project

- Контент: один Markdown на вопрос, `src/content/questions/<locale>/<id>.md` (`ru` или `en`; frontmatter `title`, `category`, `order`; пустое тело = нет ответа). `<id>` — kebab-case латиницей, уникален внутри локали, становится URL `/<category>/<id>/`. Русский — источник: новый контент пишется в `ru/`. Категории: `src/content/categories.yaml`.
- Две локали, `ru` (без префикса) и `en` (`/en/`). Новые страницы добавляются и в `src/pages/`, и в `src/pages/en/`; строки UI — в оба языка в `src/i18n/index.ts`. Детали, структура и запоминание языка: `docs/i18n.md` (читать при работе со страницами, UI-строками, переключателем языка).
- Внутренние ссылки только через `url(path, locale)` из `src/lib/url.ts` (сайт под `/fucksobes/`, английская версия под `/fucksobes/en/`).
- Интерактив только React-островами (`.tsx`); логика в `src/lib/*.ts` с unit-тестами.
- Дизайн: `docs/design-system.md`, токены в `@theme` в `src/styles/global.css`. Только тёмная тема, один лаймовый акцент; утилиты токенов (`bg-carbon`, `text-fog`, `rounded-card`), без `dark:` и цветовых литералов.
- Не запускать `npm run migrate -- generate`: он перезаписывает все файлы вопросов.
- Тесты: `npm test` (Vitest), `npm run test:e2e` (Playwright; перед ним `npx astro preview stop`, если старый preview держит порт 4321; фоновый `astro dev` на 4321 Playwright тоже подхватывает и тесты падают, проверять `astro dev status`), `npm run check`.

## Когда читать docs

Читать только под соответствующую задачу, для остальных не открывать.

- Добавление вопросов (обычно вставленный список): `docs/adding-questions.md`.
- Перевод вопросов или туториалов на английский: `docs/translation.md`.
- Добавление туториалов (обычно ссылка на тему в Notion): `docs/adding-tutorials.md`. Туториалы: `src/content/tutorials/<locale>/<topic>/<id>.md`, темы и разделы в `src/lib/tutorials.ts`.
- Ветка, коммит, PR: `docs/git-workflow.md`.

## Git (критичное)

- Никогда не коммитить и не пушить в `main`: работать в ветке `feat/`, `fix/`, `content/`, `chore/` или `docs/`, на каждое изменение PR.
- Сразу после `gh pr create`: `gh pr merge <number> --auto --squash` (владелец разрешил). Не ждать CI и не мержить вручную.
- Заголовок PR — Conventional Commits на русском. После merge: `git switch main && git pull --ff-only`.
- Репозиторий публичный: никаких секретов, локальных путей и id страниц Notion.
