#!/usr/bin/env node
/**
 * Проверка раскладки SVG-картинок туториалов в настоящем браузере (Playwright, Chromium).
 *
 *   node scripts/svg-i18n/check-overflow.mjs <topic> [--lang en] [--src] [--only 01-name.svg] [--verbose]
 *
 * По умолчанию проверяет `src/assets/tutorials/<lang>/<topic>/*.svg`; с `--src` — русские оригиналы
 * `src/assets/tutorials/<topic>/*.svg` (удобно для калибровки: оригиналы должны проходить чисто).
 * Выход: код 1, если найдены проблемы, и список вида «файл: проблема: текст».
 *
 * Для каждого <text> измеряется getBoundingClientRect() после загрузки встроенных шрифтов, и ищется:
 *  - overflow: текст вылезает за ближайший содержащий блок (самая маленькая фигура rect/path/circle/ellipse/
 *    polygon, внутри которой лежит центр текста; фигуры, вырожденные в линии, и сами `<svg>`-фон пропускаются);
 *  - clipped: текст вылезает за границы картинки (viewBox);
 *  - overlap: текст пересекается с другим текстом (боксы сжимаются по высоте, чтобы не ловить соседние строки);
 *  - font: символы вне диапазона встроенного шрифта (U+0000–03FF, U+2000–206F, плюс кириллица): браузер
 *    отрисует их запасным шрифтом (например →, ≤, ×). Заменить на ASCII или расширить unicode-range
 *    в translate-svg.py (translate-svg.py при сборке падает, если символа нет в самом шрифте).
 * Допуски (TOL = 1.5 px) подобраны по темам swift и memory.
 */
import { chromium } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const topic = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--lang' && args[args.indexOf(a) - 1] !== '--only');
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const lang = opt('--lang') ?? 'en';
const only = opt('--only');
const useSrc = args.includes('--src');
const verbose = args.includes('--verbose');
if (!topic) {
  console.error('usage: check-overflow.mjs <topic> [--lang en] [--src] [--only file.svg] [--verbose]');
  process.exit(2);
}
const dir = path.join(ROOT, 'src/assets/tutorials', ...(useSrc ? [topic] : [lang, topic]));
const files = readdirSync(dir).filter((f) => f.endsWith('.svg') && (!only || f === only)).sort();

const TOL = 1.5;

function measure() {
  const svg = document.querySelector('svg');
  const vb = svg.viewBox.baseVal;
  const root = svg.getBoundingClientRect();
  const rel = (r) => ({ x: r.left - root.left, y: r.top - root.top, w: r.width, h: r.height });
  const texts = [...svg.querySelectorAll('text')]
    .map((t) => ({ t, s: (t.textContent || '').trim() }))
    .filter((o) => o.s)
    .map((o) => ({ s: o.s, ...rel(o.t.getBoundingClientRect()) }));
  const shapes = [...svg.querySelectorAll('rect,path,circle,ellipse,polygon')]
    .filter((e) => !e.closest('defs,marker,clipPath,mask,pattern'))
    .map((e) => ({ tag: e.tagName, ...rel(e.getBoundingClientRect()) }))
    .filter((r) => r.w > 8 && r.h > 8)
    .filter((r) => !(r.x <= 0.5 && r.y <= 0.5 && r.w >= root.width - 1 && r.h >= root.height - 1)); // фон
  // Onest подключён с unicode-range U+0000-03FF,U+2000-206F: остальное (кроме кириллицы) уйдёт в запасной шрифт
  const fontsOk = {};
  for (const o of texts) for (const ch of o.s) {
    const c = ch.codePointAt(0);
    const inRange = c <= 0x3ff || (c >= 0x2000 && c <= 0x206f) || (c >= 0x400 && c <= 0x4ff);
    if (!inRange) fontsOk[ch] = true;
  }
  return { texts, shapes, w: root.width, h: root.height, vb: [vb.width, vb.height], nonLatin: Object.keys(fontsOk) };
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
let problems = 0;
for (const f of files) {
  const svg = readFileSync(path.join(dir, f), 'utf8');
  await page.setContent(`<!doctype html><body style="margin:0">${svg.replace(/^<\?xml[^>]*>/, '')}</body>`);
  await page.evaluate(() => document.fonts.ready);
  // шрифты подключены data-URL внутри SVG; дожидаемся их загрузки
  await page.evaluate(async () => { await Promise.all([...document.fonts].map((ff) => ff.load().catch(() => null))); });
  const m = await page.evaluate(measure);
  const out = [];
  for (const t of m.texts) {
    const cx = t.x + t.w / 2, cy = t.y + t.h / 2;
    const holders = m.shapes
      .filter((r) => cx > r.x && cx < r.x + r.w && cy > r.y && cy < r.y + r.h && r.w * r.h > t.w * t.h * 0.9)
      .sort((a, b) => a.w * a.h - b.w * b.h);
    const c = holders[0];
    if (c) {
      const l = c.x - t.x, r = t.x + t.w - (c.x + c.w), tp = c.y - t.y, b = t.y + t.h - (c.y + c.h);
      const over = Math.max(l, r, tp, b);
      // по вертикали em-бокс текста выше фактических глифов: допускаем больше
      if (l > TOL || r > TOL) out.push(`overflow: «${t.s}» вылезает по горизонтали на ${Math.max(l, r).toFixed(1)}px (блок ${c.tag} ${c.w.toFixed(0)}×${c.h.toFixed(0)})`);
      else if (verbose && over > TOL) out.push(`(info) «${t.s}» по вертикали на ${over.toFixed(1)}px`);
    }
    if (t.x < -TOL || t.y < -TOL || t.x + t.w > m.w + TOL || t.y + t.h > m.h + TOL) out.push(`clipped: «${t.s}» выходит за границы картинки`);
  }
  for (let i = 0; i < m.texts.length; i++) {
    for (let j = i + 1; j < m.texts.length; j++) {
      const a = m.texts[i], b = m.texts[j];
      const sh = (r) => ({ x: r.x + 1, y: r.y + r.h * 0.2, w: r.w - 2, h: r.h * 0.6 });
      const A = sh(a), B = sh(b);
      const ox = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x);
      const oy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y);
      if (ox > TOL && oy > 1) out.push(`overlap: «${a.s}» и «${b.s}»`);
    }
  }
  if (m.nonLatin.length) out.push(`font: символы вне латиницы: ${m.nonLatin.join(' ')} (запасной шрифт: замени на ASCII или расширь unicode-range)`);
  const mark = out.filter((o) => !o.startsWith('(info)')).length ? 'FAIL' : 'ok  ';
  console.log(`${mark} ${f}`);
  for (const o of out) console.log('     ' + o);
  problems += out.filter((o) => !o.startsWith('(info)')).length;
}
await browser.close();
console.log(problems ? `\nПроблем: ${problems}` : '\nВсё чисто');
process.exit(problems ? 1 : 0);
