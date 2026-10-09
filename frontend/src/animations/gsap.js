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

// Selecting entities that may legitimately be absent (e.g. no photo planes
// until they are rendered) should not spam the console.
gsap.config({ nullTargetWarn: false });

// Development aid: with ?story=debug in the URL, `window.__ScrollTrigger` / `window.__gsap`
// let you inspect every trigger (progress, start/end) and tween from the console.
// (?story=hook exposes the same objects without the on-screen HUD, for measurements.)
if (typeof window !== 'undefined' && ['debug', 'hook'].includes(new URLSearchParams(window.location.search).get('story'))) {
  window.__ScrollTrigger = ScrollTrigger;
  window.__gsap = gsap;
}

export { gsap, ScrollTrigger };
