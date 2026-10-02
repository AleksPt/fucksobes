import { splitLocaleId, type Locale } from './locale';

export interface TutorialSection {
  title: string;
  /** Пока ссылки нет — кнопка рендерится без перехода */
  href?: string;
}

export interface Tutorial {
  slug: string;
  title: string;
  sections: TutorialSection[];
}

const sections = (titles: string[]): TutorialSection[] => titles.map((title) => ({ title }));

/** Туториалы, у которых уже есть страница `/tutorials/<slug>/` */
export const tutorials: Tutorial[] = [
  {
    slug: 'swift',
    title: 'Swift',
    sections: sections([
      'Структуры, классы и enum',
      'Свойства и property wrappers',
      'Инициализация, наследование и доступ',
      'Optional',
      'Ошибки, defer и поток управления',
      'Замыкания и функции высшего порядка',
      'Протоколы, extensions и приведение типов',
      'Дженерики, any / some и type erasure',
      'Диспетчеризация и Objective-C runtime',
      'Коллекции, Hashable и сложность',
      'Строки и Unicode',
    ]),
  },
  {
    slug: 'memory',
    title: 'Память',
    sections: sections([
      'Память приложения: сегменты и MemoryLayout',
      'Стек и куча',
      'Value и Reference типы, копирование',
      'Когда value-тип оказывается в куче. Экзистенциальный контейнер',
      'От MRC к ARC — подсчёт ссылок',
      'Типы ссылок и retain cycle (новая версия)',
      'ARC под капотом: HeapObject, Side Table, жизненный цикл объекта',
      'Autorelease и autoreleasepool',
      'Утечки памяти и Memory Safety',
    ]),
  },
  {
    slug: 'concurrency',
    title: 'Многопоточность',
    sections: sections([
      'Основы многопоточности',
      'Grand Central Dispatch',
      'Проблемы многопоточности',
      'Потокобезопасность и синхронизация',
      'Operation и OperationQueue',
      'Swift Concurrency',
      'RunLoop',
    ]),
  },
  {
    slug: 'architecture',
    title: 'Архитектура и паттерны',
    sections: sections([
      'Парадигмы: ООП, POP, ФП',
      'SOLID',
      'KISS, DRY, YAGNI и композиция vs наследование',
      'Порождающие паттерны',
      'Структурные паттерны',
      'Поведенческие паттерны',
      'DI, IoC, Service Locator и тестируемость',
      'MVC, MVP, MVVM',
      'VIPER, Clean Swift, MVI',
      'Навигация: Router и Coordinator',
    ]),
  },
  {
    slug: 'uikit',
    title: 'UIKit',
    sections: sections([
      'UIView, UIWindow и координаты',
      'CALayer и отрисовка',
      'Жизненный цикл UIViewController и UIView',
      'Auto Layout: constraints и якоря',
      'Auto Layout: размеры, приоритеты, цикл компоновки',
      'Касания: UIEvent, UITouch, hitTest',
      'Responder Chain, UIControl и жесты',
      'Списки: UIScrollView, UITableView, UICollectionView',
      'Передача данных между экранами и UIAppearance',
      'Производительность UI',
      'Вёрстка кодом, клавиатура, анимации, новое в UIKit',
    ]),
  },
];

export const tutorialHref = (slug: string): string => `tutorials/${slug}/`;

/** Страница туториала: файл `src/content/tutorials/<локаль>/<тема>/<slug>.md`, `order` — номер раздела в теме (с 1) */
export interface TutorialPage {
  topic: string;
  slug: string;
  order: number;
  title: string;
}

export function parseTutorialId(id: string): { locale: Locale; topic: string; slug: string } {
  const { locale, path } = splitLocaleId(id);
  const [topic, ...rest] = path.split('/');
  const slug = rest.join('/');
  if (!topic || !slug || !tutorials.some((t) => t.slug === topic)) {
    const known = tutorials.map((t) => t.slug).join(', ');
    throw new Error(`Туториал «${id}» должен лежать в src/content/tutorials/<локаль>/<тема>/<id>.md, тема — одна из: ${known}`);
  }
  return { locale, topic, slug };
}

export const tutorialPageHref = ({ topic, slug }: Pick<TutorialPage, 'topic' | 'slug'>): string => `tutorials/${topic}/${slug}/`;

/** Раздел получает ссылку, если для него (тема + номер) есть страница */
export function sectionsWithLinks(
  tutorial: Tutorial,
  pages: TutorialPage[],
  hrefOf: (page: TutorialPage) => string,
): TutorialSection[] {
  return tutorial.sections.map((section, i) => {
    const page = pages.find((p) => p.topic === tutorial.slug && p.order === i + 1);
    return page ? { ...section, href: hrefOf(page) } : section;
  });
}

/** Соседние опубликованные страницы той же темы */
export function neighbours(pages: TutorialPage[], current: TutorialPage): { prev?: TutorialPage; next?: TutorialPage } {
  const topicPages = pages.filter((p) => p.topic === current.topic).sort((a, b) => a.order - b.order);
  const i = topicPages.findIndex((p) => p.slug === current.slug);
  return { prev: topicPages[i - 1], next: topicPages[i + 1] };
}
