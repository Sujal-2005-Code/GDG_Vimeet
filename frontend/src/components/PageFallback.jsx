/**
 * Shown while a lazily-loaded route chunk downloads. It is a full viewport
 * tall so the (always-mounted) footer stays below the fold until the page
 * arrives — otherwise the footer is visible, then jumps down (layout shift).
 */
const PageFallback = () => (
  <div className="flex min-h-[100svh] justify-center bg-surface pt-[calc(var(--nav-h)+8rem)]" role="status" aria-live="polite">
    <span className="size-8 animate-spin rounded-full border-2 border-line border-t-primary" />
    <span className="sr-only">Loading page…</span>
  </div>
);

export default PageFallback;
