import { navigate } from 'astro:transitions/client';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { createSearch, stepIndex, type SearchDoc } from '../lib/search';

interface Props {
  indexUrl: string;
}

export default function Search({ indexUrl }: Props) {
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

  const status = failed ? 'Не удалось загрузить поиск' : !docs ? 'Загрузка…' : hits.length === 0 ? 'Ничего не найдено' : null;

  return (
    <div className="ml-auto w-full max-w-sm sm:relative">
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-label="Поиск по вопросам"
        aria-expanded={open}
        aria-controls="search-results"
        aria-autocomplete="list"
        aria-activedescendant={open && hits[active] ? `search-hit-${active}` : undefined}
        placeholder="Поиск по вопросам  ⌘K"
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
        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-base sm:text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:focus-visible:outline-zinc-400 placeholder:text-zinc-500 focus:border-zinc-400 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:placeholder:text-zinc-400 dark:focus:border-zinc-600 dark:focus:bg-zinc-950"
      />
      {open && (
        <ul
          id="search-results"
          role="listbox"
          className="absolute inset-x-4 top-full mt-2 max-h-[70vh] overflow-y-auto sm:inset-x-auto sm:right-0 sm:w-[28rem] rounded-xl border border-zinc-200 bg-white p-1 shadow-xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900"
        >
          {status ? (
            <li className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400">{status}</li>
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
                  className={`block rounded-lg px-3 py-2 text-sm ${i === active ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
                >
                  <span className="block">{hit.title}</span>
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">{hit.categoryTitle}</span>
                </a>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
