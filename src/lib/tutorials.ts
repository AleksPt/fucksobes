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
