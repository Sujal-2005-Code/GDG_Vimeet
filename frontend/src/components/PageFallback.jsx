/**
 * Shown while a lazily-loaded route chunk downloads. Public inner pages are
 * still legacy-dark, so the fallback matches them.
 */
const PageFallback = () => (
  <div className="grid min-h-[60dvh] place-items-center" role="status" aria-live="polite">
    <span className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
    <span className="sr-only">Loading page…</span>
  </div>
);

export default PageFallback;
