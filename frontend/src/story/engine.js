/**
 * Story engine — builds the 2.5D scroll journey on top of the stage DOM.
 *
 * How the depth illusion works (no WebGL):
 *   stage     CSS `perspective` — the browser's compositor projects children
 *     parallax  pointer tilt (full tier only), isolated so it never fights scroll
 *       world     the CAMERA: its z / x / y / rotation move when scroll moves
 *         entity  each piece has its own x, y, **z**, rotation, scale, opacity;
 *                 pieces at different z move by different amounts under the
 *                 same camera move — that *is* parallax, for free.
 *
 * Only transform + opacity are animated (compositor-only). No blur, no SVG
 * filters, no animated shadows, no particles.
 *
 * Tiers (animations/motion.js): `static` builds no timelines at all.
 */
import { gsap } from '../animations/gsap';
import { clamp } from '../animations/motion';
import { chapters } from './chapters';
import { CAMERA, EASES, STAGGER, createPoses } from './poses';

/** Read by the debug HUD (?story=debug). */
export const storyState = { tier: 'static', chapter: null, progress: 0 };

// The intro (pieces assembling) plays once per page visit, not on every
// resize-triggered rebuild or when returning to the home page.
let introPlayed = false;

const num = (v, fallback = 0) => (typeof v === 'number' ? v : fallback);

/** A pose entry → GSAP vars. x/y/z are fractions of S unless `ax/ay` (px) given. */
const toVars = (entry = {}, S, r0 = 0) => ({
  x: entry.ax ?? num(entry.x) * S,
  y: entry.ay ?? num(entry.y) * S,
  z: num(entry.z) * S,
  rotation: r0 + num(entry.dr),
  rotationX: num(entry.rx),
  rotationY: num(entry.ry),
  scale: entry.scale ?? 1,
  opacity: entry.opacity ?? 1,
});

/**
 * Where the hero's visual should sit, measured from the Hero's own layout
 * (the `data-story-slot` element) so responsive behaviour is plain CSS and
 * swapping the visual never changes the engine.
 */
const measure = (root) => {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const slot = root.querySelector('[data-story-slot="hero"]');
  let cx = W * 0.5;
  let cy = H * 0.5;
  let S = Math.min(W, H) * 0.6;
  if (slot) {
    const r = slot.getBoundingClientRect();
    cx = r.left + r.width / 2;
    // Document-space y at scroll 0 (the hero sits at the top of the page).
    cy = r.top + window.scrollY + r.height / 2;
    S = Math.min(r.width, r.height);
  }
  return { W, H, cx, cy, S: clamp(S, 180, 760) };
};

