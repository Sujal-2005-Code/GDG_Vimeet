/**
 * The procedural half of the journey: values that are a smooth FUNCTION of
 * scroll rather than a tween between two named poses.
 *
 *   spin    the logo's rotation, in degrees, read off a smooth curve through
 *           the keyframes in chapters.SPIN (0° → 360° over the journey)
 *   orbit   where each accent dot is on its own inclined orbit (orbit.js)
 *
 * `apply(t)` is called by the master timeline with its own time — scroll
 * position in px after scrub smoothing — so, like every other part of the
 * journey, the result depends only on where the page is scrolled: scrolling in
 * order, jumping and reloading mid-page all give the same picture.
 *
 * Only `transform` and `opacity` are written, two small elements' worth per
 * frame (the spin layer and four dots).
 */
import { clamp } from '../animations/motion';
import { SPIN } from './chapters';
import { ORBIT_DOTS } from './orbit';

const RAD = Math.PI / 180;

/**
 * Monotone cubic (Fritsch–Carlson) interpolation through [x, y] keys: passes
 * exactly through every key — 25° at 20%, 90° at 40% … — but has no overshoot
 * and no sudden changes of speed at the keys, and eases in and out at both
 * ends (zero slope at the first and last key).
 */
const curveThrough = (keys) => {
  const n = keys.length;
  const xs = keys.map((k) => k[0]);
  const ys = keys.map((k) => k[1]);
  const h = [];
  const d = [];
  for (let i = 0; i < n - 1; i++) {
    h[i] = xs[i + 1] - xs[i];
    d[i] = (ys[i + 1] - ys[i]) / h[i];
  }
  const m = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) continue; // a flat or reversing spot: slope 0
    const w1 = 2 * h[i] + h[i - 1];
    const w2 = h[i] + 2 * h[i - 1];
    m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
  }
  return (x) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (x > xs[i + 1]) i++;
    const t = (x - xs[i]) / h[i];
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h[i] * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h[i] * m[i + 1]
    );
  };
};

/**
 * @param stage       the stage element (finds [data-spin] and [data-dot])
 * @param S           the mark's box size in px
 * @param radius      orbit-size factor for this tier (phones keep dots on screen)
 * @param spins       false for non-logo visuals (an image plane never spins)
 * @param span        [a, b] master-timeline times where the spin starts / ends
 * @param degPerPx    orbit sweep per px scrolled
 * @param state       object that receives { spin } for the debug HUD
 */
export const createRig = ({ stage, S, radius, spins, span: [a, b], degPerPx, state }) => {
  const spinEl = stage.querySelector('[data-spin]');
  const curve = curveThrough(SPIN.keys);

  const dots = ORBIT_DOTS.map((d) => {
    const el = stage.querySelector(`[data-dot="${d.key}"]`);
    return el
      ? {
          el,
          r: d.r * S * radius,
          sinT: Math.sin(d.tilt * RAD),
          cosT: Math.cos(d.tilt * RAD),
          sinS: Math.sin(d.slant * RAD),
          cosS: Math.cos(d.slant * RAD),
          speed: d.speed,
          phase: d.phase,
        }
      : null;
  }).filter(Boolean);

  const apply = (t) => {
    const deg = spins ? curve(clamp((t - a) / Math.max(b - a, 1), 0, 1)) : 0;
    state.spin = deg;
    if (spinEl) spinEl.style.transform = deg ? `rotate(${deg.toFixed(3)}deg)` : '';

    const sweep = t * degPerPx;
    for (const dot of dots) {
      const th = (dot.phase + dot.speed * sweep) * RAD;
      const s = Math.sin(th);
      const u = dot.r * Math.cos(th); // position on the orbit's own plane…
      const v = dot.r * s;
      const y0 = v * dot.cosT; // …inclined about the horizontal axis…
      const z = v * dot.sinT;
      const x = u * dot.cosS - y0 * dot.sinS; // …then slanted in the screen plane
      const y = u * dot.sinS + y0 * dot.cosS;
      dot.el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z.toFixed(2)}px) translate(-50%,-50%)`;
      // Depth cue on top of the browser's perspective: the far side is dimmer.
      dot.el.style.opacity = (0.58 + 0.42 * (s + 1) * 0.5).toFixed(3);
    }
  };

  return {
    apply,
    destroy() {
      if (spinEl) spinEl.style.transform = '';
      dots.forEach(({ el }) => {
        el.style.transform = '';
        el.style.opacity = '';
      });
    },
  };
};
