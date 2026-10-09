import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useFocusTrap from '../../hooks/useFocusTrap';
import useModalOpen from '../../hooks/useModalOpen';
import Icon from './Icon';
import { photoSrcSet } from '../../lib/photo';
import Photo from './Photo';

/**
 * Full-screen photo viewer.
 *   - dialog semantics, focus trapped, focus returns to the photo you opened
 *   - Esc closes · ← → (and on-screen buttons) step · swipe on touch screens
 *   - live counter "3 / 15" and the photo's description as a caption
 *   - the neighbouring photos are fetched ahead so stepping is instant
 *
 * Controlled: the parent owns `index` (null = closed).
 */
const Lightbox = ({ title, photos, index, onIndex, onClose }) => {
  const dialogRef = useRef(null);
  const swipe = useRef(null);
  const count = photos.length;
  const open = index !== null && index >= 0 && index < count;

  const step = useCallback((delta) => onIndex((i) => (i + delta + count) % count), [count, onIndex]);

  useFocusTrap(dialogRef, open, onClose);
  useModalOpen(open);

  // Arrow keys; page scroll locked while open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open, step]);

  // Warm the cache for the photos either side.
  useEffect(() => {
    if (!open || count < 2) return;
    [index + 1, index - 1].forEach((i) => {
      const p = photos[(i + count) % count];
      const img = new Image();
      img.sizes = '100vw';
      img.srcset = photoSrcSet(p.src) ?? '';
      img.src = p.src;
    });
  }, [open, index, count, photos]);

  if (!open) return null;
  const photo = photos[index];

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse') return;
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  };

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — photo viewer`}
      className="fixed inset-0 z-[2200] flex flex-col bg-[#111214]/95 text-white"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="font-mono text-xs text-white/70" aria-live="polite">
            {index + 1} / {count}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          <Icon name="close" className="size-6" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 sm:px-20"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipe.current = null;
        }}
      >
        <Photo
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          sizes="100vw"
          loading="eager"
          className="max-h-full max-w-full rounded-field object-contain"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-5"
            >
              <Icon name="chevron-left" className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-5"
            >
              <Icon name="chevron-right" className="size-6" />
            </button>
          </>
        )}
      </div>

      <p className="mx-auto max-w-[68ch] px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 text-center text-sm text-white/85">
        {photo.alt}
      </p>
    </div>,
    document.body
  );
};

export default Lightbox;
