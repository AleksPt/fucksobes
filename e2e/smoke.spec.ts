import { expect, test } from '@playwright/test';

test('главная → категория → раскрытие ответа', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 2 })).toHaveCount(10);

  await page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2, name: 'Память', exact: true }) }).click();
  await expect(page).toHaveURL(/\/fucksobes\/[a-z-]+\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Память' })).toBeVisible();

  const first = page.locator('details.question').first();
  await first.locator('summary').click();
  await expect(first).toHaveAttribute('open', '');
});

test('поиск находит вопрос и открывает его страницу', async ({ page }) => {
  await page.goto('./');
  // Остров поиска гидратируется по client:idle — ждём, пока уберётся атрибут ssr.
  await expect(page.locator('astro-island[component-url*="Search"]')).not.toHaveAttribute('ssr', '');
  await page.getByRole('combobox', { name: 'Поиск по вопросам' }).fill('ARC');

  const option = page.getByRole('listbox').getByRole('option').first();
  await expect(option).toBeVisible();
  await option.click();

  await expect(page).toHaveURL(/\/fucksobes\/[a-z0-9-]+\/[a-z0-9-]+\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('search-index.json отдаёт корректный индекс', async ({ request }) => {
  const res = await request.get('search-index.json');
  expect(res.status()).toBe(200);
  const data = await res.json();
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThan(0);
  for (const entry of data) {
    for (const key of ['id', 'title', 'categoryTitle', 'url']) {
      expect(typeof entry[key]).toBe('string');
      expect(entry[key].length).toBeGreaterThan(0);
    }
    expect(entry.url.startsWith('/fucksobes/')).toBe(true);
  }
});

test('вопрос без ответа показывает заглушку', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link').filter({ has: page.getByRole('heading', { level: 2, name: 'Память', exact: true }) }).click();
  const item = page.locator('details.question').filter({ hasText: 'без ответа' }).first();
  await expect(item).toBeVisible();
  await item.locator('summary').click();
  await item.getByRole('link', { name: /Открыть отдельно/ }).click();
  await expect(page).toHaveURL(/\/fucksobes\/[a-z0-9-]+\/[a-z0-9-]+\/$/);
  await expect(page.getByText('Ответа пока нет — скоро добавим.')).toBeVisible();
});

test('404 показывает страницу не найдена', async ({ page }) => {
  await page.goto('nope/');
  await expect(page.getByText('Страница не найдена')).toBeVisible();
});

test('главная → случайный вопрос → следующий вопрос', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: 'Случайный вопрос' }).click();
  await expect(page).toHaveURL(/\/fucksobes\/random\/#[a-z0-9-]+$/);
  await expect(page.locator('astro-island[component-url*="RandomQuestion"]')).not.toHaveAttribute('ssr', '');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();

  const before = page.url();
  await page.getByRole('button', { name: 'Следующий вопрос' }).click();
  await expect(page).not.toHaveURL(before);
  await expect(heading).toBeVisible();
});
