/**
 * POSES — the choreography as data.
 *
 * A pose says where every entity is at one moment of the journey. A chapter
 * (chapters.js) tweens entities from one named pose to the next, so each
 * chapter's start is the previous chapter's end *by construction*: the page
 * is one continuous journey, and anchor jumps / reverse scrolling stay
 * correct.
 *
 * THE JOURNEY (pose names, in order)
 *   hero → drift → orbit → cloud → jams → m1 → m2 → m3 → achieve → community
 *   (GDG mark) (separate+orbit) (toward Google Cloud) (Study Jams)
 *   (245+) (107) (20+) (Tier 1 · 3 years) (event photography)
 *
 * UNITS (so poses are resolution-independent)
 *   x, y, z        fractions of S, the mark's on-screen size
 *   dr             ADDED Z-rotation in degrees (entities also have a base rotation r0)
 *   ar             ABSOLUTE Z-rotation, overrides r0 + dr
 *   rx, ry         X / Y tilt in degrees
 *   scale, sx, sy  uniform scale and extra per-axis scale
 *   opacity
 *   anchor only:   ax, ay = pixel offset of the whole group from the stage centre
 * Anything not listed falls back to the entity's REST pose.
 *
 * ENTITY IDS (see story/marks)
 *   anchor ⊃ mark ⊃ { shadow, ring-a, ring-b, orb ⊃ diamond-{blue,red,yellow,green}, lens, dots }
 *   anchor ⊃ photo-1 … photo-4        (image mode: plane instead of orb/diamonds)
 */

/** Base rotation of each entity (degrees) — mirrors data-r0 in the markup. */
export const R0 = {
  'diamond-blue': -45,
  'diamond-red': 45,
  'diamond-yellow': 45,
  'diamond-green': -45,
  'ring-a': -18,
  'ring-b': 42,
};

/** Where an entity sits when a pose doesn't mention it. */
export const restOf = (id) =>
  id.startsWith('photo-') ? { opacity: 0, z: -1.5, ry: 40, scale: 0.6 } : {};

// ---------------------------------------------------------------------------
// Cloud arrangement. The four pieces become the lobes + base of an abstract
// cloud (not the Google Cloud logo): squares turn upright (ar), grow, and
// slide from their diamond positions (offsets from centre, in S) to:
//   blue   left lobe     red  top lobe     yellow  right lobe     green  flat base
// ---------------------------------------------------------------------------
const CLOUD = {
  'diamond-blue': { x: -0.106, y: 0.209, z: 0.02, ar: -360, scale: 1.4 },
  'diamond-red': { x: -0.174, y: 0.099, z: -0.02, ar: -360, scale: 1.9 },
  'diamond-yellow': { x: 0.374, y: -0.104, z: 0.02, ar: -360, scale: 1.55 },
  'diamond-green': { x: -0.134, y: -0.014, z: 0.08, ar: -360, sx: 3.5, sy: 0.95 },
};

const withLobe = (id, bump) => ({
  ...CLOUD,
  [id]: { ...CLOUD[id], scale: (CLOUD[id].scale ?? 1) * bump, z: (CLOUD[id].z ?? 0) + 0.1 },
});

