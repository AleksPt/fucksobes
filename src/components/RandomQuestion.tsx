import { useEffect, useState } from 'react';
import { createQuestionLoader, pickRandom, type RandomQuestionData } from '../lib/random';
import { splitInlineCode } from '../lib/text';
import { url } from '../lib/url';

interface Props {
  /** id вопросов с ответами; сами ответы грузятся по одному из `random/<id>.json`. */
  ids: string[];
}

const loadQuestion = createQuestionLoader();

function fromHash(ids: string[]): string | undefined {
  const id = decodeURIComponent(window.location.hash.slice(1));
  return ids.includes(id) ? id : undefined;
}

export default function RandomQuestion({ ids }: Props) {
  const [currentId, setCurrentId] = useState<string>();
  const [nextId, setNextId] = useState<string>();
  const [question, setQuestion] = useState<RandomQuestionData>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentId(fromHash(ids) ?? pickRandom(ids));
  }, [ids]);

  useEffect(() => {
    if (!currentId) return;
    let cancelled = false;
    setFailed(false);
    window.history.replaceState(null, '', `#${currentId}`);
    loadQuestion(currentId).then(
      (loaded) => !cancelled && setQuestion(loaded),
      () => !cancelled && setFailed(true),
    );
    // Следующий вопрос грузим заранее, чтобы кнопка срабатывала мгновенно.
    const next = pickRandom(ids, currentId);
    setNextId(next);
    if (next) loadQuestion(next).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [currentId, ids]);

  const loading = !failed && question?.id !== currentId;

  return (
    <>
      <div aria-live="polite" aria-busy={loading}>
        {question && (
          // key пересоздаёт <details>, поэтому новый вопрос открывается со свёрнутым ответом.
          <article key={question.id}>
            <a href={url(`${question.category.id}/`)} className="mt-4 inline-block text-sm text-fog hover:text-accent">
              {question.category.title}
            </a>
            <h1 className="mt-2 text-3xl leading-[1.1] font-medium tracking-[-0.02em] text-balance sm:text-[2.5rem]">
              {splitInlineCode(question.title).map((part, i) =>
                part.code ? (
                  <code key={i} className="rounded-md bg-smoke px-1.5 py-0.5 font-mono text-[0.9em]">
                    {part.text}
                  </code>
                ) : (
                  part.text
                ),
              )}
            </h1>
            <details className="question mt-6">
              <summary className="flex cursor-pointer items-center gap-3 py-3 font-medium text-ash transition-colors hover:text-paper">
                <svg className="chevron size-4 shrink-0 text-steel" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Ответ
              </summary>
              <div className="prose max-w-none pt-2 pb-6 pl-7 break-words" dangerouslySetInnerHTML={{ __html: question.html }} />
            </details>
          </article>
        )}
        {!question && !failed && <p className="mt-4 text-fog">Загружаем вопрос…</p>}
        {failed && <p className="mt-4 text-fog">Не удалось загрузить вопрос. Попробуйте следующий.</p>}
      </div>
      <div className="mt-10">
        <button
          type="button"
          onClick={() => setCurrentId(nextId ?? pickRandom(ids, currentId))}
          disabled={loading}
          className="inline-flex cursor-pointer items-center rounded-input bg-accent px-6 py-3 text-base font-medium text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50 motion-reduce:transition-none"
        >
          Следующий вопрос
        </button>
      </div>
    </>
  );
}
