import type { Locale } from '../lib/locale';

/** Формы слова по правилам `Intl.PluralRules`; `other` обязателен. */
export type Plural = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

export function plural(locale: Locale, n: number, forms: Plural): string {
  return forms[new Intl.PluralRules(locale).select(n)] ?? forms.other;
}

export interface Ui {
  siteTitle: string;
  defaultDescription: string;
  heroSubtitle: string;
  randomQuestion: string;
  tutorials: string;
  homeLabel: string;
  languageLabel: string;
  categories: string;
  allCategories: string;
  notFound: string;
  notFoundBack: string;
  noAnswer: string;
  noAnswerBadge: string;
  openSeparately: string;
  question: Plural;
  topic: Plural;
  soon: string;
  backToTutorials: string;
  adjacentTutorials: string;
  previous: string;
  next: string;
  searchLabel: string;
  searchFailed: string;
  searchLoading: string;
  searchEmpty: string;
  answer: string;
  randomLoading: string;
  randomFailed: string;
  randomNext: string;
  zoomedImage: string;
}

const ru: Ui = {
  siteTitle: 'FuckSobes — вопросы к iOS-собеседованиям',
  defaultDescription: 'Вопросы и ответы для подготовки к iOS-собеседованиям',
  heroSubtitle: 'с реальных iOS-собеседований',
  randomQuestion: 'Случайный вопрос',
  tutorials: 'Туториалы',
  homeLabel: 'FuckSobes, на главную',
  languageLabel: 'Язык',
  categories: 'Категории',
  allCategories: '← Все категории',
  notFound: 'Страница не найдена',
  notFoundBack: 'Вернуться к категориям',
  noAnswer: 'Ответа пока нет — скоро добавим.',
  noAnswerBadge: 'без ответа',
  openSeparately: 'Открыть отдельно →',
  question: { one: 'вопрос', few: 'вопроса', many: 'вопросов', other: 'вопроса' },
  topic: { one: 'тема', few: 'темы', many: 'тем', other: 'темы' },
  soon: 'скоро',
  backToTutorials: '← Туториалы',
  adjacentTutorials: 'Соседние туториалы',
  previous: '← Предыдущий',
  next: 'Следующий →',
  searchLabel: 'Поиск по вопросам',
  searchFailed: 'Не удалось загрузить поиск',
  searchLoading: 'Загрузка…',
  searchEmpty: 'Ничего не найдено',
  answer: 'Ответ',
  randomLoading: 'Загружаем вопрос…',
  randomFailed: 'Не удалось загрузить вопрос. Попробуйте следующий.',
  randomNext: 'Следующий вопрос',
  zoomedImage: 'Увеличенное изображение',
};

const en: Ui = {
  siteTitle: 'FuckSobes — iOS interview questions',
  defaultDescription: 'Questions and answers to prepare for iOS interviews',
  heroSubtitle: 'from real iOS interviews',
  randomQuestion: 'Random question',
  tutorials: 'Tutorials',
  homeLabel: 'FuckSobes, home',
  languageLabel: 'Language',
  categories: 'Categories',
  allCategories: '← All categories',
  notFound: 'Page not found',
  notFoundBack: 'Back to categories',
  noAnswer: 'No answer yet — coming soon.',
  noAnswerBadge: 'no answer',
  openSeparately: 'Open separately →',
  question: { one: 'question', other: 'questions' },
  topic: { one: 'topic', other: 'topics' },
  soon: 'soon',
  backToTutorials: '← Tutorials',
  adjacentTutorials: 'Adjacent tutorials',
  previous: '← Previous',
  next: 'Next →',
  searchLabel: 'Search questions',
  searchFailed: 'Could not load search',
  searchLoading: 'Loading…',
  searchEmpty: 'Nothing found',
  answer: 'Answer',
  randomLoading: 'Loading question…',
  randomFailed: 'Could not load the question. Try the next one.',
  randomNext: 'Next question',
  zoomedImage: 'Enlarged image',
};

export const ui: Record<Locale, Ui> = { ru, en };