export const buildStory = ({ root, tier }) => {
  const stage = root.querySelector('[data-story-stage]');
  if (!stage) return { destroy() {} };

  const view = measure(root);
  const { S } = view;
  const poses = createPoses({ view, tier });

  const els = {};
  stage.querySelectorAll('[data-entity]').forEach((el) => {
    els[el.dataset.entity] = el;
  });
  const r0Of = (el) => Number(el.dataset.r0 || 0);

  stage.style.perspective = `${clamp(view.W * 0.95, 900, 1700)}px`;
  stage.style.perspectiveOrigin = `${view.cx}px ${view.cy}px`;
  els.mark?.style.setProperty('--s', `${S}px`);

  const cleanups = [];
  storyState.tier = tier;
  storyState.chapter = null;
  storyState.progress = 0;

  const ctx = gsap.context(() => {
    // 1. Base layout: every entity at its hero pose (the assembled composition).
    Object.entries(els).forEach(([id, el]) => {
      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        transformOrigin: '50% 50%',
        ...toVars(poses.hero[id], S, r0Of(el)),
      });
    });
    stage.dataset.ready = 'true';

    // Static tier (prefers-reduced-motion): the composition, nothing moving.
    if (tier === 'static') return;

    const world = stage.querySelector('[data-story-world]');
    const parallax = stage.querySelector('[data-story-parallax]');
    Object.values(els).forEach((el) => {
      el.style.willChange = 'transform';
    });

    // 2. Intro: pieces assemble into the hero composition, once per visit.
    if (!introPlayed) {
      const entries = Object.entries(els);
      entries.forEach(([id, el], i) => {
        gsap.fromTo(el, toVars(poses.intro[id], S, r0Of(el)), {
          ...toVars(poses.hero[id], S, r0Of(el)),
          duration: id === 'mark' ? 0.01 : 1.25,
          delay: 0.05 + i * 0.03,
          ease: 'expo.out',
          immediateRender: true,
          onComplete: i === entries.length - 1 ? () => { introPlayed = true; } : undefined,
        });
      });
    }

    // 3. Chapters: each scroll range tweens every entity from pose A to pose B.
    let progress = 0;
    chapters
      .filter((c) => c.enabled)
      .forEach((ch) => {
        const section = root.querySelector(ch.section);
        if (!section) return;
        const fromPose = poses[ch.from];
        const toPose = poses[ch.to];
        const cam = { from: CAMERA[ch.from] ?? CAMERA.hero, to: CAMERA[ch.to] ?? CAMERA.hero };

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: ch.start,
            end: ch.end,
            scrub: tier === 'full' ? 0.7 : 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              progress = self.progress;
              storyState.chapter = ch.id;
              storyState.progress = self.progress;
            },
          },
        });

        // Pieces peel away one after another (STAGGER) over 75% of the range.
        Object.entries(els).forEach(([id, el]) => {
          tl.fromTo(
            el,
            toVars(fromPose[id], S, r0Of(el)),
            {
              ...toVars(toPose[id], S, r0Of(el)),
              ease: EASES[id] ?? 'power2.inOut',
              duration: 0.75,
              immediateRender: false,
            },
            STAGGER[id] ?? 0
          );
        });

        // The section's own copy leaves before the pieces cross it.
        const copyEl = ch.copy ? root.querySelector(ch.copy) : null;
        if (copyEl) {
          tl.fromTo(
            copyEl,
            { autoAlpha: 1, y: 0 },
            { autoAlpha: 0, y: -56, ease: 'power1.in', duration: 0.45, immediateRender: false },
            0
          );
        }

        // Camera dolly (world z) — closer pieces sweep past faster.
        tl.fromTo(
          world,
          { z: cam.from.z * S },
          { z: cam.to.z * S, ease: 'power1.in', duration: 1, immediateRender: false },
          0
        );

        // The vanishing point glides from the hero slot to screen centre so
        // the mark doesn't skew as it travels.
        const vp = { x: view.cx, y: view.cy };
        tl.to(
          vp,
          {
            x: view.W / 2,
            y: view.H / 2,
            ease: 'power2.inOut',
            duration: 0.8,
            onUpdate: () => {
              stage.style.perspectiveOrigin = `${vp.x}px ${vp.y}px`;
            },
          },
          0
        );

        // Hand over to the next block: fade (and un-render) the stage.
        if (ch.stageFadeAt != null) {
          tl.fromTo(
            stage,
            { autoAlpha: 1 },
            { autoAlpha: 0, ease: 'power1.in', duration: 1 - ch.stageFadeAt, immediateRender: false },
            ch.stageFadeAt
          );
        }
      });

    // 4. Pointer parallax (desktop-class devices only).
    if (tier === 'full' && parallax) {
      gsap.set(parallax, { transformOrigin: `${view.cx}px ${view.cy}px` });
      const qx = gsap.quickTo(parallax, 'x', { duration: 0.9, ease: 'power3' });
      const qy = gsap.quickTo(parallax, 'y', { duration: 0.9, ease: 'power3' });
      const qrx = gsap.quickTo(parallax, 'rotationX', { duration: 0.9, ease: 'power3' });
      const qry = gsap.quickTo(parallax, 'rotationY', { duration: 0.9, ease: 'power3' });
      const onMove = (e) => {
        if (document.hidden || progress > 0.5) return;
        const nx = e.clientX / view.W - 0.5;
        const ny = e.clientY / view.H - 0.5;
        qry(nx * 8);
        qrx(-ny * 6);
        qx(-nx * 14);
        qy(-ny * 10);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      cleanups.push(() => window.removeEventListener('pointermove', onMove));
    }
  }, root);

  return {
    destroy() {
      cleanups.forEach((fn) => fn());
      ctx.revert();
      Object.values(els).forEach((el) => {
        el.style.willChange = '';
      });
      stage.style.perspective = '';
      stage.style.perspectiveOrigin = '';
      delete stage.dataset.ready;
    },
  };
};
