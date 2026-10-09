/**
 * The scroll-linked life of the diamond mark (DiamondMark): the four diamonds
 * revolve around the centre, the two rings turn, the accent dots sweep.
 *
 * `apply(t)` is called by the master timeline with its own time — scroll
 * position in px. Every value is a plain function of it, so scrolling forward,
 * backward or jumping always lands on the same picture:
 *
 *   diamonds  loosen outward ONCE while the hero scrolls out (`spread`, eased),
 *             then revolve at a constant rate. They keep their orientation —
 *             they travel round the lens like cars on a Ferris wheel.
 *   dots      sweep at a constant rate, the opposite way
 *   rings     turn at a constant rate, in opposite directions
 *
 * Only `transform` is written, on nine SVG groups per frame.
 */
import { clamp } from '../animations/motion';

const RAD = Math.PI / 180;
const ease = (x) => x * x * (3 - 2 * x); // smoothstep

/**
 * @param stage        the stage element
 * @param span         [a, b] scroll px over which the diamonds loosen
 * @param spread       how far out the diamonds sit once loosened (1 = assembled)
 * @param diamondPerPx degrees the diamonds revolve per px scrolled
 * @param dotsPerPx    degrees the dots sweep per px scrolled (opposite way)
 * @param ringPerPx    degrees the rings turn per px scrolled (ring a forward, ring b back)
 */
export const createRig = ({ stage, span: [a, b], spread, diamondPerPx, dotsPerPx, ringPerPx }) => {
  const diamonds = [...stage.querySelectorAll('[data-diamond]')].map((el) => ({
    el,
    dx: Number(el.dataset.dx),
    dy: Number(el.dataset.dy),
  }));
  const dots = stage.querySelector('[data-dots]');
  const ringA = stage.querySelector('[data-ring="a"]');
  const ringB = stage.querySelector('[data-ring="b"]');

  const turn = (el, deg) => {
    if (el) el.style.transform = `rotate(${deg.toFixed(3)}deg)`;
  };

  const apply = (t = 0) => {
    const k = 1 + (spread - 1) * ease(clamp((t - a) / Math.max(b - a, 1), 0, 1));
    const th = t * diamondPerPx * RAD;
    const cos = Math.cos(th);
    const sin = Math.sin(th);
    for (const d of diamonds) {
      const x = (d.dx * cos - d.dy * sin) * k;
      const y = (d.dx * sin + d.dy * cos) * k;
      d.el.style.transform = `translate(${(x - d.dx).toFixed(2)}px,${(y - d.dy).toFixed(2)}px)`;
    }
    turn(dots, -t * dotsPerPx);
    turn(ringA, t * ringPerPx);
    turn(ringB, -t * ringPerPx);
  };

  apply(0);

  return {
    apply,
    destroy() {
      [...diamonds.map((d) => d.el), dots, ringA, ringB].forEach((el) => {
        if (el) el.style.transform = '';
      });
    },
  };
};
