#!/usr/bin/env python3
"""Генератор английских копий SVG-картинок туториалов.

Как пользоваться (из корня репозитория):

    python3 -m venv /private/tmp/fonttools-venv
    /private/tmp/fonttools-venv/bin/pip install fonttools brotli
    /private/tmp/fonttools-venv/bin/python scripts/svg-i18n/translate-svg.py <topic> [--lang en] [--only 01-name.svg]

Берёт `src/assets/tutorials/<topic>/*.svg` (русские оригиналы, их не трогает) и словарь
`src/assets/tutorials/<lang>/<topic>/translations.json`, пишет `src/assets/tutorials/<lang>/<topic>/*.svg`.

Что делает:
1. Подставляет перевод в <text>, <title> и <desc>. Ключ словаря — русская строка (без XML-экранирования),
   значение — перевод. Строки без кириллицы (код, идентификаторы) переводить не нужно.
2. Пересобирает встроенные шрифты: берёт variable-шрифты из node_modules (@fontsource-variable/onest и
   jetbrains-mono), фиксирует вес (400/500) через instancer, оставляет только символы, реально
   использованные в английском файле (+ kern для Onest), пишет woff2 в base64. Вес и семейство символа
   определяются по CSS-классу <text>.
3. Применяет правки раскладки из `edits` (литеральные замены в итоговом SVG).
4. Проверяет, что в результате нет кириллицы вне base64. Повторный запуск даёт идентичный результат.

Формат translations.json:

    {
      "strings": { "Русская строка": "English string", ... },        // общие для всех файлов темы
      "files": {
        "09-vtable.svg": {
          "strings": { ... },                                         // переопределения для одного файла
          "edits": [ {"find": "x=\\"64\\"", "replace": "x=\\"60\\"", "count": 1} ]   // правки раскладки
        }
      }
    }

Правила: каждая кириллическая строка должна иметь перевод, иначе скрипт падает; лишние ключи
выводятся предупреждением; `count` в edits по умолчанию 1 и обязан совпасть с числом вхождений.
"""
import argparse, base64, io, json, re, sys
from pathlib import Path
from xml.sax.saxutils import escape, unescape

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / 'src/assets/tutorials'
FONTS = {
    # (family, source file); en-версии нужна латиница
    'FS Onest': ROOT / 'node_modules/@fontsource-variable/onest/files/onest-latin-wght-normal.woff2',
    'FS Mono': ROOT / 'node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
}
UNICODE_RANGE = 'U+0000-03FF,U+2000-206F'
CYR = re.compile('[Ѐ-ӿ]')
B64 = re.compile(r'base64,[A-Za-z0-9+/=]+')


def parse_css(svg):
    """class -> {'weight': int, 'mono': bool} из <style>."""
    style = re.search(r'<style>(.*?)</style>', svg, re.S).group(1)
    props = {}
    for sel, body in re.findall(r'([^{}]+)\{([^}]*)\}', re.sub(r'@font-face\{[^}]*\}', '', style)):
        for cls in re.findall(r'\.([\w-]+)', sel):
            d = props.setdefault(cls, {})
            w = re.search(r'font-weight:(\d+)', body)
            if w: d['weight'] = int(w.group(1))
            if "FS Mono" in body: d['mono'] = True
    return props


def make_font(family, weight, chars):
    font = TTFont(FONTS[family], recalcTimestamp=False)
    cmap = font.getBestCmap()
    missing = [c for c in chars if ord(c) not in cmap]
    if missing:
        sys.exit(f'В шрифте {family} нет символов: {missing!r}')
    font = instancer.instantiateVariableFont(font, {'wght': weight}, inplace=True)
    opts = subset.Options()
    opts.layout_features = ['kern'] if family == 'FS Onest' else []
    opts.hinting = False
    opts.notdef_outline = False
    opts.name_IDs = []
    opts.drop_tables += ['STAT', 'gasp']
    opts.flavor = 'woff2'
    opts.recalc_timestamp = False
    sub = subset.Subsetter(opts)
    sub.populate(text=''.join(sorted(chars)))
    sub.subset(font)
    buf = io.BytesIO()
    font.flavor = 'woff2'
    font.save(buf)
    return base64.b64encode(buf.getvalue()).decode()


