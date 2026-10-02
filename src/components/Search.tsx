import { navigate } from 'astro:transitions/client';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ui } from '../i18n';
import type { Locale } from '../lib/locale';
import { createSearch, stepIndex, type SearchDoc } from '../lib/search';

interface Props {
  indexUrl: string;
  locale: Locale;
}

export default function Search({ indexUrl, locale }: Props) {
  const t = ui[locale];
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useMemo(() => (docs ? createSearch(docs) : null), [docs]);
  const hits = useMemo(() => (search && query.trim() ? search(query) : []), [search, query]);

  // Индекс грузится при первом фокусе, а не при загрузке страницы.
  function loadIndex() {
    if (docs || failed) return;
    fetch(indexUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<SearchDoc[]>;
      })
      .then(setDocs)
      .catch(() => setFailed(true));
  }

  useEffect(() => {
    function onGlobalKey(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onGlobalKey);
    return () => window.removeEventListener('keydown', onGlobalKey);
  }, []);

  const open = focused && query.trim() !== '';

  // Новый список результатов — подсветка снова на первом.
  useEffect(() => setActive(0), [hits]);

  // Подсвеченный результат всегда виден в прокручиваемой панели.
  useEffect(() => {
    if (open) document.getElementById(`search-hit-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  function go(url: string) {
    setQuery('');
    inputRef.current?.blur();
    navigate(url);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => stepIndex(i, 1, hits.length));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => stepIndex(i, -1, hits.length));
    } else if (event.key === 'Enter' && hits[active]) {
      event.preventDefault();
      go(hits[active].url);
    } else if (event.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
    }
  }

  const status = failed ? t.searchFailed : !docs ? t.searchLoading : hits.length === 0 ? t.searchEmpty : null;

  return (
    <div className="relative mx-auto w-full max-w-xl text-left">
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-label={t.searchLabel}
        aria-expanded={open}
        aria-controls="search-results"
        aria-autocomplete="list"
        aria-activedescendant={open && hits[active] ? `search-hit-${active}` : undefined}
        placeholder={t.searchLabel}
        value={query}
        onFocus={() => {
          setFocused(true);
          loadIndex();
        }}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        className="w-full rounded-input border border-transparent bg-mist px-4 py-3 text-base text-on-accent transition-colors outline-none placeholder:text-dim focus:border-on-accent focus:bg-paper"
      />
      {open && (
        <ul
          id="search-results"
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-3 max-h-[70vh] overflow-y-auto rounded-panel border border-rule bg-paper p-1.5 text-on-accent"
        >
          {status ? (
            <li className="px-3 py-2 text-sm text-dim">{status}</li>
          ) : (
            hits.map((hit, i) => (
              <li key={hit.id} id={`search-hit-${i}`} role="option" aria-selected={i === active}>
                <a
                  href={hit.url}
                  onMouseDown={(event) => {
                    event.preventDefault(); // не терять фокус до перехода
                    go(hit.url);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`block rounded-input px-3 py-2 text-sm ${i === active ? 'bg-mist' : ''}`}
                >
                  <span className="block">{hit.title}</span>
                  <span className="block text-xs text-dim">{hit.categoryTitle}</span>
                </a>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
