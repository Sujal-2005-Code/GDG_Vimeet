/**
 * The scroll-linked turning of the rings and the accent dots (DiamondMark).
 *
 * `apply(t)` is called by the master timeline with its own time — scroll
 * position in px. Every angle is a plain linear function of it (same speed,
 * same direction everywhere, no easing), so scrolling forward, backward or
 * jumping always lands on the same picture. Only `transform` is written,
 * on three SVG groups per frame.
 */

/**
 * @param stage     the stage element
 * @param dotsPerPx degrees the dots turn per px scrolled
 * @param ringPerPx degrees the rings turn per px scrolled (ring a forward, ring b back)
 */
export const createRig = ({ stage, dotsPerPx, ringPerPx }) => {
  const dots = stage.querySelector('[data-dots]');
  const ringA = stage.querySelector('[data-ring="a"]');
  const ringB = stage.querySelector('[data-ring="b"]');

  const turn = (el, deg) => {
    if (el) el.style.transform = `rotate(${deg.toFixed(3)}deg)`;
  };

  const apply = (t = 0) => {
    turn(dots, t * dotsPerPx);
    turn(ringA, t * ringPerPx);
    turn(ringB, -t * ringPerPx);
  };

  apply(0);

  return {
    apply,
    destroy() {
      [dots, ringA, ringB].forEach((el) => {
        if (el) el.style.transform = '';
      });
    },
  };
};