def translate(src, name, tr, used):
    gl = tr.get('strings', {})
    fl = tr.get('files', {}).get(name, {})
    fs = fl.get('strings', {})

    def tx(raw):
        key = unescape(raw)
        for d in (fs, gl):
            if key in d:
                used.add(key)
                return escape(d[key])
        if CYR.search(key):
            sys.exit(f'{name}: нет перевода для {key!r}')
        return raw

    out = re.sub(r'(<text [^>]*>)(.*?)(</text>)', lambda m: m.group(1) + tx(m.group(2)) + m.group(3), src, flags=re.S)
    out = re.sub(r'(<title>)(.*?)(</title>)', lambda m: m.group(1) + tx(m.group(2)) + m.group(3), out, flags=re.S)
    out = re.sub(r'(<desc>)(.*?)(</desc>)', lambda m: m.group(1) + tx(m.group(2)) + m.group(3), out, flags=re.S)
    for e in fl.get('edits', []):
        n = out.count(e['find'])
        if n != e.get('count', 1):
            sys.exit(f"{name}: правка {e['find']!r} нашлась {n} раз, ожидалось {e.get('count', 1)}")
        out = out.replace(e['find'], e['replace'])
    return out


def rebuild_fonts(svg, name):
    css = parse_css(svg)
    need = {}  # (family, weight) -> set(chars)
    for m in re.finditer(r'<text ([^>]*)>(.*?)</text>', svg, re.S):
        classes = re.search(r'class="([^"]*)"', m.group(1)).group(1).split()
        info = {}
        for c in classes: info.update(css.get(c, {}))
        fam = 'FS Mono' if info.get('mono') else 'FS Onest'
        w = info.get('weight', 400)
        need.setdefault((fam, w), set()).update(unescape(m.group(2)).replace('\n', ''))
    faces = []
    for (fam, w), chars in sorted(need.items()):
        data = make_font(fam, w, chars)
        rng = f'unicode-range:{UNICODE_RANGE};' if fam == 'FS Onest' else ''
        faces.append(f"@font-face{{font-family:'{fam}';font-weight:{w};{rng}src:url(data:font/woff2;base64,{data}) format('woff2')}}")
    # заменяем все @font-face в <style> на новые
    head, rest = svg.split('<style>', 1)
    style = re.sub(r'@font-face\{[^}]*\}', '', rest, count=0)
    # style теперь начинается сразу с правил; вставляем шрифты в начало
    return head + '<style>' + ''.join(faces) + style


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('topic')
    ap.add_argument('--lang', default='en')
    ap.add_argument('--only')
    a = ap.parse_args()
    out_dir = ASSETS / a.lang / a.topic
    tr = json.loads((out_dir / 'translations.json').read_text(encoding='utf-8'))
    used = set()
    for src_path in sorted((ASSETS / a.topic).glob('*.svg')):
        if a.only and src_path.name != a.only:
            continue
        svg = src_path.read_text(encoding='utf-8')
        out = translate(svg, src_path.name, tr, used)
        out = rebuild_fonts(out, src_path.name)
        left = CYR.findall(B64.sub('', out))
        if left:
            sys.exit(f'{src_path.name}: осталась кириллица: {set(left)}')
        (out_dir / src_path.name).write_text(out, encoding='utf-8')
        print('ok', src_path.name)
    if not a.only:
        allkeys = set(tr.get('strings', {}))
        for f in tr.get('files', {}).values(): allkeys |= set(f.get('strings', {}))
        for k in sorted(allkeys - used):
            print('предупреждение: ключ не использован:', repr(k), file=sys.stderr)


if __name__ == '__main__':
    main()
