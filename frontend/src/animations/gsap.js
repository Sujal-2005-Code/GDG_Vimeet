/**
 * The ONE place GSAP and ScrollTrigger are imported and registered.
 * Everything else imports `{ gsap, ScrollTrigger }` from here.
 *
 * Imports ScrollTrigger from its own module (not 'gsap/all') so the bundle
 * only contains the plugins we use.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers resize the viewport as the URL bar shows/hides; without
// this ScrollTrigger refreshes (and re-measures pinned layouts) on every
// toolbar change, which looks like jank.
ScrollTrigger.config({ ignoreMobileResize: true });

// Selecting entities that may legitimately be absent (e.g. image mode has no
// diamonds) should not spam the console.
gsap.config({ nullTargetWarn: false });

// Development aid: with ?story=debug in the URL, `window.__ScrollTrigger` lets you
// inspect every trigger (progress, start/end) from the console.
if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('story') === 'debug') {
  window.__ScrollTrigger = ScrollTrigger;
}

export { gsap, ScrollTrigger };
