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

- Content: one Markdown file per question in `src/content/questions/<id>.md` (frontmatter `title`, `category`, `order`; empty body = no answer). `<id>` is kebab-case latin, unique, and becomes the URL `/<category>/<id>/`. Categories: `src/content/categories.yaml`.
- Always build internal links with `url()` from `src/lib/url.ts` (site is served under `/fucksobes/`).
- Interactive UI only as React islands (`.tsx`); keep logic in `src/lib/*.ts` with unit tests.
- Tutorials (second flow, `/tutorials/`): topics and the numbered section list live in `src/lib/tutorials.ts`; a tutorial page is `src/content/tutorials/<topic>/<id>.md` (frontmatter `title`, `order` = section number in the topic, from 1). A section button gets its link automatically when a file with that topic and `order` exists. Cross-references to other tutorials ("тутор 03") are relative links (`[тутор 03](../init-inheritance-access/)`) once the target page exists, and plain text until then; never link from inside code blocks.
- Search indexes question titles only (`src/lib/search.ts`, `src/pages/search-index.json.ts`).
- Design system: `docs/design-system.md`, tokens in `@theme` in `src/styles/global.css`. Dark only, one lime accent; use token utilities (`bg-carbon`, `text-fog`, `rounded-card`), no `dark:` classes and no color literals.
- Do not run `npm run migrate -- generate` — it overwrites all question files.
- Tests: `npm test` (Vitest), `npm run test:e2e` (Playwright; run `npx astro preview stop` first if a stale preview holds port 4321), `npm run check`.

## Adding new questions

When the user asks to add questions (usually a pasted list of interview questions), read `docs/adding-questions.md` first and follow it. Do not read it for other tasks.

## Adding new tutorials

When the user asks to add tutorials (usually a link to a topic page in Notion), read `docs/adding-tutorials.md` first and follow it. Do not read it for other tasks.

## Git workflow

GitHub Flow, solo project. `main` is production: every merge deploys to GitHub Pages via Actions.

- Never commit or push to `main` directly, not even for typos. Branch protection enforces it, admin included; do not try to bypass it.
- Work in short-lived branches off `main` named `feat/`, `fix/`, `content/`, `chore/` or `docs/` plus a kebab-case slug.
- Open a PR for every change. Merge only when the required check `check` (workflow `CI`) is green. No approvals needed.
- Right after `gh pr create`, enable auto-merge: `gh pr merge <number> --auto --squash` (the owner authorised this for every PR). GitHub then merges as soon as `check` passes; do not wait for it or merge by hand. If CI fails, fix it on the same branch: auto-merge stays armed. Do not arm auto-merge on PRs from forks or on PRs you did not open.
- Squash merge only (merge commits and rebase merges are disabled). The PR title becomes the commit title and the PR body becomes the commit body, so write both as final. Merged branches are deleted automatically.
- PR titles use Conventional Commits (`feat:`, `fix:`, `content:`, `chore:`, `docs:`, `test:`) and are written in Russian. Keep the body short: what and why.
- Large content changes (e.g. bulk edits of questions) go in separate PRs per category, not one huge PR.
- No `develop` or `release` branches. Tags only for milestones.
- The repository is public: never commit secrets, local paths, Notion page ids or raw exports.
