import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface Zoomed {
  source: HTMLImageElement;
  src: string;
  alt: string;
}

const SELECTOR = '.tutorial img';
const DURATION = 320;
const EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

/** Прямоугольник, в который картинка вписывается на экране с отступом от краёв. */
function fitRect(source: HTMLImageElement): { left: number; top: number; width: number; height: number } {
  const pad = window.innerWidth < 640 ? 16 : 32;
  const nw = source.naturalWidth || source.width;
  const nh = source.naturalHeight || source.height;
  const scale = Math.min((window.innerWidth - pad * 2) / nw, (window.innerHeight - pad * 2) / nh);
  const width = nw * scale;
  const height = nh * scale;
  return { left: (window.innerWidth - width) / 2, top: (window.innerHeight - height) / 2, width, height };
}

/** Начальная трансформация: сдвиг и масштаб, которые совмещают увеличенную картинку с исходной. */
function transformTo(from: DOMRect, to: { left: number; top: number; width: number; height: number }): string {
  return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Остров без разметки: делает картинки туториала кликабельными и увеличивает их из исходного места на затемнённый фон. */
export default function ImageZoom() {
  const [zoomed, setZoomed] = useState<Zoomed>();
  const backdropRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const closing = useRef(false);

  useEffect(() => {
    const images = document.querySelectorAll<HTMLImageElement>(SELECTOR);
    images.forEach((img) => {
      img.classList.add('cursor-zoom-in');
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
    });

    const open = (img: HTMLImageElement) => {
      if (closing.current) return;
      setZoomed({ source: img, src: img.currentSrc || img.src, alt: img.alt });
    };
    const onClick = (event: MouseEvent) => {
      const img = (event.target as Element).closest<HTMLImageElement>(SELECTOR);
      if (img) open(img);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const img = (event.target as Element).closest<HTMLImageElement>(SELECTOR);
      if (!img) return;
      event.preventDefault();
      open(img);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const finish = useCallback((source: HTMLImageElement) => {
    source.style.visibility = '';
    closing.current = false;
    setZoomed(undefined);
  }, []);

  const close = useCallback(
    (immediate = false) => {
      if (!zoomed || closing.current) return;
      const { source } = zoomed;
      const image = imageRef.current;
      const backdrop = backdropRef.current;
      if (immediate || reducedMotion() || !image || !backdrop) {
        finish(source);
        return;
      }
      closing.current = true;
      const transform = transformTo(source.getBoundingClientRect(), fitRect(source));
      const options = { duration: DURATION, easing: EASING, fill: 'forwards' } as const;
      backdrop.animate({ opacity: [1, 0] }, options);
      image.animate({ transform: ['none', transform] }, options).finished.then(() => finish(source), () => finish(source));
    },
    [zoomed, finish],
  );

  useLayoutEffect(() => {
    if (!zoomed || reducedMotion()) return;
    const { source } = zoomed;
    const transform = transformTo(source.getBoundingClientRect(), fitRect(source));
    const options = { duration: DURATION, easing: EASING } as const;
    backdropRef.current?.animate({ opacity: [0, 1] }, options);
    imageRef.current?.animate({ transform: [transform, 'none'] }, options);
  }, [zoomed]);

  useEffect(() => {
    if (!zoomed) return;
    const { source } = zoomed;
    source.style.visibility = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    const onResize = () => close(true);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = overflow;
      source.style.visibility = '';
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [zoomed, close]);

  if (!zoomed) return null;

  const rect = fitRect(zoomed.source);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={zoomed.alt || 'Увеличенное изображение'}
      className="fixed inset-0 z-50 cursor-zoom-out"
      onClick={() => close()}
    >
      <div ref={backdropRef} className="absolute inset-0 bg-ink/95 backdrop-blur-md" />
      <img
        ref={imageRef}
        src={zoomed.src}
        alt={zoomed.alt}
        className="absolute max-w-none origin-top-left rounded-panel"
        style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
      />
    </div>
  );
}
