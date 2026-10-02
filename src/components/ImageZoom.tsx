import { useEffect, useState } from 'react';

interface Zoomed {
  src: string;
  alt: string;
}

const SELECTOR = '.tutorial img';

/** Остров без разметки: делает картинки туториала кликабельными и показывает увеличенную копию поверх затемнённого фона. */
export default function ImageZoom() {
  const [zoomed, setZoomed] = useState<Zoomed>();

  useEffect(() => {
    const images = document.querySelectorAll<HTMLImageElement>(SELECTOR);
    images.forEach((img) => {
      img.classList.add('cursor-zoom-in');
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
    });

    const open = (img: HTMLImageElement) => setZoomed({ src: img.currentSrc || img.src, alt: img.alt });
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

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomed(undefined);
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [zoomed]);

  if (!zoomed) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={zoomed.alt || 'Увеличенное изображение'}
      className="image-zoom fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-ink/95 p-4 backdrop-blur-md sm:p-8"
      onClick={() => setZoomed(undefined)}
    >
      <img src={zoomed.src} alt={zoomed.alt} className="h-full w-full rounded-panel object-contain" />
    </div>
  );
}
