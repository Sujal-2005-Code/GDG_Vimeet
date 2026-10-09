/**
 * Story engine — builds the scroll journey on top of the stage DOM.
 *
 * The stage is a fixed, flat layer holding one persistent visual (the logo
 * mark) and the event photos. Scroll only does three things to it (see
 * poses.js): the mark settles from the hero slot into the story frame, then
 * stays put while the chapters' words change, then gives way to the photos.
 * One steady scroll-linked motion runs throughout (the diamonds, rings and
 * dots turn — see rig.js and chapters.js). No tilt, depth, camera or pointer effects.
 *
 * Only transform + opacity are animated (compositor-only). No blur, no
 * animated filters, no animated shadows.
 *
 * Tiers (animations/motion.js): `static` builds no timelines at all.
 */
import { gsap } from '../animations/gsap';
import { clamp } from '../animations/motion';
import { DIAMOND_SPREAD, DIAMOND_SWEEP, DOT_SWEEP, RING_SWEEP, chapters } from './chapters';
import { EASES, STAGGER, TIMING, createPoses } from './poses';
import { createRig } from './rig';

/** Read by the debug HUD (?story=debug). */
export const storyState = { tier: 'static', chapter: null, progress: 0 };

// The intro (the mark fading in) plays once per page visit, not on every
// resize-triggered rebuild or when returning to the home page.
let introPlayed = false;

// Counters that already ran (keyed per chapter + target) show their final
// value immediately if the chapter is revisited or the page is rebuilt.
const counted = new Set();

// Copy reveal: one pattern for every chapter — opacity, plus a short rise for
// individual lines. Fractions of a chapter's length.
const COPY_IN = 0.1;
const COPY_OUT = 0.1;
const LINE_RISE = 12; // px

const num = (v, fallback = 0) => (typeof v === 'number' ? v : fallback);

/** True when two GSAP var sets describe the same state (a tween between them would do nothing). */
const sameVars = (a, b) => Object.keys(b).every((k) => Math.abs((a[k] ?? 0) - (b[k] ?? 0)) < 1e-6);

/**
 * A pose entry → GSAP vars. x/y are fractions of S unless `ax/ay` (px) given.
 *
 * `kx/ky` are the element's built-in size factors (data-kx / data-ky): the
 * logo is BUILT 1.3× larger than its design size and the authored scale is
 * divided by that, so poses keep their meaning ("scale 1" = the design size)
 * while the browser only ever scales the pixels DOWN. Scaling a small raster
 * UP is what made edges stair-step in an earlier version.
 */
const toVars = (entry = {}, S, kx = 1, ky = 1) => {
  const scale = entry.scale ?? 1;
  return {
    x: entry.ax ?? num(entry.x) * S,
    y: entry.ay ?? num(entry.y) * S,
    scaleX: scale / kx,
    scaleY: scale / ky,
    opacity: entry.opacity ?? 1,
  };
};

/**
 * Where the visual sits, measured from the page's own layout so responsive
 * behaviour is plain CSS and swapping the visual never changes the engine.
 *
 *   hero   the Hero's `data-story-slot="hero"`, in page space at scroll 0
 *   story  the first story track's `data-story-slot="story"`, measured as
 *          its VIEWPORT position while that track's layer is pinned (the
 *          distance from the pinned layer's top), so it is correct no matter
 *          where the page is scrolled when we measure.
 */
const measure = (root) => {
  const W = window.innerWidth;
  const H = window.innerHeight;
  let S = clamp(Math.min(W, H) * 0.6, 180, 760);
  const hero = { cx: W * 0.5, cy: H * 0.5 };

  const heroSlot = root.querySelector('[data-story-slot="hero"]');
  if (heroSlot) {
    const r = heroSlot.getBoundingClientRect();
    hero.cx = r.left + r.width / 2;
    hero.cy = r.top + window.scrollY + r.height / 2; // document y at scroll 0
    S = clamp(Math.min(r.width, r.height), 180, 760);
  }

  let story = { cx: hero.cx, cy: hero.cy, S };
  const storySlot = root.querySelector('[data-story-slot="story"]');
  const pin = storySlot?.closest('.story-pin');
  if (storySlot && pin) {
    const sr = storySlot.getBoundingClientRect();
    const pr = pin.getBoundingClientRect();
    story = {
      cx: sr.left + sr.width / 2,
      cy: sr.top - pr.top + sr.height / 2,
      S: clamp(Math.min(sr.width, sr.height), 180, 760),
    };
  }
  // The mark's box is built at the LARGEST size it ever needs (the hero or the
  // story frame, which differ on phones) and only scaled DOWN from there, so
  // the pixels stay sharp.
  return { W, H, S, hero, story, box: Math.max(S, story.S) };
};