export const createPoses = ({ view, tier }, ids) => {
  const k = tier === 'full' ? 1 : 0.6; // softer 3D tilt on touch devices
  const sp = tier === 'full' ? 1 : 0.68; // narrower orbit on phones (keeps pieces on screen)
  const { W, H } = view;
  // The mark's box is `view.box` px (the larger of the hero and story sizes);
  // the anchor scales it DOWN to each on-screen size, never up.
  const heroA = {
    ax: view.hero.cx - W / 2,
    ay: view.hero.cy - H / 2,
    scale: view.S / view.box,
  };
  const storyA = {
    ax: view.story.cx - W / 2,
    ay: view.story.cy - H / 2,
    scale: view.story.S / view.box,
  };

  const mark = (extra = {}) => ({ scale: 1, ...extra });
  const common = (extra) => ({ shadow: { scale: 1.2, opacity: 0.9, y: 0.1 }, ...extra });

  // Cloud-family shared rings/dots/lens, then per-pose overrides.
  const cloudy = (over = {}) => ({
    anchor: storyA,
    mark: mark({ y: -0.02, ...(over.mark || {}) }),
    orb: { dr: 360 },
    ...(over.lobes || CLOUD),
    lens: { scale: 0, opacity: 0 },
    // Rings sit behind the lobes (negative z) so they never draw across them.
    'ring-a': { scale: 1.2, dr: 180, opacity: 0.9, z: -0.12, ...(over['ring-a'] || {}) },
    'ring-b': { scale: 1.08, dr: -180, z: -0.1, ...(over['ring-b'] || {}) },
    dots: { dr: -360, scale: 1.55, ...(over.dots || {}) },
    plane: { scale: 0.88, z: -0.05, ry: 0, ...(over.plane || {}) },
    ...common({}),
  });

  const raw = {
    // The assembled composition, sitting in the hero slot.
    hero: { anchor: heroA },

    // Pieces scattered behind the camera: the one-time load-in.
    intro: {
      anchor: heroA,
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
    },

    // End of the hero: the mark has glided into the story's frame and the
    // pieces have started to loosen and tilt.
    drift: {
      anchor: storyA,
      shadow: { scale: 1.1 },
      'ring-a': { scale: 1.1, dr: 20 },
      'ring-b': { scale: 1.08, dr: -20 },
      'diamond-blue': { x: -0.05, y: -0.05, z: 0.12, rx: -5 * k, ry: 12 * k },
      'diamond-red': { x: 0.05, y: -0.05, z: 0.08, rx: -5 * k, ry: -12 * k },
      'diamond-yellow': { x: -0.05, y: 0.05, z: 0.06, rx: 5 * k, ry: 12 * k },
      'diamond-green': { x: 0.05, y: 0.05, z: 0.14, rx: 5 * k, ry: -12 * k },
      dots: { dr: -20, scale: 1.08 },
      plane: { z: 0.2, ry: -14 * k, scale: 1.04 },
    },

    // A full orbit: the whole ring of pieces turns 360° around the centre
    // (orb +360) while each piece counter-rotates (-360) so it stays upright.
    orbit: {
      anchor: storyA,
      orb: { dr: 360 },
      shadow: { scale: 1.35, opacity: 0.7 },
      lens: { scale: 0, opacity: 0 },
      'ring-a': { scale: 1.35, dr: 180, opacity: 0.9 },
      'ring-b': { scale: 1.25, dr: -180 },
      'diamond-blue': { x: -0.13 * sp, y: -0.15 * sp, z: 0.34 * sp, dr: -360, rx: -10 * k, ry: 26 * k },
      'diamond-red': { x: 0.13 * sp, y: -0.15 * sp, z: 0.22 * sp, dr: -360, rx: -10 * k, ry: -26 * k },
      'diamond-yellow': { x: -0.13 * sp, y: 0.13 * sp, z: 0.16 * sp, dr: -360, rx: 10 * k, ry: 26 * k },
      'diamond-green': { x: 0.13 * sp, y: 0.13 * sp, z: 0.4 * sp, dr: -360, rx: 10 * k, ry: -26 * k },
      dots: { dr: -360, scale: 1.25 },
      plane: { z: 0.3, ry: 24 * k, scale: 1.08 },
    },

    // Toward Google Cloud: the pieces stand upright and gather into an
    // abstract cloud of four colours.
    cloud: cloudy(),

    // Cloud Study Jams: the cloud settles; halos widen.
    jams: cloudy({ mark: { scale: 1.04 }, 'ring-a': { scale: 1.3 }, 'ring-b': { scale: 1.16 }, dots: { dr: -330 } }),

    // 245+ / 107 / 20+ — one beat at a time. Each lifts one lobe toward the
    // camera and swings the dots a third of a turn.
    m1: cloudy({ mark: { scale: 1.04 }, lobes: withLobe('diamond-blue', 1.1), 'ring-a': { scale: 1.3 }, 'ring-b': { scale: 1.16 }, dots: { dr: -240 }, plane: { scale: 0.92 } }),
    m2: cloudy({ mark: { scale: 1.04 }, lobes: withLobe('diamond-red', 1.08), 'ring-a': { scale: 1.3 }, 'ring-b': { scale: 1.16 }, dots: { dr: -120 }, plane: { scale: 0.95 } }),
    m3: cloudy({ mark: { scale: 1.04 }, lobes: withLobe('diamond-yellow', 1.1), 'ring-a': { scale: 1.3 }, 'ring-b': { scale: 1.16 }, dots: { dr: 0 }, plane: { scale: 0.98 } }),

    // TIER 1 · 3 YEARS STRONG · 4TH COLLEGE: the halos open wide.
    achieve: cloudy({ mark: { scale: 1.1 }, 'ring-a': { scale: 1.5, opacity: 1 }, 'ring-b': { scale: 1.32 }, dots: { dr: 0, scale: 1.7 }, plane: { scale: 1.04, z: 0.1 } }),

    // The cloud recedes and fades; real event photography takes its place.
    community: {
      anchor: storyA,
      mark: { scale: 0.7, z: -0.6, y: -0.05, opacity: 0 },
      orb: { dr: 360 },
      ...CLOUD,
      lens: { scale: 0, opacity: 0 },
      'ring-a': { scale: 1.5, dr: 180, opacity: 1 },
      'ring-b': { scale: 1.32, dr: -180 },
      dots: { dr: 0, scale: 1.7 },
      shadow: { scale: 1.2, opacity: 0, y: 0.1 },
      'photo-1': { x: -0.05, y: -0.12, z: 0.18, ar: -4, ry: -14 * k, rx: 4 * k, scale: 1, opacity: 1 },
      'photo-2': { x: 0.27, y: 0.1, z: 0.05, ar: 3, ry: -20 * k, rx: -2 * k, scale: 1, opacity: 1 },
      'photo-3': { x: -0.28, y: 0.22, z: -0.02, ar: -2, ry: -9 * k, rx: 3 * k, scale: 1, opacity: 1 },
      'photo-4': { x: 0.2, y: -0.3, z: -0.1, ar: 5, ry: -22 * k, rx: 4 * k, scale: 1, opacity: 1 },
      plane: { opacity: 0, scale: 0.8 },
    },
  };

  // Resolve every pose against REST so each pose lists every entity present.
  const full = {};
  for (const [name, entries] of Object.entries(raw)) {
    full[name] = Object.fromEntries(ids.map((id) => [id, { ...restOf(id), ...(entries[id] || {}) }]));
  }
  return full;
};

