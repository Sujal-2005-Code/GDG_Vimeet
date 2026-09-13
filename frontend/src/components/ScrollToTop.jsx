import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Single source of truth for scroll position on route change, mounted once
 * at the router root. A plain route change scrolls to the top; a route (or
 * same-page) change that carries a hash scrolls to that section instead.
 * Do not duplicate window.scrollTo calls in individual pages — add the
 * behavior here so every route benefits from it.
 */
const ScrollToTop = () => {
  // `key` changes on every navigation, so clicking a link to the location
  // you're already on (e.g. "Explore GDG" twice) still re-runs the scroll.
  const { pathname, hash, key } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const isNewPage = previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    // Arriving from another page, the destination's GSAP ScrollTriggers are
    // still being created and refreshed; each refresh restores the scroll
    // position it recorded, which cancels an in-progress smooth scroll. An
    // instant jump can't be interrupted that way, so only same-page hash
    // navigation animates.
    const behavior = isNewPage || prefersReducedMotion() ? 'auto' : 'smooth';

    // Give the destination route a moment to mount before measuring/scrolling.
    // A second, later pass corrects for layout that settles after the first
    // scroll — e.g. GSAP ScrollTrigger re-measuring its pinned Hero section
    // once video/image metadata finishes loading on a fresh page load.
    const scrollToHash = () => {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior, block: 'start' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    };

    const firstPass = window.setTimeout(scrollToHash, 80);
    const secondPass = window.setTimeout(scrollToHash, 400);

    return () => {
      window.clearTimeout(firstPass);
      window.clearTimeout(secondPass);
    };
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