export const buildStory = ({ root, tier }) => {
  const stage = root.querySelector('[data-story-stage]');
  if (!stage) return { destroy() {} };

  const view = measure(root);
  const S = view.box; // size of the mark's box in px (see measure)

  const els = {};
  stage.querySelectorAll('[data-entity]').forEach((el) => {
    els[el.dataset.entity] = el;
  });
  const ids = Object.keys(els);
  const poses = createPoses({ view, tier }, ids);
  const vars = (poseName, id) =>
    toVars(poses[poseName][id], S, Number(els[id].dataset.kx || 1), Number(els[id].dataset.ky || 1));

  els.anchor?.style.setProperty('--s', `${S}px`);

  const cleanups = [];
  storyState.tier = tier;
  storyState.chapter = null;
  storyState.progress = 0;

  let ctx;
  ctx = gsap.context(() => {
    // 1. Base layout: every entity at its hero pose (the assembled composition).
    ids.forEach((id) => {
      gsap.set(els[id], {
        xPercent: -50,
        yPercent: -50,
        transformOrigin: '50% 50%',
        ...vars('hero', id),
      });
    });
    stage.dataset.ready = 'true';

    // Static tier (prefers-reduced-motion): the composition, nothing moving.
    // (The story sections render as plain content — see story.css.)
    if (tier === 'static') return;

    // The anchor and the logo get their own compositor layers up-front, so the
    // logo (and its SVG shadow) is rasterised ONCE and then only moved and
    // scaled by the compositor. The logo is built at its largest size
    // (data-kx) and only ever scaled down, so the locked raster stays sharp.
    if (els.anchor) els.anchor.style.willChange = 'transform';
    if (els.core) els.core.style.willChange = 'transform';

    // 2. Intro: the composition fades in, once per visit.
    //
    // It writes the same properties the journey does, so it must never be
    // running when the journey needs to own them: a visitor who is already
    // scrolled (browser scroll restoration after a reload, an anchor link)
    // skips it, and one who starts scrolling during it finishes it instantly
    // (finishIntro) — otherwise it would complete AFTER the journey had set
    // the right state and overwrite it.
    let master;
    const introTweens = [];
    const finishIntro = () => {
      if (!introTweens.length) return;
      introTweens.splice(0).forEach((t) => t.progress(1));
      introPlayed = true;
      master?.render(master.time(), true, true); // re-apply the journey on top
    };
    if (!introPlayed && window.scrollY < 4) {
      ids.forEach((id, i) => {
        introTweens.push(
          gsap.fromTo(els[id], vars('intro', id), {
            ...vars('hero', id),
            duration: id === 'anchor' || id === 'mark' ? 0.01 : 0.9,
            delay: 0.05,
            ease: 'power2.out',
            immediateRender: true,
            onComplete: i === ids.length - 1 ? () => { introPlayed = true; introTweens.length = 0; } : undefined,
          })
        );
      });
    } else {
      introPlayed = true;
    }

    // 3. The journey: ONE master timeline, driven by ONE scrubbed trigger.
    //
    // Each chapter is a segment of it, placed by the scroll geometry of its
    // section and tweening every entity from its `from` pose to its `to`
    // pose. A single timeline renders in a deterministic order, so a jump
    // (scrollbar drag, anchor link, End key), a reload mid-page and a
    // reverse scroll all land on exactly the same state. (One timeline per
    // chapter does not: when several animate at once, which one renders
    // last — and so wins — is undefined, and a jump could settle in the
    // PREVIOUS chapter's pose.)
    const geo = chapters
      .map((ch) => {
        const section = root.querySelector(`[data-story-chapter="${ch.id}"]`);
        if (!section) return null;
        const top = section.getBoundingClientRect().top + window.scrollY;
        // hero: scrolls out (its top → its bottom); story tracks: their
        // pinned period = track height − the pinned layer's height. The layer's
        // own height (CSS 100svh) is measured instead of using innerHeight,
        // which changes on phones whenever the URL bar collapses.
        const pin = section.querySelector('.story-pin');
        const end = pin ? top + section.offsetHeight - pin.offsetHeight : top + section.offsetHeight;
        return { ch, section, a: top, b: Math.max(end, top + 1) };
      })
      .filter(Boolean);
    if (geo.length) {
      const journeyEnd = Math.max(...geo.map((g) => g.b));

      // Counters per chapter: show 0 until their moment, then count once.
      const counters = geo.flatMap(({ ch, section, a, b }) =>
        [...section.querySelectorAll('[data-count]')].map((el) => {
          const target = Number(el.dataset.count);
          const key = `${ch.id}:${target}`;
          const done = counted.has(key);
          el.textContent = done ? String(target) : '0';
          return { el, target, key, a, b, at: Number(el.dataset.countAt ?? 0.15), started: done };
        })
      );

      // The mark's life: the diamonds loosen once while the hero scrolls out
      // (the hero chapter's range), then everything turns steadily.
      const heroSpan = geo.find((g) => g.ch.id === 'hero');
      const rig = createRig({
        stage,
        span: [heroSpan?.a ?? 0, heroSpan?.b ?? journeyEnd],
        spread: DIAMOND_SPREAD,
        diamondPerPx: DIAMOND_SWEEP / view.H,
        dotsPerPx: DOT_SWEEP / view.H,
        ringPerPx: RING_SWEEP / view.H,
      });
      cleanups.push(rig.destroy);

      master = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: () => rig.apply(master.time()), // the mark's turning reads the timeline's own time (scroll px)
        scrollTrigger: {
          start: 0,
          end: journeyEnd,
          scrub: tier === 'full' ? 0.5 : 0.3,
          onUpdate: (self) => {
            const px = self.progress * journeyEnd;
            if (px > 8) finishIntro();
            const active = [...geo].reverse().find((g) => px >= g.a) ?? geo[0];
            storyState.chapter = active.ch.id;
            storyState.progress = clamp((px - active.a) / (active.b - active.a), 0, 1);
            counters.forEach((c) => {
              if (c.started || px < c.a + c.at * (c.b - c.a)) return;
              c.started = true;
              const o = { v: 0 };
              ctx.add(() => {
                gsap.to(o, {
                  v: c.target,
                  duration: 1.2,
                  ease: 'power2.out',
                  onUpdate: () => {
                    c.el.textContent = String(Math.round(o.v));
                  },
                  onComplete: () => counted.add(c.key),
                });
              });
            });
          },
        },
      });

      geo.forEach(({ ch, section, a, b }) => {
        const len = b - a;
        const at = (frac) => a + frac * len; // chapter fraction → master-timeline time
        const d = (frac) => Math.max(frac * len, 0.001); // chapter fraction → duration

        // An entity that does not change in this chapter gets no tween at all: its value simply
        // carries over from the chapter that last moved it. (Fewer tweens = less work per frame
        // and fewer first-use initialisations mid-scroll.)
        ids.forEach((id) => {
          const from = vars(ch.from, id);
          const to = vars(ch.to, id);
          if (sameVars(from, to)) return;
          const t = TIMING[ch.to]?.[id];
          master.fromTo(
            els[id],
            from,
            {
              ...to,
              ease: t?.[2] ?? EASES[id] ?? 'power2.inOut',
              duration: d(t?.[1] ?? 0.8),
              immediateRender: false,
            },
            at(t?.[0] ?? STAGGER[id] ?? 0)
          );
        });

        // Copy. A story chapter's copy fades in at the start and out at the end,
        // with [data-at] lines revealed at their own moment — the same
        // restrained fade-and-short-rise everywhere. (The hero's copy needs
        // nothing: it simply scrolls away, and the mark never crosses it.)
        const copy = section.querySelector('[data-story-copy="track"]');
        if (copy) {
          master.fromTo(copy, { opacity: 0 }, { opacity: 1, ease: 'power1.out', duration: d(COPY_IN), immediateRender: false }, at(0));
          master.to(copy, { opacity: 0, ease: 'power1.in', duration: d(COPY_OUT) }, at(1 - COPY_OUT));
        }
        section.querySelectorAll('[data-at]').forEach((el) => {
          master.fromTo(
            el,
            { opacity: 0, y: LINE_RISE },
            { opacity: 1, y: 0, ease: 'power2.out', duration: d(0.12), immediateRender: false },
            at(Number(el.dataset.at))
          );
        });

        // Hand over to the next block: fade (and un-render) the stage.
        if (ch.stageFadeAt != null) {
          master.fromTo(
            stage,
            { autoAlpha: 1 },
            { autoAlpha: 0, ease: 'power1.in', duration: d(1 - ch.stageFadeAt), immediateRender: false },
            at(ch.stageFadeAt)
          );
        }
      });

      // The scrub maps scroll progress onto the timeline's duration, and the
      // chapters are placed in scroll px — so make the duration exactly the
      // scroll range (time in px === scroll position in px, which is what the
      // chapter placement assumes).
      master.set({}, {}, journeyEnd);
      rig.apply(master.time());
    }
  }, root);

  return {
    destroy() {
      cleanups.forEach((fn) => fn());
      ctx.revert();
      [els.anchor, els.core].forEach((el) => {
        if (el) el.style.willChange = '';
      });
      delete stage.dataset.ready;
    },
  };
};
