## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project

- Content: one Markdown file per question in `src/content/questions/<locale>/<id>.md` (`<locale>` is `ru` or `en`; frontmatter `title`, `category`, `order`; empty body = no answer). `<id>` is kebab-case latin, unique within the locale, and becomes the URL `/<category>/<id>/`. The same `<id>` in `ru/` and `en/` links a translation to its original (all existing questions and tutorials are translated; new untranslated content is simply hidden in the English version: categories, topics and the "Tutorials" button appear once they have `en/` files). Russian is the source: new content is written in `ru/`. Categories: `src/content/categories.yaml`.
- Two locales: `ru` (default, no URL prefix) and `en` (`/en/`). Page bodies live in `src/views/*.astro`; `src/pages/*` and `src/pages/en/*` are thin wrappers (same file set in both, `getStaticPaths` from `src/lib/paths.ts`). UI strings: `src/i18n/index.ts` (add a key to both `ru` and `en`; plurals via `plural()`). Components get the locale from `toLocale(Astro.currentLocale)`, islands via a `locale` prop. English category title/description: `en:` block in `categories.yaml`; English tutorial topic/section titles: `src/lib/tutorials.en.ts` (same order as `tutorials.ts`). New pages must be added in both `src/pages/` and `src/pages/en/`.
- Language choice is remembered in `localStorage` (`fucksobes:locale`) only when the visitor clicks the header language switch (`data-locale-switch`). A blocking inline script in `Base.astro` then redirects, once per tab, only from the Russian home root to `/en/` on a document load (never on ClientRouter navigations, never for other URLs). Logic and tests: `src/lib/locale-preference.ts`; the inline script must stay in sync with it. No auto-detection by browser language (the owner decided against it).
- Always build internal links with `url(path, locale)` from `src/lib/url.ts` (site is served under `/fucksobes/`; the English version lives under `/fucksobes/en/`, Russian has no prefix).
- Interactive UI only as React islands (`.tsx`); keep logic in `src/lib/*.ts` with unit tests.
- Tutorials (second flow, `/tutorials/`): topics and the numbered section list live in `src/lib/tutorials.ts`; a tutorial page is `src/content/tutorials/<locale>/<topic>/<id>.md` (frontmatter `title`, `order` = section number in the topic, from 1). A section button gets its link automatically when a file with that topic and `order` exists. Cross-references to other tutorials ("тутор 03") are relative links (`[тутор 03](../init-inheritance-access/)`) once the target page exists, and plain text until then; never link from inside code blocks. English pages live in `src/content/tutorials/en/<topic>/<id>.md`, English images in `src/assets/tutorials/en/<topic>/` (generated from the Russian SVGs by `scripts/svg-i18n/`); the process is in `docs/translation.md` ("Туториалы и картинки").
- Search indexes question titles only (`src/lib/search.ts`, `src/pages/search-index.json.ts`).
- Design system: `docs/design-system.md`, tokens in `@theme` in `src/styles/global.css`. Dark only, one lime accent; use token utilities (`bg-carbon`, `text-fog`, `rounded-card`), no `dark:` classes and no color literals.
- Do not run `npm run migrate -- generate` — it overwrites all question files.
- Tests: `npm test` (Vitest), `npm run test:e2e` (Playwright; run `npx astro preview stop` first if a stale preview holds port 4321; a background `astro dev` on 4321 also gets reused by Playwright and makes tests fail, check with `astro dev status`), `npm run check`.

## Adding new questions

When the user asks to add questions (usually a pasted list of interview questions), read `docs/adding-questions.md` first and follow it. Do not read it for other tasks.

## Translating to English

When the user asks to translate questions or tutorials into English, read `docs/translation.md` first and follow it. Do not read it for other tasks.

## Adding new tutorials

When the user asks to add tutorials (usually a link to a topic page in Notion), read `docs/adding-tutorials.md` first and follow it. Do not read it for other tasks.

## Git workflow

GitHub Flow, solo project. `main` is production: every merge deploys to GitHub Pages via Actions.

- Never commit or push to `main` directly, not even for typos. Branch protection enforces it, admin included; do not try to bypass it.
- Work in short-lived branches off `main` named `feat/`, `fix/`, `content/`, `chore/` or `docs/` plus a kebab-case slug.
- Open a PR for every change. Merge only when the required check `check` (workflow `CI`) is green. No approvals needed.
- Right after `gh pr create`, enable auto-merge: `gh pr merge <number> --auto --squash` (the owner authorised this for every PR). GitHub then merges as soon as `check` passes; do not wait for it or merge by hand. If CI fails, fix it on the same branch: auto-merge stays armed. Do not arm auto-merge on PRs from forks or on PRs you did not open.
- Squash merge only (merge commits and rebase merges are disabled). The PR title becomes the commit title and the PR body becomes the commit body, so write both as final. Merged branches are deleted automatically.
- After a PR is merged, sync the local `main`: `git switch main && git pull --ff-only`. Merges happen on GitHub, so local `main` falls behind otherwise. If `--ff-only` fails, local `main` has diverged: stop and tell the owner.
- PR titles use Conventional Commits (`feat:`, `fix:`, `content:`, `chore:`, `docs:`, `test:`) and are written in Russian. Keep the body short: what and why.
- Large content changes (e.g. bulk edits of questions) go in separate PRs per category, not one huge PR.
- No `develop` or `release` branches. Tags only for milestones.
- The repository is public: never commit secrets, local paths, Notion page ids or raw exports.
