import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
    if (!existsSync(paths.export)) {
      console.error(
        'Экспорт Notion не найден: migration/notion-export.md. Файл не хранится в репозитории (в нём id страниц Notion); сделайте экспорт заново и положите его сюда.',
      );
      process.exit(1);
    }
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
