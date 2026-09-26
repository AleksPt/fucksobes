import { useEffect, useState } from 'react';
import { pickRandom } from '../lib/random';

interface Props {
  /** id вопросов, чьи ответы отрендерены на странице в `article[data-id]`. */
  ids: string[];
}

function fromHash(ids: string[]): string | undefined {
  const id = decodeURIComponent(window.location.hash.slice(1));
  return ids.includes(id) ? id : undefined;
}

export default function RandomQuestion({ ids }: Props) {
  const [current, setCurrent] = useState<string>();

  useEffect(() => {
    setCurrent(fromHash(ids) ?? pickRandom(ids));
  }, [ids]);

  useEffect(() => {
    if (!current) return;
    for (const article of document.querySelectorAll<HTMLElement>('article[data-id]')) {
      article.hidden = article.dataset.id !== current;
      article.querySelector('details')?.removeAttribute('open');
    }
    window.history.replaceState(null, '', `#${current}`);
  }, [current]);

  return (
    <button
      type="button"
      onClick={() => setCurrent((prev) => pickRandom(ids, prev))}
      disabled={!current}
      className="inline-flex cursor-pointer items-center rounded-input bg-accent px-6 py-3 text-base font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50 motion-reduce:transition-none"
    >
      Следующий вопрос
    </button>
  );
}