/** Camera (the world element) per pose: dolly z in S, sway ry/rx in degrees. */
export const CAMERA = {
  hero: { z: 0, ry: 0 },
  drift: { z: 0.06, ry: 0 },
  orbit: { z: 0.14, ry: 8 },
  cloud: { z: 0.04, ry: 0 },
  jams: { z: 0.04, ry: 0 },
  m1: { z: 0.06, ry: -7 },
  m2: { z: 0.06, ry: 0 },
  m3: { z: 0.06, ry: 7 },
  achieve: { z: 0.1, ry: 0 },
  community: { z: 0, ry: 0 },
};

/**
 * Per-entity offsets inside a chapter (0–0.12 of its length), so pieces move
 * one after another instead of in lockstep.
 */
export const STAGGER = {
  'diamond-blue': 0,
  'diamond-red': 0.04,
  'diamond-yellow': 0.08,
  'diamond-green': 0.12,
  'ring-a': 0.02,
  'ring-b': 0.06,
  dots: 0.1,
  'photo-1': 0,
  'photo-2': 0.06,
  'photo-3': 0.12,
  'photo-4': 0.18,
};

export const EASES = {
  anchor: 'power2.inOut',
  dots: 'power1.inOut',
  lens: 'power2.in',
  shadow: 'power1.in',
};

/**
 * Chapter-specific timing overrides, keyed by the chapter's TARGET pose:
 *   id → [offset, duration, ease]   (fractions of the chapter)
 * The orbit needs the ring and every piece in perfect sync, otherwise the
 * counter-rotation doesn't cancel and the pieces wobble.
 */
const SYNC = [0, 1, 'sine.inOut'];
export const TIMING = {
  orbit: {
    orb: SYNC,
    'diamond-blue': SYNC,
    'diamond-red': SYNC,
    'diamond-yellow': SYNC,
    'diamond-green': SYNC,
    dots: SYNC,
    'ring-a': SYNC,
    'ring-b': SYNC,
  },
  // The cloud is fully formed by ~70% of its chapter, so "Google Cloud" is
  // read over a finished cloud rather than half-formed diamonds.
  cloud: {
    orb: [0, 0.6, 'power3.inOut'],
    'diamond-blue': [0, 0.6, 'power3.inOut'],
    'diamond-red': [0.03, 0.6, 'power3.inOut'],
    'diamond-yellow': [0.06, 0.6, 'power3.inOut'],
    'diamond-green': [0.09, 0.6, 'power3.inOut'],
    'ring-a': [0, 0.6, 'power3.inOut'],
    'ring-b': [0.04, 0.6, 'power3.inOut'],
    dots: [0.05, 0.6, 'power3.inOut'],
  },
  // Photos arrive across the chapter, not in the first moments.
  community: {
    'photo-1': [0.05, 0.7, 'power3.out'],
    'photo-2': [0.15, 0.7, 'power3.out'],
    'photo-3': [0.25, 0.7, 'power3.out'],
    'photo-4': [0.35, 0.6, 'power3.out'],
    mark: [0, 0.7, 'power2.in'],
  },
};
