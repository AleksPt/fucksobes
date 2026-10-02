import { describe, expect, it } from 'vitest';
import { localizeTutorial, neighbours, parseTutorialId, sectionsWithLinks, tutorialPageHref, tutorials, type TutorialPage } from './tutorials';

const page = (topic: string, slug: string, order: number): TutorialPage => ({ topic, slug, order, title: slug });

describe('parseTutorialId', () => {
  it('разбирает тему и slug из пути файла', () => {
    expect(parseTutorialId('ru/swift/structs-classes-enums')).toEqual({ locale: 'ru', topic: 'swift', slug: 'structs-classes-enums' });
    expect(parseTutorialId('en/swift/optional')).toEqual({ locale: 'en', topic: 'swift', slug: 'optional' });
  });

  it('падает с понятным текстом, если файл лежит не в папке темы', () => {
    expect(() => parseTutorialId('ru/structs')).toThrow(/src\/content\/tutorials\/<локаль>\/<тема>\/<id>\.md/);
  });

  it('падает, если файл лежит вне папки локали', () => {
    expect(() => parseTutorialId('swift/optional')).toThrow(/папке локали/);
  });

  it('падает на неизвестной теме', () => {
    expect(() => parseTutorialId('ru/cooking/pasta')).toThrow(/swift/);
  });
});

describe('tutorialPageHref', () => {
  it('строит путь без base', () => {
    expect(tutorialPageHref(page('swift', 'optional', 4))).toBe('tutorials/swift/optional/');
  });
});

describe('sectionsWithLinks', () => {
  const swift = tutorials.find((t) => t.slug === 'swift')!;
  const hrefOf = (p: TutorialPage) => `/${p.topic}/${p.slug}`;

  it('без страниц оставляет все разделы без ссылок', () => {
    const sections = sectionsWithLinks(swift, [], hrefOf);
    expect(sections).toHaveLength(swift.sections.length);
    expect(sections.every((s) => s.href === undefined)).toBe(true);
  });

  it('даёт ссылку разделу с номером страницы и не трогает остальные', () => {
    const sections = sectionsWithLinks(swift, [page('swift', 'structs', 1)], hrefOf);
    expect(sections[0]).toEqual({ title: swift.sections[0].title, href: '/swift/structs' });
    expect(sections[1].href).toBeUndefined();
  });

  it('игнорирует страницы других тем с тем же номером', () => {
    const sections = sectionsWithLinks(swift, [page('memory', 'stack', 2)], hrefOf);
    expect(sections[1].href).toBeUndefined();
  });
});

describe('neighbours', () => {
  const pages = [page('swift', 'c', 3), page('swift', 'a', 1), page('memory', 'm', 2), page('swift', 'b', 2)];

  it('находит соседей по order внутри темы', () => {
    const { prev, next } = neighbours(pages, page('swift', 'b', 2));
    expect([prev?.slug, next?.slug]).toEqual(['a', 'c']);
  });

  it('у первой страницы нет предыдущей, у последней — следующей', () => {
    expect(neighbours(pages, page('swift', 'a', 1)).prev).toBeUndefined();
    expect(neighbours(pages, page('swift', 'c', 3)).next).toBeUndefined();
  });

  it('пропускает неопубликованные номера', () => {
    const { prev, next } = neighbours([page('swift', 'a', 1), page('swift', 'd', 4)], page('swift', 'a', 1));
    expect([prev, next?.slug]).toEqual([undefined, 'd']);
  });
});

describe('localizeTutorial', () => {
  it('русский возвращает как есть', () => {
    expect(localizeTutorial(tutorials[0], 'ru')).toBe(tutorials[0]);
  });

  it('у каждого туториала английские названия темы и всех разделов', () => {
    for (const tutorial of tutorials) {
      const en = localizeTutorial(tutorial, 'en');
      expect(en.title, tutorial.slug).toBeTruthy();
      expect(en.sections).toHaveLength(tutorial.sections.length);
      expect(en.sections.every((section) => /^[\x20-\x7E]+$/.test(section.title)), tutorial.slug).toBe(true);
    }
  });
});
