/**
 * POSES — the choreography as data.
 *
 * A pose says where every entity is at one moment of the journey. A chapter
 * (chapters.js) tweens entities from one named pose to the next, so each
 * chapter's start is the previous chapter's end *by construction* — that is
 * what makes the page one continuous journey instead of independent
 * section animations, and why anchor jumps and scrolling backwards stay
 * correct.
 *
 * Units (so poses are resolution-independent):
 *   x, y, z      fractions of S, the on-screen size of the mark
 *   dr           ADDED Z-rotation, degrees (entities also have a base rotation)
 *   rx, ry       X / Y rotation, degrees (the 3D tilt)
 *   scale, opacity
 *   mark only:   ax, ay = pixel offset of the whole mark from the stage centre
 * Entities not listed in a pose are at rest (identity).
 *
 * Entity ids (see story/marks): mark, shadow, ring-a, ring-b,
 * diamond-{blue,red,yellow,green}, lens, dots, dot-{blue,red,yellow,green},
 * plane (image mode).
 */

export const IDENTITY = { x: 0, y: 0, z: 0, dr: 0, rx: 0, ry: 0, scale: 1, opacity: 1 };

/** Where the viewport/slot measurement puts things. */
const heroPose = ({ view }) => ({
  mark: { ax: view.cx - view.W / 2, ay: view.cy - view.H / 2 },
});

/**
 * Load-in: the pieces start scattered behind the camera and assemble into
 * the hero composition (played once per visit, never in the static tier).
 */
const introPose = ({ view }) => ({
  mark: { ax: view.cx - view.W / 2, ay: view.cy - view.H / 2 },
  shadow: { opacity: 0, scale: 0.5 },
  'ring-a': { scale: 0.45, dr: -50, opacity: 0 },
  'ring-b': { scale: 0.45, dr: 50, opacity: 0 },
  'diamond-blue': { x: -0.5, y: -0.46, z: -0.9, dr: -80, rx: -25, ry: 55, scale: 0.5, opacity: 0 },
  'diamond-red': { x: 0.5, y: -0.46, z: -0.9, dr: 80, rx: -25, ry: -55, scale: 0.5, opacity: 0 },
  'diamond-yellow': { x: -0.5, y: 0.46, z: -0.9, dr: 80, rx: 25, ry: 55, scale: 0.5, opacity: 0 },
  'diamond-green': { x: 0.5, y: 0.46, z: -0.9, dr: -80, rx: 25, ry: -55, scale: 0.5, opacity: 0 },
  lens: { scale: 0, opacity: 0 },
  dots: { dr: -150, scale: 0.4, opacity: 0 },
  plane: { z: -0.8, ry: 38, rx: 8, scale: 0.7, opacity: 0 },
});

/**
 * Hero → leaving: the diamonds separate and turn square, the rings widen
 * into orbits, the dots swing round, the whole mark glides to the centre
 * of the stage while the camera dollies in. `k` softens the 3D tilt on
 * the lite tier (touch devices).
 */
const driftPose = ({ tier }) => {
  const k = tier === 'full' ? 1 : 0.6;
  return {
    mark: { ax: 0, ay: 0, scale: 1.16, dr: 8 },
    shadow: { scale: 1.5, y: 0.22, opacity: 0 },
    'ring-a': { scale: 1.6, dr: 38, opacity: 0.15 },
    'ring-b': { scale: 1.42, dr: -38, opacity: 0.15 },
    'diamond-blue': { x: -0.36, y: -0.3, z: 0.55, dr: 45, rx: -12 * k, ry: 34 * k },
    'diamond-red': { x: 0.36, y: -0.3, z: 0.4, dr: -45, rx: -12 * k, ry: -34 * k },
    'diamond-yellow': { x: -0.36, y: 0.3, z: 0.3, dr: -45, rx: 12 * k, ry: 34 * k },
    'diamond-green': { x: 0.36, y: 0.3, z: 0.65, dr: 45, rx: 12 * k, ry: -34 * k },
    lens: { scale: 2.4, opacity: 0 },
    dots: { dr: 120, scale: 1.25 },
    plane: { z: 0.5, rx: 8 * k, ry: -22 * k, scale: 1.12 },
  };
};

/** Camera (the world element) per pose: dolly distance as a fraction of S. */
export const CAMERA = {
  hero: { z: 0 },
  drift: { z: 0.45 },
};

export const createPoses = (ctx) => ({
  hero: heroPose(ctx),
  intro: introPose(ctx),
  drift: driftPose(ctx),
});

/**
 * Per-entity choreography offsets inside a chapter (0–0.25 of its length)
 * and eases — so pieces peel away one after another instead of in lockstep.
 */
export const STAGGER = {
  'diamond-blue': 0,
  'diamond-red': 0.04,
  'diamond-yellow': 0.08,
  'diamond-green': 0.12,
  'ring-a': 0.02,
  'ring-b': 0.06,
  dots: 0.1,
  lens: 0,
  shadow: 0,
  plane: 0,
  mark: 0.06,
};

export const EASES = {
  mark: 'power2.inOut',
  dots: 'power1.inOut',
  lens: 'power2.in',
  shadow: 'power1.in',
};
