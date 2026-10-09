/**
 * Motion policy — no GSAP import, safe to use anywhere (including hooks that
 * must not pull animation code into a chunk).
 *
 * Three tiers decide how much motion a visitor gets. The same story runs in
 * every tier; only fidelity changes:
 *
 *   full   desktop-class: ≥1024px wide, mouse-like pointer, motion allowed
 *          → scroll-scrubbed journey, smoother scrub
 *   lite   phones/tablets/touch, motion allowed
 *          → the same journey, smaller mark, shorter chapters
 *   static prefers-reduced-motion
 *          → no timelines; the upright mark and plain content with a
 *            one-time opacity/scale fade as each chapter appears
 */

export const MQ = {
  reduce: '(prefers-reduced-motion: reduce)',
  wide: '(min-width: 1024px)',
  finePointer: '(hover: hover) and (pointer: fine)',
};

/** Mirrors the CSS motion tokens in index.css (seconds, for GSAP). */
export const DURATION = { fast: 0.15, base: 0.25, slow: 0.45 };

/** GSAP eases standing in for the CSS cubic-beziers (no CustomEase needed). */
export const EASE = { standard: 'power3.out', emphasized: 'expo.out', inOut: 'power2.inOut' };

const matches = (query) =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false;

export const prefersReducedMotion = () => matches(MQ.reduce);

export const getMotionTier = () => {
  if (typeof window === 'undefined') return 'static';
  if (matches(MQ.reduce)) return 'static';
  if (matches(MQ.wide) && matches(MQ.finePointer)) return 'full';
  return 'lite';
};

/** Subscribe to every media query the tier depends on. */
export const subscribeToTier = (onChange) => {
  const lists = Object.values(MQ).map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener('change', onChange));
  return () => lists.forEach((l) => l.removeEventListener('change', onChange));
};

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
