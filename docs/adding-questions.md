# Добавление новых вопросов

Инструкция для агента. Читать, когда пользователь просит добавить вопросы (обычно вставляет список вопросов с собеседований). Правила ветвления и PR: раздел «Git workflow» в `AGENTS.md`.

1. **Dedupe first.** Compare every incoming question by meaning, not wording, against existing `title`s in `src/content/questions/` (`grep -ril <keyword>`). Skip duplicates and near-duplicates; do not create a second file for a question that already exists. Report skipped ones and the file that already covers them.
2. **Pick the category** from `src/content/categories.yaml`. If none fits, ask the user instead of inventing one.
3. **Create `src/content/questions/<id>.md`**:
   - `id`: short kebab-case latin slug, unique across all files (check `ls src/content/questions`);
   - frontmatter: `title` (in double quotes, Russian, phrased as a question), `category` (a category id), `order`;
   - `order`: max `order` within that category + 1 (per category, not global); for several questions, increment in the order they were given.
4. **Write the answer** as the file body, in Russian. Write it yourself; do not leave the body empty unless the user asked for a question without an answer. Style: start with a direct definition or short answer, then details as short paragraphs or bullet lists, key terms in bold, Swift examples in fenced ```swift blocks, code comments in Russian. Aim for 10–25 lines: enough to answer at an interview, no essays. Be technically accurate; if unsure about a detail, leave it out rather than guess.
5. **Validate**: `npm run check` and `npm test` must pass.
6. **One PR per category** (see Git workflow in `AGENTS.md`): branch `content/<slug>`, title `content: новые вопросы и ответы в категории «<Категория>» из списка вопросов собеседований`. The body lists the added questions in one sentence and states that duplicates were skipped. If the list spans several categories, open a separate PR for each. Never pull in Notion page ids or the raw export (see `migration/notion-export.md`, gitignored).
7. **Report to the user** when done: the added questions grouped by category. Show only the category title as a heading and the question titles under it, nothing else (no ids, paths or links).
